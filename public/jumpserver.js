setTimeout(() => {
    const css = '[class*="watermark"]{background-image:none !important;}';
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}, 500);
