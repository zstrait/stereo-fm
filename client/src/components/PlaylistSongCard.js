import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function PlaylistSongCard({ song, index, isActive, onClick }) {
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
        store.addRemoveSongTransaction(song, index);
    };

    if (onClick) {
        const playingStyle = {
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1,
            mb: 0.5,
            borderRadius: 1,
            cursor: 'pointer',
            border: isActive ? '1px solid black' : '1px solid transparent',
            bgcolor: isActive ? '#F2ECBE' : 'transparent',
            boxShadow: isActive ? '2px 2px 0px black' : 'none',
            transform: isActive ? 'translate(-1px, -1px)' : 'none',
            '&:hover': { bgcolor: isActive ? '#F2ECBE' : '#d6dac8aa' }
        };

        const playingIndexStyle = {
            fontFamily: 'monospace',
            width: 20,
            fontWeight: isActive ? 'bold' : 'normal',
            opacity: isActive ? 1 : 0.5
        };

        return (
            <Box onClick={() => onClick(index)} sx={playingStyle}>
                <Typography variant="caption" sx={playingIndexStyle}>
                    {index + 1})
                </Typography>
                <Box sx={{ overflow: 'hidden' }}>
                    <Typography
                        variant="body2"
                        fontWeight="bold"
                        noWrap
                        sx={{ color: isActive ? 'black' : '#334155' }}
                    >
                        {song.title}
                    </Typography>
                    <Typography variant="caption" noWrap sx={{ color: '#64748B' }}>
                        {song.artist}
                    </Typography>
                </Box>
            </Box>
        );
    }

    const editingStyle = {
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
    };

    return (
        <Box
            key={index}
            draggable="true"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={editingStyle}
        >
            <Typography variant="h6" sx={{ width: '40px' }}>
                {index + 1}.
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                    {song.title} by {song.artist} ({song.year})
                </Typography>
            </Box>
            <IconButton onClick={handleRemoveSong}>
                <CloseIcon sx={{ fontSize: 30 }} />
            </IconButton>
        </Box>
    );
}