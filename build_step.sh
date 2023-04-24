#!/bin/bash

# Install dependencies
echo "Installing..."
npm run frontend:install
npm run backend:install

# Build
echo "Building app..."
npm run build