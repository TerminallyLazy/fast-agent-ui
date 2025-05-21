#!/bin/bash

# Start the Fast Agent UI and backend

# Navigate to the project directory
cd "$(dirname "$0")"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js and try again."
    exit 1
fi

# Check if the UI dependencies are installed
if [ ! -d "ui/node_modules" ]; then
    echo "Installing UI dependencies..."
    cd ui && npm install && cd ..
fi

# Start the UI in the background
echo "Starting Fast Agent UI..."
cd ui && npm run dev &
UI_PID=$!

# Give the UI time to start
sleep 2

echo "Fast Agent UI is running at http://localhost:3000"
echo "Press Ctrl+C to stop all services"

# Wait for user to press Ctrl+C
trap "kill $UI_PID; echo 'Stopping all services...'; exit 0" INT
wait