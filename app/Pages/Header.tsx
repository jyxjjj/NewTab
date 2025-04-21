import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

import {
    IconButton,
    InputBase,
    Paper,
    Stack,
    useTheme
} from '@mui/material';

import {
    Search as SearchIcon
} from '@mui/icons-material';

import {
    SiBaidu,
    SiGoogle
} from '@icons-pack/react-simple-icons';

export default function Header() {

    const theme = useTheme();

    const [searchEngine, setSearchEngine] = useState('google');
    const [query, setQuery] = useState('');
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
        const foucsInterval = setInterval(() => {
            if (document.activeElement !== searchInput) {
                searchInput?.focus();
            }
        }, 1000);
        return () => clearInterval(foucsInterval);
    }, []);

    const setKeyword = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        suggest(e.target.value);
    };

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'Enter':
                handleSearch();
                e.preventDefault();
                break;
            case 'Tab':
                changeEngine();
                e.preventDefault();
                break;
            default:
                break;
        }
    };

    const changeEngine = function () {
        setSearchEngine(searchEngine === 'google' ? 'baidu' : 'google');
    };

    const handleSearch = function () {
        window.location.href =
            searchEngine === 'google'
                ? 'https://www.google.com/search?q=' + encodeURIComponent(query)
                : 'https://www.baidu.com/s?wd=' + encodeURIComponent(query);
    };

    const suggest = function (kw: string) {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        kw = encodeURIComponent(kw);
        if (searchEngine === 'google') {
            fetch(`https://www.google.com/complete/search?hl=en&output=toolbar&q=${kw}`, { signal: abortControllerRef.current.signal })
                .then((response) => response.text())
                .then((data) => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data, 'application/xml');
                    const suggestions = xmlDoc.querySelectorAll('suggestion');
                    const dataList = Array.from(suggestions).map(el => el.getAttribute('data'));
                    console.log(dataList);
                })
                .catch(() => void (0));
        }
        if (searchEngine === 'baidu') {
            fetch(`https://www.baidu.com/sugrec?json=1&prod=pc&wd=${kw}`, { signal: abortControllerRef.current.signal })
                .then((response) => response.json())
                .then((data) => {
                    const suggestions: string[] = [];
                    for (const suggestion of data.g) {
                        suggestions.push(suggestion.q);
                    }
                    console.log(suggestions);
                })
                .catch(() => void (0));
        }
    };

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
