// config.js - Configuration settings for different environments
module.exports = {
    // Development environment settings
    development: {
        PORT: 3001,
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/Stroom',
        SESSION_SECRET: process.env.SESSION_SECRET || 'dev-session-secret'
    },
    
    // Production environment settings
    production: {
        PORT: process.env.PORT || 3001,
        MONGODB_URI: process.env.MONGODB_URI,
        SESSION_SECRET: process.env.SESSION_SECRET
    },
    
    // Test environment settings - useful for CI/CD pipelines
    test: {
        PORT: process.env.PORT || 3001,
        MONGODB_URI: process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/StroomTest',
        SESSION_SECRET: process.env.TEST_SESSION_SECRET || 'test-session-secret'
    }
};
