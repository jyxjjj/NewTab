import { useColorScheme, IconButton, IconButtonProps } from '@mui/material';

import {
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Contrast as ContrastIcon
} from '@mui/icons-material';

export default function ChangeThemeButton(
    {
        ...props
    }: {
    } & IconButtonProps
) {

    const { mode, setMode } = useColorScheme();

    const changeTheme = () => {
        switch (mode) {
            case 'dark':
                setMode('light');
                break;
            case 'light':
                setMode('system');
                break;
            case 'system':
                setMode('dark');
                break;
        }
    };

    return (
        <IconButton
            size='large'
            {...props}
            onClick={changeTheme}
        >
            {mode === 'light' && <LightModeIcon />}
            {mode === 'dark' && <DarkModeIcon />}
            {mode === 'system' && <ContrastIcon />}
        </IconButton>
    );
}
