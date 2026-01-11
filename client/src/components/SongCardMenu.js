import { useContext, useState } from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemIcon, ListItemText, Divider } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Define a consistent style for both menus
const menuPaperProps = {
    elevation: 0,
    sx: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
        mt: 1.5,
        bgcolor: '#F4EEE0',
        border: '1px solid #E0DCE4',
        '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
        },
        '&:before': { // This creates the little arrow at the top
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: '#F4EEE0',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
            borderLeft: '1px solid #E0DCE4',
            borderTop: '1px solid #E0DCE4'
        },
    },
};

const menuItemSx = {
    borderBottom: '1px dotted lightgray',
    '&:hover': {
        backgroundColor: '#e0dce4'
    }
}

export default function SongCardMenu({ song, anchorEl, onClose }) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [playlistMenuAnchor, setPlaylistMenuAnchor] = useState(null);

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
            {/* --- MAIN MENU --- */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={onClose}
                PaperProps={menuPaperProps}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleAddToPlaylist} sx={menuItemSx}>
                    <ListItemIcon><PlaylistAddIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Add to Playlist</ListItemText>
                </MenuItem>

                {isOwner && (
                    <MenuItem onClick={handleEdit} sx={menuItemSx}>
                        <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Edit Song</ListItemText>
                    </MenuItem>
                )}
                
                {isOwner && (
                    <MenuItem onClick={handleDelete} sx={{ ...menuItemSx, color: 'error.main', borderBottom: 'none' }}>
                        <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                        <ListItemText>Remove from Catalog</ListItemText>
                    </MenuItem>
                )}
            </Menu>

            <Menu
                anchorEl={playlistMenuAnchor}
                open={Boolean(playlistMenuAnchor)}
                onClose={handlePlaylistMenuClose}
                PaperProps={menuPaperProps}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {userPlaylists.length > 0 ? (
                    userPlaylists.map((playlist) => (
                        <MenuItem
                            key={playlist._id}
                            onClick={(event) => handleSelectPlaylist(event, playlist._id)}
                            sx={menuItemSx}
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