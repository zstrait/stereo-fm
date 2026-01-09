import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

    const handlePlay = (event) => {
        event.stopPropagation();
        store.showPlayPlaylistModal(playlist);
    };

    let ownerButtons = null;
    if (isOwner) {
        ownerButtons = (
            <>
                <IconButton
                    onClick={handleEdit}
                    size="small"
                    aria-label="edit"
                    sx={{
                        color: 'grey',
                        '&:hover': {
                            bgcolor: 'rgba(0, 128, 0, 0.1)',
                            '& .MuiSvgIcon-root': { color: '#457f43ff' },
                        }
                    }}
                >
                    <EditIcon sx={{ fontSize: '20px' }} />
                </IconButton>
                <IconButton
                    onClick={handleDelete}
                    size="small"
                    aria-label="delete"
                    sx={{
                        color: 'grey',
                        '&:hover': {
                            bgcolor: 'rgba(255, 0, 0, 0.1)',
                            '& .MuiSvgIcon-root': { color: '#9e2a3ada' }
                        }
                    }}
                >
                    <DeleteIcon sx={{ fontSize: '20px' }} />
                </IconButton>
            </>
        );
    }

    return (
        <Box sx={{
            bgcolor: '#fcf5eeb7',
            borderRadius: 2,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(43, 41, 54, 0.05)',
            mb: 2,
            p: 1.5,
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 5px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(43, 41, 54, 0.05)',
            }
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar alt={playlist.ownerName} src={playlist.ownerAvatar} />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2b2936ff' }}>{playlist.name}</Typography>
                        <Typography variant="body2" sx={{ color: '#2b2936ff' }}>{playlist.ownerName}</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#A78295',
                            width: '96px',
                            '& .MuiButton-startIcon > svg': {
                                fontSize: '26px'
                            },
                            transform: 'translatex(12px)',
                            '&:hover': { bgcolor: '#B88FA2' }
                        }}
                        onClick={handlePlay}
                        startIcon={<PlayArrowIcon />}
                    >
                        <span style={{ transform: 'translate(-4px, 1px)', display: 'inline-block', fontSize: '14px' }}>
                            Play
                        </span>
                    </Button>
                    <IconButton onClick={handleExpandClick} sx={{ transform: 'translatex(5px)' }}>
                        <ExpandMoreIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ mt: 1, ml: 1, color: '#957083ff', fontWeight: 'bold' }}>
                    {playlist.listenerIds.length} Listeners
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', transform: 'translateY(2px)' }}>
                    {ownerButtons}
                </Box>
            </Box>

            {expanded && (
                <List sx={{ mt: 1, borderTop: '1px solid #ddd', color: '#2b2936ff' }}>
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