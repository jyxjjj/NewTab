import { createTheme } from '@mui/material/styles';
import { colors } from '@mui/material';

const palette = {
    primary: {
        main: colors.blue[500]
    },
    secondary: {
        main: colors.blue[500]
    },
    success: {
        main: colors.green[500]
    },
    info: {
        main: colors.cyan[500]
    },
    warning: {
        main: colors.orange[500]
    },
    error: {
        main: colors.red[500]
    },
};

const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'class',
        cssVarPrefix: 'theme',
    },
    colorSchemes: {
        light: {
            palette: {
                mode: 'light',
                background: {
                    default: colors.grey[300],
                },
                ...palette
            },
        },
        dark: {
            palette: {
                mode: 'dark',
                ...palette,
            },
        }
    },
    typography: {
        fontFamily: [
            'JetBrains Mono',
            'Noto Sans SC',
            'Apple Color Emoji',
            'Segoe UI Emoji',
            'Segoe UI Symbol',
            'Noto Color Emoji',
            'system-ui',
            '-apple-system',
            'emoji',
            'monospace',
        ].join(','),
        fontSize: 16,
        h1: {
            fontSize: 'calc(1.375rem + 1.5vw)',
            fontWeight: 500,
            lineHeight: 1.2,
            root: {
                margin: '1rem 0',
            },
            '@media (min-width:1200px)': {
                fontSize: '2.5rem'
            },
        },
        h2: {
            fontSize: 'calc(1.325rem + 0.9vw)',
            fontWeight: 500,
            lineHeight: 1.2,
            margin: '1rem 0',
            '@media (min-width:1200px)': {
                fontSize: '2rem'
            },
        },
        h3: {
            fontSize: 'calc(1.3rem + 0.6vw)',
            fontWeight: 500,
            lineHeight: 1.2,
            margin: '1rem 0',
            '@media (min-width:1200px)': {
                fontSize: '1.75rem'
            },
        },
        h4: {
            fontSize: 'calc(1.275rem + 0.3vw)',
            fontWeight: 500,
            lineHeight: 1.2,
            margin: '1rem 0',
            '@media (min-width:1200px)': {
                fontSize: '1.5rem'
            },
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.2,
            margin: '1rem 0',
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.2,
            margin: '1rem 0',
        },
        button: undefined,
        caption: undefined,
        overline: undefined,
        subtitle1: undefined,
        subtitle2: undefined,
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.5
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.5
        },
    },
});

console.log(theme);

export default theme;
