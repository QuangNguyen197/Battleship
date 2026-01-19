#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Checkout or create gh-pages branch
git checkout --orphan gh-pages 2>/dev/null || git checkout gh-pages

# Remove all files except dist
git rm -rf . --ignore-unmatch

# Copy dist files to root
cp -r dist/* .

# Add all files
git add .

# Commit
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
echo "Pushing to gh-pages branch..."
git push origin gh-pages --force

# Switch back to main branch
git checkout main

echo "Deployment complete! GitHub Pages should update shortly."