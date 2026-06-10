# Stroom

![welcome-stroom](https://github.com/user-attachments/assets/7b3eb9f3-952b-4141-9b48-fafa0f20f538)

Stroom is a full-stack web application that helps users find, create, and join study sessions. Built with Node.js, Express, MongoDB, and the Google Maps API, it provides an interactive way to discover study spots and organize collaborative learning.

## Features

- User authentication system
- Interactive map with nearby study locations
- Create and manage study sessions
- Search functionality to find relevant study groups

![createpost-stroom](https://github.com/user-attachments/assets/90a2cf67-6b40-4b95-be85-cab3ac16fca0)
![map-stroom](https://github.com/user-attachments/assets/3580628b-d68a-4ec0-b51d-b33dcd720515)

![mystudysessions-stroom](https://github.com/user-attachments/assets/7438813d-3364-486a-af91-b6ce8343f480)
![allavailablesessions-stroom](https://github.com/user-attachments/assets/dc5d47ac-e9a1-4797-9cbb-8bf2276ee9be)
![contact-stroom](https://github.com/user-attachments/assets/9ef2d6a5-9095-4dbe-a52d-022b84e3493b)

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, EJS templates, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: Google Maps API, EmailJS



## Local Development Setup

1. Clone the repository
   ```
   git clone https://github.com/manavkr0710/stroom.git
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
