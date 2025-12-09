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

    async updateUser(email, userData) {
        return await User.findOneAndUpdate({ email: email }, userData, { new: true });
    }

    async createSong(songData) {
        const newSong = new Song(songData);
        return await newSong.save();
    }

    async updateSong(songId, songData) {
        return await Song.findByIdAndUpdate(songId, songData, { new: true });
    }
    
    async getSongs(searchCriteria, sortCriteria, userEmail) {
        let filter = {};
        if (!searchCriteria.title && !searchCriteria.artist && !searchCriteria.year && userEmail) {
            filter = { ownerEmail: userEmail };
        }
        else {
            if (searchCriteria.title) {
                filter.title = { $regex: new RegExp(searchCriteria.title, 'i') };
            }
            if (searchCriteria.artist) {
                filter.artist = { $regex: new RegExp(searchCriteria.artist, 'i') };
            }
            if (searchCriteria.year) {
                filter.year = parseInt(searchCriteria.year);
            }
        }

        let sort = {};
        if (sortCriteria) {
            switch (sortCriteria) {
                case "Title (A-Z)": sort = { title: 1 }; break;
                case "Title (Z-A)": sort = { title: -1 }; break;
                case "Artist (A-Z)": sort = { artist: 1 }; break;
                case "Artist (Z-A)": sort = { artist: -1 }; break;
                case "Year (High-Low)": sort = { year: -1 }; break;
                case "Year (Low-High)": sort = { year: 1 }; break;
                case "Listens (High-Low)": sort = { listens: -1 }; break;
                case "Listens (Low-High)": sort = { listens: 1 }; break;
                case "Playlists (High-Low)": sort = { playlists: -1 }; break;
                case "Playlists (Low-High)": sort = { playlists: 1 }; break;
                default: sort = { title: 1 };
            }
        }

        const songs = await Song.find(filter).sort(sort).limit(50);
        const count = await Song.countDocuments(filter);

        return { songs, count };
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

    async incrementListens(songId) {
        return await Song.findByIdAndUpdate(
            songId,
            { $inc: { listens: 1 } },
            { new: true }
        );
    }

    async clear() {
        await User.deleteMany({});
        await Playlist.deleteMany({});
    }
}

module.exports = MongoDatabaseManager;