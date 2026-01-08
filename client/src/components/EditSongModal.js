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

export default function EditSongModal() {
    const { store } = useContext(GlobalStoreContext);
    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        year: "",
        youTubeId: ""
    });

    useEffect(() => {
        if (store.currentSong) {
            setFormData({
                ...store.currentSong,
                youTubeId: "https://www.youtube.com/watch?v=" + store.currentSong.youTubeId
            });
        }
    }, [store.currentSong]);

    const handleChange = (prop) => (event) => {
        setFormData({ ...formData, [prop]: event.target.value });
    };

    const parseYouTubeId = (url) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    const handleConfirm = () => {
        store.updateSong(store.currentSong._id, {
            ...formData,
            youTubeId: parseYouTubeId(formData.youTubeId)
        });
    };

    const handleCancel = () => {
        store.hideModals();
    };

    const isButtonDisabled = !formData.title || !formData.artist || !formData.year || !formData.youTubeId;

    return (
        <Modal
            open={store.currentModal === "EDIT_SONG"}
            onClose={handleCancel}
        >
            <Box sx={style}>
                <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Edit Song
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Title" fullWidth value={formData.title} onChange={handleChange('title')} />
                    <TextField label="Artist" fullWidth value={formData.artist} onChange={handleChange('artist')} />
                    <TextField label="Year" fullWidth value={formData.year} onChange={handleChange('year')} />
                    <TextField label="YouTube Link" fullWidth value={formData.youTubeId} onChange={handleChange('youTubeId')} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button variant="contained" onClick={handleConfirm} disabled={isButtonDisabled}>Confirm</Button>
                    <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}