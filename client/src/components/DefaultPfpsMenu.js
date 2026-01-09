import { Grid, Avatar, Typography, Box } from '@mui/material';

const convertUrlToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export default function DefaultPfpsMenu({ onSelectAvatar }) {

    const handlePresetClick = async (pfpIndex) => {
        try {
            const imageUrl = require(`../images/default-pfps/pfp${pfpIndex}.png`);
            const base64 = await convertUrlToBase64(imageUrl);
            onSelectAvatar(base64);
        } catch (error) {
            console.error("Error loading preset avatar:", error);
        }
    };

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Typography variant="caption" sx={{ mb: 1, color: 'text.secondary', display: 'block', textAlign: 'center' }}>
                Or choose a preset avatar:
            </Typography>
            <Box sx={{
                maxHeight: '250px',
                overflowY: 'auto',
                width: '220px',
                p: 1,
                border: '1px solid #ccc',
                bgcolor: '#eae5d7ff',
                borderRadius: 2
            }}>
                <Grid container spacing={1}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((index) => (
                        <Grid item xs={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Avatar
                                src={require(`../images/default-pfps/pfp${index}.png`)}
                                onClick={() => handlePresetClick(index)}
                                sx={{
                                    width: 56,
                                    height: 56,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        outline: '2px solid #1976d2'
                                    }
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}