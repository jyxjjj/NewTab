(() => {
    function debugLog() {
        if (window.__MBGA_DEBUG__) console.log.apply(this, arguments);
    }

    // 拦截 fetch
    const oldFetch = window.fetch;
    window.fetch = function (url, ...args) {
        if (typeof url === 'string' && url.match(/(?:cm|data)\.bilibili\.com/)) {
            return new Promise(() => { }); // 永远不返回
        }
        return oldFetch.apply(this, [url, ...args]);
    };

    // 拦截 XHR
    const oldOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url, ...args) {
        if (typeof url === 'string' && url.match(/(?:cm|data)\.bilibili\.com/)) {
            this.send = function () { };
        }
        return oldOpen.apply(this, [method, url, ...args]);
    };

    // 拦截 sendBeacon
    window.navigator.sendBeacon = () => true;

    // MReporterInstance / MReporter
    const MReporterInstance = new Proxy(function () { }, {
        get(target, prop) {
            debugLog(`MReporterInstance.${prop} called`, arguments);
            return () => { };
        }
    });

    const MReporter = new Proxy(function () { }, {
        construct() { return MReporterInstance; },
        get(target, prop) {
            debugLog(`MReporter.${prop} called`, arguments);
            return () => { };
        }
    });

    window.MReporterInstance = MReporterInstance;
    window.MReporter = MReporter;

    // Sentry 替身
    class FakeHub { bindClient() { } }
    const fakeSentry = {
        SDK_NAME: 'sentry.javascript.browser',
        SDK_VERSION: '0.0.0',
        BrowserClient: class { },
        Hub: FakeHub,
        Integrations: { Vue: class { }, GlobalHandlers: class { }, InboundFilters: class { } },
        init() { },
        configureScope() { },
        getCurrentHub: () => new FakeHub(),
        setContext() { },
        setExtra() { },
        setExtras() { },
        setTag() { },
        setTags() { },
        setUser() { },
        wrap() { },
    };
    if (!window.Sentry || window.Sentry.SDK_VERSION !== fakeSentry.SDK_VERSION) {
        if (window.Sentry) delete window.Sentry;
        Object.defineProperty(window, 'Sentry', { value: fakeSentry, enumerable: false, writable: false });
    }

    // ReporterPbInstance / ReporterPb
    const ReporterPbInstance = new Proxy(function () { }, {
        get(target, prop) {
            debugLog(`ReporterPbInstance.${prop} called`, arguments);
            return () => { };
        }
    });

    const ReporterPb = new Proxy(function () { }, {
        construct() { return ReporterPbInstance; },
    });

    window.ReporterPbInstance = ReporterPbInstance;
    window.ReporterPb = ReporterPb;

    // __biliUserFp__, __USER_FP_CONFIG__, __MIRROR_CONFIG__
    Object.defineProperty(window, '__biliUserFp__', {
        get() { return { init() { }, queryUserLog() { return [] } }; },
        set() { },
    });

    Object.defineProperty(window, '__USER_FP_CONFIG__', { get() { return undefined; }, set() { } });
    Object.defineProperty(window, '__MIRROR_CONFIG__', { get() { return undefined; }, set() { } });

})();
