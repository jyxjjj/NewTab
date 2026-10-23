// Portions adapted from Make Bilibili Great Than Ever Before, see README.md
(() => {
    // flru 1.0.2 by Luke Edwards (MIT), see README.md
    function cache(max) {
        let num, curr, prev;
        const limit = max || 1;
        function keep(key, value) {
            if (++num > limit) {
                prev = curr;
                reset(true);
                ++num;
            }
            curr[key] = value;
        }
        function reset(partial) {
            num = 0;
            curr = Object.create(null);
            if (!partial) prev = Object.create(null);
        }
        reset();
        return {
            clear: reset,
            has(key) { return curr[key] !== undefined || prev[key] !== undefined; },
            get(key) {
                let value = curr[key];
                if (value !== undefined) return value;
                value = prev[key];
                if (value !== undefined) {
                    keep(key, value);
                    return value;
                }
            },
            set(key, value) {
                if (curr[key] !== undefined) curr[key] = value;
                else keep(key, value);
            }
        };
    }

    function disguise(patched, original) {
        const source = original.toString();
        const toString = Function.prototype.toString;
        Object.defineProperties(patched, {
            name: { value: original.name, configurable: true },
            toString: {
                value() { return this === patched ? source : toString.call(this); },
                writable: true,
                configurable: true
            }
        });
    }

    const video = (location.hostname === 'www.bilibili.com' &&
        (location.pathname.startsWith('/video/') || location.pathname.startsWith('/bangumi/play/'))) ||
        (location.hostname === 'player.bilibili.com' && location.pathname === '/player.html');
    const live = location.hostname === 'live.bilibili.com';
    const report = /data\.bilibili\.com|cm\.bilibili\.com|api\.bilibili\.com\/x\/internal\/gaia-gateway\/ExClimbWuzhi/;

    function requestUrl(input) {
        if (typeof input === 'string') return input;
        if ('href' in input) return input.href;
        if ('url' in input) return input.url;
        console.error('Invalid requestInfo', input);
        return null;
    }

    // 播放器画质和设备识别
    if (video || live) {
        const forceKeys = ['bilibili_player_force_DolbyAtmos&8K&HDR', 'bilibili_player_force_hdr', 'bilibili_player_force_8k'];
        for (const key of Object.keys(localStorage)) {
            if (key.startsWith('bilibili_player_force_') && !forceKeys.includes(key)) localStorage.removeItem(key);
        }
        for (const key of forceKeys) {
            if (localStorage.getItem(key) !== '1') localStorage.setItem(key, '1');
        }
        const getItem = sessionStorage.getItem;
        sessionStorage.getItem = function (key) {
            return key === 'enableHEVCError' ? null : getItem.call(this, key);
        };
        Object.defineProperty(navigator, 'userAgent', {
            get() { return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15'; },
            set() { }
        });
        Object.defineProperty(navigator, 'platform', { get() { return 'MacIntel'; }, set() { } });
        if (matchMedia('(pointer: fine)').matches && matchMedia('(any-hover: hover)').matches &&
            !(matchMedia('(pointer: coarse)').matches && ('ontouchstart' in window || navigator.maxTouchPoints > 0))) {
            Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });
        }
    }

    const playurl = /\/\/api\.bilibili\.com\/(?:x\/player\/(?:wbi\/)?playurl|pgc\/player\/web\/(?:v2\/)?playurl|pugv\/player\/web\/playurl)(?:[#/?]|$)/;
    const p2p = /^[^.]*302|302ppio|302kodo|\.mcdn\.bilivideo|szbdyd\.com|\.nexusedgeio\.com|\.ahdohpiechei\.com|\.mountaintoys\.cn|\.bvmlt\.top|upos-sz-mirror14b\.bilivideo\.com/;
    const files = cache(400);
    const videos = cache(32);
    const exclusions = cache(256);
    let fileCount = 0;
    let videoCount = 0;
    const hosts = new Map();
    const cdnHosts = new Set();
    const seedHosts = [
        'upos-sz-mirrorali.bilivideo.com',
        'upos-sz-mirrorhw.bilivideo.com',
        'upos-sz-mirrorbos.bilivideo.com',
        'upos-sz-mirror08c.bilivideo.com',
        'upos-sz-mirrorbd.bilivideo.com',
        'upos-sz-mirrorcos.bilivideo.com',
        'upos-sz-mirrorcoso1.bilivideo.com',
        'upos-sz-mirrorcosb.bilivideo.com',
        'upos-sz-mirrorcosov.bilivideo.com',
        'upos-sz-mirroraliov.bilivideo.com',
        'upos-sz-estgoss.bilivideo.com',
        'cn-hk-eq-01-01.bilivideo.com',
        'cn-hk-eq-01-03.bilivideo.com'
    ];
    const mirror = /^https?:\/\/(?:upos-\w+-(?!302)\w+|(?:upos|proxy)-tf-[^/]+)\.(?:bilivideo|akamaized)\.(?:com|net)\/upgcxcode/;
    const proxy = /^https?:\/\/(?:(?:\d{1,3}\.){3}\d{1,3}|[^/]+\.mcdn\.bilivideo\.(?:com|cn|net))(?::\d{1,5})?\/v\d\/resource/;
    let lastSuccess = -Infinity;

    function seconds(value) {
        const number = Number(value);
        return Number.isSafeInteger(number) && number > 0 ? number : 0;
    }

    function address(value) {
        const url = new URL(value, location.href);
        let type = 'unknown';
        if (url.href.includes('/upgcxcode/')) {
            if (p2p.test(url.hostname) || (mirror.test(url.href) && url.searchParams.get('os') === 'mcdn')) type = 'p2p';
            else if (mirror.test(url.href)) type = 'mirror';
            else type = 'bcache';
        } else if (proxy.test(url.href)) {
            type = 'proxy';
        } else if (url.href.includes('szbdyd.com')) {
            type = 'source';
        }
        let deadline = seconds(url.searchParams.get('deadline'));
        const expiry = seconds(url.searchParams.get('hdnts')?.match(/(?:^|~)exp=(\d+)/)?.[1] ?? null);
        deadline = deadline && expiry ? Math.min(deadline, expiry) : deadline || expiry;
        return { url, type, deadline };
    }

    function hostState(hostname) {
        if (!hosts.has(hostname)) hosts.set(hostname, { failures: 0, cooldown: 0 });
        return hosts.get(hostname);
    }

    function replaceP2PUrl(value) {
        const href = String(value);
        if (href.startsWith('data:') || href.startsWith('blob:') ||
            ['bilibili.com', 'hdslb.com', 'bvc.bilivideo.com', 'bvc-drm.bilivideo.com'].some(host => href.includes(host))) return value;
        const requested = address(value);
        const file = files.get(requested.url.pathname);
        if (requested.type === 'unknown' && !file) return value;
        if (!file && ['mirror', 'bcache'].includes(requested.type)) cdnHosts.add(requested.url.hostname);
        const listed = [requested, ...(file?.addresses || [])];
        const candidates = new Map();
        const names = new Set();
        for (const item of file?.addresses || []) {
            if (['mirror', 'bcache'].includes(item.type)) names.add(item.url.hostname);
        }
        for (const name of cdnHosts) names.add(name);
        for (const name of seedHosts) names.add(name);
        const usableNames = [...names].filter(name => !p2p.test(name) && !name.endsWith('.akamaized.net'));
        const add = item => {
            if (!candidates.has(item.url.href)) candidates.set(item.url.href, item);
        };
        const moved = new Set();
        for (const item of listed) {
            const isP2P = ['p2p', 'source', 'proxy'].includes(item.type) || p2p.test(item.url.hostname);
            const key = item.url.pathname + item.url.search;
            add({
                ...item,
                url: isP2P ? item.url : new URL(`https://${item.url.hostname}${key}`),
                tier: isP2P ? 6 : /^(?:upos|proxy)-tf-/.test(item.url.hostname) ? 5 : item.type === 'bcache' ? 1 : 0,
                p2p: isP2P
            });
            if (item.url.pathname.includes('/upgcxcode/') && !item.url.hostname.endsWith('.akamaized.net') && !moved.has(key)) {
                moved.add(key);
                for (const name of usableNames) {
                    const isMirror = mirror.test(`https://${name}/upgcxcode/`);
                    add({ ...item, url: new URL(`https://${name}${key}`), type: isMirror ? 'mirror' : 'bcache', tier: isMirror ? 2 : 3, p2p: false });
                }
            }
        }
        const acceptable = [];
        for (const item of candidates.values()) {
            if (!item.p2p) {
                acceptable.push(item);
                continue;
            }
            const url = new URL(item.url);
            if (item.type === 'source') {
                const source = url.searchParams.get('xy_usource');
                if (source) {
                    url.protocol = 'https:';
                    url.hostname = source;
                    url.port = '';
                    acceptable.push({ ...address(url.href), tier: 4, p2p: false });
                }
            } else if (item.type === 'proxy') {
                const proxy = new URL('https://proxy-tf-all-ws.bilivideo.com');
                proxy.searchParams.set('url', url.href);
                acceptable.push({ ...address(proxy.href), deadline: item.deadline, tier: 5, p2p: false });
            }
        }
        const now = performance.now();
        const usable = acceptable.filter(item =>
            (!item.deadline || item.deadline > Date.now() / 1000 + 60) &&
            (exclusions.get(file?.key)?.get(item.url.hostname) || 0) <= now);
        const available = usable.filter(item => hostState(item.url.hostname).cooldown <= now);
        const current = available.find(item => item.url.hostname === requested.url.hostname &&
            item.url.pathname + item.url.search === requested.url.pathname + requested.url.search);
        if (current) return current.url.href;
        const options = available.length ? available : usable;
        const tier = Math.min(...options.map(item => item.tier));
        const best = options.filter(item => item.tier === tier);
        const original = acceptable.find(item => item.url.hostname === requested.url.hostname &&
            item.url.pathname + item.url.search === requested.url.pathname + requested.url.search);
        return best.length ? best[Math.floor(Math.random() * best.length)].url.href : original?.url.href ?? value;
    }

    function readPlayinfo(obj) {
        if (!isObject(obj)) return;
        let dash;
        if (isObject(obj.data) && isObject(obj.data.dash)) dash = obj.data.dash;
        else if (isObject(obj.result)) {
            if (isObject(obj.result.video_info) && isObject(obj.result.video_info.dash)) dash = obj.result.video_info.dash;
            else if (isObject(obj.result.dash)) dash = obj.result.dash;
        }
        if (!dash) {
            console.warn('Invalid Bilibili Playinfo data', { json: obj });
            return;
        }
        const representations = [];
        for (const [kind, list] of [
            ['video', dash.video],
            ['audio', dash.audio],
            ['audio', isObject(dash.dolby) ? dash.dolby.audio : null],
            ['audio', isObject(dash.flac) ? dash.flac.audio : null]
        ]) {
            if (Array.isArray(list)) {
                for (const item of list) {
                    if (isObject(item)) representations.push([kind, item]);
                }
            } else if (isObject(list)) representations.push([kind, list]);
        }
        const listed = [];
        let videoKey = null;
        for (const [kind, representation] of representations) {
            const urls = new Set();
            for (const value of [representation.baseUrl, representation.base_url, representation.backupUrl, representation.backup_url]) {
                if (typeof value === 'string') urls.add(value);
                else if (Array.isArray(value)) {
                    for (const item of value) {
                        if (typeof item === 'string') urls.add(item);
                    }
                }
            }
            const addresses = [];
            for (const value of urls) {
                let url;
                try { url = new URL(value); }
                catch { continue; }
                const item = address(url.href);
                addresses.push(item);
                if (['mirror', 'bcache'].includes(item.type)) cdnHosts.add(item.url.hostname);
            }
            if (!addresses.length) continue;
            let known;
            for (const item of addresses) {
                known = files.get(item.url.pathname);
                if (known) break;
            }
            videoKey ??= known?.videoKey ?? null;
            listed.push({ kind, representation, addresses, known });
        }
        videoKey ??= `video-${++videoCount}`;
        const videoFiles = [];
        for (const { kind, representation, addresses, known } of listed) {
            const segment = isObject(representation.SegmentBase) ? representation.SegmentBase :
                isObject(representation.segment_base) ? representation.segment_base : null;
            const init = segment ? byteRange(segment.Initialization ?? segment.initialization) : null;
            const index = segment ? byteRange(segment.indexRange ?? segment.index_range) : null;
            const file = {
                key: known?.key ?? `file-${++fileCount}`,
                videoKey,
                kind,
                codecs: typeof representation.codecs === 'string' ? representation.codecs : '',
                bandwidth: Number(representation.bandwidth) || 0,
                segmentBase: init && index ? { init, index } : null,
                addresses
            };
            videoFiles.push(file);
            for (const item of addresses) {
                files.set(item.url.pathname, file);
            }
        }
        videos.set(videoKey, videoFiles);
    }

    function isObject(value) {
        return typeof value === 'object' && value !== null;
    }

    function byteRange(value) {
        const match = typeof value === 'string' ? /^(\d+)-(\d+)$/.exec(value.trim()) : null;
        if (!match) return null;
        const start = Number(match[1]);
        const end = Number(match[2]);
        return Number.isSafeInteger(start) && Number.isSafeInteger(end) && start <= end ? { start, end } : null;
    }

    function exclude(file, hostname, until) {
        if (!file) return;
        let excluded = exclusions.get(file.key);
        if (!excluded) {
            excluded = new Map();
            exclusions.set(file.key, excluded);
        }
        excluded.set(hostname, until);
    }

    function recordOutcome(value, status, elapsed, redirected = false) {
        const item = address(value);
        if (item.type === 'unknown' && !files.has(item.url.pathname)) return;
        const now = performance.now();
        const hostname = item.url.hostname;
        const host = hostState(hostname);
        const file = files.get(item.url.pathname);
        if (status >= 200 && status < 300 && !redirected) {
            host.failures = 0;
            lastSuccess = now;
            return;
        }
        if (redirected || [404, 410].includes(status)) {
            exclude(file, hostname, Infinity);
            return;
        }
        if ([401, 403].includes(status)) {
            exclude(file, hostname, now + 60000);
            return;
        }
        if (!status && now - lastSuccess > 3000) return;
        let delay = 0;
        if ([412, 429, 503].includes(status)) delay = 2000 * (2 ** Math.min(host.failures, 3));
        else if (status >= 500 || !status) delay = 1000 * (2 ** Math.min(host.failures, 5));
        if (!status && elapsed < 1000) delay = 60000 * (2 ** Math.min(host.failures, 2));
        if (delay) {
            host.failures++;
            host.cooldown = Math.max(host.cooldown, now + delay);
        }
    }

    let playinfo = window.__playinfo__;
    let lastPlayinfo = null;
    function readEmbedded(value) {
        if (value !== lastPlayinfo && isObject(value)) {
            lastPlayinfo = value;
            readPlayinfo(value);
        }
    }
    readEmbedded(playinfo);
    try {
        Object.defineProperty(window, '__playinfo__', {
            configurable: true,
            enumerable: true,
            get() { return playinfo; },
            set(value) {
                playinfo = value;
                readEmbedded(value);
            }
        });
    } catch (e) { console.warn('Failed to trap window.__playinfo__', e); }
    document.addEventListener('DOMContentLoaded', () => readEmbedded(window.__playinfo__), { once: true });

    // 直播原画和转发域名
    let forceQuality = true;
    const qualityUrls = cache(300);
    const errors = [];
    const quality = /(live-bvc\/\d+\/live_\d+_\d+)_\w+/;
    const smtcdns = /[\w.]+\.smtcdns.net\/([\w-]+\.bilivideo.com\/)/;
    const beforeFetch = [
        args => {
            const url = requestUrl(args[0]);
            return typeof url === 'string' && report.test(url) ? new Response() : args;
        },
        args => {
            if (!live || !forceQuality) return args;
            const originalUrl = requestUrl(args[0]);
            if (originalUrl === null) return args;
            let url = originalUrl;
            if (quality.test(url)) {
                url = url.replace(quality, '$1').replaceAll(/(\d+)_(?:mini|pro)hevc/g, '$1');
                qualityUrls.set(url, originalUrl);
            }
            url = url.replace(smtcdns, '$1');
            if (url !== originalUrl) args[0] = args[0] instanceof Request ? new Request(url, args[0]) : url;
            return args;
        },
        args => {
            const url = requestUrl(args[0]);
            if (url === null) return args;
            const value = replaceP2PUrl(url);
            if (value !== url) args[0] = args[0] instanceof Request ? new Request(value, args[0]) : value;
            return args;
        }
    ];
    const afterFetch = [
        (response, args) => {
            const url = response.url || requestUrl(args[0]);
            if (url && playurl.test(url)) response.clone().json().then(readPlayinfo).catch(e => console.error(e));
            return response;
        },
        (response, args, fetch) => {
            if (!live || !/\.bilivideo\.|\.m3u8|\.m4s|\.flv/.test(response.url) || response.ok) return response;
            const now = Date.now();
            errors.push(now);
            while (errors[0] < now - 30000) errors.shift();
            if (forceQuality && errors.length >= 5) {
                forceQuality = false;
                console.warn('原画不可用，已切换至播放器选择的清晰度');
                const showNotice = () => {
                    const notice = document.createElement('div');
                    notice.setAttribute('role', 'status');
                    notice.textContent = '原画不可用，已恢复播放器所选清晰度';
                    notice.style.cssText = 'position: fixed; top: 24px; right: 24px; z-index: 2147483647; max-width: calc(100vw - 48px); box-sizing: border-box; padding: 14px 20px; border-radius: 4px; background: #323232; color: #fff; box-shadow: 0 3px 8px #0006; font-size: 14px;';
                    document.body.appendChild(notice);
                    setTimeout(() => notice.remove(), 6000);
                };
                if (document.body) showNotice();
                else document.addEventListener('DOMContentLoaded', showNotice, { once: true });
            }
            if (qualityUrls.has(response.url)) {
                const oldUrl = qualityUrls.get(response.url);
                const request = args[0] instanceof Request ? new Request(oldUrl, args[0]) : oldUrl;
                return fetch(request, args[1]);
            }
            return response;
        }
    ];
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        let fetchArgs = args;
        for (const callback of beforeFetch) {
            try {
                const result = callback(fetchArgs);
                if (result === null) return new Response();
                if ('body' in result) return result;
                fetchArgs = result;
            } catch (e) { console.error('Failed to replace fetcherArgs', e, { fetchArgs }); }
        }
        const input = fetchArgs[0];
        const url = input instanceof Request ? input.url : typeof input === 'string' ? input : input?.href;
        const started = performance.now();
        let response;
        try {
            response = await originalFetch.apply(this, fetchArgs);
        } catch (e) {
            try {
                const signal = fetchArgs[1]?.signal ?? (input instanceof Request ? input.signal : null);
                if (url && !signal?.aborted) recordOutcome(url, 0, performance.now() - started);
            } catch (error) { console.error(error); }
            throw e;
        }
        try {
            if (url) {
                const redirected = response.url && ['p2p', 'source', 'proxy'].includes(address(response.url).type);
                recordOutcome(url, response.status, performance.now() - started, redirected);
            }
        } catch (e) { console.error(e); }
        for (const callback of afterFetch) response = await callback(response, fetchArgs, originalFetch);
        return response;
    };
    disguise(window.fetch, originalFetch);

    // 媒体地址和播放接口响应
    const media = new WeakMap();
    const src = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
    Object.defineProperty(HTMLMediaElement.prototype, 'src', {
        ...src,
        set(value) {
            if (!media.has(this)) {
                this.addEventListener('error', () => {
                    if (this.error?.code !== 2) return;
                    const state = media.get(this);
                    recordOutcome(state.url, 0, performance.now() - state.started);
                });
                this.addEventListener('loadeddata', () => recordOutcome(media.get(this).url, 200, 0));
            }
            let url = value;
            try { url = replaceP2PUrl(value); }
            catch (e) { console.error('Failed to handle media src', e, { value }); }
            media.set(this, { url, started: performance.now() });
            src.set.call(this, url);
        }
    });
    const requests = new WeakMap();
    const blocked = new WeakSet();
    const beforeOpen = [
        args => {
            const url = typeof args[1] === 'string' ? args[1] : args[1].href;
            return report.test(url) ? null : args;
        },
        args => {
            const url = typeof args[1] === 'string' ? args[1] : args[1].href;
            const value = replaceP2PUrl(url);
            if (value !== url) args[1] = value;
            return args;
        }
    ];
    const afterResponse = [
        (method, url, response) => {
            if (!playurl.test(url)) return response;
            if (typeof response === 'string') {
                try { readPlayinfo(JSON.parse(response)); }
                catch (e) { console.error(e); }
            } else {
                readPlayinfo(response);
            }
            return response;
        }
    ];
    const NativeXMLHttpRequest = window.XMLHttpRequest;
    const PatchedXMLHttpRequest = class extends NativeXMLHttpRequest {
        open(...args) {
            blocked.delete(this);
            let xhrArgs = args;
            for (const callback of beforeOpen) {
                if (xhrArgs === null) break;
                try { xhrArgs = callback(xhrArgs); }
                catch (e) { console.error('Failed to replace XHR open arguments', e); }
            }
            if (xhrArgs === null) {
                requests.delete(this);
                blocked.add(this);
                return;
            }
            super.open(...xhrArgs);
            requests.set(this, {
                method: args[0],
                originalUrl: args[1],
                url: new URL(xhrArgs[1], location.href).href,
                canceled: false,
                nativeSent: false,
                response: null,
                lastResponseLength: null
            });
        }
        setRequestHeader(name, value) {
            if (!blocked.has(this)) super.setRequestHeader(name, value);
        }
        send(...args) {
            if (blocked.has(this)) return;
            const state = requests.get(this);
            if (!state || state.nativeSent) return super.send(...args);
            state.nativeSent = true;
            const started = performance.now();
            this.addEventListener('loadend', () => {
                if (state !== requests.get(this) || state.canceled) return;
                const redirected = this.responseURL && ['p2p', 'source', 'proxy'].includes(address(this.responseURL).type);
                recordOutcome(state.url, this.status, performance.now() - started, redirected);
            }, { once: true });
            return super.send(...args);
        }
        abort() {
            const state = requests.get(this);
            if (state) state.canceled = true;
            return super.abort();
        }
        get response() {
            const value = super.response;
            const state = requests.get(this);
            if (!state) return value;
            const length = typeof value === 'string' ? value.length : null;
            if (state.lastResponseLength !== length) {
                state.response = null;
                state.lastResponseLength = length;
            }
            if (state.response !== null) return state.response;
            let response = value;
            for (const callback of afterResponse) {
                try { response = callback(state.method, state.originalUrl, response, this); }
                catch (e) { console.error('Failed to handle XHR response', e); }
            }
            state.response = response;
            return response;
        }
        get responseText() {
            const value = this.response;
            return typeof value === 'string' ? value : super.responseText;
        }
    };
    for (const key of ['open', 'setRequestHeader', 'send', 'abort', 'response', 'responseText']) {
        Object.defineProperty(PatchedXMLHttpRequest.prototype, key, { enumerable: true });
    }
    for (const key of ['open', 'setRequestHeader', 'send', 'abort']) {
        disguise(PatchedXMLHttpRequest.prototype[key], NativeXMLHttpRequest.prototype[key]);
    }
    disguise(PatchedXMLHttpRequest, NativeXMLHttpRequest);
    window.XMLHttpRequest = PatchedXMLHttpRequest;
})();
