import { ReactNode } from 'react';

type ShortCutsType = Array<Array<{
    text: string;
    icon?: ReactNode | string;
    link: string;
    color?: string;
    favicon?: 'default' | 'google'
}>>

export default ShortCutsType;

export type SavedShortCutsType = Array<Array<{
    text: string
    icon?: string
    link: string
    color?: string
    favicon?: 'default' | 'google'
}>>
