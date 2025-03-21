import { useTheme, Stack } from '@mui/material';

import DnsIcon from '@mui/icons-material/Dns';
import FolderIcon from '@mui/icons-material/Folder';
import LanIcon from '@mui/icons-material/Lan';

import { SiBaidu, SiGoogle, SiCloudflare, SiGithub, SiGooglechrome, SiGoogletranslate, SiDigitalocean, SiWordpress, SiAlibabacloud } from '@icons-pack/react-simple-icons';

import ItemContainer from '../Components/ItemContainer';
import ItemIcon from '../Components/ItemIcon';
import ItemTitle from '../Components/ItemTitle';

const groups = [
    [
        { text: 'Google', icon: <SiGoogle />, link: 'https://www.google.com/ncr' },
        { text: 'Baidu', icon: <SiBaidu />, link: 'https://www.baidu.com' },
        { text: 'Translate', icon: <SiGoogletranslate />, link: 'https://translate.google.com' },
        { text: 'WebStore', icon: <SiGooglechrome />, link: 'https://chromewebstore.google.com' },
    ],
    [
        { text: 'Cloudflare', icon: <SiCloudflare />, link: 'https://www.cloudflare.com' },
        { text: 'Digital Ocean', icon: <SiDigitalocean />, link: 'https://www.digitalocean.com' },
        { text: 'AliYun', icon: <SiAlibabacloud />, link: 'https://www.aliyun.com' },
        { text: 'GitHub', icon: <SiGithub />, link: 'https://github.com' },
    ],
    [
        { text: 'DESMG', icon: null, link: 'https://www.desmg.com' },
        { text: 'SDWAN', icon: <LanIcon />, link: 'https://zt.desmg.com' },
        { text: 'DNS', icon: <DnsIcon />, link: 'https://dns.desmg.com' },
        { text: 'Blog', icon: <SiWordpress />, link: 'https://blog.desmg.com' },
        { text: 'Files', icon: <FolderIcon />, link: 'https://local.desmg.com/files/' },
    ]
];

export default function Main() {

    const theme = useTheme();

    return (
        <Stack
            component='main'
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
                                    <ItemIcon elevation={3} icon={item.icon} link={item.link} />
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
