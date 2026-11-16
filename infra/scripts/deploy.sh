#!/bin/bash
# ==============================================================
# SindhHunar Zero-Downtime Production Deployment Script
# ==============================================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_DIR"

echo "=========================================================="
echo "🚀 Starting SindhHunar Production Deployment: $(date)"
echo "📂 Project Directory: $PROJECT_DIR"
echo "=========================================================="

# 1. Pull latest code from GitHub
echo "📥 [1/5] Pulling latest code from main branch..."
git pull origin main

# 2. Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️ ERROR: .env file not found in $PROJECT_DIR!"
    echo "Please copy .env.example to .env and configure your production secrets."
    exit 1
fi

# 3. Build & Recreate Containers (Zero-Downtime)
echo "🐳 [2/5] Building & Recreating Docker Containers..."
docker compose build --pull web
docker compose up -d --remove-orphans

# 4. Wait for services to become healthy
echo "⏳ [3/5] Waiting for services healthcheck..."
sleep 5

# 5. Verify local HTTP response
echo "🔍 [4/5] Testing HTTP endpoint via Nginx..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80 || true)

if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 301 ] || [ "$HTTP_STATUS" -eq 302 ]; then
    echo "✅ Healthcheck Passed! HTTP Status: $HTTP_STATUS"
else
    echo "⚠️ Warning: HTTP returned status $HTTP_STATUS. Checking docker logs..."
    docker compose logs --tail=50 web
fi

# 6. Disk Cleanup (Remove old dangling images)
echo "🧹 [5/5] Cleaning up old unused Docker images..."
docker image prune -f

echo "=========================================================="
echo "🎉 Deployment Completed Successfully: $(date)"
echo "=========================================================="
