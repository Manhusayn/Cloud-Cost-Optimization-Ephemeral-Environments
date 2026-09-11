SHELL := /bin/bash

TF_DIR := infra/terraform

.PHONY: validate fmt init plan apply destroy bootstrap app-preview app-destroy

validate:
	./scripts/validate.sh

fmt:
	terraform -chdir=$(TF_DIR) fmt -recursive

init:
	terraform -chdir=$(TF_DIR) init

plan:
	terraform -chdir=$(TF_DIR) plan

apply:
	terraform -chdir=$(TF_DIR) apply

destroy:
	terraform -chdir=$(TF_DIR) destroy

bootstrap:
	./scripts/bootstrap-platform.sh

app-preview:
	./scripts/deploy-preview.sh

app-destroy:
	./scripts/destroy-preview.sh
