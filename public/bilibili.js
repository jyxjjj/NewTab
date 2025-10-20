(() => {
    const addStyle = css => {
        const style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    };
    // 去掉叔叔去世时的全站黑白效果
    addStyle("html, body { -webkit-filter: none !important; filter: none !important; }");
    // 去掉屏蔽广告时候叔叔的眼泪
    addStyle(".adblock-tips, .feed-card:has(.bili-video-card>div:empty) { display: none !important; }");
    // 防止叔叔不肯出自己和父母的棺材钱
    try {
        class _RTCPeerConnection {
            addEventListener() { }
            createDataChannel() { }
        }
        class _RTCDataChannel { }
        Object.defineProperty(window, 'RTCPeerConnection', { value: _RTCPeerConnection, enumerable: false, writable: false });
        Object.defineProperty(window, 'RTCDataChannel', { value: _RTCDataChannel, enumerable: false, writable: false });
        Object.defineProperty(window, 'webkitRTCPeerConnection', { value: _RTCPeerConnection, enumerable: false, writable: false });
        Object.defineProperty(window, 'webkitRTCDataChannel', { value: _RTCDataChannel, enumerable: false, writable: false });
    } catch (e) { }
    // 去掉垃圾华为字体就是不爱国
    Array.from(document.querySelectorAll('link[href*="/jinkela/long/font/"]')).forEach(x => x.remove());
    addStyle("html, body { font-family: initial !important; }");
    // 首页优化
    if (location.hostname === "www.bilibili.com") {
        addStyle('.feed2 .feed-card:has(a[href*="cm.bilibili.com"]), .feed2 .feed-card:has(.bili-video-card:empty) { display: none } .feed2 .container > * { margin-top: 0 !important }');
    }
    // 动态页面优化
    if (location.hostname === "t.bilibili.com") {
        addStyle("html[wide] #app { display: flex; } html[wide] .bili-dyn-home--member { box-sizing: border-box;padding: 0 10px;width: 100%;flex: 1; } html[wide] .bili-dyn-content { width: initial; } html[wide] main { margin: 0 8px;flex: 1;overflow: hidden;width: initial; } #wide-mode-switch { margin-left: 0;margin-right: 20px; } .bili-dyn-list__item:has(.bili-dyn-card-goods), .bili-dyn-list__item:has(.bili-rich-text-module.goods) { display: none !important }");
        if (!localStorage.WIDE_OPT_OUT) {
            document.documentElement.setAttribute('wide', 'wide');
        }
        window.addEventListener('load', function () {
            const tabContainer = document.querySelector('.bili-dyn-list-tabs__list');
            if (!tabContainer) return;
            const placeHolder = document.createElement('div');
            placeHolder.style.flex = 1;
            const switchButton = document.createElement('a');
            switchButton.id = 'wide-mode-switch';
            switchButton.className = 'bili-dyn-list-tabs__item';
            switchButton.textContent = '宽屏模式';
            switchButton.addEventListener('click', e => {
                e.preventDefault();
                if (localStorage.WIDE_OPT_OUT) {
                    localStorage.removeItem('WIDE_OPT_OUT');
                    document.documentElement.setAttribute('wide', 'wide');
                } else {
                    localStorage.setItem('WIDE_OPT_OUT', '1');
                    document.documentElement.removeAttribute('wide');
                }
            });
            tabContainer.appendChild(placeHolder);
            tabContainer.appendChild(switchButton);
        });
    }
    // 去广告
    addStyle('.ad-report, a[href*="cm.bilibili.com"] { display: none !important; }');
    if (window.__INITIAL_STATE__?.adData) {
        for (const key in window.__INITIAL_STATE__.adData) {
            if (!Array.isArray(window.__INITIAL_STATE__.adData[key])) continue;
            for (const item of window.__INITIAL_STATE__.adData[key]) {
                item.name = 'B 站未来有可能会倒闭，但绝不会变质'; // 广告名称改为叔叔名言
                item.pic = 'https://static.hdslb.com/images/transparent.gif';
                item.url = 'https://space.bilibili.com/208259'; // 把广告链接指向叔叔的个人空间
            }
        }
    }
    // 去充电列表
    if (window.__INITIAL_STATE__?.elecFullInfo) {
        window.__INITIAL_STATE__.elecFullInfo.list = [];
    }
    // 去除 P2P CDN
    Object.defineProperty(window, 'PCDNLoader', { value: class { }, enumerable: false, writable: false });
    Object.defineProperty(window, 'BPP2PSDK', { value: class { on() { } }, enumerable: false, writable: false });
    Object.defineProperty(window, 'SeederSDK', { value: class { }, enumerable: false, writable: false });
    // 允许复制文章内容
    document.querySelectorAll('div#article-content').forEach((item) => {
        item.addEventListener(
            'copy',
            event => {
                event.stopImmediatePropagation();
            },
            true
        );
    });

    (() => {
        // 没用的 URL 参数
        const uselessUrlParams = [
            'buvid',
            'is_story_h5',
            'launch_id',
            'live_from',
            'mid',
            'session_id',
            'timestamp',
            'up_id',
            'vd_source',
            /^share/,
            /^spm/,
        ];

        function removeTracking(url) {
            if (!url) return url;
            try {
                const urlObj = new URL(url, location.href);
                if (!urlObj.search) return url;
                const searchParams = urlObj.searchParams;
                const keys = Array.from(searchParams.keys());
                for (const key of keys) {
                    uselessUrlParams.forEach(item => {
                        if (typeof item === 'string') {
                            if (item === key) searchParams.delete(key);
                        } else if (item instanceof RegExp) {
                            if (item.test(key)) searchParams.delete(key);
                        }
                    });
                }
                urlObj.search = searchParams.toString();
                return urlObj.toString();
            } catch (e) {
                console.error(e);
                return url;
            }
        }

        // 替换历史记录
        history.replaceState(undefined, undefined, removeTracking(location.href));
        const pushState = history.pushState;
        history.pushState = function (state, unused, url) {
            return pushState.apply(this, [state, unused, removeTracking(url)]);
        };
        const replaceState = history.replaceState;
        history.replaceState = function (state, unused, url) {
            return replaceState.apply(this, [state, unused, removeTracking(url)]);
        };
    })();
})();
