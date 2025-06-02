# Deploy the fixed version to Heroku

Write-Output "=== DEPLOYING FIXES TO HEROKU ==="

# 1. Add all changes to git
Write-Output "Adding changes to git..."
git add .

# 2. Commit the changes
Write-Output "Committing changes..."
git commit -m "Fix registration issues with improved error handling and MongoDB connection"

# 3. Push to Heroku
Write-Output "Pushing to Heroku..."
git push heroku main

# 4. Open the app in browser
Write-Output "Opening app in browser..."
heroku open --app stroom-app

# 5. Display logs to monitor deployment
Write-Output "Displaying logs (press Ctrl+C to stop)..."
heroku logs --tail --app stroom-app
