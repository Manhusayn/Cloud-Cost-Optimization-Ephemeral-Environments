# FinOps Control Center

Recruiter-facing Next.js dashboard for the **Cloud Cost Optimization & Ephemeral Environments** project.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, import the repository.
3. Set the **Root Directory** to `dashboard`.
4. Framework preset: **Next.js**.
5. Deploy.

No environment variables are required for the static demonstration.

## Connect it to the real project

Replace the demonstration values in `app/page.tsx` with API data from your preferred backend.

Recommended production flow:

```text
Vercel dashboard
      ↓
small read-only API
      ↓
OpenCost / GitHub / AWS
      ↓
EKS
```

Do not expose AWS credentials, kubeconfig files, or privileged Kubernetes credentials to the browser.
