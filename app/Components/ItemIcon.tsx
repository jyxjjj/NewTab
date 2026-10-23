import { ComponentType, lazy, ReactNode, Suspense } from 'react';

import { Paper, PaperProps } from '@mui/material';

const iconFiles = import.meta.glob<{ default: ComponentType }>([
    '../../node_modules/@mui/icons-material/*.mjs',
    '!../../node_modules/@mui/icons-material/index.mjs',
    '../../node_modules/@icons-pack/react-simple-icons/icons/Si*.mjs',
])

const icons = Object.fromEntries(Object.entries(iconFiles).map(([file, load]) => [
    file.slice(file.lastIndexOf('/') + 1, -4), lazy(load),
]))

export const iconNames = Object.keys(icons).sort()

export default function ItemIcon(
    {
        icon,
        link,
        color,
        favicon,
        ...props
    }: {
        icon?: ReactNode | string;
        link: string;
        color?: string;
        favicon?: 'default' | 'google'
    } & PaperProps
) {
    let iconNode = icon;
    if (icon == null) {
        iconNode = <img
            src={favicon === 'google'
                ? `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(link)}&sz=64`
                : `${link.split(/[?#]/)[0].split('/').slice(0, 3).join('/')}/favicon.ico`}
            referrerPolicy='no-referrer'
            style={{ width: 24, height: 24 }}
        />
    }
    if (typeof icon === 'string') {
        const Icon = icons[icon]
        iconNode = Icon
            ? <Suspense fallback={null}><Icon /></Suspense>
            : <img src={icon} referrerPolicy="no-referrer" style={{ width: 24, height: 24 }} />
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
