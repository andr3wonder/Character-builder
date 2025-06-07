#!/bin/bash

# Ensure fnm is available
if ! command -v fnm &> /dev/null; then
    echo "fnm is not installed. Installing fnm..."
    brew install fnm
fi

# Install Node.js 20.18.3 if not already installed
fnm install 20.18.3

# Use Node.js 20.18.3
fnm use 20.18.3

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
npm run dev 