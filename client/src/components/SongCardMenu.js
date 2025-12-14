import { useContext, useState } from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function SongCardMenu({ song, anchorEl, onClose }) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [playlistMenuAnchor, setPlaylistMenuAnchor] = useState(null);
    const open = Boolean(anchorEl);
    const isPlaylistMenuOpen = Boolean(playlistMenuAnchor);
    const isOwner = auth.user && auth.user.email === song.ownerEmail;

    const userPlaylists = store.playlists 
        ? store.playlists.filter(playlist => auth.user && playlist.ownerEmail === auth.user.email)
        : [];

    const handleAddToPlaylist = (event) => {
        event.stopPropagation();
        setPlaylistMenuAnchor(event.currentTarget);
    };

    const handlePlaylistMenuClose = () => {
        setPlaylistMenuAnchor(null);
    };

    const handleSelectPlaylist = (event, playlistId) => {
        event.stopPropagation(); 
        store.addSongToPlaylist(playlistId, song._id);
        handlePlaylistMenuClose();
        onClose(); 
    };

    const handleEdit = (event) => {
        event.stopPropagation();
        onClose();
        store.showEditSongModal(song);
    };

    const handleDelete = (event) => {
        event.stopPropagation();
        onClose();
        store.markSongForDeletion(song);
    };

    return (
        <>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={onClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem
                    onClick={handleAddToPlaylist}
                    aria-owns={isPlaylistMenuOpen ? 'playlist-menu' : undefined}
                    aria-haspopup="true"
                >
                    Add to Playlist
                </MenuItem>

                {isOwner && (
                    [
                        <MenuItem key="edit" onClick={handleEdit}>
                            Edit Song
                        </MenuItem>,
                        <MenuItem key="delete" onClick={handleDelete}>
                            Remove from Catalog
                        </MenuItem>
                    ]
                )}
            </Menu>

            <Menu
                id="playlist-menu"
                anchorEl={playlistMenuAnchor}
                open={isPlaylistMenuOpen}
                onClose={handlePlaylistMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: { backgroundColor: '#fcd0d4ff' }
                }}
            >
                {userPlaylists.length > 0 ? (
                    userPlaylists.map((playlist) => (
                        <MenuItem
                            key={playlist._id}
                            onClick={(event) => handleSelectPlaylist(event, playlist._id)}
                        >
                            {playlist.name}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>
                        No Playlists Available
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}