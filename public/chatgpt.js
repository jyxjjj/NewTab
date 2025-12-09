setTimeout(() => {
    const css = `
        article > div > div {
            max-width: 100% !important;
        }
        div#thread-bottom > div > div {
            max-width: 100% !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}, 1000);
