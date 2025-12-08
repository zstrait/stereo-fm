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

export default function RemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);
    
    const handleConfirm = () => {
        store.deleteSong(store.currentSong._id);
    };

    const handleCancel = () => {
        store.hideModals();
    };

    return (
        <Modal
            open={store.currentModal === "REMOVE_SONG"}
            onClose={handleCancel}
        >
            <Box sx={style}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Remove Song?
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography>
                    Are you sure you want to remove the song <b>{store.currentSong?.title}</b> from the catalog?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 12, mt: 3 }}>
                    <Button variant="contained" onClick={handleConfirm}>Remove Song</Button>
                    <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}