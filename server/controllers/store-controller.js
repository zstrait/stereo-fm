const { db } = require('../index.js');
const auth = require('../auth')

/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/

createPlaylist = (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    async function asyncCreate() {
        try {
            const user = await db.getUserById(req.userId);
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }
            const playlist = await db.createPlaylist(body, user);
            return res.status(201).json({ playlist: playlist });
        } catch (error) {
            return res.status(400).json({ errorMessage: 'Playlist Not Created' });
        }
    }
    asyncCreate();
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
        return res.status(401).json({
            errorMessage: 'UNAUTHORIZED'
        })
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
        return res.status(401).json({
            errorMessage: 'UNAUTHORIZED'
        })
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
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    try {
        const playlists = await db.getPlaylists();
        if (!playlists || !playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    } catch (err) {
        return res.status(500).send();
    }
}

updatePlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    const body = req.body;
    if (!body) {
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
        await db.updatePlaylist(req.params.id, body.playlist);
        return res.status(200).json({ success: true, id: req.params.id, message: 'Playlist updated!' });
    } catch (error) {
        return res.status(404).json({ error, message: 'Playlist not updated!' });
    }
}

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist
}