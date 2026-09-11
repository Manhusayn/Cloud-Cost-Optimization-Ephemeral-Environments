# ☁️ Cloud Cost Optimization & Ephemeral Environments

> **Production-style DevOps / FinOps portfolio project**  
> AWS • EKS • ECR • Terraform • Infracost • KEDA • OpenCost • GitHub Actions

This project demonstrates a practical **FinOps + Kubernetes platform engineering workflow**:

```text
Pull Request
    │
    ├──► Terraform plan ──► Infracost ──► PR cost visibility / budget guard
    │
    └──► Build container ──► ECR ──► Ephemeral namespace
                                      │
                                      └──► KEDA ──► 0 replicas off-hours
                                                        │
                                                        └──► OpenCost ──► cost visibility
PR closed ──────────────────────────────────────────────► namespace destroyed
```

## 🎯 What this project proves

### 1. Shift-left FinOps
Every infrastructure PR is checked with **Infracost** before merge. The pipeline generates a cost breakdown and can fail when the estimated monthly increase exceeds the configured threshold.

### 2. Ephemeral preview environments
A pull request automatically gets an isolated Kubernetes namespace:

```text
preview-pr-42
├── Deployment
├── Service
├── ResourceQuota
├── LimitRange
└── labels linking the environment to PR #42
```

When the PR closes, the namespace is deleted automatically.

### 3. Kubernetes cost optimization
KEDA uses a **cron scaler** with `minReplicaCount: 0` so non-production workloads run during working hours and scale to zero outside the defined window.

### 4. Cost observability
OpenCost is installed into the cluster so Kubernetes spend can be inspected by namespace, workload, controller, and other dimensions.

---

# 🏗️ Architecture

```text
                         GitHub
                           │
                    Pull Request / Push
                           │
             ┌─────────────┴─────────────┐
             │                           │
      Terraform changed?          Application changed?
             │                           │
             ▼                           ▼
       Terraform Plan               Docker Build
             │                           │
             ▼                           ▼
         Infracost                     ECR
             │                           │
             ▼                           ▼
       PR cost comment            Preview namespace
                                         │
                                         ▼
                                  Kubernetes Service
                                         │
                                         ▼
                                      KEDA
                              ┌──────────┴──────────┐
                              │                     │
                         Work hours            Off hours
                              │                     │
                         1 replica             0 replicas
                              │
                              ▼
                           OpenCost
                              │
                              ▼
                     Kubernetes cost data
```

---

# 📁 Repository structure

```text
.
├── .github/
│   └── workflows/
│       ├── infracost.yml              # Terraform cost governance
│       ├── preview-environment.yml    # PR create/update/delete
│       └── terraform.yml              # Terraform validation/plan
│
├── app/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── infra/
│   └── terraform/
│       ├── versions.tf
│       ├── variables.tf
│       ├── main.tf
│       ├── outputs.tf
│       ├── terraform.tfvars.example
│       └── .terraform.lock.hcl.example
│
├── k8s/
│   ├── app/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── keda-scaledobject.yaml
│   ├── observability/
│   │   └── namespace.yaml
│   └── preview/
│       ├── deployment.yaml.tmpl
│       ├── service.yaml.tmpl
│       ├── quota.yaml
│       └── limitrange.yaml
│
├── scripts/
│   ├── bootstrap-platform.sh
│   ├── deploy-preview.sh
│   ├── destroy-preview.sh
│   └── validate.sh
│
├── .gitignore
├── Makefile
└── LICENSE
```

---

# 💰 FinOps control flow

The Infracost workflow is intentionally separate from the deployment workflow.

```text
Terraform files changed
        │
        ▼
terraform init
        │
        ▼
terraform plan
        │
        ▼
infracost breakdown
        │
        ▼
monthly cost estimate
        │
        ├── within threshold ──► PR can continue
        │
        └── above threshold ───► workflow fails
```

Set the GitHub repository secret:

```text
INFRACOST_API_KEY
```

The workflow uses the official Infracost setup action and writes a cost summary to the PR.

