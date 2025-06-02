# Stroom - Study Room Finder

Stroom is a full-stack web application that helps users find, create, and join study sessions. Built with Node.js, Express, MongoDB, and the Google Maps API, it provides an interactive way to discover study spots and organize collaborative learning.

## Features

- User authentication system
- Interactive map with nearby study locations
- Create and manage study sessions
- Search functionality to find relevant study groups
- Mobile-responsive design


## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, EJS templates, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: Google Maps API



## Local Development Setup

1. Clone the repository
   ```
   git clone https://github.com/your-username/Stroom.git
   cd Stroom-main
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/
   GOOGLE_MAPS_API_KEY=your-api-key-here
   SESSION_SECRET=your-session-secret
   ```

4. Start the development server
   ```
   npm start
   ```

5. Visit `http://localhost:3001` in your browser
