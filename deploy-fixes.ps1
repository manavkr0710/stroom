# Deploy the fixed version to Heroku

Write-Output "=== DEPLOYING SESSION FIX TO HEROKU ==="

# 0. Check if the MongoDB connection is working
Write-Output "Checking MongoDB connection..."
heroku config:get MONGODB_URI --app stroom-app

# 1. Add all changes to git
Write-Output "Adding changes to git..."
git add .

# 2. Commit the changes
Write-Output "Committing changes..."
git commit -m "Fix session management and unauthorized user handling"

# 3. Push to Heroku
Write-Output "Pushing to Heroku..."
git push heroku main

# 4. Set environment variables if needed
Write-Output "Setting environment variables..."
heroku config:set NODE_ENV=production --app stroom-app
heroku config:set DIAGNOSTIC_KEY=(New-Guid).ToString() --app stroom-app

# 5. Restart the application
Write-Output "Restarting the application..."
heroku restart --app stroom-app

# 6. Open the app in browser
Write-Output "Opening app in browser..."
heroku open --app stroom-app

# 7. Display logs to monitor deployment
Write-Output "Displaying logs (press Ctrl+C to stop)..."
heroku logs --tail --app stroom-app
