import { Link } from '@mui/material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';

export default function Footer() {
    return (
        <Stack
            component='footer'
            direction='column'
            alignItems='center'
            padding={2}
            sx={{
                position: 'relative',
                bottom: 0,
            }}
        >
            <Stack
                direction='row'
                spacing={1}
            >
                <Link href="https://www.desmg.com/" color="inherit" underline="hover">
                    DESMG
                </Link>
                <Typography>|</Typography>
                <Link href="https://www.desmg.com/#/policies/privacy" rel="privacy-policy" color="inherit" underline="hover">
                    Privacy
                </Link>
                <Typography>|</Typography>
                <Link href="https://www.desmg.com/#/policies/terms" rel="terms-of-service" color="inherit" underline="hover">
                    Terms
                </Link>
            </Stack>
        </Stack>
    );
}
