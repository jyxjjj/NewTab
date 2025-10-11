import { ReactNode, useMemo } from 'react';

import { Stack, StackProps } from '@mui/material';

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

    const obj = useMemo(() => {
        const isDESMG = (() => {
            try {
                return new URL(href).hostname.endsWith('.desmg.com');
            } catch {
                return false;
            }
        })();
        const isChromeURL = href.startsWith('chrome://');
        if (isDESMG) {
            return { href };
        } else if (isChromeURL) {
            return {
                onClick: () => chrome.tabs.update({ url: href }),
            };
        } else {
            return {
                href: href,
                rel: 'external noopener noreferrer nofollow',
            };
        }
    }, [href]);

    return (
        <Stack
            component='a'
            {...obj}
            direction='column'
            alignItems='center'
            justifyContent='center'
            color='inherit'
            {...props}
            sx={[
                theme => ({
                    height: 96,
                    width: 96,
                    minHeight: 96,
                    minWidth: 96,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    borderRadius: theme.shape.borderRadius,
                    '&:hover': {
                        boxShadow: theme.shadows[16],
                    },
                }),
                theme => theme.applyStyles('dark', {
                    '&:hover': {
                        backgroundColor: theme.palette.grey[800],
                    },
                }),
            ]}
        >
            {children}
        </Stack>
    );
}
