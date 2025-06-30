import { ReactNode } from 'react';

import { Paper, PaperProps } from '@mui/material';

export default function ItemIcon(
    {
        icon,
        link,
        color,
        ...props
    }: {
        icon?: ReactNode | string;
        link: string;
        color?: string;
    } & PaperProps
) {
    let iconNode = icon;
    if (icon == null) {
        iconNode = <img src={`${link}/favicon.ico`} referrerPolicy="no-referrer" style={{ width: 24, height: 24 }} />;
    }
    if (typeof icon === 'string') {
        iconNode = <img src={icon} referrerPolicy="no-referrer" style={{ width: 24, height: 24 }} />;
    }
    return (
        <Paper
            {...props}
            sx={[
                {
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '64px',
                    color: color ?? '#000000',
                },
                theme => theme.applyStyles('dark', {
                    backgroundColor: theme.palette.grey[800],
                    '> svg, > img': {
                        filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))',
                    }
                }),
            ]}
        >
            {iconNode}
        </Paper>
    );
}
