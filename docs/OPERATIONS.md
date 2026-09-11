# Operations Runbook

## Preview environment

```bash
export PR_NUMBER=42
export IMAGE_URI=123456789.dkr.ecr.ap-south-1.amazonaws.com/finops-ephemeral/dev/preview-service:test

./scripts/deploy-preview.sh
```

Inspect:

```bash
kubectl get all -n preview-pr-42
kubectl describe deployment preview-service -n preview-pr-42
kubectl logs deployment/preview-service -n preview-pr-42
```

Port-forward:

```bash
kubectl port-forward -n preview-pr-42 svc/preview-service 8080:80
```

Cleanup:

```bash
PR_NUMBER=42 ./scripts/destroy-preview.sh
```

## KEDA

```bash
kubectl get scaledobject
kubectl describe scaledobject cost-demo-scaler
kubectl get hpa
```

The cron scaler deliberately uses `minReplicaCount: 0`. KEDA's cron scaler controls the desired replica floor during the active window; outside the window the workload can reach zero.

## OpenCost

```bash
kubectl get pods -n opencost
kubectl get svc -n opencost
kubectl port-forward -n opencost svc/opencost 9003:9003
```

## Common failure modes

### EKS access denied

Check:

```bash
aws sts get-caller-identity
aws eks describe-cluster --name finops-ephemeral-dev --region ap-south-1
```

### ECR push denied

Check the IAM role/user has ECR authentication and push permissions.

### ImagePullBackOff

Check:

```bash
kubectl describe pod -n preview-pr-42
```

Common causes:

- wrong ECR URI
- image tag does not exist
- node IAM permissions
- image architecture mismatch

### Preview namespace remains

The PR cleanup job may have failed. Run:

```bash
PR_NUMBER=42 ./scripts/destroy-preview.sh
```

### KEDA does not scale

Check:

```bash
kubectl get pods -n keda
kubectl describe scaledobject cost-demo-scaler
kubectl get hpa
```
