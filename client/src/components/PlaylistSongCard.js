import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function PlaylistSongCard({ song, index }) {
    const { store } = useContext(GlobalStoreContext);

    const handleDragStart = (event) => {
        event.dataTransfer.setData("song", index);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    };

    const handleRemoveSong = (event) => {
        event.stopPropagation();
        store.removeSong(index);
    };

    return (
        <Box
            key={index}
            draggable="true"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid black',
                bgcolor: '#fff9c4',
                mb: 1,
                borderRadius: 2,
                p: 1.5,
                width: '98%',
                mx: 'auto'
            }}
        >
            <Typography variant="h6" sx={{ width: '40px' }}>{index + 1}.</Typography>

            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold">{song.title} by {song.artist} ({song.year})</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton><ContentCopyIcon sx={{ fontSize: 30 }} /></IconButton>
                <IconButton onClick={handleRemoveSong}><CloseIcon sx={{ fontSize: 30 }} /></IconButton>
            </Box>
        </Box>
    );
}