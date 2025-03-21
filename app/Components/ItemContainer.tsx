import { ReactNode } from 'react';

import { useTheme, Grid2 as Grid, Grid2Props } from '@mui/material';

export default function ItemContainer(
    {
        children,
        ...props
    }: {
        children: ReactNode;
    } & Grid2Props
) {
    const theme = useTheme();
    return (
        <Grid
            size={{ xs: 4, sm: 3, md: 2, lg: 1 }}
            {...props}
            sx={{
                padding: theme.spacing(1),
                height: 96,
                width: 96,
                minHeight: 96,
                minWidth: 96,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: theme.shadows[4],
                    backgroundColor: theme.palette.grey[800],
                },
            }}
        >
            {children}
        </Grid>
    );
}
