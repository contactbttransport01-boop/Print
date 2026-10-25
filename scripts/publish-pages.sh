#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build
touch dist/.nojekyll

# Use a separate index: preserve the development branch, files and staged changes.
print_pages_tmp=$(mktemp -d /tmp/print-pages-publish.XXXXXX)
trap 'rm -rf "$print_pages_tmp"' EXIT
print_pages_parent=()
print_pages_remote=$(GIT_TERMINAL_PROMPT=0 git ls-remote origin refs/heads/gh-pages)
if [[ -n "$print_pages_remote" ]]; then
  GIT_TERMINAL_PROMPT=0 git fetch --no-tags origin refs/heads/gh-pages
  print_pages_parent=(-p "$(git rev-parse --verify 'FETCH_HEAD^{commit}')")
fi

GIT_INDEX_FILE="$print_pages_tmp/index" git --work-tree="$PWD/dist" add --all
print_pages_tree=$(GIT_INDEX_FILE="$print_pages_tmp/index" git write-tree)
print_pages_commit=$(git commit-tree "$print_pages_tree" "${print_pages_parent[@]}" -m 'Publish Print static site')
GIT_TERMINAL_PROMPT=0 git push origin "$print_pages_commit:refs/heads/gh-pages"
echo 'Static files pushed to gh-pages. GitHub Pages activation and deployment must be verified separately.'
