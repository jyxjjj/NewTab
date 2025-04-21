document.querySelectorAll('div#article-content').forEach((item) => {
    item.addEventListener(
        'copy',
        event => {
            event.stopImmediatePropagation();
        },
        true
    );
});
