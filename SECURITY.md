# Security

## Reporting

Do not commit credentials, tokens, AWS access keys, kubeconfigs or private keys.

## Production recommendations

- Use GitHub OIDC and AWS IAM role assumption.
- Scope IAM permissions to the exact EKS/ECR resources.
- Use separate AWS accounts for production and non-production.
- Add image signing and admission verification.
- Add NetworkPolicies.
- Enable EKS control-plane audit logging.
- Store Terraform state remotely with encryption and locking.
- Use AWS Secrets Manager / Parameter Store for secrets.
- Add vulnerability scanning to the container pipeline.
