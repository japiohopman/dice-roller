# Branching & PR Workflow

## Branching
- `main` (protected): always deployable, requires passing CI and at least one reviewer.
- `develop` (optional): integration branch for collected features before `main`.
- Feature branches: `feature/<short-desc>` for new features.
- Hotfix branches: `hotfix/<issue-number>` for urgent fixes.

## Pull Request Policy
- All work should be submitted as PRs against `main` (or `develop` if using it).
- PR checklist:
  - [ ] Linked issue(s)
  - [ ] Descriptive PR title and summary
  - [ ] Tests added or updated
  - [ ] Linting applied
- Require at least 1 approving review and passing CI before merge.

## Labels
- `type/feature`, `type/bug`, `priority/high`, `priority/low`, `needs-review`, `good-first-issue`

## Automation & Templates
- Use `.github/ISSUE_TEMPLATE` for consistent issues.
- Add GitHub Actions to auto-assign reviewers, run CI, and post preview deployments.

---

**Tip:** Use the GitHub CLI (`gh`) to open issues from local markdown files:

```
# example: create issue from file title and body
gh issue create --title "$(head -1 < file.md)" --body "$(sed '1,3d' file.md)"
```

This repository includes `issues/` markdown files for each top-priority task; you can import them as issues with the `gh` CLI or copy-paste them into GitHub Issues.