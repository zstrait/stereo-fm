import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import YouTube from 'react-youtube';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Slider from '@mui/material/Slider';

import CloseIcon from '@mui/icons-material/Close';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import PlaylistSongCard from './PlaylistSongCard';

const controlBtnStyle = {
    border: '1px solid black',
    borderRadius: '6px',
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
        maxWidth: '1000px',
        height: '700px',
        maxHeight: '90vh',
        bgcolor: '#A7C1A8',
        border: '2px solid #000',
        borderRadius: '12px',
        boxShadow: '5px 5px 0px rgba(0,0,0,0.7)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        outline: 'none'
    },
    titleBar: {
        container: {
            height: '40px',
            bgcolor: '#EEEFE0',
            borderBottom: '2px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            userSelect: 'none',
            flexShrink: 0
        },
        closeBtn: {
            ...controlBtnStyle,
            width: 24,
            height: 24,
            bgcolor: '#F87171',
            color: 'white',
            boxShadow: '1px 1px 0px black',
            transform: 'translateX(6px)',
            '&:hover': { bgcolor: '#EF4444' },
            '&:active': { transform: 'translate(7px, 1px)', boxShadow: 'none !important' }
        }
    },
    leftPanel: {
        container: {
            width: '40%',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            borderRight: '2px solid #000',
            bgcolor: '#A7C1A8',
            overflow: 'hidden'
        },
        playlistInfo: {
            bgcolor: '#EEEFE0',
            borderRadius: 2,
            border: '2px solid #000',
            p: 2,
            mb: 3,
            boxShadow: '4px 4px 0px rgba(0,0,0,0.15)',
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexShrink: 0
        },
        songList: {
            container: {
                flex: 1,
                minHeight: 0,
                bgcolor: '#EEEFE0',
                borderRadius: 2,
                border: '2px solid #000',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'inset 0px 0px 8px rgba(0,0,0,0.1)'
            },
            header: {
                px: 2,
                py: 1,
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                bgcolor: 'rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                flexShrink: 0
            },
            scrollArea: {
                flex: 1,
                overflowY: 'auto',
                p: 1,
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#A7C1A8', borderRadius: '4px', border: '1px solid black' }
            }
        }
    },
    rightPanel: {
        container: {
            flex: 1,
            bgcolor: '#EEEFE0',
            p: 4,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: 'center',
            '&::before': { content: '""', position: 'absolute', inset: 0, bgcolor: 'rgba(238, 239, 224, 0.9)' }
        },
        videoContainer: {
            position: 'relative',
            zIndex: 1,
            width: '100%',
            aspectRatio: '16/9',
            bgcolor: 'black',
            borderRadius: 2,
            border: '2px solid #000',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.15)',
            mb: 3,
            overflow: 'hidden',
            flexShrink: 0
        },
        songInfo: {
            position: 'relative',
            zIndex: 1,
            bgcolor: '#faf9f5',
            border: '2px solid black',
            borderRadius: 2,
            p: 2,
            mb: 3,
            boxShadow: '3px 3px 0px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
        },
        progressContainer: {
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: '#faf9f5',
            border: '2px solid black',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            mb: 2,
            boxShadow: '3px 3px 0px rgba(0,0,0,0.1)',
            transform: 'translateY(-12px)'
        },
        slider: {
            color: '#719185',
            height: 4,
            '& .MuiSlider-thumb': {
                width: 14,
                height: 14,
                border: '2px solid black',
                bgcolor: '#f9f2a9',
                boxShadow: '1px 1px 0px black',
                transition: 'none',
                '&:before': { boxShadow: 'none' },
                '&:hover, &.Mui-focusVisible': { boxShadow: '1px 1px 0px black' },
            },
            '& .MuiSlider-rail': {
                opacity: 1,
                bgcolor: '#e2e8f0',
                border: '1px solid rgba(0,0,0,0.1)'
            },
            '& .MuiSlider-track': { border: 'none' },
        },
        controls: {
            container: {
                position: 'relative',
                zIndex: 1,
                mt: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: 'translateY(-56px)'
            },
            navBtn: {
                ...controlBtnStyle,
                width: 48,
                height: 48,
                bgcolor: 'white',
                boxShadow: '3px 3px 0px black',
                '&:hover': { bgcolor: '#faf9f5' }
            },
            pauseBtn: {
                ...controlBtnStyle,
                width: 64,
                height: 64,
                borderRadius: 3,
                bgcolor: '#fff8afe8',
                border: '2px solid black',
                boxShadow: '4px 4px 0px black',
                '&:hover': { bgcolor: '#fbf28a' },
                '&:active': { transform: 'translate(2px, 2px)', boxShadow: 'none' }
            }
        }
    }
};

