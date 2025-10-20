# New Tab

This project is solely intended to address the “Remove Doodle” and “Not Enough Shortcuts” issues.

## Installation

```zsh
cp public/manifest.example.json public/manifest.json
vim public/manifest.json # Modify according to your needs
npm i
npm run build
```

## Chrome Extension

Load the `dist` folder as an unpacked extension.

## LICENSE

[AGPL-3.0-Only](LICENSE)

## Functions

### Bilibili

- Remove the grey effect of the entire site when the uncle Chen died.

- Remove uncle Chen's Tears when Blocking Ads.

- Remove WebRTC (Testing) (Preventing uncle Chen from refusing to pay for the coffin for himself and his parents).

- Remove P2P (Testing).

- Removes copy restrictions on Bilibili articles.

- Other multiple optimizations.

### JumpServer Watermark Removal

Removes watermarks JumpServer. You need to set the domain name in `manifest.json` according to your actual situation.

### ChatGPT Width Adjustment

Adjusts the width of the ChatGPT chat area to utilize the full width of the window.
