// config.js - Configuration settings for different environments
module.exports = {
    // Development environment settings
    development: {
        PORT: 3001,
        MONGODB_URI: 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/Stroom',
        SESSION_SECRET: 'dev-session-secret'
    },
    
    // Production environment settings
    production: {
        PORT: process.env.PORT || 3001,
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/Stroom',
        SESSION_SECRET: process.env.SESSION_SECRET || 'production-session-secret'
    },
    
    // Test environment settings - useful for CI/CD pipelines
    test: {
        PORT: process.env.PORT || 3001,
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/Stroom',
        SESSION_SECRET: process.env.SESSION_SECRET || 'test-session-secret'
    }
};
