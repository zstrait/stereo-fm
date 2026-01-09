import { useContext, useState } from 'react';
import AuthContext from '../auth'
import ErrorModal from './ErrorModal'
import Copyright from './Copyright'
import DefaultPfpsMenu from './DefaultPfpsMenu';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/HighlightOff';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);
    const [avatar, setAvatar] = useState("");

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        passwordVerify: ""
    });

    const handleChange = (prop) => (event) => {
        setFormData({ ...formData, [prop]: event.target.value });
    };

    const handleClear = (prop) => () => {
        setFormData({ ...formData, [prop]: "" });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        auth.registerUser(
            formData.userName,
            formData.email,
            formData.password,
            formData.passwordVerify,
            avatar
        );
    };

    const loadImage = (file) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            const url = URL.createObjectURL(file);
            image.src = url;
            image.onload = () => {
                resolve({ image, url });
            };
            image.onerror = (error) => {
                URL.revokeObjectURL(url);
                reject(error);
            };
        });
    };

    const getImageDimensions = async (file) => {
        const { image, url } = await loadImage(file);
        const dimensions = { width: image.width, height: image.height };
        URL.revokeObjectURL(url);
        return dimensions;
    };

    const resizeImage = async (file) => {
        const targetSize = 250;
        const { image, url } = await loadImage(file);

        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const context = canvas.getContext('2d');

        const { width, height } = image;
        let sx = 0, sy = 0, sWidth = width, sHeight = height;

        if (width > height) {
            sWidth = height;
            sx = (width - height) / 2;
        } else if (height > width) {
            sHeight = width;
            sy = (height - width) / 2;
        }

        context.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, targetSize, targetSize);

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                URL.revokeObjectURL(url);
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Canvas to Blob conversion failed'));
                }
            }, 'image/png');
        });
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    const handleFileRead = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const { width, height } = await getImageDimensions(file);
            let imageToConvert = file;

            if (width !== 250 || height !== 250) {
                console.log("Resizing image...");
                imageToConvert = await resizeImage(file);
            } else {
                console.log("Image is already 250x250, skipping resize.");
            }

            const base64 = await convertBase64(imageToConvert);
            setAvatar(base64);
        } catch (error) {
            console.error("Image processing failed:", error);
        }
    };

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
        !formData.email ||
        !formData.password ||
        !formData.passwordVerify ||
        !avatar ||
        formData.password.length < 8 ||
        formData.password !== formData.passwordVerify;

    let modalJSX = "";
    if (auth.errorMessage !== null && !isEmailError) {
        modalJSX = <ErrorModal />;
    }

    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: '#6D5D6E' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create Account
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'start', gap: 6, transform: 'translateX(-70px)' }}>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                            transform: 'translate(-20%, -35%)',
                        }}>
                            <Box sx={{
                                width: 100, height: 100, border: '1px solid grey', borderRadius: '50%',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                overflow: 'hidden', mb: 1, bgcolor: '#dcdbdaff',
                                transform: 'translate(-48%, 10%)',
                            }}>
                                {avatar ? (
                                    <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <AccountCircle sx={{ fontSize: 100, color: 'grey' }} />
                                )}
                            </Box>
                            <Button sx={{ transform: 'translate(-65%, 40%)', }} variant="contained" component="label" size="small">
                                Upload
                                <input type="file" hidden accept="image/*" onChange={handleFileRead} />
                            </Button>

                            <Box sx={{
                                position: 'absolute',
                                top: '101%',
                                left: '50%',
                                transform: 'translateX(-70%)',
                                mt: 1,
                                zIndex: 10
                            }}>
                                <DefaultPfpsMenu onSelectAvatar={setAvatar} />
                            </Box>
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
                                        onChange={handleChange('email')}
                                        InputProps={{ endAdornment: getEndAdornment('email') }}
                                        error={isEmailError}
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
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isButtonDisabled}
                            >
                                Create Account
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/login/" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
            {modalJSX}
        </Container>
    );
}