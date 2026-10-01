const installButton = document.querySelector('[data-install]');
const copyButtons = document.querySelectorAll('[data-copy]');
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installButton?.removeAttribute('hidden');
});

installButton?.addEventListener('click', async () => {
  if (!deferredPrompt) {
    return;
  }

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installButton.setAttribute('hidden', '');
});

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.querySelector(button.dataset.copy);
    if (!target) {
      return;
    }

    await navigator.clipboard.writeText(target.textContent.trim());
    button.textContent = 'コピーしました';
    window.setTimeout(() => {
      button.textContent = 'コピー';
    }, 1400);
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}
