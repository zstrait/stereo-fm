/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createPlaylist = (newListName, newSongs, userEmail) => {
    return fetch('http://localhost:4000/store/playlist/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            name: newListName,
            songs: newSongs,
            ownerEmail: userEmail
        })
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
export const getPlaylists = (searchCriteria) => {
    return fetch(`http://localhost:4000/store/playlists?search=${searchCriteria}`, {
        method: 'GET',
        credentials: 'include',
    });
}

export const getSongs = (searchCriteria) => {
    return fetch(`http://localhost:4000/store/songs?search=${searchCriteria}`, {
        method: 'GET',
        credentials: 'include',
    });
}

const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    updatePlaylistById,
    getPlaylists,
    getSongs
}

export default apis;
