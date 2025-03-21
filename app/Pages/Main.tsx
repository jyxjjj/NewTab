import { Grid2 as Grid, Typography } from '@mui/material';

import DnsIcon from '@mui/icons-material/Dns';
import FolderIcon from '@mui/icons-material/Folder';
import LanIcon from '@mui/icons-material/Lan';

import { SiBaidu, SiGoogle, SiCloudflare, SiGithub, SiGooglechrome, SiGoogletranslate, SiDigitalocean, SiWordpress, SiAlibabacloud } from '@icons-pack/react-simple-icons';

import ItemContainer from '../Components/ItemContainer';
import ItemIcon from '../Components/ItemIcon';

const groups = [
    [
        { text: 'Google', icon: SiGoogle, link: 'https://www.google.com/ncr' },
        { text: 'Baidu', icon: SiBaidu, link: 'https://www.baidu.com' },
        { text: 'Translate', icon: SiGoogletranslate, link: 'https://translate.google.com' },
        { text: 'WebStore', icon: SiGooglechrome, link: 'https://chromewebstore.google.com' },
    ],
    [
        { text: 'Cloudflare', icon: SiCloudflare, link: 'https://www.cloudflare.com' },
        { text: 'Digital Ocean', icon: SiDigitalocean, link: 'https://www.digitalocean.com' },
        { text: 'AliYun', icon: SiAlibabacloud, link: 'https://www.aliyun.com' },
        { text: 'GitHub', icon: SiGithub, link: 'https://github.com' },
    ],
    [
        { text: 'DESMG', icon: null, link: 'https://www.desmg.com' },
        { text: 'SDWAN', icon: LanIcon, link: 'https://zt.desmg.com' },
        { text: 'DNS', icon: DnsIcon, link: 'https://dns.desmg.com' },
        { text: 'Blog', icon: SiWordpress, link: 'https://blog.desmg.com' },
        { text: 'Files', icon: FolderIcon, link: 'https://local.desmg.com/files/' },
    ]
];

export default function Main() {
    return (
        <>
            {
                groups.map((items, i) => (
                    <Grid
                        key={i}
                        component='main'
                        container
                        spacing={1}
                        sx={{
                            userSelect: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '65vw',
                            '@media (max-width: 768px)': {
                                width: '90vw',
                            },
                        }}
                    >
                        {items.map((item, index) => (
                            <ItemContainer key={index} href={item.link}>
                                <ItemIcon elevation={3}>
                                    {item.icon === null
                                        ? <img
                                            src={`${item.link}/favicon.ico`}
                                            alt={item.text}
                                            referrerPolicy="no-referrer"
                                            style={{
                                                width: 24,
                                                height: 24,
                                                filter: 'grayscale(100%)',
                                            }}
                                        />
                                        : <item.icon />}
                                </ItemIcon>
                                <Typography
                                    variant='body2'
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '75%',
                                        marginTop: 1,
                                    }}>
                                    {item.text}
                                </Typography>
                            </ItemContainer>
                        ))}
                    </Grid>
                ))
            }
        </>
    );
}
