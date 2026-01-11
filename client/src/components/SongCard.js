import { useContext, useState } from 'react';
import AuthContext from '../auth';
import SongCardMenu from './SongCardMenu';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function SongCard({ song, selected, onSelect }) {
    const { auth } = useContext(AuthContext);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const isCreatedByUser = auth.user && song.ownerEmail === auth.user.email;
    const isSelected = selected;

    const cardStyle = {
        backgroundColor: isSelected ? '#F7E396' : '#fff1cbcd',
        border: isCreatedByUser ? '2px solid #c890a7b9' : '2px solid #c890a737',
        borderRadius: '8px',
        padding: '10px 15px',
        marginBottom: '10px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(43, 41, 54, 0.02)',
    };

    const handleCardClick = () => {
        onSelect();
    };

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    return (
        <Box sx={cardStyle} onClick={handleCardClick}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {song.title} by {song.artist} ({song.year})
                </Typography>
                {auth.loggedIn && (
                    <IconButton onClick={handleMenuOpen} size="small">
                        <MoreVertIcon />
                    </IconButton>
                )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                    Listens: {song.listens.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                    Playlists: {song.playlists}
                </Typography>
            </Box>
            <SongCardMenu
                song={song}
                anchorEl={menuAnchorEl}
                onClose={handleMenuClose}
            />
        </Box>
    );
}