export default function PlayPlaylistModal() {
    const { store } = useContext(GlobalStoreContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [player, setPlayer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const currentSong = store.currentList?.songs[currentIndex];
        if (currentSong) {
            store.incrementListens(currentSong._id, false);
        }
    }, [currentIndex, store.currentList]);

    useEffect(() => {
        if (store.currentModal === "PLAY_PLAYLIST") {
            setCurrentIndex(0);
            setIsPlaying(true);
            setCurrentTime(0);
            setDuration(0);
        }
    }, [store.currentModal]);

    useEffect(() => {
        let interval = null;
        if (isPlaying && player) {
            interval = setInterval(() => {
                const current = player.getCurrentTime();
                const total = player.getDuration();
                setCurrentTime(current);
                if (total > 0) setDuration(total);
            }, 1000);
        } else if (!isPlaying && interval) {
            clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, player]);

    const handleClose = () => {
        store.hideModals();
        setIsPlaying(false);
        setPlayer(null);
        setCurrentTime(0);
    };

    const handleNext = () => {
        if (store.currentList) {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= store.currentList.songs.length) nextIndex = 0;
            setCurrentIndex(nextIndex);
            setIsPlaying(true);
        }
    };

    const handlePrev = () => {
        if (store.currentList) {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = store.currentList.songs.length - 1;
            setCurrentIndex(prevIndex);
            setIsPlaying(true);
        }
    };

     const handleSongClick = (index) => {
        setCurrentIndex(index);
        setIsPlaying(true);
    };

    const handlePlayerReady = (event) => {
        setPlayer(event.target);
        event.target.playVideo();
        setDuration(event.target.getDuration());
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

    const handleSeek = (event, newValue) => {
        if (player) {
            player.seekTo(newValue);
            setCurrentTime(newValue);
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getCleanVideoId = (rawInput) => {
        if (!rawInput) return null;
        if (rawInput.length === 11) return rawInput;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = rawInput.match(regExp);
        if (match && match[2].length === 11) return match[2];
        return null;
    };

    if (!store.currentList) return null;

    const currentSong = store.currentList.songs[currentIndex];
    const videoId = getCleanVideoId(currentSong?.youTubeId);

    return (
        <Modal
            open={store.currentModal === "PLAY_PLAYLIST"}
            onClose={handleClose}
        >
            <Box sx={styles.modal}>
                <Box sx={styles.titleBar.container}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: 1, color: '#334155' }}>
                            STEREO.FM // {store.currentList.name}
                        </Typography>
                    </Box>
                    <Box component="button" onClick={handleClose} sx={styles.titleBar.closeBtn}>
                        <CloseIcon sx={{ fontSize: 16, strokeWidth: 2 }} />
                    </Box>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
                    <Box sx={styles.leftPanel.container}>
                        <Box sx={styles.leftPanel.playlistInfo}>
                            <Box sx={{ width: 56, height: 56, borderRadius: 1, overflow: 'hidden', flexShrink: 0 }}>
                                <Avatar src={store.currentList.ownerAvatar} variant="square" sx={{ width: '100%', height: '100%' }} />
                            </Box>
                            <Box sx={{ overflow: 'hidden' }}>
                                <Typography variant="h6" fontWeight="bold" noWrap sx={{ lineHeight: 1.2 }}>{store.currentList.name}</Typography>
                                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>Created by {store.currentList.ownerName}</Typography>
                            </Box>
                        </Box>
                        <Box sx={styles.leftPanel.songList.container}>
                            <Box sx={styles.leftPanel.songList.header}>
                                <Typography variant="caption" fontWeight="bold" sx={{ color: '#64748B', letterSpacing: 1 }}>TRACK LIST</Typography>
                                <Typography variant="caption" fontWeight="bold" sx={{ color: '#64748B' }}>{currentIndex + 1} / {store.currentList.songs.length}</Typography>
                            </Box>
                            <Box sx={styles.leftPanel.songList.scrollArea}>
                                {store.currentList.songs.map((song, index) => (
                                    <PlaylistSongCard
                                        key={song._id}
                                        song={song}
                                        index={index}
                                        isActive={index === currentIndex}
                                        onClick={() => handleSongClick(index)}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>


                    <Box sx={styles.rightPanel.container}>
                        <Box sx={styles.rightPanel.videoContainer}>
                            {videoId ? (
                                <YouTube
                                    videoId={videoId}
                                    opts={{
                                        height: '100%',
                                        width: '100%',
                                        playerVars: { autoplay: 1, controls: 0, modestbranding: 1 }
                                    }}
                                    onReady={handlePlayerReady}
                                    onStateChange={(e) => {
                                        if (e.data === 1) setIsPlaying(true);
                                        if (e.data === 2) setIsPlaying(false);
                                        if (e.data === 0) handleNext();
                                    }}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            ) : (
                                <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#A7C1A8' }}>
                                    <Typography variant="caption" sx={{ fontSize: '16px' }} >(Playlist is empty)</Typography>
                                </Box>
                            )}
                        </Box>
                        <Box sx={styles.rightPanel.songInfo}>
                            <Box sx={{ overflow: 'hidden', mr: 2 }}>
                                <Typography variant="h5" fontWeight="900" noWrap sx={{ color: '#1E293B', letterSpacing: -0.5 }}>{currentSong?.title}</Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                                    <Typography variant="body2" fontWeight="600" sx={{ color: '#64748B' }}>{currentSong?.artist}</Typography>
                                    <Typography variant="caption" sx={{ border: '1px solid #CBD5E1', borderRadius: 1, px: 0.5, color: '#94A3B8' }}>{currentSong?.year}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={styles.rightPanel.progressContainer}>
                            <Typography variant="caption" fontFamily="monospace" fontWeight="bold">{formatTime(currentTime)}</Typography>
                            <Slider
                                size="small"
                                value={currentTime}
                                max={duration}
                                onChange={handleSeek}
                                sx={styles.rightPanel.slider}
                            />
                            <Typography variant="caption" fontFamily="monospace" fontWeight="bold">{formatTime(duration)}</Typography>
                        </Box>
                        <Box sx={styles.rightPanel.controls.container}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Box component="button" onClick={handlePrev} sx={styles.rightPanel.controls.navBtn}>
                                    <SkipPreviousIcon />
                                </Box>

                                <Box component="button" onClick={handlePlayPause} sx={styles.rightPanel.controls.pauseBtn}>
                                    {isPlaying ? <PauseIcon sx={{ fontSize: 32 }} /> : <PlayArrowIcon sx={{ fontSize: 32 }} />}
                                </Box>

                                <Box component="button" onClick={handleNext} sx={styles.rightPanel.controls.navBtn}>
                                    <SkipNextIcon />
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 0.5, opacity: 0.2 }}>
                            {[1, 2, 3].map(i => (
                                <Box key={i} sx={{ width: 2, height: 12, bgcolor: 'black', transform: 'rotate(-45deg)' }} />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}