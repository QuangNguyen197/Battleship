# PowerShell deployment script for GitHub Pages

Write-Host "Building project..." -ForegroundColor Green
npm run build

Write-Host "Setting up gh-pages branch..." -ForegroundColor Green

# Check if gh-pages branch exists
$branchExists = git branch -r | Select-String "origin/gh-pages"

if ($branchExists) {
    git checkout gh-pages
    git pull origin gh-pages
} else {
    git checkout --orphan gh-pages
}

# Remove all files
git rm -rf . --ignore-unmatch 2>$null

# Copy dist files to root
Copy-Item -Path "dist\*" -Destination "." -Recurse -Force

# Add all files
git add .

# Commit
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
Write-Host "Pushing to gh-pages branch..." -ForegroundColor Green
git push origin gh-pages --force

# Switch back to main branch
git checkout main

Write-Host "Deployment complete! GitHub Pages should update shortly." -ForegroundColor Green