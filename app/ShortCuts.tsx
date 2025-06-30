import {
    Bookmarks as BookmarksIcon,
    Dns as DnsIcon,
    Extension as ExtensionIcon,
    FileDownload as FileDownloadIcon,
    Folder as FolderIcon,
    History as HistoryIcon,
    Key as KeyIcon,
    Lan as LanIcon,
    Settings as SettingsIcon,
    Speed as SpeedIcon,
} from '@mui/icons-material';

import {
    SiAlibabacloud,
    SiApple,
    SiBaidu,
    SiCloudflare,
    SiDigitalocean,
    SiFedora,
    SiGithub,
    SiMaterialdesignicons,
    SiMui,
    SiPodman,
    SiWordpress,
} from '@icons-pack/react-simple-icons';

import ShortCutsType from './ShortCutsType';

const ShortCuts: ShortCutsType = [
    [
        { text: 'Google', icon: '/newtab/google.png', link: 'https://www.google.com/ncr', color: '#4285F4' },
        { text: 'Baidu', icon: <SiBaidu />, link: 'https://www.baidu.com', color: '#2932E1' },
        { text: 'Translate', icon: '/newtab/translate.webp', link: 'https://translate.google.com', color: '#4285F4' },
        { text: 'WebStore', icon: '/newtab/webstore.png', link: 'https://chromewebstore.google.com', color: '#4285F4' },
        { text: 'Apple US', icon: <SiApple />, link: 'https://www.apple.com', color: '#000000' },
        { text: 'Apple HK', icon: <SiApple />, link: 'https://www.apple.com', color: '#000000' },
        { text: 'Apple EU', icon: <SiApple />, link: 'https://www.apple.com', color: '#000000' },
        { text: 'Apple CN', icon: <SiApple style={{ transform: 'scaleX(-1) scaleY(-1)' }} />, link: 'https://www.apple.com.cn', color: '#000000' },
    ],
    [
        { text: 'Cloudflare', icon: <SiCloudflare />, link: 'https://dash.cloudflare.com', color: '#F38020' },
        { text: 'Digital Ocean', icon: <SiDigitalocean />, link: 'https://www.digitalocean.com', color: '#0080FF' },
        { text: 'AliYun', icon: <SiAlibabacloud />, link: 'https://www.aliyun.com', color: '#FF6A00' },
        { text: 'Fedora', icon: <SiFedora />, link: 'https://fedoraproject.org', color: '#294172' },
        { text: 'GitHub', icon: <SiGithub />, link: 'https://github.com/', color: '#181717' },
        { text: 'MUI', icon: <SiMui />, link: 'https://mui.com/material-ui/all-components/', color: '#007FFF' },
        { text: 'Material Icons', icon: <SiMaterialdesignicons />, link: 'https://fonts.google.com/icons?icon.set=Material+Icons', color: '#2196F3' }
    ],
    [
    ],
    [
        { text: 'DESMG', link: 'https://www.desmg.com' },
        { text: 'Blog', icon: <SiWordpress />, link: 'https://blog.desmg.com', color: '#21759B' },
        { text: 'Files', icon: <FolderIcon />, link: 'https://local.desmg.com/files/', color: '#607D8B' },
        { text: 'SDWAN', icon: <LanIcon />, link: 'https://zt.desmg.com', color: '#388E3C' },
        { text: 'DNS', icon: <DnsIcon />, link: 'https://dns.desmg.com', color: '#512DA8' },
        { text: 'Status', icon: <SpeedIcon />, link: 'https://status.desmg.com', color: '#0288D1' },
        { text: 'Registry', icon: <SiPodman />, link: 'https://joxit.dev/docker-registry-ui/demo/', color: '#892CA0' },
    ],
];

if (window.location.href.startsWith('chrome-extension://')) {
    [
        { text: 'History', icon: <HistoryIcon />, link: 'chrome://history' },
        { text: 'Downloads', icon: <FileDownloadIcon />, link: 'chrome://downloads' },
        { text: 'Password Manager', icon: <KeyIcon />, link: 'chrome://password-manager/passwords' },
        { text: 'Bookmark', icon: <BookmarksIcon />, link: 'chrome://bookmarks' },
        { text: 'Extensions', icon: <ExtensionIcon />, link: 'chrome://extensions/' },
        { text: 'Settings', icon: <SettingsIcon />, link: 'chrome://settings' },
    ].forEach(item => ShortCuts[ShortCuts.length - 2].push(item));
}

import PrivateShortCuts from './PrivateShortCuts';
PrivateShortCuts.forEach(item => ShortCuts.push(item));

export {
    ShortCuts
};
