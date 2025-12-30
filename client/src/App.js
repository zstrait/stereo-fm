import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    LoginScreen,
    RegisterScreen,
    EditAccountScreen,
    PlaylistsScreen,
    SongCatalogScreen,
    WelcomeScreen
} from './components'

const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>              
                    <AppBanner />
                    <Switch>
                        <Route path="/" exact component={WelcomeScreen} />
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/songs/" exact component={SongCatalogScreen} />
                        <Route path="/playlists/" exact component={PlaylistsScreen} />
                        <Route path="/account/edit/" exact component={EditAccountScreen} />
                    </Switch>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App