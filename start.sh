#!/bin/bash
cd "$(dirname "$0")/backend"
while true; do
  echo "$(date): Starting Dent AI server..."
  node server.js
  echo "$(date): Server exited. Restarting in 2s..."
  sleep 2
done
