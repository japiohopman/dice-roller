Title: Revoke exposed PAT, perform security audit, and add secrets

Description: A personal access token was shared in project notes. This is a high severity security issue — revoke the token immediately and audit the repository for other secrets.

Tasks:
- [ ] Revoke the exposed PAT in GitHub (Settings → Developer settings → Personal access tokens)
- [ ] Run `git grep -n "github_pat"` to find any other leaked tokens
- [ ] Remove any hardcoded secrets and rotate keys
- [ ] Add necessary secrets to GitHub Secrets (Settings → Secrets → Actions)
- [ ] Add a pre-commit check to reject committed tokens (git-secrets or similar)

Acceptance Criteria:
- No secrets in repo history or working tree; new secrets live in GitHub Secrets
- CI uses secrets from GitHub Actions only

Priority: Critical