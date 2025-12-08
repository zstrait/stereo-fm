import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/HighlightOff';

export default function SearchMenu({ title, inputFields, onSearch }) {
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
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
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
                        InputProps={{
                            disableUnderline: true,
                            sx: { backgroundColor: 'white', borderRadius: 1 },
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
                    sx={{ textTransform: 'none', borderRadius: 5, px: 3 }}
                >
                    Search
                </Button>
                <Button
                    variant="contained"
                    onClick={handleClearAll}
                    sx={{ textTransform: 'none', borderRadius: 5, px: 3 }}
                >
                    Clear
                </Button>
            </Box>
        </Box>
    );
}