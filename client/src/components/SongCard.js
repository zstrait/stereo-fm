import { useContext } from 'react';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function SongCard({ song, selected, onSelect }) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const isCreatedByUser = auth.user && song.ownerEmail === auth.user.email;
    const isSelected = selected;

    const cardStyle = {
        backgroundColor: isSelected ? '#ffc107' : '#fff9c4',
        border: isCreatedByUser ? '2px solid red' : '1px solid transparent',
        borderRadius: '8px',
        padding: '10px 15px',
        marginBottom: '10px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    };

    const handleCardClick = () => {
        onSelect();
    };

    const handleMenuClick = (event) => {
        event.stopPropagation();
        console.log("Menu Clicked");
    };

    return (
        <Box sx={cardStyle} onClick={handleCardClick}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {song.title} by {song.artist} ({song.year})
                </Typography>
                <IconButton onClick={handleMenuClick} size="small">
                    <MoreVertIcon />
                </IconButton>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                    Listens: {song.listens.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                    Playlists: {song.playlists}
                </Typography>
            </Box>
        </Box>
    );
}