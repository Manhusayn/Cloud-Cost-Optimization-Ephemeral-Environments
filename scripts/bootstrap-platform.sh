#!/usr/bin/env bash
set -Eeuo pipefail

KEDA_NAMESPACE="keda"
OPENCOST_NAMESPACE="opencost"

echo "==> Adding Helm repositories"
helm repo add kedacore https://kedacore.github.io/charts
helm repo add opencost https://opencost.github.io/opencost-helm-chart
helm repo update

echo "==> Installing/upgrading KEDA"
helm upgrade --install keda kedacore/keda \
  --namespace "${KEDA_NAMESPACE}" \
  --create-namespace \
  --wait \
  --timeout 10m

echo "==> Installing/upgrading OpenCost"
helm upgrade --install opencost opencost/opencost \
  --namespace "${OPENCOST_NAMESPACE}" \
  --create-namespace \
  --wait \
  --timeout 10m

echo "==> Platform components"
kubectl get pods -n "${KEDA_NAMESPACE}"
kubectl get pods -n "${OPENCOST_NAMESPACE}"

echo "==> Done"
