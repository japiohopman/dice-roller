#!/usr/bin/env bash
# Create GitHub issues from the files in ./issues using GitHub CLI
# Requires: gh CLI and a logged-in user with repo access

set -euo pipefail
for f in ../issues/*.md; do
  TITLE=$(head -n 1 "$f" | sed 's/^Title: //')
  BODY=$(sed '1,1d' "$f")
  echo "Creating issue: $TITLE"
  gh issue create --title "$TITLE" --body "$BODY"
done

echo "Done."
