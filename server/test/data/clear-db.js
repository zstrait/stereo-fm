const mongoose = require('mongoose');
const User = require('../../db/mongodb/models/user-model');
const Song = require('../../db/mongodb/models/song-model');
const Playlist = require('../../db/mongodb/models/playlist-model');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function clearDB() {
    try {
        await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
        console.log('Connected to MongoDB for Clearing...');

        await User.deleteMany({});
        await Song.deleteMany({});
        await Playlist.deleteMany({});

        console.log('All collections cleared successfully.');
        process.exit();
    } catch (error) {
        console.error("Error clearing database:", error);
        process.exit(1);
    }
}

clearDB();