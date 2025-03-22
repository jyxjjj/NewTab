import { Stack } from '@mui/material';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

export default function Home() {
    return (
        <Stack
            sx={{
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100%',
            }}>
            <Header />
            <Main />
            <Footer />
        </Stack>
    );
};
