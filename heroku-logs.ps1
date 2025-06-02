# Fetch Heroku logs to diagnose registration errors
Write-Output "Fetching Heroku logs..."
heroku logs --tail --app stroom-app
