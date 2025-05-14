import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';

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

    const [searchEngine, setSearchEngine] = useState<'google' | 'baidu'>('google');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);

    function setKeyword(e: ChangeEvent<HTMLInputElement>) {
        suggest(e.target.value);
    }

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
    }

    function changeEngine() {
        setSearchEngine(searchEngine === 'google' ? 'baidu' : 'google');
        document.getElementById('searchInput')?.focus();
    }

    function handleSearch() {
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        window.location.href =
            searchEngine === 'google'
                ? 'https://www.google.com/search?q=' + encodeURIComponent(searchInput.value)
                : 'https://www.baidu.com/s?wd=' + encodeURIComponent(searchInput.value);
    }

    function suggest(kw: string) {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        kw = kw.trim();
        if (kw.length === 0) {
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
    }

    function handleChooseSuggestion(suggestion: string) {
        console.log(suggestion);
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        searchInput.value = suggestion;
        handleSearch();
    }

    return (
        <Stack
            component='header'
            direction='row'
            sx={{
                width: '75vw',
                [theme.breakpoints.up('sm')]: {
                    width: '65vw',
                },
                position: 'fixed',
                top: '4rem',
                zIndex: theme.zIndex.tooltip,
            }}
        >
            <Paper
                sx={[
                    theme => ({
                        display: 'flex',
                        width: '100%',
                        boxShadow: theme.shadows[4],
                        '&:hover': {
                            boxShadow: theme.shadows[16],
                        },
                        flexDirection: 'column',
                    }),
                    theme => theme.applyStyles('dark', {
                        backgroundColor: theme.palette.grey[800],
                    }),
                ]}
            >
                <Stack direction="row">
                    <IconButton
                        onClick={changeEngine}
                    >
                        {searchEngine === 'google' ? <SiGoogle /> : <SiBaidu />}
                    </IconButton>
                    <InputBase
                        id='searchInput'
                        sx={{ ml: 1, flex: 1 }}
                        onChange={setKeyword}
                        onKeyDown={handleKey}
                        placeholder='Search'
                        autoFocus
                    />
                    <IconButton onClick={handleSearch}>
                        <SearchIcon />
                    </IconButton>
                </Stack>
                {suggestions.length > 0 && (
                    <Stack>
                        {suggestions.map((suggestion, index) => (
                            <Paper
                                key={index}
                                square
                                onClick={() => handleChooseSuggestion(suggestion)}
                                sx={{
                                    padding: '.5rem 1rem .5rem 1rem',
                                    cursor: 'pointer',
                                    boxShadow: 'none',
                                    background: 'inherit',
                                    '&:hover': {
                                        backgroundColor: theme.palette.grey[700],
                                    },
                                }}
                            >
                                {suggestion}
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Paper>
        </Stack>
    );
}
