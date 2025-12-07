const mongoose = require('mongoose');
const DatabaseManager = require('../');

const Playlist = require('./models/playlist-model');
const User = require('./models/user-model');

class MongoDatabaseManager extends DatabaseManager {
    constructor() {
        super();
    }

    async connect() {
        try {
            await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
            console.log('MongoDB connection successful');
        } catch (e) {
            console.error('MongoDB connection error:', e.message);
        }
    }

    async close() {
        try {
            await mongoose.connection.close();
            console.log("MongoDB connection closed.");
        } catch (e) {
            console.error('Error closing MongoDB connection:', e.message);
        }
    }

    async getUserById(userId) {
        return await User.findById(userId);
    }

    async getUserByEmail(email) {
        return await User.findOne({ email: email });
    }

    async createUser(userData) {
        const newUser = new User(userData);
        return await newUser.save();
    }

    async createPlaylist(playlistData, user) {
        const playlist = new Playlist(playlistData);
        user.playlists.push(playlist._id);
        await user.save();
        return await playlist.save();
    }

    async deletePlaylist(playlistId) {
        return await Playlist.findOneAndDelete({ _id: playlistId });
    }

    async getPlaylistById(playlistId) {
        return await Playlist.findById(playlistId);
    }

    async getPlaylistPairs(user) {
        const playlists = await Playlist.find({ ownerEmail: user.email });
        return playlists.map(list => ({
            _id: list.id,
            name: list.name
        }));
    }

    async getPlaylists() {
        return await Playlist.find({});
    }

    async updatePlaylist(playlistId, playlistData) {
        return await Playlist.findOneAndUpdate({ _id: playlistId }, playlistData, { new: true });
    }

    async clear() {
        await User.deleteMany({});
        await Playlist.deleteMany({});
    }
}

module.exports = MongoDatabaseManager;