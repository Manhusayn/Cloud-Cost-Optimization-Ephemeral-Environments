#!/usr/bin/env bash
set -Eeuo pipefail

: "${PR_NUMBER:?PR_NUMBER must be set}"
: "${IMAGE_URI:?IMAGE_URI must be set}"

if ! [[ "${PR_NUMBER}" =~ ^[0-9]+$ ]]; then
  echo "PR_NUMBER must be numeric" >&2
  exit 1
fi

NAMESPACE="preview-pr-${PR_NUMBER}"

export NAMESPACE PR_NUMBER IMAGE_URI

echo "==> Creating/updating ${NAMESPACE}"
kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -

kubectl label namespace "${NAMESPACE}" \
  preview-pr="${PR_NUMBER}" \
  managed-by=github-actions \
  --overwrite

kubectl apply -f k8s/preview/quota.yaml -n "${NAMESPACE}"
kubectl apply -f k8s/preview/limitrange.yaml -n "${NAMESPACE}"

envsubst < k8s/preview/deployment.yaml.tmpl | kubectl apply -f -
envsubst < k8s/preview/service.yaml.tmpl | kubectl apply -f -

echo "==> Waiting for rollout"
kubectl rollout status deployment/preview-service \
  -n "${NAMESPACE}" \
  --timeout=180s

echo "==> Preview environment ready"
kubectl get all -n "${NAMESPACE}"
