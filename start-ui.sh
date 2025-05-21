#!/bin/bash

# Navigate to the UI directory
cd "$(dirname "$0")/ui"

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development server
echo "Starting Fast Agent UI..."
npm run dev