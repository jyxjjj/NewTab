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
            borderRadius={theme.shape.borderRadius}
            color='inherit'
            {...props}
            sx={{
                height: 96,
                width: 96,
                minHeight: 96,
                minWidth: 96,
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                    boxShadow: theme.shadows[16],
                    '@media(prefers-color-scheme: dark)': {
                        backgroundColor: theme.palette.grey[800],
                    }
                },
            }}
        >
            {children}
        </Stack>
    );
}
