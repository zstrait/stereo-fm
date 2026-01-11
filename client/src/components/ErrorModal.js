import { useContext } from 'react';
import { GlobalStoreContext } from '../store'; 
import AuthContext from '../auth';
import { Box, Modal, Typography, Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: '#F4EEE0',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    p: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
};

export default function ErrorModal() {
    const { store } = useContext(GlobalStoreContext); 
    const { auth } = useContext(AuthContext);

    const handleClose = () => {
        store.hideModals(); 
    };

    return (
        <Modal
            open={auth.errorMessage !== null}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box sx={{
                    bgcolor: '#4F4557',
                    color: 'white',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <WarningAmberIcon />
                    <Typography variant="h6" component="h2">
                        Error
                    </Typography>
                </Box>
                <Box sx={{
                    p: 3,
                    background: 'linear-gradient(180deg, #F4EEE0 0%, #e6e0d4 100%)'
                }}>
                    <Typography sx={{ color: '#393646', fontSize: '1.1rem' }}>
                        {auth.errorMessage}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{
                                color: '#4F4557',
                                borderColor: '#4F4557',
                                '&:hover': {
                                    backgroundColor: '#4f455722',
                                    borderColor: '#3A3341', 
                                    color: '#3A3341' 
                                }
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}