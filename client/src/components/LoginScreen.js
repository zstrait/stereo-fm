import { useContext, useState } from 'react';
import AuthContext from '../auth';
import ErrorModal from './ErrorModal';
import Copyright from './Copyright';
import { Avatar, Box, Button, Grid, Link, TextField, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LoginScreen() {
    const { auth } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        auth.loginUser(email, password);
    };

    let modalJSX = "";
    if (auth.errorMessage !== null) {
        modalJSX = <ErrorModal />;
    }

    const isButtonDisabled = !email || !password;

    const textFieldStyle = {
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': { borderColor: '#4F4557' },
        },
        '& label.Mui-focused': { color: '#4F4557' },
    };

    return (
        <Container component="main" maxWidth="xs" >
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: '#393646' 
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: '#6D5D6E' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{fontWeight:'450'}}>
                    Sign in
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={textFieldStyle} 
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={textFieldStyle} 
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ 
                            mt: 3, 
                            mb: 2,
                            bgcolor: '#4F4557', 
                            '&:hover': {
                                bgcolor: '#6D5D6E'
                            }
                        }}
                        disabled={isButtonDisabled}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="flex-end"> 
                        <Grid item>
                            <Link 
                                href="/register/" 
                                variant="body2"
                                sx={{
                                    color: '#6D5D6E',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                    <Copyright sx={{ mt: 5 }} />
                </Box>
            </Box>
            {modalJSX}
        </Container>
    );
}