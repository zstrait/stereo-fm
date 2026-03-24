# StereoFM

- StereoFM is a Full-Stack (MERN) social music platform that allows users to discover, create, and share music playlists.
- Users can create custom playlists, search a global catalog of songs, and listen directly within the app.

### [→ Live Demo ←](https://stereo-fm.netlify.app/)

https://github.com/user-attachments/assets/6b6e0cfa-cab8-41db-a859-e9973a6a1770

## Tech Stack

* React & JavaScript
* Node.js & Express
* MongoDB & Mongoose
* Material UI 

## Features
- **Playlist Management:**
    - Create, edit, and delete personal playlists.
    - Publish playlists to make them visible to the global community.
    - Play entire playlists seamlessly via the integrated YouTube player.
- **Global Song Catalog:**
    - Add, edit, and remove individual songs from a community-driven catalog.
    - Songs are linked to their corresponding YouTube IDs for direct playback.
- **Social Tracking:**
    - Tracks view counts and listens for playlists and songs to gauge community popularity.
- **Search & Sort:**
    - Powerful search functionalities to find specific users, playlists, or songs.
    - Sort playlists and songs by various metrics including creation date, name, and total listens.
- **User Authentication:**
    - Implements secure, stateless authentication using JWT and bcrypt.
    - Enforces granular data ownership permissions to ensure users can only modify their own contributed content.
- **Demo Mode:**
    - Features an auto-reset demo environment that programmatically reseeds data on login, enabling immediate exploration without registration.

## Running Locally

**1) Clone the repository**
   ```bash
   git clone https://github.com/zstrait/stereo-fm.git
   ```

**2) Set up the backend server**
   Open a terminal and navigate to the server directory:
   ```bash
   cd stereo-fm/server
   ```
   Install dependencies:
   ```bash
   npm install
   ```
   Create a `.env` file in the `server` directory and add your environment variables:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   Start the backend development server:
   ```bash
   npm run start
   ```

**3) Set up the frontend client**
   Open a new terminal window and navigate to the client directory:
   ```bash
   cd stereo-fm/client
   ```
   Install dependencies:
   ```bash
   npm install
   ```
   Start the React application:
   ```bash
   npm start
   ```