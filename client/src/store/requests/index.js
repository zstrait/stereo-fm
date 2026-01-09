export const createPlaylist = () => {
    return fetch('http://localhost:4000/store/playlist/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({})
    });
}
export const deletePlaylistById = (id) => {
    return fetch(`http://localhost:4000/store/playlist/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
}
export const getPlaylistById = (id) => {
    return fetch(`http://localhost:4000/store/playlist/${id}`, {
        credentials: 'include',
    });
}
export const updatePlaylistById = (id, playlist) => {
    return fetch(`http://localhost:4000/store/playlist/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            playlist: playlist
        })
    });
}
export const getPlaylists = (criteria, sort) => {
    const params = new URLSearchParams();
    if (criteria) {
        if (criteria.playlistName) params.append('playlistName', criteria.playlistName);
        if (criteria.userName) params.append('userName', criteria.userName);
        if (criteria.songTitle) params.append('songTitle', criteria.songTitle);
        if (criteria.songArtist) params.append('songArtist', criteria.songArtist); 
        if (criteria.songYear) params.append('songYear', criteria.songYear);       
    }
    if (sort) params.append('sort', sort);

    return fetch(`http://localhost:4000/store/playlists?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
    });
}

export const addSongToPlaylist = (playlistId, songId) => {
    return fetch(`http://localhost:4000/store/playlist/${playlistId}/song`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ playlistId, songId })
    });
}

export const createSong = (songData) => {
    return fetch(`http://localhost:4000/store/song`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(songData)
    });
}

export const updateSong = (songId, songData) => {
    return fetch(`http://localhost:4000/store/song/${songId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(songData)
    });
}

export const deleteSong = (songId) => {
    return fetch(`http://localhost:4000/store/song/${songId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
}

export const getSongs = (criteria, sort) => {
    const params = new URLSearchParams();
    if (criteria.title) params.append('title', criteria.title);
    if (criteria.artist) params.append('artist', criteria.artist);
    if (criteria.year) params.append('year', criteria.year);
    if (sort) params.append('sort', sort);

    return fetch(`http://localhost:4000/store/songs?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
    });
}

export const incrementListens = (songId) => {
    return fetch(`http://localhost:4000/store/song/${songId}/listen`, {
        method: 'PUT',
        credentials: 'include',
    });
}

export const incrementPlaylistListens = (playlistId) => {
    return fetch(`http://localhost:4000/store/playlist/${playlistId}/listen`, {
        method: 'PUT',
        credentials: 'include', 
    });
}

const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    updatePlaylistById,
    getPlaylists,
    addSongToPlaylist,
    createSong,
    updateSong,
    deleteSong,
    getSongs,
    incrementListens,
    incrementPlaylistListens
}

export default apis;
