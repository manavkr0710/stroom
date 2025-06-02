const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const {v4: uuidv4} = require('uuid');
const app = express();
const mongoose = require('mongoose');

const router = require('./router');


// Database connection URI - use environment variable for production
const uri = process.env.MONGODB_URI || `mongodb+srv://Manav:babumanav@cluster0.rwhl77f.mongodb.net/Stroom`;

async function connect() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to the database');
    } catch(error) {
        console.error('Database connection error: ', error);
    }
}

connect();

// Use environment port or default to 3001
const port = process.env.PORT || 3001;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.json());

app.set('view engine', 'ejs');

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
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