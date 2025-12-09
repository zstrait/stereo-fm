const { db } = require('../index.js');
const auth = require('../auth')

/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/

createPlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' })
    }

    try {
        const user = await db.getUserById(req.userId);
        if (!user) {
            return res.status(404).json({ errorMessage: 'User not found' });
        }
        const userPlaylists = await db.getPlaylistPairs(user);

        let maxNumber = -1;
        const untitledRegex = /^Untitled (\d+)$/;

        userPlaylists.forEach(playlist => {
            const match = playlist.name.match(untitledRegex);
            if (match) {
                const num = parseInt(match[1]);
                if (num > maxNumber) maxNumber = num;
            }
        });

        const newName = `Untitled ${maxNumber + 1}`;

        const playlistData = {
            name: newName,
            ownerEmail: user.email,
            ownerName: user.userName,
            ownerAvatar: user.avatar,
            songs: [],
            published: false,
            listenerIds: []
        };

        const playlist = await db.createPlaylist(playlistData, user);
        return res.status(201).json({
            success: true,
            playlist: playlist
        });
    } catch (err) {
        return res.status(400).json({ errorMessage: 'Playlist Not Created' });
    }
}

deletePlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);

    try {
        const playlist = await db.getPlaylistById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ errorMessage: 'Playlist not found!' });
        }
        const user = await db.getUserByEmail(playlist.ownerEmail);
        if (user._id.toString() !== req.userId) {
            return res.status(401).json({ errorMessage: "Authentication Error" });
        }
        await db.deletePlaylist(req.params.id);
        return res.status(200).json({});
    } catch (err) {
        return res.status(500).send();
    }
}

getPlaylistById = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' })
    }
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    try {
        const playlist = await db.getPlaylistById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ success: false, error: 'Playlist not found' });
        }
        const user = await db.getUserById(req.userId);
        if (playlist.ownerEmail !== user.email) {
            return res.status(401).json({ success: false, description: "Authentication Error" });
        }
        return res.status(200).json({ success: true, playlist: playlist });
    } catch (err) {
        return res.status(500).send();
    }
}

getPlaylistPairs = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' })
    }
    console.log("getPlaylistPairs");

    try {
        const user = await db.getUserById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const pairs = await db.getPlaylistPairs(user);
        return res.status(200).json({ success: true, idNamePairs: pairs });
    } catch (err) {
        return res.status(500).send();
    }
}

getPlaylists = async (req, res) => {
    try {
        const searchCriteria = {
            playlistName: req.query.playlistName || "",
            userName: req.query.userName || "",
            songTitle: req.query.songTitle || "",
            songArtist: req.query.songArtist || "",
            songYear: req.query.songYear || ""
        };
        const user = req.userId ? await db.getUserById(req.userId) : null;

        const playlists = await db.getPlaylists(searchCriteria, user ? user.email : null);
        return res.status(200).json({ success: true, data: playlists });
    } catch (err) {
        console.error(err);
        return res.status(500).send();
    }
}

updatePlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' })
    }

    const body = req.body;
    if (!body || !body.playlist) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    try {
        const playlist = await db.getPlaylistById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found!' });
        }

        const user = await db.getUserById(req.userId);
        if (playlist.ownerEmail !== user.email) {
            return res.status(401).json({ success: false, description: "Authentication Error" });
        }

        playlist.name = body.playlist.name;
        playlist.songs = body.playlist.songs;
        playlist.published = body.playlist.published;

        await db.updatePlaylist(req.params.id, playlist);

        return res.status(200).json({
            success: true,
            id: playlist._id,
            message: 'Playlist updated!',
        });
    } catch (error) {
        return res.status(404).json({ error, message: 'Playlist not updated!' });
    }
}

createSong = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' })
    }
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Song',
        })
    }

    try {
        const songData = {
            title: body.title,
            artist: body.artist,
            year: body.year,
            youTubeId: body.youTubeId,
            ownerEmail: body.ownerEmail
        };

        const song = await db.createSong(songData);
        return res.status(201).json({
            success: true,
            song: song,
            message: 'Song Created!'
        })
    } catch (err) {
        return res.status(400).json({
            error: err,
            errorMessage: 'Song Not Created!'
        })
    }
}

updateSong = async (req, res) => {
    try {
        const songId = req.params.id;
        const body = req.body;
        if (!body) {
            return res.status(400).json({ errorMessage: 'You must provide a body to update' });
        }
        const song = await db.getSongById(songId);
        if (!song) {
            return res.status(404).json({ errorMessage: 'Song not found!' });
        }
        const user = await db.getUserById(req.userId);
        if (song.ownerEmail !== user.email) {
            return res.status(401).json({ errorMessage: "You do not own this song" });
        }

        const updatedSong = await db.updateSong(songId, body);
        return res.status(200).json({ success: true, song: updatedSong });
    } catch (err) {
        return res.status(500).json({ errorMessage: 'Song Not Updated!' });
    }
}

getSongs = async (req, res) => {
    try {
        const searchCriteria = {
            title: req.query.title || "",
            artist: req.query.artist || "",
            year: req.query.year || ""
        };
        const sortCriteria = req.query.sort || "";

        const userId = auth.verifyUser(req);
        const user = userId ? await db.getUserById(userId) : null;

        const result = await db.getSongs(searchCriteria, sortCriteria, user ? user.email : null);

        return res.status(200).json({
            success: true,
            songs: result.songs,
            count: result.count
        })
    } catch (err) {
        return res.status(500).json({ error: err, errorMessage: 'Failed to get songs' })
    }
}

deleteSong = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' })
    }

    try {
        const songId = req.params.id;
        const song = await db.getSongById(songId);
        const user = await db.getUserById(req.userId);

        if (!song) {
            return res.status(404).json({ errorMessage: 'Song not found!' });
        }
        if (song.ownerEmail !== user.email) {
            return res.status(401).json({ errorMessage: "You do not own this song" });
        }

        const deletedSong = await db.deleteSong(songId);
        return res.status(200).json({
            success: true,
            song: deletedSong,
            message: 'Song Deleted!'
        })
    } catch (err) {
        console.error("DELETE SONG ERROR:", err);
        return res.status(500).json({ error: err.message, errorMessage: 'Song Not Deleted!' })
    }
}

addSongToPlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' })
    }

    const { playlistId, songId } = req.body;
    if (!playlistId || !songId) {
        return res.status(400).json({ errorMessage: 'Missing playlistId or songId' });
    }

    try {
        const playlist = await db.getPlaylistById(playlistId);
        if (!playlist) {
            return res.status(404).json({ errorMessage: 'Playlist not found' });
        }

        const user = await db.getUserById(req.userId);
        if (playlist.ownerEmail !== user.email) {
            return res.status(401).json({ errorMessage: 'You do not own this playlist' });
        }

        playlist.songs.push(songId);
        await db.updatePlaylist(playlistId, playlist);

        return res.status(200).json({
            success: true,
            playlist: playlist,
            message: 'Song Added!'
        });
    } catch (err) {
        return res.status(500).json({ error: err, errorMessage: 'Failed to add song' });
    }
}

incrementListens = async (req, res) => {
    try {
        const songId = req.params.id;
        await db.incrementListens(songId);
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).send();
    }
}

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    createSong,
    updateSong,
    getSongs,
    deleteSong,
    addSongToPlaylist,
    incrementListens
}