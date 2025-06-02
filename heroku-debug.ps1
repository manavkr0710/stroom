# Registration Debug Script for Heroku
# This script helps identify common issues with user registration on Heroku

Write-Output "=== STROOM APP DEPLOYMENT DIAGNOSTICS ==="
Write-Output "Running diagnostics for Heroku deployment..."
Write-Output ""

# Check if app is running
Write-Output "1. Checking if application is running..."
$appStatus = heroku ps --app stroom-app
Write-Output $appStatus
Write-Output ""

# Check environment variables
Write-Output "2. Checking environment variables..."
$envVars = heroku config --app stroom-app
Write-Output $envVars
Write-Output ""

# Check MongoDB connection 
Write-Output "3. Getting recent logs to check MongoDB connection..."
heroku logs --tail --lines=50 --app stroom-app

Write-Output ""
Write-Output "=== NEXT STEPS ==="
Write-Output "1. Check if NODE_ENV is set to 'production'"
Write-Output "2. Verify MONGODB_URI is correctly configured"
Write-Output "3. Make sure SESSION_SECRET is set"
Write-Output "4. Look for specific error messages in the logs"
Write-Output ""
Write-Output "To set environment variables, use:"
Write-Output "heroku config:set MONGODB_URI=your_mongodb_uri --app stroom-app"
Write-Output "heroku config:set NODE_ENV=production --app stroom-app"
Write-Output "heroku config:set SESSION_SECRET=your_secure_secret --app stroom-app"
