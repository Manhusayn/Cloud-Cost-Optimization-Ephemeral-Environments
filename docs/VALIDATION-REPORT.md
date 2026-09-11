# Validation Report

This repository is generated as a self-contained project and includes an offline-safe validation script.

Run:

```bash
./scripts/validate.sh
```

The validator checks:

- required files
- Bash syntax
- Python syntax
- Terraform formatting when Terraform is installed
- Terraform validation after `terraform init`
- YAML parsing when PyYAML is available

Cloud provisioning is intentionally **not** executed automatically because it would require access to a real AWS account and can incur charges.

For a real deployment, the required external dependencies are:

1. AWS credentials with appropriate IAM permissions
2. Terraform provider/module downloads
3. An EKS cluster created by Terraform
4. Helm connectivity
5. GitHub repository secrets/OIDC configuration
6. Infracost API key

The repository therefore separates deterministic code validation from account-specific infrastructure validation.
