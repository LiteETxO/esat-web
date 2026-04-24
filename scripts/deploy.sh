#!/bin/bash
set -euo pipefail

SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519_esat_deploy}"
SSH_OPTS="-o StrictHostKeyChecking=no -o IdentitiesOnly=yes -i $SSH_KEY"
VPS="root@161.35.220.149"
REMOTE="/root/esat-web"
BASE_URL="http://161.35.220.149:3002"

echo "→ Building..."
npm run build

echo "→ Syncing standalone server..."
rsync -avz --delete -e "ssh $SSH_OPTS" .next/standalone/ "$VPS:$REMOTE/"

echo "→ Syncing static assets (Tailwind CSS, JS chunks)..."
rsync -avz --delete -e "ssh $SSH_OPTS" .next/static/ "$VPS:$REMOTE/.next/static/"

echo "→ Syncing public assets..."
rsync -avz --delete -e "ssh $SSH_OPTS" public/ "$VPS:$REMOTE/public/"

echo "→ Restarting PM2..."
ssh $SSH_OPTS "$VPS" "pm2 restart esat-web && pm2 save"

echo "→ Verifying..."
sleep 3

CSS_PATH=$(curl -s "$BASE_URL/" | grep -oE '_next/static/css/[^"]+' | head -1)
if [ -z "$CSS_PATH" ]; then
  echo "✗ No CSS link found in HTML output"
  exit 1
fi

STATUS=$(curl -sI "$BASE_URL/$CSS_PATH" | head -1)
CSS_SIZE=$(curl -s "$BASE_URL/$CSS_PATH" | wc -c | tr -d ' ')
echo "CSS file : $CSS_PATH"
echo "HTTP status: $STATUS"
echo "CSS size : ${CSS_SIZE} bytes"

if [ "$CSS_SIZE" -lt 10000 ]; then
  echo "✗ CSS file too small (${CSS_SIZE}B) — Tailwind not bundled correctly"
  exit 1
fi

echo "✓ Deploy complete: $BASE_URL/"
