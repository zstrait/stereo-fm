import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { Box, Modal, Typography, Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450, 
    bgcolor: '#F4EEE0',
    border: 'none',
    borderRadius: '12px', 
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', 
    p: 0, 
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
};

export default function DeletePlaylistModal() {
    const { store } = useContext(GlobalStoreContext);

    const handleDelete = () => {
        store.deleteMarkedList();
    }
    const handleClose = () => {
        store.hideModals();
    }

    let playlistName = "";
    if (store.listMarkedForDeletion) {
        playlistName = store.listMarkedForDeletion.name;
    }

    return (
        <Modal
            open={store.currentModal === "DELETE_LIST"}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box sx={{
                    bgcolor: '#4F4557',
                    color: 'white',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <WarningAmberIcon />
                    <Typography variant="h6" component="h2">
                        Delete Playlist
                    </Typography>
                </Box>

                <Box sx={{
                    p: 3,
                    background: 'linear-gradient(180deg, #F4EEE0 0%, #e6e0d4 100%)'
                }}>
                    <Typography sx={{ color: '#393646', fontSize: '1.1rem' }}>
                        Are you sure you want to permanently delete the <strong>{playlistName}</strong> playlist?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                        <Button
                            variant="contained"
                            onClick={handleDelete}
                            sx={{
                                bgcolor: '#AF1740',
                                '&:hover': { bgcolor: '#C71D4A' }
                            }}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{
                                color: '#4F4557',
                                borderColor: '#4F4557',
                                '&:hover': {
                                    backgroundColor: '#4f455722',
                                    borderColor: '#3A3341', 
                                    color: '#3A3341' 
                                }
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}