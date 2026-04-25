#!/bin/bash
set -euo pipefail

SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519_esat_deploy}"
SSH_OPTS="-o StrictHostKeyChecking=no -o IdentitiesOnly=yes -i $SSH_KEY"
VPS="root@161.35.220.149"
REMOTE="/root/esat-static"
PORT=3002
BASE_URL="http://161.35.220.149:${PORT}"

echo "→ Creating remote static directory..."
ssh $SSH_OPTS "$VPS" "mkdir -p $REMOTE"

echo "→ Syncing static files..."
rsync -avz --delete -e "ssh $SSH_OPTS" public-static/ "$VPS:$REMOTE/"
rsync -avz -e "ssh $SSH_OPTS" public/esat-logo.png "$VPS:$REMOTE/"
rsync -avz -e "ssh $SSH_OPTS" public/esat-logo.svg "$VPS:$REMOTE/"

echo "→ Ensuring 'serve' is available on VPS..."
ssh $SSH_OPTS "$VPS" "which serve >/dev/null 2>&1 || npm install -g serve"

echo "→ Restarting static server on port ${PORT}..."
ssh $SSH_OPTS "$VPS" "
  pm2 stop esat-web 2>/dev/null || true
  pm2 delete esat-web 2>/dev/null || true
  pm2 start serve --name esat-web -- --single -l ${PORT} ${REMOTE}
  pm2 save
"

echo "→ Verifying..."
sleep 3

HTTP_STATUS=$(curl -sI "$BASE_URL/" | head -1)
PAGE_SIZE=$(curl -s "$BASE_URL/" | wc -c | tr -d ' ')
echo "HTTP status : $HTTP_STATUS"
echo "Page size   : ${PAGE_SIZE} bytes"

if [ "$PAGE_SIZE" -lt 40000 ]; then
  echo "✗ Page too small (${PAGE_SIZE}B) — something went wrong"
  exit 1
fi

echo "✓ Static deploy complete: $BASE_URL/"
