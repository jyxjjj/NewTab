import { ReactNode } from 'react';

type ShortCutsType = Array<Array<{
    text: string;
    icon?: ReactNode | string;
    link: string;
    color?: string;
}>>

export default ShortCutsType;
