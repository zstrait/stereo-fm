import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import PlaylistSongCard from './PlaylistSongCard'; 
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useHistory } from 'react-router-dom';

const btnStyle = {
    border: '2px solid black',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    '&:active': {
        transform: 'translate(1px, 1px)',
        boxShadow: 'none !important'
    }
};

const styles = {
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '850px',
        height: '75vh',
        minHeight: '600px',
        maxHeight: '800px',
        bgcolor: '#A7C1A8',
        border: '3px solid #000',
        borderRadius: '16px',
        boxShadow: '4px 4px 0px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        outline: 'none'
    },
    titleBar: {
        container: {
            height: '42px',
            bgcolor: '#EEEFE0',
            borderBottom: '3px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            userSelect: 'none',
            flexShrink: 0
        },
        title: {
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
        },
        closeBtn: {
            ...btnStyle,
            width: 26,
            height: 26,
            bgcolor: '#F87171',
            color: 'white',
            boxShadow: '1px 1px 0px black',
            '&:hover': { bgcolor: '#EF4444' },
            '&:active': { transform: 'translate(1px, 1px)', boxShadow: 'none !important' }
        }
    },
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2.5,
        gap: 2,
        overflow: 'hidden',
        minHeight: 0
    },
    nameField: {
        container: {
            bgcolor: '#faf9f5',
            border: '2px solid #000',
            borderRadius: '10px',
            px: 2.5,
            py: 1.25,
            boxShadow: '2px 2px 0px rgba(0,0,0,0.15)',
            flexShrink: 0
        }
    },
    songList: {
        container: {
            flex: 1,
            minHeight: 0,
            bgcolor: '#EEEFE0',
            borderRadius: '12px',
            border: '3px solid #000',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.15)'
        },
        header: {
            px: 2.5,
            py: 1.25,
            borderBottom: '2px solid #000',
            bgcolor: '#faf9f5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            gap: 2
        },
        scrollArea: {
            flex: 1,
            overflowY: 'auto',
            p: 1.5,
            bgcolor: '#EEEFE0',
            '&::-webkit-scrollbar': { width: '10px' },
            '&::-webkit-scrollbar-track': { 
                bgcolor: 'rgba(0,0,0,0.05)',
                borderRadius: '8px',
                m: 1
            },
            '&::-webkit-scrollbar-thumb': { 
                backgroundColor: '#A7C1A8', 
                borderRadius: '8px', 
                border: '2px solid black',
                '&:hover': { backgroundColor: '#8FAF90' }
            }
        }
    },
    controls: {
        iconButton: {
            ...btnStyle,
            width: 36,
            height: 36,
            bgcolor: 'white',
            boxShadow: '2px 2px 0px black',
            padding: 0,
            minWidth: 'auto',
            '&:hover': { bgcolor: '#faf9f5' },
            '&:disabled': {
                opacity: 0.25,
                cursor: 'not-allowed',
                bgcolor: '#f5f5f5',
                color: '#999',
                '&:hover': { bgcolor: '#f5f5f5' },
                '&:active': { transform: 'none', boxShadow: '2px 2px 0px black' }
            }
        },
        addButton: {
            ...btnStyle,
            width: 36,
            height: 36,
            bgcolor: '#fff8afe8',
            border: '2px solid black',
            boxShadow: '2px 2px 0px black',
            padding: 0,
            minWidth: 'auto',
            '&:hover': { bgcolor: '#fbf28a' }
        }
    }
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
            <Box sx={styles.modal}>
                <Box sx={styles.titleBar.container}>
                    <Box sx={styles.titleBar.title}>
                        <EditIcon sx={{ fontSize: 17, color: '#334155' }} />
                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: 1.2, color: '#334155' }}>
                            EDIT PLAYLIST
                        </Typography>
                    </Box>
                    <Box component="button" onClick={handleClose} sx={styles.titleBar.closeBtn}>
                        <CloseIcon sx={{ fontSize: 17, strokeWidth: 2 }} />
                    </Box>
                </Box>

                <Box sx={styles.content}>
                    <Box sx={styles.nameField.container}>
                        <TextField 
                            variant="standard" 
                            fullWidth 
                            value={name} 
                            onChange={handleNameChange} 
                            onBlur={handleNameBlur}
                            placeholder="Playlist name..."
                            InputProps={{ 
                                disableUnderline: true, 
                                style: { 
                                    fontSize: 19, 
                                    fontWeight: 'bold',
                                    color: '#1E293B',
                                    letterSpacing: '-0.3px'
                                } 
                            }}
                        />
                    </Box>

                    <Box sx={styles.songList.container}>
                        <Box sx={styles.songList.header}>
                            <Typography 
                                variant="body2" 
                                fontWeight="bold" 
                                sx={{ color: '#334155', fontSize: '0.875rem' }}
                            >
                                {store.currentList?.songs.length || 0} Tracks
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Box component="button" onClick={handleUndo} disabled={!store.canUndo()} sx={styles.controls.iconButton}>
                                    <UndoIcon sx={{ fontSize: 18 }} />
                                </Box>
                                <Box component="button" onClick={handleRedo} disabled={!store.canRedo()} sx={styles.controls.iconButton}>
                                    <RedoIcon sx={{ fontSize: 18 }} />
                                </Box>
                                <Box component="button" onClick={handleAddSong} sx={styles.controls.addButton}>
                                    <AddIcon sx={{ fontSize: 24 }} />
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={styles.songList.scrollArea}>
                            {store.currentList?.songs.length === 0 ? (
                                <Box sx={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    height: '100%',
                                    gap: 1.5
                                }}>
                                    <Typography variant="body2" fontWeight="600" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                                        No songs yet
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                                        Click "+" to start building your playlist
                                    </Typography>
                                </Box>
                            ) : (
                                store.currentList?.songs.map((song, index) => (
                                    <PlaylistSongCard 
                                        key={index} 
                                        index={index} 
                                        song={song} 
                                    />
                                ))
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}