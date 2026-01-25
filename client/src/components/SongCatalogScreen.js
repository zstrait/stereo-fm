import { useContext, useEffect, useState } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import SearchMenu from './SearchMenu';
import SortMenu from './SortMenu';
import SongCard from './SongCard';
import YouTubePlayer from './YouTubePlayer';
import AddSongModal from './AddSongModal';
import RemoveSongModal from './RemoveSongModal';
import EditSongModal from './EditSongModal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function SongCatalogScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [selectedSongId, setSelectedSongId] = useState(null);

    useEffect(() => {
        store.setSortCriteria("Title (A-Z)");
    }, []);

    useEffect(() => {
        store.loadSongs();
        store.loadPlaylists();
    }, [store.searchCriteria, store.sortCriteria]);

    useEffect(() => {
        return () => {
            store.setSearchCriteria({});
        }
    }, []);

    const handleSearch = (searchTerms) => {
        const criteria = {
            title: searchTerms.Title,
            artist: searchTerms.Artist,
            year: searchTerms.Year
        };
        store.setSearchCriteria(criteria);
    };

    const handleNewSong = () => {
        store.showAddSongModal();
    }

    const handleSort = (sortCriteria) => {
        console.log(sortCriteria);
        store.setSortCriteria(sortCriteria);
    };

    const handleSelectSong = (songId) => {
        if (songId !== selectedSongId) {
            setSelectedSongId(songId);
            store.incrementListens(songId);
        }
    };

    const selectedSong = store.songCatalog?.find(s => s._id === selectedSongId);

    const songSortOptions = [
        "Title (A-Z)",
        "Title (Z-A)",
        "Artist (A-Z)",
        "Artist (Z-A)",
        "Year (High-Low)",
        "Year (Low-High)",
        "Listens (High-Low)",
        "Listens (Low-High)",
        "Playlists (High-Low)",
        "Playlists (Low-High)"
    ];

    return (
        <Box sx={{ display: 'flex', height: '85vh', backgroundColor: '#F4EEE0' }}>
            <Box sx={{ width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, justifyContent: 'space-between', borderRight: '1px solid #ccc' }}>
                <SearchMenu
                    title="Songs Catalog"
                    inputFields={['Title', 'Artist', 'Year']}
                    onSearch={handleSearch}
                />

                {auth.loggedIn && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', transform: 'translate(-248px, 42px)' }}>
                        <Button
                            variant="text"
                            sx={{
                                bgcolor: 'transparent',
                                color: '#96818ce1',
                                transform: 'translate(80px,-64px)',
                                borderRadius: 5,
                                px: 1,
                                minWidth: 'auto',
                                position: 'relative',
                                transition: 'color 0.3s ease',
                                '& .MuiSvgIcon-root': {
                                    fontSize: '2.5rem'
                                },
                                '&:hover': {
                                    bgcolor: 'transparent',
                                    color: '#5b4575ea',
                                    '& .song-text': {
                                        maxWidth: '120px',
                                        opacity: 1,
                                        paddingRight: '8px'
                                    }
                                },
                                '& .song-text': {
                                    position: 'absolute',
                                    left: '100%',
                                    maxWidth: 0,
                                    opacity: 0,
                                    paddingRight: 0,
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.3s ease',
                                    textDecoration: 'underline',
                                    textUnderlineOffset: '3px',
                                    textDecorationThickness: '1px',
                                    fontSize: '1rem'
                                }
                            }}
                            onClick={handleNewSong}
                        >
                            <span className="song-text">New Song</span>
                            <AddCircleOutlineIcon />
                        </Button>
                    </Box>
                )}

                <Box sx={{
                    width: '100%',
                    mb: 2,
                    transform: auth.loggedIn ? 'translateY(-32px)' : 'translateY(-32px)'
                }}>
                    <YouTubePlayer videoId={selectedSong?.youTubeId} />
                </Box>
            </Box>

            <Box sx={{ width: '65%', display: 'flex', flexDirection: 'column', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, transform: 'translateY(2px)' }}>
                    <SortMenu
                        sortOptions={songSortOptions}
                        onSort={handleSort}
                        currentSortValue={store.sortCriteria}
                    />
                    <Typography variant="h6" sx={{ color: '#393646' }}>{store.songCount} Songs</Typography>
                </Box>

                <Box sx={{ flexGrow: 1, overflow: 'hidden', mb: 2, paddingBottom: '24px' }}>
                    <Box sx={{ height: '100%', overflowY: 'auto', px: 2, paddingTop: '6px' }}>
                        {store.songCatalog && store.songCatalog.map((song) => (
                            <SongCard
                                key={song._id}
                                song={song}
                                selected={song._id === selectedSongId}
                                index={0}
                                onSelect={() => handleSelectSong(song._id)}
                            />
                        ))}
                    </Box>
                </Box>

                <AddSongModal />
                <RemoveSongModal />
                <EditSongModal />
            </Box>
        </Box>
    );
}