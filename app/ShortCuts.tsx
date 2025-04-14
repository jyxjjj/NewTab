import {
    InsertDriveFile as BlankPageIcon,
    Bookmarks as BookmarksIcon,
    Dns as DnsIcon,
    Extension as ExtensionIcon,
    FileDownload as FileDownloadIcon,
    Folder as FolderIcon,
    History as HistoryIcon,
    Key as KeyIcon,
    Lan as LanIcon,
    Gavel as LawsIcon,
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
    SiGoogle,
    SiGooglechrome,
    SiGoogletranslate,
    SiMaterialdesignicons,
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
        { text: 'Apple CN', icon: <SiApple style={{ display: 'inline-block', transform: 'scaleX(-1) scaleY(-1)' }} />, link: 'https://www.apple.com.cn' },
    ],
    [
        { text: 'Cloudflare', icon: <SiCloudflare />, link: 'https://www.cloudflare.com' },
        { text: 'Digital Ocean', icon: <SiDigitalocean />, link: 'https://www.digitalocean.com' },
        { text: 'AliYun', icon: <SiAlibabacloud />, link: 'https://www.aliyun.com' },
        { text: 'Fedora', icon: <SiFedora />, link: 'https://fedoraproject.org' },
        { text: 'GitHub', icon: <SiGithub />, link: 'https://github.com' },
        { text: 'MUI', icon: <SiMui />, link: 'https://mui.com/material-ui/all-components/' },
        { text: 'Material Icons', icon: <SiMaterialdesignicons />, link: 'https://fonts.google.com/icons?icon.set=Material+Icons' }
    ],
    [
        { text: 'Base64', icon: <BlankPageIcon />, link: 'https://base64.us' },
        { text: 'URLDecode', icon: <BlankPageIcon />, link: 'https://www.qianbo.com.cn/Tool/Url-Encode.html' },
        { text: 'Word Count', icon: <BlankPageIcon />, link: 'https://www.eteste.com' },
        { text: 'Num Base', icon: <BlankPageIcon />, link: 'https://tool.oschina.net/hexconvert/' },
        { text: 'Timestamp', icon: <BlankPageIcon />, link: 'https://tool.lu/timestamp/' },
    ],
    [
    ],
    [
        { text: 'DESMG', icon: null, link: 'https://www.desmg.com' },
        { text: 'Blog', icon: <SiWordpress />, link: 'https://blog.desmg.com' },
        { text: 'Laws', icon: <LawsIcon />, link: 'https://local.desmg.com/laws/' },
        { text: 'Files', icon: <FolderIcon />, link: 'https://local.desmg.com/files/' },
        { text: 'SDWAN', icon: <LanIcon />, link: 'https://zt.desmg.com' },
        { text: 'DNS', icon: <DnsIcon />, link: 'https://dns.desmg.com' },
        { text: 'Status', icon: <SpeedIcon />, link: 'https://status.desmg.com' },
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
    ].forEach((item) => ShortCuts[ShortCuts.length - 2].push(item));
}

export {
    ShortCuts
};
