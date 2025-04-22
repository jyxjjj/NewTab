import { IconButton, IconButtonProps } from '@mui/material';

import {
    Search as SearchIcon
} from '@mui/icons-material';

export default function ChangeThemeButton(
    {
        setShow,
        ...props
    }: {
        setShow: (show: boolean) => void;
    } & IconButtonProps
) {

    function handleClick() {
        setShow(true);
        document.getElementById('searchInput')?.focus();
    }

    return (
        <IconButton
            size='large'
            {...props}
            onClick={handleClick}
        >
            <SearchIcon />
        </IconButton>
    );
}
