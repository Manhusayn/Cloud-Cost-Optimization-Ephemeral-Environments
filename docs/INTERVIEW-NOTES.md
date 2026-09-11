# Interview Notes

## Cost optimization equation

```text
Cloud cost reduction
=
Prevent unnecessary resources
+
Shorten resource lifetime
+
Right-size resource consumption
+
Observe allocation
+
Govern changes before merge
```

## Project mapping

| Problem | Solution |
|---|---|
| Expensive Terraform change | Infracost |
| Preview environment forgotten | PR lifecycle cleanup |
| One AWS LB per preview | Shared ingress recommendation |
| Idle Kubernetes workload | KEDA scale-to-zero |
| Unknown Kubernetes spend | OpenCost |
| ECR image accumulation | Lifecycle policy |
| Long-lived CI AWS credentials | OIDC recommendation |

## Strong design decision

The project does not create an AWS LoadBalancer for every pull request.

Why?

Because an ephemeral Kubernetes namespace is cheap compared with repeatedly provisioning cloud-facing infrastructure.

## Strong KEDA detail

The correct pattern for scheduled scale-to-zero is:

```yaml
minReplicaCount: 0

triggers:
  - type: cron
    metadata:
      desiredReplicas: "1"
```

Do not make `desiredReplicas: "0"` the cron trigger's main mechanism.

## Strong FinOps detail

Cost estimation should happen before infrastructure reaches production:

```text
Code
  ↓
PR
  ↓
Terraform plan
  ↓
Infracost
  ↓
Review
  ↓
Merge
  ↓
Apply
```

This is "shift-left FinOps".
