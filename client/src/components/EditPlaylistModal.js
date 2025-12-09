import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import PlaylistSongCard from './PlaylistSongCard'; 
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: 600,
    bgcolor: '#90EE90',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    display: 'flex',
    flexDirection: 'column'
};

export default function EditPlaylistModal() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();
    const [name, setName] = useState("");

    useEffect(() => {
        if (store.currentModal === "EDIT_PLAYLIST" && store.currentList) {
            setName(store.currentList.name);
        }
    }, [store.currentModal, store.currentList]);

    const handleClose = () => {
        store.hideModals();
    };

    const handleAddSong = () => {
        store.hideModals();
        history.push('/songs');
    };

    const handleUndo = () => store.undo();
    const handleRedo = () => store.redo();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    
    const handleNameBlur = () => {
         if (store.currentList && name !== store.currentList.name) {
             store.changeListName(store.currentList._id, name);
         }
    }

    return (
        <Modal
            open={store.currentModal === "EDIT_PLAYLIST"}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold">Edit Playlist</Typography>
                    <Button variant="contained" sx={{ bgcolor: '#673ab7' }} onClick={handleAddSong} startIcon={<AddIcon />}>
                         Add Song
                    </Button>
                </Box>

                <Box sx={{ bgcolor: '#e0e0e0', p: 2, borderRadius: 1, mb: 2, display: 'flex', alignItems: 'center' }}>
                    <TextField 
                        variant="standard" 
                        fullWidth 
                        value={name} 
                        onChange={handleNameChange} 
                        onBlur={handleNameBlur}
                        InputProps={{ disableUnderline: true, style: { fontSize: 24, fontWeight: 'bold' } }}
                    />
                </Box>

                <List sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: 'white', borderRadius: 1, mb: 2, p: 1 }}>
                    {store.currentList?.songs.map((song, index) => (
                        <PlaylistSongCard 
                            key={index} 
                            index={index} 
                            song={song} 
                        />
                    ))}
                </List>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Button variant="contained" sx={{ mr: 1, bgcolor: '#673ab7' }} onClick={handleUndo} disabled={!store.canUndo()}>
                            <UndoIcon /> Undo
                        </Button>
                        <Button variant="contained" sx={{ bgcolor: '#673ab7' }} onClick={handleRedo} disabled={!store.canRedo()}>
                            <RedoIcon /> Redo
                        </Button>
                    </Box>
                    <Button variant="contained" color="success" onClick={handleClose}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}