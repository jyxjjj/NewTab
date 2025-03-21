import { Typography } from '@mui/material';

export default function ItemTitle(
    {
        text,
    }: {
        text: string
    }
) {
    return (
        <Typography
            variant='body2'
            sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '75%',
                marginTop: 1,
            }}>
            {text}
        </Typography>
    );
}
