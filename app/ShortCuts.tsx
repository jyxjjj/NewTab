import DnsIcon from '@mui/icons-material/Dns';
import FolderIcon from '@mui/icons-material/Folder';
import LanIcon from '@mui/icons-material/Lan';
import SpeedIcon from '@mui/icons-material/Speed';

import { SiBaidu, SiGoogle, SiCloudflare, SiGithub, SiGooglechrome, SiGoogletranslate, SiDigitalocean, SiWordpress, SiAlibabacloud } from '@icons-pack/react-simple-icons';

const ShortCuts = [
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
        { text: 'Blog', icon: <SiWordpress />, link: 'https://blog.desmg.com' },
        { text: 'Files', icon: <FolderIcon />, link: 'https://local.desmg.com/files/' },
        { text: 'SDWAN', icon: <LanIcon />, link: 'https://zt.desmg.com' },
        { text: 'DNS', icon: <DnsIcon />, link: 'https://dns.desmg.com' },
        { text: 'Status', icon: <SpeedIcon />, link: 'https://status.desmg.com/' },
    ]
];

export {
    ShortCuts
};
