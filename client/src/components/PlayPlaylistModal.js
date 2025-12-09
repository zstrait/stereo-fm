import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import Avatar from '@mui/material/Avatar';
import YouTube from 'react-youtube';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    height: 600,
    bgcolor: '#90EE90',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    display: 'flex',
};

export default function PlayPlaylistModal() {
    const { store } = useContext(GlobalStoreContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        if (store.currentModal === "PLAY_PLAYLIST") {
            setCurrentIndex(0);
            setIsPlaying(true);
        }
    }, [store.currentModal]);

    const handleClose = () => {
        store.hideModals();
        setIsPlaying(false);
    };

    const handleNext = () => {
        if (store.currentList) {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= store.currentList.songs.length) nextIndex = 0;
            setCurrentIndex(nextIndex);
        }
    };

    const handlePrev = () => {
        if (store.currentList) {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = store.currentList.songs.length - 1;
            setCurrentIndex(prevIndex);
        }
    };

    const handleSongClick = (index) => {
        setCurrentIndex(index);
    };

    const handlePlayerReady = (event) => {
        setPlayer(event.target);
        event.target.playVideo();
    };

    const handlePlayPause = () => {
        if (player) {
            if (isPlaying) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const currentSong = store.currentList?.songs[currentIndex];
    const opts = {
        height: '250',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <Modal
            open={store.currentModal === "PLAY_PLAYLIST"}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box sx={{ width: '50%', mr: 2, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ bgcolor: 'white', p: 2, mb: 2, borderRadius: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={store.currentList?.ownerAvatar} alt={store.currentList?.ownerName} />
                        <Box>
                            <Typography variant="h6" fontWeight="bold">{store.currentList?.name}</Typography>
                            <Typography variant="subtitle2">{store.currentList?.ownerName}</Typography>
                        </Box>
                    </Box>

                    <List sx={{ overflowY: 'auto', flexGrow: 1, bgcolor: 'white', borderRadius: 1 }}>
                        {store.currentList?.songs.map((song, index) => (
                            <ListItem
                                key={song._id}
                                button
                                onClick={() => handleSongClick(index)}
                                sx={{
                                    bgcolor: index === currentIndex ? '#ffc107' : 'transparent',
                                    mb: 1,
                                    borderRadius: 1,
                                    border: '1px solid #ccc',
                                    mx: 1,
                                    width: 'auto'
                                }}
                            >
                                <Typography fontWeight="bold">
                                    {index + 1}. {song.title} by {song.artist} ({song.year})
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <YouTube
                            videoId={currentSong?.youTubeId}
                            opts={opts}
                            onReady={handlePlayerReady}
                            onStateChange={(e) => {
                                if (e.data === 1) setIsPlaying(true);
                                if (e.data === 2) setIsPlaying(false);
                                if (e.data === 0) handleNext(); 
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'transparent', p: 0, width: '100%' }}>
                        <Typography variant="h6" fontWeight="bold">{currentSong?.title}</Typography>
                        <Typography variant="subtitle1">{currentSong?.artist}</Typography>

                        <Box sx={{ display: 'flex', gap: 2, mt: 2, border: '1px solid black', p: 1, borderRadius: 1, bgcolor: 'white' }}>
                            <IconButton onClick={handlePrev}>
                                <SkipPreviousIcon />
                            </IconButton>
                            <IconButton onClick={handlePlayPause}>
                                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                            <IconButton onClick={handleNext}>
                                <SkipNextIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleClose}
                        sx={{ alignSelf: 'flex-end', borderRadius: 5, px: 4 }}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}