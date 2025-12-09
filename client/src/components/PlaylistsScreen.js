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
        <Box sx={{ display: 'flex', height: '85vh', backgroundColor: '#f5f5f5' }}>
            <Box sx={{ width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, borderRight: '1px solid #ccc' }}>
                <SearchMenu
                    title="Playlists"
                    inputFields={playlistInputFields}
                    onSearch={handleSearch}
                />
            </Box>

            <Box sx={{ width: '65%', display: 'flex', flexDirection: 'column', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <SortMenu
                        sortOptions={playlistSortOptions}
                        onSort={handleSort}
                        currentSortValue={store.sortCriteria}
                    />
                    <Typography variant="h6">{store.playlists ? store.playlists.length : 0} Playlists</Typography>
                </Box>

                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                    {store.playlists && store.playlists.map((playlist) => (
                        <PlaylistCard
                            key={playlist._id}
                            playlist={playlist}
                        />
                    ))}
                </Box>

                {auth.loggedIn && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" sx={{ borderRadius: 5, px: 3, gap: 1 }} onClick={handleNewPlaylist}>
                            <AddCircleOutlineIcon />
                            New Playlist
                        </Button>
                    </Box>
                )}
                <DeletePlaylistModal />
                <PlayPlaylistModal />
                <EditPlaylistModal />
            </Box>
        </Box>
    );
}