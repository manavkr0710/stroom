# Stroom App Deployment Guide

## Heroku Deployment Troubleshooting

### Session and Authentication Issues

If you're experiencing "Unauthorized User" errors or issues with sessions after deploying to Heroku, follow these steps:

1. **Check MongoDB Connection**
   - Make sure MongoDB Atlas accepts connections from anywhere (`0.0.0.0/0` in Network Access settings)
   - Verify your connection string in Heroku environment variables

2. **Check Session Configuration**
   - Sessions are now stored in MongoDB using connect-mongo
   - Secure cookies may cause issues if HTTPS is not properly set up

3. **Use Diagnostic Endpoints**
   - Visit `/health` to check if MongoDB is connected
   - Use `/session-diagnostic?key=YOUR_DIAGNOSTIC_KEY` to check session data (set DIAGNOSTIC_KEY env var first)

### Registration Issues

If you're experiencing issues with user registration after deploying to Heroku, follow these steps:

1. **Check Heroku Logs**

   ```bash
   heroku logs --tail --app stroom-app
   ```

   Look for any error messages related to MongoDB connections or the registration process.

2. **Verify Environment Variables**

   Make sure you have set up all required environment variables in Heroku:

   ```bash
   heroku config --app stroom-app
   ```

   You should see the following environment variables:
   - `NODE_ENV` should be set to `production`
   - `MONGODB_URI` should point to your MongoDB instance
   - `SESSION_SECRET` for secure sessions

   If any are missing, set them:

   ```bash
   heroku config:set NODE_ENV=production --app stroom-app
   heroku config:set MONGODB_URI=your_mongodb_uri --app stroom-app
   heroku config:set SESSION_SECRET=your_secure_secret --app stroom-app
   ```

3. **Check MongoDB Connection**

   Visit `https://stroom-app.herokuapp.com/health` in your browser to check if MongoDB is connected.
   
   If it shows "mongodb": "disconnected", your MongoDB connection is failing.

4. **Test Database Access**

   Make sure your MongoDB Atlas (or other provider) has:
   - IP access control allowing Heroku's dynamic IPs (set to allow access from anywhere: `0.0.0.0/0`)
   - Correct username/password in your connection string
   - Proper authentication method

5. **Restart the App**

   Try restarting the application:

   ```bash
   heroku restart --app stroom-app
   ```

6. **Check for Conflicts**

   Make sure there are no route conflicts in your application.

7. **Deploy Debug Version**

   If you've made fixes to your code:

   ```bash
   git add .
   git commit -m "Fix registration issues"
   git push heroku main
   ```

8. **Reset Database**

   If the database structure needs to be reset (be careful, this will delete data):

   1. Access your MongoDB Atlas dashboard
   2. Go to your cluster
   3. Go to Collections
   4. Find the "userInfo" collection
   5. Try making a small test change or export/import the data structure

## Common Fixes

1. **Fix MongoDB Connection Issues**

   - Make sure the MongoDB URI is correctly formatted
   - Check if the credentials in the URI are valid
   - Verify network access settings in MongoDB Atlas
   - Ensure proper error handling around database operations

2. **Environment Variable Issues**

   Make sure to set proper environment variables in your Heroku dashboard or using the CLI:

   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Stroom
   ```

3. **Security Issues**

   If you're using SSL/TLS connections, make sure your MongoDB URI and options are configured correctly:
   
   ```javascript
   mongoose.connect(uri, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     ssl: true,
     sslValidate: true
   });
   ```

## Deploying Updates

After making changes to fix registration issues:

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Fix registration issues"
   ```

2. Deploy to Heroku:
   ```bash
   git push heroku main
   ```

3. Verify the deployment:
   ```bash
   heroku open --app stroom-app
   ```

4. Check the health endpoint:
   ```
   https://stroom-app.herokuapp.com/health
   ```

5. Try to register a new user
