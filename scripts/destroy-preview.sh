#!/usr/bin/env bash
set -Eeuo pipefail

: "${PR_NUMBER:?PR_NUMBER must be set}"

if ! [[ "${PR_NUMBER}" =~ ^[0-9]+$ ]]; then
  echo "PR_NUMBER must be numeric" >&2
  exit 1
fi

NAMESPACE="preview-pr-${PR_NUMBER}"

if kubectl get namespace "${NAMESPACE}" >/dev/null 2>&1; then
  echo "==> Deleting ${NAMESPACE}"
  kubectl delete namespace "${NAMESPACE}" --wait=true --timeout=180s
else
  echo "==> ${NAMESPACE} does not exist; nothing to delete"
fi