> The default threshold is intentionally conservative for a demo. Change `COST_THRESHOLD_USD` in the workflow to match your organization's policy.

---

# 🚀 Quick start

## Prerequisites

Install:

- AWS CLI
- Terraform >= 1.9
- kubectl
- Helm 3
- Docker
- GitHub CLI (optional)
- Infracost CLI (optional locally)

Configure AWS:

```bash
aws configure
aws sts get-caller-identity
```

Your AWS identity needs permissions to create EKS, VPC, IAM, ECR and related resources.

---

# 1. Create the AWS infrastructure

```bash
cd infra/terraform

cp terraform.tfvars.example terraform.tfvars
```

Edit:

```hcl
aws_region  = "ap-south-1"
project_name = "finops-ephemeral"
environment = "dev"
```

Then:

```bash
terraform init
terraform fmt -check
terraform validate
terraform plan
terraform apply
```

⚠️ **EKS is not free.** The control plane, worker nodes, NAT gateways and other AWS resources can generate charges.

For a learning environment, destroy it when finished:

```bash
terraform destroy
```

---

# 2. Configure kubectl

After Terraform completes:

```bash
aws eks update-kubeconfig \
  --region ap-south-1 \
  --name finops-ephemeral-dev
```

Verify:

```bash
kubectl get nodes
```

---

# 3. Install KEDA + OpenCost

From the repository root:

```bash
chmod +x scripts/*.sh
./scripts/bootstrap-platform.sh
```

Verify:

```bash
kubectl get pods -n keda
kubectl get pods -n opencost
```

The bootstrap script is idempotent: running it again uses Helm upgrade/install semantics.

---

# 4. Deploy the sample workload

```bash
kubectl apply -f k8s/app/
```

Check:

```bash
kubectl get deployment -n finops-demo
kubectl get scaledobject -n finops-demo
kubectl get pods -n finops-demo
```

The KEDA policy uses:

```text
minReplicaCount = 0
desired replicas during work hours = 1
maxReplicaCount = 4
```

The schedule is configured in the manifest:

```yaml
timezone: Asia/Kolkata
start: 0 9 * * 1-5
end: 0 19 * * 1-5
desiredReplicas: "1"
```

Outside that window, the workload can scale to zero.

---

# 5. Deploy the sample workload

The checked-in Deployment intentionally contains an image placeholder. Use the helper so the ECR image is injected safely:

```bash
export IMAGE_URI="$(terraform -chdir=infra/terraform output -raw ecr_repository_url):latest"
./scripts/deploy-app.sh
```

Then test it:

```bash
kubectl port-forward -n finops-demo svc/cost-demo 8080:80
```

Then:

```bash
curl http://127.0.0.1:8080/
curl http://127.0.0.1:8080/health
```

---

# 6. Test an ephemeral PR environment locally

```bash
export PR_NUMBER=42
export IMAGE_URI="$(terraform -chdir=infra/terraform output -raw ecr_repository_url):local"

docker build -t "$IMAGE_URI" app/
docker push "$IMAGE_URI"

./scripts/deploy-preview.sh
```

Inspect it:

```bash
kubectl get all -n preview-pr-42
```

Delete it:

```bash
./scripts/destroy-preview.sh
```

---

# 🔄 GitHub Actions PR lifecycle

For a PR:

```text
opened / reopened / synchronize
             │
             ▼
      build application
             │
             ▼
          ECR push
             │
             ▼
  namespace preview-pr-N
             │
             ▼
       Kubernetes deploy
```

For:

```text
pull_request.closed
```

the workflow executes:

```bash
kubectl delete namespace preview-pr-N
```

This is the key cost-saving property: **preview infrastructure has a lifecycle tied to the PR lifecycle.**

---

# 🔐 GitHub authentication

For the portfolio/demo implementation, the workflow can use AWS access keys through:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```

For a real production setup, replace long-lived credentials with **GitHub OIDC → AWS IAM role assumption**.

Recommended production flow:

```text
GitHub OIDC token
       │
       ▼
