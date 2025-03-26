import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';

import { useTheme, Stack, IconButton, Paper, InputBase } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

import { SiGoogle } from '@icons-pack/react-simple-icons';
import { SiBaidu } from '@icons-pack/react-simple-icons';

export default function Header() {

    const theme = useTheme();

    const [searchEngine, setSearchEngine] = useState('google');
    const [query, setQuery] = useState('');

    const changeEngine = () => setSearchEngine(searchEngine === 'google' ? 'baidu' : 'google');

    const setKeyword = (e: ChangeEvent<HTMLInputElement>) => {
        suggest(e.target.value);
    };

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
            e.preventDefault();
        }
        if (e.key === 'Tab') {
            changeEngine();
            e.preventDefault();
        }
    };

    const handleSearch = () =>
        window.location.href =
        searchEngine === 'google'
            ? 'https://www.google.com/search?q=' + encodeURIComponent(query)
            : 'https://www.baidu.com/s?wd=' + encodeURIComponent(query);

    const suggest = (kw: string) => {
        setQuery(kw);
        // if (searchEngine === 'google') {
        //     fetch(`https://suggestqueries.google.com/complete/search?q=${kw}&hl=en&output=toolbar`)
        //         .then((response) => response.json())
        //         .then((data) => {
        //             console.log(data);
        //         })
        //         .catch((error) => {
        //             console.error(error);
        //         });
        // }
    };

    useEffect(() => {
        const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
        const foucsInterval = setInterval(() => {
            if (document.activeElement !== searchInput) {
                searchInput?.focus();
            }
        }, 1000);
        return () => clearInterval(foucsInterval);
    }, []);

    return (
        <Stack
            component='header'
            direction='row'
            alignItems='center'
            marginTop={8}
            sx={{
                width: '75vw',
                [theme.breakpoints.up('sm')]: {
                    width: '65vw',
                },
            }}
        >
            <Paper
                sx={[
                    theme => ({
                        display: 'flex',
                        width: '100%',
                        boxShadow: theme.shadows[4],
                        borderRadius: theme.shape.borderRadius * 4,
                        '&:hover': {
                            boxShadow: theme.shadows[16],
                        },
                    }),
                    theme => theme.applyStyles('dark', {
                        backgroundColor: theme.palette.grey[800],
                    }),
                ]}
            >
                <IconButton
                    onClick={changeEngine}
                >
                    {searchEngine === 'google' ? <SiGoogle /> : <SiBaidu />}
                </IconButton>
                <InputBase
                    id='searchInput'
                    sx={{ ml: 1, flex: 1 }}
                    value={query}
                    onChange={setKeyword}
                    onKeyDown={handleKey}
                    placeholder='Search'
                    autoFocus
                />
                <IconButton onClick={handleSearch}>
                    <SearchIcon />
                </IconButton>
            </Paper>
        </Stack>
    );
}
