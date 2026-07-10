// Adds a copy-to-clipboard button to every syntax-highlighted code block.
const SELECTOR = 'pre[class*="language-"]';
const RESET_DELAY = 2000;

const LABEL_COPY = 'Copy code to clipboard';
const LABEL_COPIED = 'Copied!';

const ICON_COPY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const ICON_COPIED = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

// No point adding buttons when the browser can't write to the clipboard.
if (navigator.clipboard?.writeText) {
  document.querySelectorAll(SELECTOR).forEach(pre => {
    const code = pre.querySelector('code');
    if (!code || pre.parentElement?.classList.contains('code-block')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.append(pre);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code-button';
    button.setAttribute('aria-label', LABEL_COPY);
    button.innerHTML = ICON_COPY;
    wrapper.append(button);

    let resetTimer;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent.replace(/\n+$/, ''));
        button.innerHTML = ICON_COPIED;
        button.classList.add('is-copied');
        button.setAttribute('aria-label', LABEL_COPIED);
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          button.innerHTML = ICON_COPY;
          button.classList.remove('is-copied');
          button.setAttribute('aria-label', LABEL_COPY);
        }, RESET_DELAY);
      } catch {
        // Clipboard write was blocked or failed; leave the code block untouched.
      }
    });
  });
}
