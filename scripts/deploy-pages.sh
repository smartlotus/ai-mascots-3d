#!/usr/bin/env bash
# 构建并发布到 gh-pages 分支（不 force-push：每次发布是 gh-pages 上的一个新提交）
# 用法：scripts/deploy-pages.sh
set -euo pipefail
cd "$(dirname "$0")/.."
REPO_URL=$(git remote get-url origin)
GIT_NAME=$(git config user.name || echo "deploy-bot")
GIT_EMAIL=$(git config user.email || echo "deploy-bot@users.noreply.github.com")
HEAD_SHA=$(git rev-parse --short HEAD)
npm run build
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git clone --quiet --depth 1 --branch gh-pages "$REPO_URL" "$TMP/site"
  find "$TMP/site" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
else
  git init --quiet "$TMP/site"; git -C "$TMP/site" checkout --quiet -b gh-pages
  git -C "$TMP/site" remote add origin "$REPO_URL"
fi
cp -R dist/. "$TMP/site/"
touch "$TMP/site/.nojekyll"
cd "$TMP/site"
git add -A
if git diff --cached --quiet; then echo "没有变化，无需发布"; exit 0; fi
git -c user.name="$GIT_NAME" -c user.email="$GIT_EMAIL" commit --quiet -m "deploy: $HEAD_SHA $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push --quiet origin gh-pages
echo "已发布 → https://smartlotus.github.io/ai-mascots-3d/"