AWS IAM trust policy
       │
       ▼
short-lived AWS role
       │
       ▼
ECR / EKS
```

The repository intentionally keeps credentials out of source control.

---

# 🌐 Optional preview ingress

The base project deliberately uses a Kubernetes `Service` rather than creating one AWS LoadBalancer per PR.

That is itself a FinOps decision:

```text
1 PR = 1 namespace
1 PR ≠ 1 AWS Load Balancer
```

Creating one AWS LoadBalancer per PR can turn an "ephemeral" environment into an unnecessary recurring cost source.

For a real platform, use a shared ingress controller / AWS Load Balancer Controller and route:

```text
pr-42.preview.example.com
pr-43.preview.example.com
pr-44.preview.example.com
```

through the same shared entry point.

---

# 📊 OpenCost

OpenCost provides Kubernetes cost visibility.

After installation, use:

```bash
kubectl get svc -n opencost
```

Port-forward the service if needed:

```bash
kubectl port-forward -n opencost svc/opencost 9003:9003
```

Then open:

```text
http://127.0.0.1:9003
```

For AWS billing accuracy, configure cloud-provider billing integration appropriate to your AWS account. The demo installation focuses on Kubernetes allocation and local observability.

---

# 🧪 Validation

Run:

```bash
./scripts/validate.sh
```

The validator checks:

- required repository files
- shell syntax
- Python syntax
- Dockerfile presence
- YAML parseability when PyYAML is available
- Terraform formatting when Terraform is installed

It intentionally does **not** run `terraform apply` because applying infrastructure is destructive/cost-incurring and requires the user's AWS account.

---

# 🧠 Interview explanation

If an interviewer asks:

### "How did you reduce cloud cost?"

Answer:

> I implemented cost controls at three layers. First, I shifted cost analysis left by running Infracost against Terraform changes in GitHub Actions and exposing the estimated monthly delta directly in pull requests. Second, I created PR-scoped ephemeral Kubernetes environments, so preview workloads exist only while a pull request is active and are automatically removed when it closes. Third, I used KEDA's cron scaler with `minReplicaCount: 0` to scale non-production workloads to zero outside working hours. OpenCost provides Kubernetes-level cost visibility so we can validate where the spend is going.

### "Why not just use HPA?"

Because HPA primarily reacts to workload metrics. For predictable non-production schedules, KEDA's cron scaler can explicitly control the working-hours window and allow the workload to reach zero outside that window.

### "Why not create an AWS load balancer for every PR?"

Because that adds infrastructure cost and lifecycle complexity. A shared ingress layer is a better design when many ephemeral environments exist.

### "What happens if a developer forgets to delete the environment?"

The GitHub `pull_request.closed` workflow performs the cleanup automatically. The namespace is the lifecycle boundary.

---

# ⚠️ Important production hardening

This repository is intentionally portfolio-sized. Before production, add:

- GitHub OIDC instead of long-lived AWS keys
- admission policies for resource requests/limits
- namespace TTL/reaper as a second cleanup safety net
- shared ingress
- NetworkPolicies
- Pod Security Admission
- image signing / verification
- Trivy or another image scanner
- Terraform remote state with locking
- separate AWS accounts for environments
- AWS Budgets / Cost Anomaly Detection
- OpenCost cloud billing integration
- centralized logging and audit trails

---

# 🧹 Cleanup

Delete the Kubernetes demo resources:

```bash
kubectl delete namespace finops-demo --ignore-not-found
```

Delete the AWS infrastructure:

```bash
terraform -chdir=infra/terraform destroy
```

Verify AWS resources in the console after destruction.

---

# 🏆 Portfolio impact

This project demonstrates more than "I know Terraform."

It demonstrates:

```text
Infrastructure as Code
        +
FinOps
        +
CI/CD
        +
Kubernetes
        +
Autoscaling
        +
Ephemeral environments
        +
Cost-aware architecture
```

That combination is highly relevant to **DevOps, Platform Engineering, Infrastructure Engineering and FinOps** roles.

---

## License

MIT
