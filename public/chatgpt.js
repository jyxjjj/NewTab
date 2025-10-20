setTimeout(() => {
    const css = `
        div[class*="--thread-content-max-width:40rem"][class*="thread-lg:[--thread-content-max-width:48rem]"] {
            max-width: 100% !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}, 1000);
