import { ReactNode } from 'react';

import { useTheme, Paper, PaperProps } from '@mui/material';

export default function ItemIcon(
    {
        children,
        ...props
    }: {
        children: ReactNode;
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
                backgroundColor: theme.palette.grey[800],
                borderRadius: theme.shape.borderRadius * 16,
            }}
        >
            {children}
        </Paper>
    );
}
