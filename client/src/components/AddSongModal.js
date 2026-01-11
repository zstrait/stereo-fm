import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import { Box, Modal, Typography, Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

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
                <Box sx={{
                    bgcolor: '#4F4557',
                    color: 'white',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <AddIcon sx={{fontSize:'32px'}}/>
                    <Typography variant="h6" component="h2">
                        Add Song
                    </Typography>
                </Box>

                <Box sx={{
                    p: 3,
                    background: 'linear-gradient(180deg, #F4EEE0 0%, #e6e0d4 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <TextField 
                        label="Title" 
                        fullWidth 
                        value={formData.title} 
                        onChange={handleChange('title')}
                        sx={{
                            '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#4F4557' } },
                            '& label.Mui-focused': { color: '#4F4557' },
                        }}
                    />
                    <TextField 
                        label="Artist" 
                        fullWidth 
                        value={formData.artist} 
                        onChange={handleChange('artist')}
                        sx={{
                            '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#4F4557' } },
                            '& label.Mui-focused': { color: '#4F4557' },
                        }}
                    />
                    <TextField 
                        label="Year" 
                        fullWidth 
                        value={formData.year} 
                        onChange={handleChange('year')}
                        sx={{
                            '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#4F4557' } },
                            '& label.Mui-focused': { color: '#4F4557' },
                        }}
                    />
                    <TextField 
                        label="YouTube Link" 
                        fullWidth 
                        value={formData.youTubeId} 
                        onChange={handleChange('youTubeId')} 
                        error={error}
                        helperText={error ? "Invalid YouTube Link" : ""}
                        sx={{
                            '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#4F4557' } },
                            '& label.Mui-focused': { color: '#4F4557' },
                        }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                         <Button
                            variant="contained"
                            onClick={handleConfirm}
                            disabled={isButtonDisabled}
                            sx={{
                                bgcolor: '#6D5D6E', 
                                '&:hover': { bgcolor: '#5c4e5d' }
                            }}
                        >
                            Confirm
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
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