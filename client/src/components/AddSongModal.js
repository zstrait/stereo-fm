import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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

export default function AddSongModal() {
    const { store } = useContext(GlobalStoreContext);
    const [error, setError] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        year: "",
        youTubeId: ""
    });

    useEffect(() => {
        if (store.currentModal === "ADD_SONG") {
            setError(false);
            setFormData({
                title: "",
                artist: "",
                year: "",
                youTubeId: ""
            });
        }
    }, [store.currentModal]); 

    const handleChange = (prop) => (event) => {
        if (prop === 'youTubeId') setError(false);
        setFormData({ ...formData, [prop]: event.target.value });
    };

    const parseYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleConfirm = () => {
        const id = parseYouTubeId(formData.youTubeId);
        
        if (!id) {
            setError(true);
            return;
        }

        store.createSong(formData.title, formData.artist, formData.year, id);
    };

    const handleCancel = () => {
        store.hideModals();
    };

    const isButtonDisabled = !formData.title || !formData.artist || !formData.year || !formData.youTubeId;

    return (
         <Modal
            open={store.currentModal === "ADD_SONG"}
            onClose={handleCancel}
        >
            <Box sx={style}>
                <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Add Song
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Title" fullWidth value={formData.title} onChange={handleChange('title')} />
                    <TextField label="Artist" fullWidth value={formData.artist} onChange={handleChange('artist')} />
                    <TextField label="Year" fullWidth value={formData.year} onChange={handleChange('year')} />
                    <TextField 
                        label="YouTube Link" 
                        fullWidth 
                        value={formData.youTubeId} 
                        onChange={handleChange('youTubeId')} 
                        error={error}
                        helperText={error ? "Invalid YouTube Link Format" : ""}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button variant="contained" onClick={handleConfirm} disabled={isButtonDisabled}>Confirm</Button>
                    <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}