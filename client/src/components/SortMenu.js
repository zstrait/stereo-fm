import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SortIcon from '@mui/icons-material/Sort';

export default function SortMenu({ sortOptions, onSort, currentSortValue }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSort = (option) => {
        onSort(option);
        handleClose();
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Box onClick={handleClick} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                    Sort: <span style={{ color: '#1976d2' }}>{currentSortValue}</span>
                </Typography>
                <SortIcon />
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {sortOptions.map((option) => (
                    <MenuItem key={option} onClick={() => handleSort(option)}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}