import { useContext, useEffect, useState } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import SearchMenu from './SearchMenu';
import SortMenu from './SortMenu';
import SongCard from './SongCard';
import YouTubePlayer from './YouTubePlayer';
import AddSongModal from './AddSongModal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function SongCatalogScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [selectedSongId, setSelectedSongId] = useState(null);

    useEffect(() => {
        store.loadSongs();
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
        <Box sx={{ display: 'flex', height: '85vh', backgroundColor: '#f5f5f5' }}>

            {/* LEFT CONTAINER */}
            <Box sx={{
                width: '35%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                borderRight: '1px solid #ccc'
            }}>
                <SearchMenu
                    title="Songs Catalog"
                    inputFields={['Title', 'Artist', 'Year']}
                    onSearch={handleSearch}
                />

                <Box sx={{ mt: 4, width: '100%' }}>
                    <YouTubePlayer videoId={selectedSong?.youTubeId} />
                </Box>
            </Box>

            {/* RIGHT CONTAINER */}
            <Box sx={{
                width: '65%',
                display: 'flex',
                flexDirection: 'column',
                p: 2
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <SortMenu
                        sortOptions={songSortOptions}
                        onSort={handleSort}
                        currentSortValue={store.sortCriteria}
                    />
                    <Typography variant="h6">{store.songCount} Songs</Typography>
                </Box>

                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
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

                {auth.loggedIn && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" sx={{ borderRadius: 5, px: 3, gap: 1 }} onClick={handleNewSong}>
                            <AddCircleOutlineIcon />
                            New Song
                        </Button>
                    </Box>
                )}
                <AddSongModal />
            </Box>
        </Box>
    );
}