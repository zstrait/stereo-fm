import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {`© ${new Date().getFullYear()} StereoFM | `}
            <Link 
                color="inherit" 
                href="https://github.com/zstrait/stereo-fm"
                target="_blank" 
                rel="noopener noreferrer"
            >
                GitHub
            </Link>
        </Typography>
    );
}