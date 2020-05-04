async function loadReadme() {
    const pathParts = location.pathname.split('/');
    const exampleName = pathParts[pathParts.length - 2];
    const rawContent =
        (await (await fetch('README.md')).text()) +
        `\n\n[View Source](https://github.com/d3fc/d3fc/tree/master/examples/${exampleName}/)`;
    return rawContent.replace(
        /\[(.+)\]\(([^ ]+)(?: "(.+)")?\)/g,
        (_, text, url, title) =>
            `<a href="${url}" title="${title || ''}">${text}</a>`
    );
}
async function showReadme() {
    const processedContent = await loadReadme();
    const div = document.createElement('pre');
    Object.assign(div.style, {
        position: 'absolute',
        top: 0,
        left: 0,
        maxWidth: '40vw',
        padding: '1em',
        margin: '1em',
        whiteSpace: 'pre-wrap',
        background: 'rgba(250, 250, 250, 0.9)',
        color: '#1b1e23'
    });
    div.innerHTML = processedContent;
    const a = document.createElement('a');
    Object.assign(a.style, {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: '1em'
    });
    Object.assign(a, {
        href: '#',
        onclick: () => div.remove(),
        id: 'hide-overlay',
        innerHTML: 'Hide'
    });
    div.appendChild(a);
    document.body.append(div);
}

showReadme();
