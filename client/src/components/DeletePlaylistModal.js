import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function DeletePlaylistModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleDelete() {
        store.deleteMarkedList();
    }
    function handleClose() {
        store.hideModals();
    }

    let playlistName = "";
    if (store.listMarkedForDeletion) {
        playlistName = store.listMarkedForDeletion.name;
    }

    return (
        <Modal
            open={store.currentModal === "DELETE_LIST"} 
        >
            <Box sx={style}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Delete Playlist?
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography>
                    Are you sure you want to delete the <strong>{playlistName}</strong> playlist?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}