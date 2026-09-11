#!/usr/bin/env bash
set -Eeuo pipefail

: "${IMAGE_URI:?IMAGE_URI must be set}"

kubectl create namespace finops-demo --dry-run=client -o yaml | kubectl apply -f -

sed "s|REPLACE_WITH_ECR_IMAGE|${IMAGE_URI}|g" k8s/app/deployment.yaml \
  | kubectl apply -n finops-demo -f -

kubectl apply -n finops-demo -f k8s/app/service.yaml
kubectl apply -n finops-demo -f k8s/app/keda-scaledobject.yaml

kubectl rollout status deployment/cost-demo -n finops-demo --timeout=180s
kubectl get all -n finops-demo
