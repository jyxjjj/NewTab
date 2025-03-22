import React from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import theme from './theme';

import './global.css';

import Home from './Pages/Home';

export default function App() {

    const userPreference = window.matchMedia('(prefers-color-scheme: dark)');
    const mode = userPreference.matches ? 'dark' : 'light';

    return (
        <React.StrictMode>
            <ThemeProvider
                theme={theme}
                defaultMode={mode}
                modeStorageKey='theme'
                colorSchemeStorageKey='colorScheme'
                noSsr
            >
                <CssBaseline enableColorScheme />
                <Home />
            </ThemeProvider>
        </React.StrictMode>
    );
}
