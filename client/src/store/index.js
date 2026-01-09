import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { jsTPS } from "jstps"
import storeRequestSender from './requests'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import AuthContext from '../auth'

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_PLAYLISTS: "LOAD_PLAYLISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    LOAD_SONGS: "LOAD_SONGS",
    SET_SEARCH_CRITERIA: "SET_SEARCH_CRITERIA",
    SET_SORT_CRITERIA: "SET_SORT_CRITERIA",
    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION"
}

const tps = new jsTPS();

const CurrentModal = {
    NONE: "NONE",
    DELETE_LIST: "DELETE_LIST",
    EDIT_SONG: "EDIT_SONG",
    ERROR: "ERROR",
    ADD_SONG: "ADD_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    PLAY_PLAYLIST: "PLAY_PLAYLIST",
    EDIT_PLAYLIST: "EDIT_PLAYLIST",
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,
        playlists: [],
        currentList: null,
        currentSongIndex: -1,
        currentSong: null,
        newListCounter: 0,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        currentView: "HOME",
        searchCriteria: {},
        sortCriteria: "Title (A-Z)",
        songCatalog: [],
        songCount: 0
    });
    const history = useHistory();

    const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore(prevStore => ({
                    ...prevStore,
                    currentModal: prevStore.currentModal === CurrentModal.EDIT_PLAYLIST ? CurrentModal.EDIT_PLAYLIST : CurrentModal.NONE,
                    playlists: payload.playlists,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                }));
            }
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore(prevStore => ({
                    ...prevStore,
                    currentModal: CurrentModal.NONE,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                }));
            }
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore(prevStore => ({
                    ...prevStore,
                    currentModal: CurrentModal.NONE,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: prevStore.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                }));
            }
            case GlobalStoreActionType.LOAD_PLAYLISTS: {
                return setStore(prevStore => ({
                    ...prevStore,
                    currentModal: prevStore.currentModal === CurrentModal.PLAY_PLAYLIST ? CurrentModal.PLAY_PLAYLIST : CurrentModal.NONE,
                    playlists: payload,
                    currentList: prevStore.currentModal === CurrentModal.PLAY_PLAYLIST ? prevStore.currentList : null,
                    currentSongIndex: -1,
                    currentSong: null,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                }));
            }
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore(prevStore => ({
                    ...prevStore,
                    currentModal: CurrentModal.DELETE_LIST,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist
                }));
            }
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore(prevStore => ({
                    ...prevStore,
                    currentModal: prevStore.currentModal === CurrentModal.EDIT_PLAYLIST ? CurrentModal.EDIT_PLAYLIST : CurrentModal.NONE,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                }));
            }
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore(prevStore => ({
                    ...prevStore,
                    currentModal: CurrentModal.EDIT_SONG,
                    currentSong: payload
                }));
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore(prevStore => ({
                    ...prevStore,
                    currentModal: CurrentModal.NONE,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                }));
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore(prevStore => ({
                    ...prevStore,
                    currentModal: CurrentModal.NONE
                }));
            }
            case GlobalStoreActionType.LOAD_SONGS: {
                return setStore(prevStore => ({
                    ...prevStore,
                    currentModal: CurrentModal.NONE,
                    songCatalog: payload.songs,
                    songCount: payload.count
                }));
            }
            case GlobalStoreActionType.SET_SEARCH_CRITERIA: {
                return setStore(prevStore => ({
                    ...prevStore,
                    searchCriteria: payload
                }));
            }
            case GlobalStoreActionType.SET_SORT_CRITERIA: {
                return setStore(prevStore => ({
                    ...prevStore,
                    sortCriteria: payload
                }));
            }
            case GlobalStoreActionType.SET_CURRENT_MODAL: {
                return setStore(prevStore => ({
                    ...prevStore,
                    currentModal: payload.modal || payload,
                    currentList: payload.list || prevStore.currentList
                }));
            }
            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                return setStore(prevStore => ({
                    ...prevStore,
                    currentModal: CurrentModal.REMOVE_SONG,
                    currentSong: payload
                }));
            }

            default:
                return store;
        }
    }

    store.changeListName = function (id, newName) {
        async function asyncChangeListName(id) {
            let response = await storeRequestSender.getPlaylistById(id);
            if (response.status === 200) {
                const responseData = await response.json();
                let playlist = responseData.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await storeRequestSender.updatePlaylistById(playlist._id, playlist);
                    if (response.status === 200) {
                        async function getListPairs(playlist) {
                            response = await storeRequestSender.getPlaylists();
                            if (response.status === 200) {
                                const responseData = await response.json();
                                let playlists = responseData.data;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        playlists: playlists,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/");
    }

    store.createNewList = async function () {
        const response = await storeRequestSender.createPlaylist();
        if (response.status === 201) {
            store.loadPlaylists();
        } else {
            console.log("FAILED TO CREATE A NEW LIST");
        }
    }

    store.loadPlaylists = function () {
        async function asyncLoadPlaylists() {
            const response = await storeRequestSender.getPlaylists(store.searchCriteria, store.sortCriteria);
            if (response.status === 200) {
                const responseData = await response.json();
                storeReducer({
                    type: GlobalStoreActionType.LOAD_PLAYLISTS,
                    payload: responseData.data
                });
            } else {
                console.log("FAILED TO GET PLAYLISTS");
            }
        }
        asyncLoadPlaylists();
    }

    store.addSongToPlaylist = function (playlistId, songId) {
        async function asyncAddSong() {
            const response = await storeRequestSender.addSongToPlaylist(playlistId, songId);
            if (response.status === 200) {
                console.log("Song added to playlist");
                store.loadSongs();
            }
        }
        asyncAddSong();
    }

    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await storeRequestSender.getPlaylistById(id);
            if (response.status === 200) {
                const responseData = await response.json();
                let playlist = responseData.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: { id: id, playlist: playlist }
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await storeRequestSender.deletePlaylistById(id);
            if (response.status === 200) {
                store.loadPlaylists();
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function () {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();

    }

    store.showAddSongModal = () => {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_MODAL,
            payload: "ADD_SONG"
        });
    }
    store.showEditSongModal = function (song) {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: song
        });
    }
    store.showPlayPlaylistModal = (playlist) => {
        async function incrementListens() {
            await storeRequestSender.incrementPlaylistListens(playlist._id);
            store.loadPlaylists();
        }
        incrementListens();
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_MODAL,
            payload: { modal: "PLAY_PLAYLIST", list: playlist }
        });
    }
    store.showEditPlaylistModal = (playlist) => {
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_MODAL,
            payload: { modal: "EDIT_PLAYLIST", list: playlist }
        });
    }

    store.hideModals = () => {
        auth.errorMessage = null;
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isErrorModalOpen = () => {
        return store.currentModal === CurrentModal.ERROR;
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await storeRequestSender.getPlaylistById(id);
            if (response.status === 200) {
                const responseData = await response.json();
                let playlist = responseData.playlist;

                response = await storeRequestSender.updatePlaylistById(playlist._id, playlist);
                if (response.status === 200) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    }

    store.createSong = function (title, artist, year, youTubeId) {
        async function asyncCreateSong() {
            const songData = {
                title: title,
                artist: artist,
                year: parseInt(year),
                youTubeId: youTubeId,
                ownerEmail: auth.user.email
            };
            const response = await storeRequestSender.createSong(songData);
            if (response.status === 201) {
                await store.loadSongs();
                store.hideModals();
            }
        }
        asyncCreateSong();
    }

    store.updateSong = function (songId, songData) {
        async function asyncUpdateSong() {
            const response = await storeRequestSender.updateSong(songId, songData);
            if (response.status === 200) {
                store.hideModals();
                store.loadSongs();
            }
        }
        asyncUpdateSong();
    }

    store.moveSong = function (start, end) {
        let list = store.currentList;

        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        store.updateCurrentList();
    }

    store.markSongForDeletion = function (song) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
            payload: song
        });
    }

    store.deleteSong = function (songId) {
        async function asyncDeleteSong() {
            const response = await storeRequestSender.deleteSong(songId);
            if (response.status === 200) {
                store.hideModals();
                store.loadSongs();
            }
        }
        asyncDeleteSong();
    }

    store.removeSong = function (index) {
        let list = store.currentList;
        list.songs.splice(index, 1);
        store.updateCurrentList();
    }

    store.insertSong = function (index, song) {
        let list = store.currentList;
        list.songs.splice(index, 0, song);
        store.updateCurrentList();
    }

    store.loadSongs = async function () {
        const criteria = store.searchCriteria || {};
        const response = await storeRequestSender.getSongs(criteria, store.sortCriteria);
        if (response.status === 200) {
            const responseData = await response.json();
            storeReducer({
                type: GlobalStoreActionType.LOAD_SONGS,
                payload: { songs: responseData.songs, count: responseData.count }
            });
        }
    }

    store.incrementListens = function (songId) {
        async function asyncIncrement() {
            await storeRequestSender.incrementListens(songId);
            store.loadSongs();
        }
        asyncIncrement();
    }

    store.setSearchCriteria = function (searchCriteria) {
        storeReducer({
            type: GlobalStoreActionType.SET_SEARCH_CRITERIA,
            payload: { ...searchCriteria }
        });
    }

    store.setSortCriteria = function (sortCriteria) {
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_CRITERIA,
            payload: sortCriteria
        });
    }

    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.processTransaction(transaction);
    }

    store.addRemoveSongTransaction = (song, index) => {
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.processTransaction(transaction);
    }

    store.updateCurrentList = function () {
        async function asyncUpdateCurrentList() {
            const response = await storeRequestSender.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.status === 200) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function () {
        return (store.currentList !== null);
    }
    store.canUndo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToDo());
    }
    store.canClose = function () {
        return (store.currentList !== null);
    }

    function KeyPress(event) {
        if (!store.modalOpen && event.ctrlKey) {
            if (event.key === 'z') {
                store.undo();
            }
            if (event.key === 'y') {
                store.redo();
            }
        }
    }

    document.onkeydown = (event) => KeyPress(event);

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };