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
    const [suggestions, setSuggestions] = useState<Array<string>>(['test1', 'test2']);
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

    function setKeyword(e: ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value);
        suggest(e.target.value);
    };

    function handleKey(e: KeyboardEvent<HTMLInputElement>) {
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

    function changeEngine() {
        setSearchEngine(searchEngine === 'google' ? 'baidu' : 'google');
    };

    function handleSearch() {
        window.location.href =
            searchEngine === 'google'
                ? 'https://www.google.com/search?q=' + encodeURIComponent(query)
                : 'https://www.baidu.com/s?wd=' + encodeURIComponent(query);
    };

    function suggest(kw: string) {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        kw = kw.trim();
        if (kw.length == 0) {
            return;
        }
        if (kw.length > 32) {
            kw = kw.slice(0, 32);
        }
        kw = encodeURIComponent(kw);
        abortControllerRef.current = new AbortController;
        const signal = { signal: abortControllerRef.current.signal };
        try {
            if (searchEngine === 'google') {
                fetch(`https://www.google.com/complete/search?hl=en&output=toolbar&q=${kw}`, signal)
                    .then(res => res.text())
                    .then(data => {
                        setSuggestions(
                            Array.from(
                                (new DOMParser)
                                    .parseFromString(data, 'application/xml')
                                    .querySelectorAll('suggestion')
                            ).map(
                                suggestion => suggestion.getAttribute('data')
                            ).filter(
                                (suggestion: string | null) => suggestion !== null
                            )
                        );
                    }).catch(() => { });
            }
            if (searchEngine === 'baidu') {
                fetch(`https://www.baidu.com/sugrec?json=1&prod=pc&wd=${kw}`, signal)
                    .then(res => res.json())
                    .then(data => {
                        setSuggestions(
                            (
                                data.g || []
                            ).map(
                                (suggestion: { q: string }) => suggestion.q
                            ).filter(
                                (suggestion: string | null) => suggestion !== null
                            )
                        );
                    }).catch(() => { });
            }
        } catch {
            //
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
