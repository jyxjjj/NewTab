import { ReactNode } from 'react';

import { useTheme, Paper, PaperProps } from '@mui/material';

export default function ItemIcon(
    {
        icon,
        link,
        ...props
    }: {
        icon: ReactNode;
        link: string;
    } & PaperProps
) {
    const theme = useTheme();

    return (
        <Paper
            {...props}
            sx={{
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: theme.shape.borderRadius * 16,
                '@media(prefers-color-scheme: dark)': {
                    backgroundColor: theme.palette.grey[800],
                },
            }}
        >
            {
                icon ?? <img
                    src={`${link}/favicon.ico`}
                    referrerPolicy="no-referrer"
                    style={{
                        width: 24,
                        height: 24,
                        filter: 'grayscale(100%)',
                    }}
                />
            }
        </Paper>
    );
}
