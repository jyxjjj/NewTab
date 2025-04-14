import React from 'react';

import { createRoot } from 'react-dom/client';

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import theme from './theme';

import './global.css';

import Home from './Pages/Home';

createRoot(document.querySelector('root')!)
    .render(
        <React.StrictMode>
            <ThemeProvider
                theme={theme}
                defaultMode='system'
                modeStorageKey='theme'
                colorSchemeStorageKey='colorScheme'
                noSsr
            >
                <CssBaseline enableColorScheme />
                <Home />
            </ThemeProvider>
        </React.StrictMode>
    );
