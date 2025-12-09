import { useContext } from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function SongCardMenu({ song, anchorEl, onClose }) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const open = Boolean(anchorEl);
    const isOwner = auth.user && auth.user.email === song.ownerEmail;

    const handleAddToPlaylist = (event) => {
        event.stopPropagation();
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
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
        >
            <MenuItem onClick={handleAddToPlaylist}>
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
    );
}