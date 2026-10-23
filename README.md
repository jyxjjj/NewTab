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

Thanks to the authors of these open-source projects for their work.

| Repository | Author | Version | Commit Hash | License |
| :---: | :---: | :---: | :---: | :---: |
| [Make Bilibili Great Than Ever Before](https://github.com/SukkaW/Make-Bilibili-Great-Than-Ever-Before) | [Sukka](https://github.com/SukkaW) | 1.9.2 | [51046e5ef213884c8bc7e4da5920dd0199ee39a5](https://github.com/SukkaW/Make-Bilibili-Great-Than-Ever-Before/tree/51046e5ef213884c8bc7e4da5920dd0199ee39a5) | [MIT](https://github.com/SukkaW/Make-Bilibili-Great-Than-Ever-Before/blob/51046e5ef213884c8bc7e4da5920dd0199ee39a5/LICENSE) |
| [fake-indexeddb](https://github.com/dumbmatter/fakeIndexedDB) | [Jeremy Scheff](https://github.com/dumbmatter) | 6.2.6 | [e4b7e016cf218f429db4819b0ff9a04741f15a25](https://github.com/dumbmatter/fakeIndexedDB/tree/e4b7e016cf218f429db4819b0ff9a04741f15a25) | [Apache-2.0](https://github.com/dumbmatter/fakeIndexedDB/blob/e4b7e016cf218f429db4819b0ff9a04741f15a25/LICENSE) |
| [flru](https://github.com/lukeed/flru) | [Luke Edwards](https://github.com/lukeed) | 1.0.2 | [35d9a9aa9d29a6c6a2fb7948be04c1f6dddc3baf](https://github.com/lukeed/flru/tree/35d9a9aa9d29a6c6a2fb7948be04c1f6dddc3baf) | [MIT](https://github.com/lukeed/flru/blob/35d9a9aa9d29a6c6a2fb7948be04c1f6dddc3baf/license) |

Portions of the Bilibili scripts and the cache implementation are adapted from Make Bilibili Great Than Ever Before and flru, respectively. The in-memory IndexedDB implementation uses a browser bundle of fake-indexeddb adapted to use `scheduler.postTask` or `setTimeout` for task scheduling.

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
