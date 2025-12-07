class DatabaseManager {
    constructor() { }

    connect() { }
    close() { }

    getUserById(userId) { }
    getUserByEmail(email) { }
    createUser(userData) { }

    createPlaylist(playlistData, userId) { }
    deletePlaylist(playlistId, userId) { }
    getPlaylistById(playlistId, userId) { }
    getPlaylistPairs(userId) { }
    getPlaylists() {}
    updatePlaylist(playlistId, playlistData, userId) { }

    clear() { }
}

module.exports = DatabaseManager;