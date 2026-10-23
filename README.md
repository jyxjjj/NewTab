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

### Bilibili Script Attribution

Portions of the Bilibili scripts are adapted from [Make Bilibili Great Than Ever Before](https://github.com/SukkaW/Make-Bilibili-Great-Than-Ever-Before) by [Sukka](https://github.com/SukkaW), licensed under the MIT License. See [Original LICENSE](https://github.com/SukkaW/Make-Bilibili-Great-Than-Ever-Before/blob/51046e5ef213884c8bc7e4da5920dd0199ee39a5/LICENSE).

The in-memory IndexedDB implementation uses [fake-indexeddb 6.2.6](https://github.com/dumbmatter/fakeIndexedDB/tree/e4b7e016cf218f429db4819b0ff9a04741f15a25) by [Jeremy Scheff](https://github.com/dumbmatter), licensed under Apache-2.0. See [Original LICENSE](https://github.com/dumbmatter/fakeIndexedDB/blob/e4b7e016cf218f429db4819b0ff9a04741f15a25/LICENSE). The browser bundle uses `scheduler.postTask` or `setTimeout` for task scheduling.

The cache implementation is adapted from [flru 1.0.2](https://github.com/lukeed/flru/tree/35d9a9aa9d29a6c6a2fb7948be04c1f6dddc3baf) by [Luke Edwards](https://github.com/lukeed), licensed under the MIT License. See [Original LICENSE](https://github.com/lukeed/flru/blob/35d9a9aa9d29a6c6a2fb7948be04c1f6dddc3baf/license).

## Functions

### Bilibili

- Remove the grey effect of the entire site when the uncle Chen died.

- Remove uncle Chen's Tears when Blocking Ads.

- Remove WebRTC (Testing) (Preventing uncle Chen from refusing to pay for the coffin for himself and his parents).

- Remove P2P (Testing).

- Removes copy restrictions on Bilibili articles.

- Other multiple optimizations.

- Store selected logging, fingerprinting, and PCDN data in memory using IndexedDB, and remove their existing persistent databases.

### JumpServer Watermark Removal

Removes watermarks JumpServer. You need to set the domain name in `manifest.json` according to your actual situation.
