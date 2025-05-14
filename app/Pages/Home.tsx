import { useCallback, useDeferredValue, useEffect, useRef, useState } from 'react';

import { Stack } from '@mui/material';

import SearchButton from '../Components/SearchButton';
import ChangeThemeButton from '../Components/ChangeThemeButton';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';

export default function Home() {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [show, setShow] = useState(false);
    const deferredShow = useDeferredValue(show);


    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setShow(false);
        }
    }, []);

    const handleSpotlight = useCallback((e: KeyboardEvent) => {
        if ((e.key === 'f' && (e.ctrlKey || e.metaKey)) || e.key === '/') {
            setShow(true);
            document.getElementById('searchInput')?.focus();
            e.preventDefault();
        }
        if (e.key === 'Escape') {
            setShow(false);
            e.preventDefault();
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleSpotlight);
        return () => {
            window.removeEventListener('keydown', handleSpotlight);
        };
    }, [handleSpotlight]);

    return (
        <Stack
            onClick={handleClick}
            sx={{
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100%',
                padding: '2rem',
            }}>
            <SearchButton
                setShow={setShow}
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                }}
            />
            <ChangeThemeButton
                sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                }}
            />
            {deferredShow && <Header inputRef={inputRef} />}
            <Main />
            <Footer />
        </Stack>
    );
};
