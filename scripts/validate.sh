#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

echo "==> Checking required files"
required=(
  README.md
  Makefile
  app/main.py
  app/Dockerfile
  app/requirements.txt
  infra/terraform/main.tf
  infra/terraform/variables.tf
  infra/terraform/outputs.tf
  infra/terraform/versions.tf
  k8s/app/deployment.yaml
  k8s/app/service.yaml
  k8s/app/keda-scaledobject.yaml
  scripts/bootstrap-platform.sh
  scripts/deploy-app.sh
  scripts/deploy-preview.sh
  scripts/destroy-preview.sh
)

for file in "${required[@]}"; do
  [[ -f "${file}" ]] || { echo "Missing: ${file}" >&2; exit 1; }
done

echo "==> Shell syntax"
bash -n scripts/*.sh

echo "==> Python syntax"
python3 -m py_compile app/main.py

if command -v terraform >/dev/null 2>&1; then
  echo "==> Terraform format check"
  terraform -chdir=infra/terraform fmt -check -recursive

  echo "==> Terraform validation (initialization required)"
  if [[ -d infra/terraform/.terraform ]]; then
    terraform -chdir=infra/terraform validate
  else
    echo "Terraform not initialized; skipping validate. Run: make init"
  fi
else
  echo "Terraform not installed; skipping Terraform checks."
fi

if python3 -c 'import yaml' >/dev/null 2>&1; then
  echo "==> YAML parse"
  python3 - <<'PY'
from pathlib import Path
import yaml

for path in Path("k8s").rglob("*.yaml"):
    yaml.safe_load(path.read_text())

print("YAML parse: OK")
PY
else
  echo "PyYAML not installed; skipping YAML parse."
fi

echo "==> Validation completed successfully"
