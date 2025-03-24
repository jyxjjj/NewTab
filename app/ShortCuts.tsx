import {
    Dns as DnsIcon,
    Folder as FolderIcon,
    Lan as LanIcon,
    Speed as SpeedIcon,
    FileDownload as FileDownloadIcon,
    Extension as ExtensionIcon,
    History as HistoryIcon,
    Key as KeyIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

import {
    SiAlibabacloud,
    SiApple,
    SiBaidu,
    SiCloudflare,
    SiDigitalocean,
    SiFedora,
    SiGithub,
    SiGoogle,
    SiGooglechrome,
    SiGoogletranslate,
    SiLaravel,
    SiMui,
    SiWordpress,
} from '@icons-pack/react-simple-icons';

const ShortCuts = [
    [
        { text: 'Google', icon: <SiGoogle />, link: 'https://www.google.com/ncr' },
        { text: 'Baidu', icon: <SiBaidu />, link: 'https://www.baidu.com' },
        { text: 'Translate', icon: <SiGoogletranslate />, link: 'https://translate.google.com' },
        { text: 'WebStore', icon: <SiGooglechrome />, link: 'https://chromewebstore.google.com' },
        { text: 'Apple US', icon: <SiApple />, link: 'https://www.apple.com' },
        { text: 'Apple CN', icon: <SiApple />, link: 'https://www.apple.com.cn' },
    ],
    [
        { text: 'Cloudflare', icon: <SiCloudflare />, link: 'https://www.cloudflare.com' },
        { text: 'Digital Ocean', icon: <SiDigitalocean />, link: 'https://www.digitalocean.com' },
        { text: 'AliYun', icon: <SiAlibabacloud />, link: 'https://www.aliyun.com' },
        { text: 'Fedora', icon: <SiFedora />, link: 'https://fedoraproject.org' },
    ],
    [
        { text: 'GitHub', icon: <SiGithub />, link: 'https://github.com' },
        { text: 'Laravel', icon: <SiLaravel />, link: 'https://laravel.com/docs/12.x' },
        { text: 'MUI', icon: <SiMui />, link: 'https://mui.com/material-ui/all-components/' },
    ],
    [
    ],
    [
        { text: 'DESMG', icon: null, link: 'https://www.desmg.com' },
        { text: 'Blog', icon: <SiWordpress />, link: 'https://blog.desmg.com' },
        { text: 'Files', icon: <FolderIcon />, link: 'https://local.desmg.com/files/' },
        { text: 'SDWAN', icon: <LanIcon />, link: 'https://zt.desmg.com' },
        { text: 'DNS', icon: <DnsIcon />, link: 'https://dns.desmg.com' },
        { text: 'Status', icon: <SpeedIcon />, link: 'https://status.desmg.com/' },
    ],
];

if (window.location.href.startsWith('chrome-extension://')) {
    ShortCuts[3] = [
        { text: 'History', icon: <HistoryIcon />, link: 'chrome://history' },
        { text: 'Downloads', icon: <FileDownloadIcon />, link: 'chrome://downloads' },
        { text: 'Password Manager', icon: <KeyIcon />, link: 'chrome://password-manager/passwords' },
        { text: 'Extensions', icon: <ExtensionIcon />, link: 'chrome://extensions/' },
        { text: 'Settings', icon: <SettingsIcon />, link: 'chrome://settings' },
    ];
}

export {
    ShortCuts
};
