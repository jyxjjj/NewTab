import { ReactNode } from 'react';

import { useTheme, Stack, StackProps } from '@mui/material';

export default function ItemContainer(
    {
        href,
        children,
        ...props
    }: {
        href: string;
        children: ReactNode;
    } & StackProps
) {

    const theme = useTheme();

    return (
        <Stack
            component='a'
            href={href}
            rel='noopener noreferrer'
            direction='column'
            alignItems='center'
            justifyContent='center'
            {...props}
            sx={{
                height: 96,
                width: 96,
                minHeight: 96,
                minWidth: 96,
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit',
                borderRadius: theme.shape.borderRadius,
                '&:hover': {
                    boxShadow: theme.shadows[4],
                    backgroundColor: theme.palette.grey[800],
                },
            }}
        >
            {children}
        </Stack>
    );
}
