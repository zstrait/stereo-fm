import { useContext, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store';

import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Button, ListItemIcon, ListItemText, Divider } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';

const menuPaperProps = {
    elevation: 0,
    sx: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
        bgcolor: '#F4EEE0',
        border: '1px solid #E0DCE4',
        mt: -2,
        ml: -1.4,
        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: '#F4EEE0',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
            borderLeft: '1px solid #E0DCE4',
            borderTop: '1px solid #E0DCE4'
        },
    },
};

const menuItemSx = {
    '&:hover': {
        backgroundColor: '#e0dce4'
    }
};

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleNavigation = (path) => {
        history.push(path);
        handleMenuClose();
    };

    const handleLogout = () => {
        auth.logoutUser();
        handleMenuClose();
    }

    const handleHouseClick = () => {
        store.closeCurrentList();
        history.push('/');
    }

    const menuId = 'primary-search-account-menu';

    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={menuPaperProps}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={() => handleNavigation('/login/')} sx={menuItemSx}>
                <ListItemIcon><LoginIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Login</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/register/')} sx={menuItemSx}>
                <ListItemIcon><PersonAddIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Create New Account</ListItemText>
            </MenuItem>
        </Menu>
    );

    const loggedInMenu = (
        <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={menuPaperProps}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={() => handleNavigation('/account/edit/')} sx={menuItemSx}>
                <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Edit Account</ListItemText>
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleLogout} sx={{ ...menuItemSx, color: 'error.main' }}>
                <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                <ListItemText>Logout</ListItemText>
            </MenuItem>
        </Menu>
    );

    let menu = auth.loggedIn ? loggedInMenu : loggedOutMenu;

    function getAccountMenu(loggedIn) {
        if (loggedIn && auth.user && auth.user.avatar) {
            return <img src={auth.user.avatar} alt="Avatar" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />;
        }
        return <AccountCircle sx={{ fontSize: 40, color: '#f3eee1e5' }} />;
    }

    return (
        <Box sx={{ flexGrow: 1 }} >
            <AppBar position="static" style={{ borderTopRightRadius: 12, borderTopLeftRadius: 12, backgroundColor: "#4F4557" }}>
                <Toolbar>
                    <Link onClick={handleHouseClick} className="home-link" to='/' />
                    <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
                        <Link to='/playlists/' style={{ textDecoration: 'none' }}>
                            <Button variant="contained" sx={{ bgcolor: '#6D5D6E', color: '#F4EEE0', borderRadius: "12px", textTransform: 'none', '&:hover': { bgcolor: '#675668ff' } }}>Playlists</Button>
                        </Link>
                        <Link to='/songs/' style={{ textDecoration: 'none' }}>
                            <Button variant="contained" sx={{ bgcolor: '#6D5D6E', color: '#F4EEE0', borderRadius: "12px", textTransform: 'none', '&:hover': { bgcolor: '#675668ff' } }}>Song Catalog</Button>
                        </Link>
                    </Box>

                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box sx={{ height: "90px", display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            disableRipple
                            sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                        >
                            {getAccountMenu(auth.loggedIn)}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {menu}
        </Box>
    );
}