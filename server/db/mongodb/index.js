const mongoose = require('mongoose');
const DatabaseManager = require('../');

const User = require('./models/user-model');
const Song = require('./models/song-model');
const Playlist = require('./models/playlist-model');

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

    async createSong(songData) {
        const newSong = new Song(songData);
        return await newSong.save();
    }

    async getSongs(searchCriteria) {
        if (!searchCriteria) {
            return await Song.find({});
        }
        const regex = new RegExp(searchCriteria, 'i');
        return await Song.find({
            $or: [
                { title: { $regex: regex } },
                { artist: { $regex: regex } }
            ]
        });
    }

    async getSongById(songId) {
        return await Song.findById(songId);
    }

    async deleteSong(songId) {
        const deletedSong = await Song.findOneAndDelete({ _id: songId });
        if (deletedSong) {
            await Playlist.updateMany(
                {},
                { $pull: { songs: deletedSong._id } }
            );
        }
        return deletedSong;
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
        return await Playlist.findById(playlistId).populate('songs');
    }

    async getPlaylistPairs(user) {
        const playlists = await Playlist.find({ ownerEmail: user.email });
        return playlists.map(list => ({
            _id: list.id,
            name: list.name
        }));
    }

    async getPlaylists(searchCriteria, userEmail) {
        let filter = { published: true };

        if (userEmail) {
            filter = { ownerEmail: userEmail };
        }
        else if (searchCriteria) {
            const regex = new RegExp(searchCriteria, 'i');
            const matchingSongs = await Song.find({
                $or: [
                    { title: { $regex: regex } },
                    { artist: { $regex: regex } }
                ]
            }, '_id');
            const songIds = matchingSongs.map(song => song._id);

            filter = {
                published: true,
                $or: [
                    { name: { $regex: regex } },
                    { ownerName: { $regex: regex } },
                    { songs: { $in: songIds } }
                ]
            };
        }

        return await Playlist.find(filter).populate('songs');
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