// Portions adapted from Make Bilibili Great Than Ever Before, see README.md
(() => {
    const noop = () => { };
    const trueFn = () => true;
    function readonly(target, key, value) {
        Object.defineProperty(target, key, { get() { return value; }, set: noop, configurable: false, enumerable: true });
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

    // 页面读取初始数据前处理广告和充电列表
    function removeAds(state) {
        if (state?.adData) {
            for (const key in state.adData) {
                if (!Array.isArray(state.adData[key])) continue;
                for (const item of state.adData[key]) {
                    item.name = 'B 站未来有可能会倒闭，但绝不会变质';
                    item.pic = 'https://static.hdslb.com/images/transparent.gif';
                    item.url = 'https://space.bilibili.com/208259';
                }
            }
        }
        if (state?.elecFullInfo) state.elecFullInfo.list = [];
    }
    let initialState = window.__INITIAL_STATE__;
    removeAds(initialState);
    Object.defineProperty(window, '__INITIAL_STATE__', {
        configurable: true,
        enumerable: true,
        get() { return initialState; },
        set(value) {
            removeAds(value);
            initialState = value;
        }
    });
    document.addEventListener('DOMContentLoaded', () => removeAds(window.__INITIAL_STATE__), { once: true });

    // 日志、指纹和 PCDN 数据保存在内存
    const storagePattern = /pbp3|pbp_|pbpstate|BILI_MIRROR|MIRROR_TRACK|__LOG|reporter-pb|KV_CONFIG_SDK|pcdn|nc_loader|bpcfgzip/;
    const memoryDB = window.BilibiliIndexedDB;
    delete window.BilibiliIndexedDB;
    const factory = window.indexedDB;
    const open = factory.open;
    factory.open = function (name, version) {
        if (storagePattern.test(name)) return memoryDB.open(name, version);
        return open.call(this, name, version);
    };
    disguise(factory.open, open);
    factory.databases().then(databases => {
        for (const database of databases) {
            if (storagePattern.test(database.name)) factory.deleteDatabase(database.name);
        }
    });

    const originalStorage = window.localStorage;
    const store = new Map();
    for (const key of Object.keys(originalStorage)) {
        if (storagePattern.test(key)) originalStorage.removeItem(key);
    }
    const keys = Object.keys(originalStorage);
    const storage = {
        getItem(key) {
            key = String(key);
            return storagePattern.test(key) ? store.get(key) ?? null : originalStorage.getItem(key);
        },
        setItem(key, value) {
            key = String(key);
            keys.push(key);
            if (storagePattern.test(key)) {
                originalStorage.removeItem(key);
                store.set(key, String(value));
            } else originalStorage.setItem(key, value);
        },
        removeItem(key) {
            key = String(key);
            const index = keys.indexOf(key);
            if (index > -1) keys.splice(index, 1);
            if (storagePattern.test(key)) store.delete(key);
            else originalStorage.removeItem(key);
        },
        clear() {
            store.clear();
            originalStorage.clear();
            keys.length = 0;
        },
        key(index) { return keys[keys.length - index - 1] ?? null; },
        get length() { return originalStorage.length + store.size; }
    };
    Object.defineProperty(window, 'localStorage', { get() { return storage; }, set() { }, enumerable: true, configurable: false });

    // 防止叔叔不肯出自己和父母的棺材钱
    const neverResolvedPromise = new Promise(noop);
    const noopNeverResolvedPromise = () => neverResolvedPromise;
    class MockDataChannel {
        static {
            this.prototype.close = noop;
            this.prototype.send = noop;
            this.prototype.addEventListener = noop;
            this.prototype.removeEventListener = noop;
            this.prototype.onbufferedamountlow = noop;
            this.prototype.onclose = noop;
            this.prototype.onerror = noop;
            this.prototype.onmessage = noop;
        }
        toString() { return '[object RTCDataChannel]'; }
    }
    class MockRTCSessionDescription {
        constructor(init) {
            this.type = init.type;
            this.sdp = init.sdp || '';
        }
        toJSON() { return { type: this.type, sdp: this.sdp }; }
        toString() { return '[object RTCSessionDescription]'; }
    }
    const localDescription = new MockRTCSessionDescription({ type: 'offer', sdp: '' });
    class MockRTCPeerConnection {
        createDataChannel() { return new MockDataChannel(); }
        static {
            this.prototype.close = noop;
            this.prototype.createOffer = noopNeverResolvedPromise;
            this.prototype.setLocalDescription = noop;
            this.prototype.setRemoteDescription = noop;
            this.prototype.addEventListener = noop;
            this.prototype.removeEventListener = noop;
            this.prototype.addIceCandidate = noop;
            this.prototype.setConfiguration = noop;
            this.prototype.localDescription = localDescription;
            this.prototype.createAnswer = noopNeverResolvedPromise;
            this.prototype.onicecandidate = noop;
        }
        toString() { return '[object RTCPeerConnection]'; }
    }
    for (const key of ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection']) {
        if (key in window) readonly(window, key, MockRTCPeerConnection);
    }
    for (const key of ['RTCDataChannel', 'webkitRTCDataChannel', 'mozRTCDataChannel']) {
        if (key in window) readonly(window, key, MockDataChannel);
    }
    readonly(window, 'RTCSessionDescription', MockRTCSessionDescription);
    // 去除 P2P CDN
    class MockPCDNLoader { }
    class MockBPP2PSDK { on = noop; }
    class MockSeederSDK { }
    readonly(window, 'PCDNLoader', MockPCDNLoader);
    readonly(window, 'BPP2PSDK', MockBPP2PSDK);
    readonly(window, 'SeederSDK', MockSeederSDK);

    function debugLog() {
        if (window.__MBGA_DEBUG__) console.log.apply(this, arguments);
    }

    // 拦截 sendBeacon
    readonly(window.navigator, 'sendBeacon', trueFn);

    // 上报 SDK 的构造和方法调用
    function mockClass(name) {
        const instance = new Proxy(noop, {
            get(target, prop) {
                return (...args) => debugLog(`${name}.${String(prop)} called`, args);
            }
        });
        return new Proxy(class { }, {
            construct() { return instance; },
            get(target, prop) {
                return (...args) => debugLog(`${name}.${String(prop)} called`, args);
            }
        });
    }

    const MReporter = mockClass('MReporter');
    readonly(window, 'MReporter', MReporter);

    // Sentry 替身
    const FakeHub = mockClass('SentryHub');
    const fakeSentry = {
        SDK_NAME: 'sentry.javascript.browser',
        SDK_VERSION: '0.0.1145141919810',
        BrowserClient: mockClass('Sentry.BrowserClient'),
        Hub: FakeHub,
        Integrations: {
            Vue: mockClass('Sentry.Integrations.Vue'),
            GlobalHandlers: mockClass('Sentry.Integrations.GlobalHandlers'),
            InboundFilters: mockClass('Sentry.Integrations.InboundFilters')
        },
        init: noop,
        configureScope: noop,
        getCurrentHub: () => new FakeHub(),
        setContext: noop,
        setExtra: noop,
        setExtras: noop,
        setTag: noop,
        setTags: noop,
        setUser: noop,
        wrap: noop,
    };
    readonly(window, 'Sentry', fakeSentry);

    // ReporterPb
    const ReporterPb = mockClass('ReporterPb');
    readonly(window, 'ReporterPb', ReporterPb);

    // __biliUserFp__, __USER_FP_CONFIG__, __MIRROR_CONFIG__
    readonly(window, '__biliUserFp__', { init: noop, queryUserLog() { return []; } });
    readonly(window, '__USER_FP_CONFIG__', undefined);
    readonly(window, '__MIRROR_CONFIG__', undefined);

})();
