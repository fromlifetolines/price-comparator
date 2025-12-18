#!/bin/bash
echo "=========================================="
echo "   GitHub Repository Setup Assistant"
echo "=========================================="
echo ""
echo "I have committed all your code."
echo "Please follow these steps:"
echo "1. Go to https://github.com/new"
echo "2. Create a repository named 'price-comparator'"
echo "3. Copy the HTTPS URL (e.g., https://github.com/username/price-comparator.git)"
echo ""
echo -n "Paste the Repository URL here and press Enter: "
read REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "Error: URL cannot be empty."
    exit 1
fi

echo "Setting remote origin to $REPO_URL..."
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

echo "Renaming branch to main..."
git branch -M main

echo "Pushing code to GitHub..."
echo "NOTE: You may be asked for your GitHub username and password (or token)."
git push -u origin main

echo ""
echo "Done! check your repository URL to see the code."
