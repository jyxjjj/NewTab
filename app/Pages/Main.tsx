import { useTheme, Stack } from '@mui/material';

import ItemContainer from '../Components/ItemContainer';
import ItemIcon from '../Components/ItemIcon';
import ItemTitle from '../Components/ItemTitle';

import { ShortCuts as groups } from '../ShortCuts';

export default function Main() {

    const theme = useTheme();

    return (
        <Stack
            component='main'
            paddingY={4}
            sx={{
                userSelect: 'none',
                [theme.breakpoints.up('sm')]: {
                    width: '65vw',
                },
            }}
        >
            {
                groups.map((items, index1) => (
                    <Stack
                        key={index1}
                        spacing={1}
                        direction='row'
                        flexWrap='wrap'
                        alignItems='center'
                        justifyContent='center'
                    >
                        {
                            items.map((item, index2) => (
                                <ItemContainer key={index2} href={item.link}>
                                    <ItemIcon elevation={8} icon={item.icon} link={item.link} />
                                    <ItemTitle text={item.text} />
                                </ItemContainer>
                            ))
                        }
                    </Stack>
                ))
            }
        </Stack>
    );
}
