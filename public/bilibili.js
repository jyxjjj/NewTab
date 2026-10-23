// Portions adapted from Make Bilibili Great Than Ever Before, see README.md
(() => {
    const styles = [];
    const addStyle = css => styles.push(css);
    const onReady = callback => {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });
        else callback();
    };
    // 去掉叔叔去世时的全站黑白效果
    addStyle("html, body { -webkit-filter: none !important; filter: none !important; }");
    // 隐藏广告和客户端提示
    addStyle('.adblock-tips, .feed-card:has(.bili-video-card>div:empty), a[href*="cm.bilibili.com"], .desktop-download-tip, .ad-report, .feed2 .feed-card:has(a[href*="cm.bilibili.com"]), .feed2 .feed-card:has(.bili-video-card:empty) { width: 1px !important; height: 1px !important; opacity: 0 !important; pointer-events: none !important; position: absolute !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border-width: 0 !important; }');
    // 去掉垃圾华为字体就是不爱国
    onReady(() => Array.from(document.querySelectorAll('link[href*="/jinkela/long/font/"]')).forEach(x => x.remove()));
    addStyle("html, body { font-family: initial !important; }");
    // 首页优化
    if (location.hostname === "www.bilibili.com") {
        addStyle('.feed2 .container > * { margin-top: 0 !important }');
    }
    // 动态页面优化
    if (location.hostname === "t.bilibili.com") {
        addStyle("html[wide] #app { display: flex; } html[wide] .bili-dyn-home--member { box-sizing: border-box;padding: 0 10px;width: 100%;flex: 1; } html[wide] .bili-dyn-content { width: initial; } html[wide] main { margin: 0 8px;flex: 1;overflow: hidden;width: initial; } #wide-mode-switch { margin-left: 0;margin-right: 20px; } .bili-dyn-list__item:has(.bili-dyn-card-goods), .bili-dyn-list__item:has(.bili-rich-text-module.goods) { display: none !important }");
        onReady(() => {
            if (!localStorage.getItem('WIDE_OPT_OUT')) document.documentElement.setAttribute('wide', 'wide');
        });
        const addSwitch = () => {
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
                if (localStorage.getItem('WIDE_OPT_OUT')) {
                    localStorage.removeItem('WIDE_OPT_OUT');
                    document.documentElement.setAttribute('wide', 'wide');
                } else {
                    localStorage.setItem('WIDE_OPT_OUT', '1');
                    document.documentElement.removeAttribute('wide');
                }
            });
            tabContainer.appendChild(placeHolder);
            tabContainer.appendChild(switchButton);
        };
        if (document.readyState === 'complete') addSwitch();
        else window.addEventListener('load', addSwitch, { once: true });
    }
    // 允许复制文章内容
    onReady(() => {
        if (location.pathname.startsWith('/read/cv') && window.original) {
            Object.defineProperty(window.original, 'reprint', { get() { return '1'; }, set() { } });
        }
        document.querySelectorAll('div#article-content, .article-holder').forEach((item) => {
            item.classList.remove('unable-reprint');
            item.addEventListener(
                'copy',
                event => {
                    event.stopImmediatePropagation();
                },
                true
            );
        });
    });

    if (location.hostname === 'live.bilibili.com') {
        addStyle('div[data-cy=EvaRenderer_LayerWrapper]:has(.player) { z-index: 999999; } #welcome-area-bottom-vm, .web-player-icon-roomStatus { display: none !important; }');
    }

    // 播放器裁切模式
    if (location.hostname === 'www.bilibili.com' && (location.pathname.startsWith('/video/') || location.pathname.startsWith('/bangumi/play/'))) {
        addStyle('body[video-fit] #bilibili-player video { object-fit: cover; } .bpx-player-ctrl-setting-fit-mode { display: flex; width: 100%; height: 32px; line-height: 32px; } .bpx-player-ctrl-setting-box .bui-panel-wrap, .bpx-player-ctrl-setting-box .bui-panel-item { min-height: 172px !important; }');
        const timer = setInterval(() => {
            const parent = document.querySelector('.bpx-player-ctrl-setting-menu-left');
            if (!parent) return;
            clearInterval(timer);
            const item = document.createElement('div');
            item.className = 'bpx-player-ctrl-setting-fit-mode bui bui-switch';
            item.innerHTML = '<input class="bui-switch-input" type="checkbox"><label class="bui-switch-label"><span class="bui-switch-name">裁切模式</span><span class="bui-switch-body"><span class="bui-switch-dot"><span></span></span></span></label>';
            parent.insertBefore(item, parent.querySelector('.bpx-player-ctrl-setting-more'));
            item.querySelector('input').addEventListener('change', e => document.body.toggleAttribute('video-fit', e.target.checked));
            const panel = document.querySelector('.bpx-player-ctrl-setting-box .bui-panel-item');
            if (panel) panel.style.height = '';
        }, 200);
    }

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
            'trackid',
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
        history.replaceState(history.state, '', removeTracking(location.href));
        const pushState = history.pushState;
        history.pushState = function (state, unused, url) {
            return pushState.apply(this, [state, unused, removeTracking(url)]);
        };
        const replaceState = history.replaceState;
        history.replaceState = function (state, unused, url) {
            return replaceState.apply(this, [state, unused, removeTracking(url)]);
        };
    })();

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles.join('\n'));
    document.adoptedStyleSheets.push(sheet);
})();
