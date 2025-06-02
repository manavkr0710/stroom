const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const {v4: uuidv4} = require('uuid');
const app = express();
const mongoose = require('mongoose');

// Import configuration based on environment
const env = process.env.NODE_ENV || 'development';
let config;
try {
    // Try to load config from project root
    config = require('../config')[env];
    console.log('Loaded config from project root');
} catch (error) {
    console.log('Failed to load config from project root:', error.message);
    try {
        // Try to load from current directory
        config = require('./config')[env];
        console.log('Loaded config from current directory');
    } catch (error) {
        console.log('Failed to load config from current directory:', error.message);
        // Fallback to environment variables
        config = {
            PORT: process.env.PORT || 3001,
            MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://Manav:babumanav@cluster0.rwhl77f.mongodb.net/Stroom',
            SESSION_SECRET: process.env.SESSION_SECRET || 'fallback-session-secret'
        };
        console.log('Using fallback configuration:', config);
    }
}

const router = require('./router');

// Database connection URI from config with validation
let uri = config.MONGODB_URI;

// Validate MongoDB URI
if (!uri) {
    console.error('MongoDB URI is missing or undefined. Check your environment variables or config file.');
    uri = 'mongodb+srv://Manav:babumanav@cluster0.rwhl77f.mongodb.net/Stroom';
    console.log('Falling back to hardcoded MongoDB URI for development');
} else if (!uri.startsWith('mongodb')) {
    console.error('Invalid MongoDB URI format. URI should start with "mongodb://" or "mongodb+srv://"');
}

async function connect() {
    try {
        console.log('Attempting to connect to MongoDB at:', uri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to the database successfully');
    } catch(error) {
        console.error('Database connection error: ', error);
        // Log more detailed information about the error
        if (error.name === 'MongooseServerSelectionError') {
            console.error('MongoDB server selection error - check your connection string and network');
        }
        if (error.name === 'MongoNetworkError') {
            console.error('MongoDB network error - check your internet connection and firewall settings');
        }
    }
}

// Connect with better error reporting
connect().catch(err => {
    console.error('Failed to start database connection:', err);
});

// Use port from config
const port = config.PORT || 3001;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.json());

app.set('view engine', 'ejs');

app.use(session({
    secret: config.SESSION_SECRET || uuidv4(),
    resave: true, // Changed to true to ensure session is saved
    saveUninitialized: true,
    cookie: {
        secure: false, // Changed to false to work in both HTTP and HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

const noteSchema = {
    location:String,
    room:String,
    time:String,
    studyTopics:String,
    additionalNotes: String,
    tags:String
};

// Define Post model once, avoid OverwriteModelError
const Post = mongoose.models.posts || mongoose.model('posts', noteSchema);

app.use('/', router);

// Load static assets
app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
    const health = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        environment: env
    };
    
    // If MongoDB is not connected, return 503 status
    const status = health.mongodb === 'connected' ? 200 : 503;
    return res.status(status).json(health);
});

// Home Route
app.get(`/`, (req, res) => {
    res.render('landing', { title: "Welcome to Stroom" });
});

// Redirect legacy search page to dashboard inline search
app.get('/search.html', (req, res) => {
    return res.redirect('/route/dashboard');
});

// Redirect legacy search API to dashboard
app.get('/search', (req, res) => {
    return res.redirect('/route/dashboard');
});

// Serve contact page directly
app.get('/contact', (req, res) => {
    res.render('contact');
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

app.get('/', function(req, res) {
    res.render('dashboard');
});

app.post('/', async function(req, res) {
    const newPost = new Post({
        location: req.body.location,
        room: req.body.room,
        time: req.body.time,
        studyTopics: req.body.studyTopics,
        additionalNotes: req.body.additionalNotes,
        tags: req.body.tags
    });
    try {
        const savedPost = await newPost.save();
        res.json(savedPost);
        console.log('Session saved');
    } catch (err) {
        console.log(`Error occurred: ${err}`);
        res.status(500).send(err);
    }
});