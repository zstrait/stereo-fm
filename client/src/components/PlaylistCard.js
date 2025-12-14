import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

export default function PlaylistCard({ playlist }) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(false);

    const isOwner = auth.user && auth.user.email === playlist.ownerEmail;

    const handleExpandClick = (event) => {
        event.stopPropagation();
        setExpanded(!expanded);
    };

    const handleDelete = (event) => {
        event.stopPropagation();
        store.markListForDeletion(playlist._id);
    };
    const handleEdit = (event) => {
        event.stopPropagation();
        store.showEditPlaylistModal(playlist);
    };
    const handleCopy = (event) => event.stopPropagation();
    const handlePlay = (event) => {
        event.stopPropagation();
        store.showPlayPlaylistModal(playlist);
    };

    let ownerButtons = null;
    if (isOwner) {
        ownerButtons = (
            <>
                <Button variant="contained" sx={{ bgcolor: 'red' }} onClick={handleDelete}>Delete</Button>
                <Button variant="contained" sx={{ bgcolor: 'royalblue' }} onClick={handleEdit}>Edit</Button>
            </>
        );
    }

    let userButtons = null;
    if (auth.loggedIn) {
        userButtons = (
            <>
                <Button variant="contained" sx={{ bgcolor: 'green' }} onClick={handleCopy}>Copy</Button>
            </>
        );
    }

    return (
        <Box sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 2,
            mb: 2,
            p: 1.5,
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar alt={playlist.ownerName} src={playlist.ownerAvatar} />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{playlist.name}</Typography>
                        <Typography variant="body2">{playlist.ownerName}</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {ownerButtons}
                    {userButtons}
                    <Button variant="contained" sx={{ bgcolor: 'magenta' }} onClick={handlePlay}>Play</Button>
                    <IconButton onClick={handleExpandClick}>
                        <ExpandMoreIcon />
                    </IconButton>
                </Box>
            </Box>

            <Typography variant="body2" sx={{ mt: 1, ml: 1, color: 'royalblue', fontWeight: 'bold' }}>
                {playlist.listenerIds.length} Listeners
            </Typography>

            {expanded && (
                <List sx={{ mt: 1, borderTop: '1px solid #ddd' }}>
                    {playlist.songs.map((song, index) => (
                        <ListItem key={song._id}>
                            <Typography>{index + 1}. {song.title} by {song.artist}</Typography>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}