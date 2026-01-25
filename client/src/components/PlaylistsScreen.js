import { useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import SearchMenu from './SearchMenu';
import SortMenu from './SortMenu';
import PlaylistCard from './PlaylistCard';
import DeletePlaylistModal from './DeletePlaylistModal';
import PlayPlaylistModal from './PlayPlaylistModal';
import EditPlaylistModal from './EditPlaylistModal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function PlaylistsScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        store.setSortCriteria("User Name (A-Z)");
    }, []);

    useEffect(() => {
        store.loadPlaylists();
    }, [store.searchCriteria, store.sortCriteria]);

    useEffect(() => {
        return () => {
            store.setSearchCriteria({});
        }
    }, []);

    const handleSearch = (searchTerms) => {
        const criteria = {
            playlistName: searchTerms['Playlist Name'],
            userName: searchTerms['User Name'],
            songTitle: searchTerms['Song Title'],
            songArtist: searchTerms['Song Artist'],
            songYear: searchTerms['Song Year']
        };
        store.setSearchCriteria(criteria);
    };

    const handleSort = (sortCriteria) => {
        store.setSortCriteria(sortCriteria);
    };

    const handleNewPlaylist = () => {
        store.createNewList();
    };

    const playlistInputFields = ['Playlist Name', 'User Name', 'Song Title', 'Song Artist', 'Song Year'];
    const playlistSortOptions = [
        'Listeners (High-Low)', 'Listeners (Low-High)',
        'Playlist Name (A-Z)', 'Playlist Name (Z-A)',
        'User Name (A-Z)', 'User Name (Z-A)'
    ];

    return (
        <Box sx={{ display: 'flex', height: '85vh', backgroundColor: '#F4EEE0' }}>
            <Box sx={{ width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, justifyContent: 'space-between', borderRight: '1px solid #ccc' }}>
                <SearchMenu
                    title="Playlists"
                    inputFields={playlistInputFields}
                    onSearch={handleSearch}
                />
                {auth.loggedIn && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', transform: 'translate(-252px, 22px)' }}>
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
                                    '& .playlist-text': {
                                        maxWidth: '120px',
                                        opacity: 1,
                                        paddingRight: '8px'
                                    }
                                },
                                '& .playlist-text': {
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
                            onClick={handleNewPlaylist}
                        >
                            <span className="playlist-text">New Playlist</span>
                            <AddCircleOutlineIcon />
                        </Button>
                    </Box>
                )}
            </Box>

            <Box sx={{ width: '65%', display: 'flex', flexDirection: 'column', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, transform: 'translateY(2px)' }}>
                    <SortMenu
                        sortOptions={playlistSortOptions}
                        onSort={handleSort}
                        currentSortValue={store.sortCriteria}
                    />
                    <Typography variant="h6" sx={{ color: '#393646' }}>{store.playlists ? store.playlists.length : 0} Playlists</Typography>
                </Box>

                <Box sx={{ flexGrow: 1, overflow: 'hidden', mb: 2, paddingBottom: '24px' }}>
                    <Box sx={{ height: '100%', overflowY: 'auto', px: 2, paddingTop: '6px' }}>
                        {store.playlists && store.playlists.map((playlist) => (
                            <PlaylistCard
                                key={playlist._id}
                                playlist={playlist}
                            />
                        ))}
                    </Box>
                </Box>

                <DeletePlaylistModal />
                <PlayPlaylistModal />
                <EditPlaylistModal />
            </Box>
        </Box>
    );
}