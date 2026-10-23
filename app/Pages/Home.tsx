import { useEffect, useRef, useState } from 'react';

import { Link, Stack } from '@mui/material';

import ChangeThemeButton from '../Components/ChangeThemeButton';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';

export default function Home() {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [editing, setEditing] = useState(false)
    useEffect(() => {
        function focusSearch(e: KeyboardEvent) {
            if (e.defaultPrevented || document.querySelector('[role="dialog"], [role="menu"]')) {
                return
            }
            if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
                inputRef.current?.focus()
                e.preventDefault()
            }
        }
        window.addEventListener('keydown', focusSearch)
        return () => {
            window.removeEventListener('keydown', focusSearch)
        }
    }, []);

    return (
        <Stack
            sx={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                minHeight: '100dvh',
                padding: '2rem',
                paddingBottom: 2,
            }}>
            <ChangeThemeButton
                sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                }}
            />
            <Header inputRef={inputRef} />
            <Main editing={editing} />
            <Link
                component='button'
                type='button'
                color='inherit'
                underline='hover'
                aria-pressed={editing}
                onClick={() => setEditing(!editing)}
                sx={{ flexShrink: 0, marginTop: 'auto' }}
            >
                {editing ? '结束编辑' : '编辑快捷方式'}
            </Link>
            <Footer />
        </Stack>
    );
};
