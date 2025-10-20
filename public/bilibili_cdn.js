(() => {
    if (!location.href.startsWith('https://www.bilibili.com/video/') &&
        !location.href.startsWith('https://www.bilibili.com/bangumi/play/')) return;

    let cdnDomain;

    function replaceP2PUrl(url) {
        cdnDomain ||= document.head.innerHTML.match(/up[\w-]+\.bilivideo\.com/)?.[0];

        try {
            const urlObj = new URL(url);
            const hostName = urlObj.hostname;
            if (urlObj.hostname.endsWith(".mcdn.bilivideo.cn")) {
                urlObj.host = cdnDomain || 'upos-sz-mirrorcoso1.bilivideo.com';
                console.log(`更换视频源: ${hostName} -> ${urlObj.host}`);
                return urlObj.toString();
            } else if (urlObj.hostname.endsWith(".szbdyd.com")) {
                urlObj.host = urlObj.searchParams.get('xy_usource');
                console.log(`更换视频源: ${hostName} -> ${urlObj.host}`);
                return urlObj.toString();
            }
            return url;
        } catch (e) {
            return url;
        }
    }

    function replaceP2PUrlDeep(obj) {
        if (!obj || typeof obj !== 'object') return;
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = replaceP2PUrl(obj[key]);
            } else if (Array.isArray(obj[key]) || typeof obj[key] === 'object') {
                replaceP2PUrlDeep(obj[key]);
            }
        }
    }

    // 尝试替换 __playinfo__，延迟几次以兼容动态加载
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
        if (window.__playinfo__) {
            try { replaceP2PUrlDeep(window.__playinfo__); } catch (e) { }
            clearInterval(interval);
        } else if (++attempts >= maxAttempts) {
            clearInterval(interval);
        }
    }, 200);

    // 覆盖 HTMLMediaElement.src
    (function (desc) {
        Object.defineProperty(window.HTMLMediaElement.prototype, 'src', {
            ...desc,
            set: function (value) {
                desc.set.call(this, replaceP2PUrl(value));
            }
        });
    })(Object.getOwnPropertyDescriptor(window.HTMLMediaElement.prototype, 'src'));

    // 覆盖 XMLHttpRequest.open
    (function (originalOpen) {
        window.XMLHttpRequest.prototype.open = function () {
            try {
                arguments[1] = replaceP2PUrl(arguments[1]);
            } finally {
                return originalOpen.apply(this, arguments);
            }
        };
    })(window.XMLHttpRequest.prototype.open);
})();
