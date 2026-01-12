import './App.css';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store';
import {
    AppBanner,
    LoginScreen,
    RegisterScreen,
    EditAccountScreen,
    PlaylistsScreen,
    SongCatalogScreen,
    WelcomeScreen
} from './components';
import { Box } from '@mui/material';

const AppLayout = () => {
    const location = useLocation();
    const containedPaths = ['/songs/', '/playlists/'];
    const isContainedLayout = containedPaths.includes(location.pathname);

    const routes = (
        <Switch>
            <Route path="/" exact component={WelcomeScreen} />
            <Route path="/login/" exact component={LoginScreen} />
            <Route path="/register/" exact component={RegisterScreen} />
            <Route path="/songs/" exact component={SongCatalogScreen} />
            <Route path="/playlists/" exact component={PlaylistsScreen} />
            <Route path="/account/edit/" exact component={EditAccountScreen} />
        </Switch>
    );

    if (isContainedLayout) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden'
            }}>
                <AppBanner />
                {routes}
            </Box>
        );
    } else {
        return (
            <>
                <AppBanner />
                {routes}
            </>
        );
    }
}

const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <AppLayout />
                </GlobalStoreContextProvider>
            </AuthContextProvider>
            <a 
                href="https://github.com/zstrait/stereo-fm" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="github-logo"
            >
            </a>
        </BrowserRouter>
    );
}

export default App;