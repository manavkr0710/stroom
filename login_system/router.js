var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model('User', UserSchema, 'userInfo');

const emailjs = require('emailjs-com');



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
            req.session.user = req.body.email;
            return res.redirect('/route/dashboard');
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
    
    let successMessage = null;
    if (showSuccess) {
        successMessage = 'User created successfully!';
    } else if (showLogout) {
        successMessage = 'Logged out successfully!';
    }
    
    res.render('login', { success: successMessage });
});

// Route for rendering the register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Route for handling registration
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('register', { error: 'User already exists' });
        }
        const newUser = new User({ email, password });
        await newUser.save();
        res.redirect('/route/login?success=true');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error registering user');
    }
});

// Route for dashboard
router.get('/route/dashboard', (req, res) => {
    if(req.session.user) {
        res.render('dashboard', { user: req.session.user });
    } else {
        res.send('Unauthorized User');
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
    return res.status(401).json({ error: 'Unauthorized' });
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