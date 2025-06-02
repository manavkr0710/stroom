var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model('User', UserSchema, 'userInfo');

const emailjs = require('emailjs-com');


// Authentication middleware
const authMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    // Create a friendly unauthorized page
    return res.render('unauthorized', { 
      title: 'Access Denied',
      message: 'Please log in to access this page'
    });
  }
};

const noteSchema = new mongoose.Schema({
  location: String,
  room: String,
  time: String,
  studyTopics: String,
  additionalNotes: String,
  tags: String,
  author: String  
});
const Post = mongoose.models.posts || mongoose.model('posts', noteSchema);

// Route for handling the login page
router.post('/route/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.render('login', { error: 'Email does not exist' });
        }

        if (req.body.password === user.password) {
            // Store user in session
            req.session.user = req.body.email;
            console.log('Login successful, user saved in session:', req.body.email);
            
            // Force session save before redirect
            req.session.save((err) => {
                if (err) {
                    console.error('Error saving session:', err);
                    return res.render('login', { error: 'Session error. Please try again.' });
                }
                return res.redirect('/route/dashboard');
            });
        } else {
            return res.render('login', { error: 'Invalid password' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

// Route for rendering the login page
router.get('/route/login', (req, res) => {
    const showSuccess = req.query.success === 'true';
    const showLogout = req.query.logout === 'true';
    const errorMsg = req.query.error;
    
    let successMessage = null;
    if (showSuccess) {
        successMessage = 'User created successfully!';
    } else if (showLogout) {
        successMessage = 'Logged out successfully!';
    }
    
    res.render('login', { 
        success: successMessage,
        error: errorMsg
    });
});

// Route for rendering the register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Route for handling registration
router.post('/register', async (req, res) => {
    try {
        // Log registration attempt (without exposing full password)
        console.log(`[REGISTER] Registration attempt for email: ${req.body.email}`);
        
        // Input validation
        const { email, password } = req.body;
        if (!email || !password) {
            console.log('[REGISTER ERROR] Missing email or password');
            return res.render('register', { error: 'Email and password are required' });
        }
        
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.error('[REGISTER ERROR] MongoDB is not connected. Connection state:', mongoose.connection.readyState);
            return res.render('register', { error: 'Database connection issue. Please try again later.' });
        }
        
        try {
            // Check if user exists
            console.log('[REGISTER] Checking if user exists...');
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log(`[REGISTER ERROR] User with email ${email} already exists`);
                return res.render('register', { error: 'User already exists' });
            }
        } catch (dbError) {
            console.error('[REGISTER ERROR] Error checking existing user:', dbError);
            return res.render('register', { error: 'Database error. Please try again later.' });
        }
        
        // Create new user
        console.log(`[REGISTER] Creating new user with email: ${email}`);
        const newUser = new User({ email, password });
        
        try {
            await newUser.save();
            console.log(`[REGISTER] User ${email} registered successfully`);
            // Redirect to login
            return res.redirect('/route/login?success=true');
        } catch (saveError) {
            console.error('[REGISTER ERROR] Error saving user:', saveError);
            return res.render('register', { error: 'Could not save user. Please try again.' });
        }
    } catch (err) {
        console.error('[REGISTER ERROR] Unexpected error:', err);
        
        // Provide more specific error messages
        if (err.name === 'ValidationError') {
            return res.render('register', { error: 'Invalid input data' });
        } else if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.render('register', { error: 'This email is already registered' });
        } else {
            return res.render('register', { error: 'Error registering user. Please try again later.' });
        }
    }
});

// Route for dashboard
router.get('/route/dashboard', (req, res) => {
    console.log('Dashboard route accessed, session state:', req.session);
    
    if (req.session && req.session.user) {
        console.log('User found in session:', req.session.user);
        res.render('dashboard', { user: req.session.user });
    } else {
        console.log('No user in session, redirecting to login');
        // Instead of showing "Unauthorized User", redirect to login page with a message
        res.redirect('/route/login?error=Please%20login%20to%20access%20the%20dashboard');
    }
});

// Route for Logout
router.get('/route/logout', (req, res) => {
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
            res.send('Error');
        } else {
            res.redirect('/route/login?logout=true');
        }
    });
});

// Contact Us page
router.get('/contact', (req, res) => {
    // Render contact page without login requirement
    res.render('contact');
});

// Route for creating a new study session post
router.post('/post', async (req, res) => {
  try {
    const newPost = new Post({
      location: req.body.location,
      room: req.body.room,
      time: req.body.time,
      studyTopics: req.body.studyTopics,
      additionalNotes: req.body.additionalNotes,
      tags: req.body.tags,
      author: req.session.user  
    });
    const savedPost = await newPost.save();
    return res.json(savedPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save post' });
  }
});

// API endpoint for AJAX search
router.get('/api/search', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Your session has expired. Please refresh the page and log in again.'
    });
  }
  const query = req.query.query;
  let results;
  if (query) {
    const regex = new RegExp(query, 'i');
    results = await Post.find({
      $or: [
        { location: regex },
        { room: regex },
        { time: regex },
        { studyTopics: regex },
        { tags: regex }
      ]
    });
  } else {
    results = await Post.find({});
  }
  // fetch current user's sessions, include old posts without author field
  const mySessions = await Post.find({
    $or: [
      { author: req.session.user },
      { author: { $exists: false } }
    ]
  });
  return res.json({ results, mySessions });
});

module.exports = router;