#!/bin/bash
# Dent AI - Production Deployment Script
# Usage: ./deploy.sh

set -e

echo "=============================="
echo "  Dent AI - Production Build  "
echo "=============================="

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"

# 1. Install dependencies
echo ""
echo "[1/3] Installing dependencies..."
cd "$FRONTEND_DIR" && npm install --production=false 2>&1 | tail -3
cd "$BACKEND_DIR" && npm install --production 2>&1 | tail -3

# 2. Build frontend
echo ""
echo "[2/3] Building frontend..."
cd "$FRONTEND_DIR" && npm run build 2>&1

# 3. Start with PM2
echo ""
echo "[3/3] Starting server with PM2..."
cd "$PROJECT_DIR"

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2 globally..."
  npm install -g pm2 2>&1 | tail -3
fi

# Create logs directory
mkdir -p "$BACKEND_DIR/logs"

# Stop existing process if running
pm2 delete dent-ai 2>/dev/null || true

# Start the application
pm2 start ecosystem.config.js

echo ""
echo "=============================="
echo "  Deployment Complete!        "
echo "  App running on port 5000    "
echo "=============================="
echo ""
echo "Useful commands:"
echo "  pm2 logs dent-ai    - View logs"
echo "  pm2 restart dent-ai - Restart app"
echo "  pm2 stop dent-ai    - Stop app"
echo "  pm2 monit           - Monitor"