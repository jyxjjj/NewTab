import { Stack } from '@mui/material';

import ChangeThemeButton from '../Components/ChangeThemeButton';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';

export default function Home() {
    return (
        <Stack
            sx={{
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100%',
            }}>
            <ChangeThemeButton
                sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    p: 2,
                }}
            />
            <Header />
            <Main />
            <Footer />
        </Stack>
    );
};
