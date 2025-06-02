// config.js - Configuration settings for different environments
module.exports = {
    // Development environment settings
    development: {
        PORT: 3001,
        MONGODB_URI: 'mongodb+srv://Manav:babumanav@cluster0.rwhl77f.mongodb.net/Stroom',
        SESSION_SECRET: 'dev-session-secret'
    },
    
    // Production environment settings
    production: {
        PORT: process.env.PORT,
        MONGODB_URI: process.env.MONGODB_URI,
        SESSION_SECRET: process.env.SESSION_SECRET || 'production-session-secret'
    }
};
