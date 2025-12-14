import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    // HomeWrapper,
    LoginScreen,
    RegisterScreen,
    EditAccountScreen,
    PlaylistsScreen,
    SongCatalogScreen,
    WelcomeScreen
} from './components'
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
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