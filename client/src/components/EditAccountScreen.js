import { useContext, useState, useEffect } from 'react';
import AuthContext from '../auth'
import ErrorModal from './ErrorModal'
import Copyright from './Copyright'
import { useHistory } from 'react-router-dom'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/HighlightOff';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function EditAccountScreen() {
    const { auth } = useContext(AuthContext);
    const history = useHistory();
    const [avatar, setAvatar] = useState("");
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        passwordVerify: ""
    });


    useEffect(() => {
        if (auth.user) {
            setFormData({
                userName: auth.user.userName,
                email: auth.user.email,
                password: "",
                passwordVerify: ""
            });
            setAvatar(auth.user.avatar || "");
        }
    }, [auth.user]);


    const handleChange = (prop) => (event) => {
        setFormData({ ...formData, [prop]: event.target.value });
    };

    const handleClear = (prop) => () => {
        setFormData({ ...formData, [prop]: "" });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            userName: formData.userName,
            password: formData.password,
            passwordVerify: formData.passwordVerify,
            avatar: avatar
        };
        auth.updateUser(formData.email, userData);

    };

    const handleCancel = () => {
        history.goBack();
    }

    const handleFileRead = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const base64 = await convertBase64(file);
            setAvatar(base64);
        }
    }

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    const getEndAdornment = (prop) => (
        formData[prop] ? (
            <IconButton onClick={handleClear(prop)} edge="end">
                <ClearIcon />
            </IconButton>
        ) : null
    );

    const isEmailError = auth.errorMessage && auth.errorMessage.toLowerCase().includes("email");
    const isPasswordShort = formData.password.length > 0 && formData.password.length < 8;
    const isPasswordMismatch = formData.passwordVerify.length > 0 && formData.password !== formData.passwordVerify;

    const isButtonDisabled =
        !formData.userName ||
        !avatar ||
        (formData.password.length > 0 && formData.password.length < 8) ||
        (formData.password.length > 0 && formData.password !== formData.passwordVerify);

    let modalJSX = "";
    if (auth.errorMessage !== null && !isEmailError) {
        modalJSX = <ErrorModal />;
    }

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Edit Account
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'start', gap: 6, transform: 'translateX(-70px)' }}>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{
                                width: 100,
                                height: 100,
                                border: '1px solid grey',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden',
                                mb: 1,
                                bgcolor: 'lightgrey'
                            }}>
                                {avatar ? (
                                    <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <AccountCircle sx={{ fontSize: 100, color: 'grey' }} />
                                )}
                            </Box>
                            <Button
                                variant="contained"
                                component="label"
                                size="small"
                            >
                                Select
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileRead}
                                />
                            </Button>
                        </Box>

                        <Box sx={{ width: '400px' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="userName"
                                        label="User Name"
                                        name="userName"
                                        autoComplete="username"
                                        value={formData.userName}
                                        onChange={handleChange('userName')}
                                        InputProps={{ endAdornment: getEndAdornment('userName') }}
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        disabled
                                    />
                                    {isEmailError && (
                                        <Typography variant="caption" color="error" sx={{ ml: 1, width: '150px' }}>
                                            An account already exists with this email.
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange('password')}
                                        InputProps={{ endAdornment: getEndAdornment('password') }}
                                        error={isPasswordShort}
                                    />
                                    {isPasswordShort && (
                                        <Typography variant="caption" color="error" sx={{ ml: 1, width: '150px' }}>
                                            Password must contain at least 8 characters.
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="passwordVerify"
                                        label="Confirm Password"
                                        type="password"
                                        id="passwordVerify"
                                        autoComplete="new-password"
                                        value={formData.passwordVerify}
                                        onChange={handleChange('passwordVerify')}
                                        InputProps={{ endAdornment: getEndAdornment('passwordVerify') }}
                                        error={isPasswordMismatch}
                                    />
                                    {isPasswordMismatch && (
                                        <Typography variant="caption" color="error" sx={{ ml: 1, width: '150px' }}>
                                            Passwords do not match.
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                <Button type="submit" fullWidth variant="contained" disabled={isButtonDisabled}>
                                    Submit Changes
                                </Button>
                                <Button fullWidth variant="outlined" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
            {modalJSX}
        </Container>
    );
}