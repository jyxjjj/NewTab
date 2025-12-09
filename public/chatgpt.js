setTimeout(() => {
    const css = `
        #thread > div > div.relative.basis-auto.flex-col.-mb-\(--composer-overlap-px\).\[--composer-overlap-px\:28px\].grow.flex.overflow-hidden > div > div > div.flex.flex-col.text-sm.\@w-xl\/main\:pt-header-height.pb-25 > article.text-token-text-primary.w-full.focus\:outline-none.\[--shadow-height\:45px\].has-data-writing-block\:pointer-events-none.has-data-writing-block\:-mt-\(--shadow-height\).has-data-writing-block\:pt-\(--shadow-height\).\[\&\:has\(\[data-writing-block\]\)\>\*\]\:pointer-events-auto.\[content-visibility\:auto\].supports-\[content-visibility\:auto\]\:\[contain-intrinsic-size\:auto_100lvh\].scroll-mt-\[calc\(var\(--header-height\)\+min\(200px\,max\(70px\,20svh\)\)\)\] > div > div {
            max-width: 100% !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}, 1000);
