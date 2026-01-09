import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/HighlightOff';

export default function SearchMenu({ title = "Search", inputFields = ["name", "email"], onSearch = (terms) => console.log(terms) }) {
    const [searchTerms, setSearchTerms] = useState(
        inputFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
    );

    const handleChange = (field) => (event) => {
        setSearchTerms({ ...searchTerms, [field]: event.target.value });
    };

    const handleClearField = (field) => () => {
        setSearchTerms({ ...searchTerms, [field]: "" });
    };

    const handleClearAll = () => {
        const cleared = inputFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {});
        setSearchTerms(cleared);
    };

    const handleSearch = () => {
        onSearch(searchTerms);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box sx={{
            padding: 2,
            width: '100%',
            maxWidth: '300px'
        }}>
            <Typography variant="h4" sx={{ color: '#393646', fontWeight: 'bold', mb: 2 }}>
                {title}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {inputFields.map((field) => (
                    <TextField
                        key={field}
                        label={`by ${field}`}
                        variant="filled"
                        fullWidth
                        value={searchTerms[field]}
                        onChange={handleChange(field)}
                        onKeyDown={handleKeyDown}
                        InputLabelProps={{
                            sx: {
                                transform: 'translate(12px, 18px) scale(1.05)',
                                '&.MuiInputLabel-shrink': {
                                    transform: 'translate(12px, 7px) scale(0.75)',
                                },
                                '&.Mui-focused': {
                                    color: 'rgba(0, 0, 0, 0.6)',
                                }
                            }
                        }}
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                backgroundColor: '#eee3d690',
                                borderRadius: 1,
                                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.08), inset 0 0.5px 1px rgba(0, 0, 0, 0.05)',
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                                '&:hover': {
                                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 0.5px 1.5px rgba(0, 0, 0, 0.06)',
                                },
                                '&.Mui-focused': {
                                    boxShadow: 'inset 0 1.5px 4px rgba(0, 0, 0, 0.12), inset 0 0.5px 2px rgba(0, 0, 0, 0.08)',
                                }
                            },
                            endAdornment: searchTerms[field] ? (
                                <IconButton size="small" onClick={handleClearField(field)}>
                                    <ClearIcon />
                                </IconButton>
                            ) : null
                        }}
                    />
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    sx={{ bgcolor: '#6D5D6E', color: '#F4EEE0', textTransform: 'none', borderRadius: 5, px: 3,  '&:hover': { bgcolor: '#5a4f5dfa' } }}
                >
                    Search
                </Button>
                <Button
                    variant="contained"
                    onClick={handleClearAll}
                    sx={{ bgcolor: '#6D5D6E', color: '#F4EEE0', textTransform: 'none', borderRadius: 5, px: 3, '&:hover': { bgcolor: '#5a4f5dfa' } }}
                >
                    Clear
                </Button>
            </Box>
        </Box>
    );
}