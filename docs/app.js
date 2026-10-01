const installButton = document.querySelector('[data-install]');
const installDialog = document.querySelector('[data-install-dialog]');
const installStatus = document.querySelector('[data-install-status]');
const copyButtons = document.querySelectorAll('[data-copy]');
let deferredPrompt;

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const getInstallMessage = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isiOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/.test(ua);

  if (isStandalone()) {
    return 'このPWAはすでにインストール済みの表示モードで開かれています。';
  }

  if (deferredPrompt) {
    return 'このブラウザでは、下のボタンから直接インストールできます。';
  }

  if (isiOS || isSafari) {
    return 'Safariの共有メニューから「ホーム画面に追加」を選ぶとインストールできます。';
  }

  if (isAndroid) {
    return 'ブラウザのメニューから「アプリをインストール」または「ホーム画面に追加」を選んでください。';
  }

  return 'ブラウザのアドレスバーやメニューにあるインストール項目から追加できます。';
};

const showInstallHelp = () => {
  if (installStatus) {
    installStatus.textContent = getInstallMessage();
  }

  if (installDialog?.showModal) {
    installDialog.showModal();
    return;
  }

  alert(getInstallMessage());
};

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (installButton) {
    installButton.textContent = 'PWAをインストール';
  }
});

installButton?.addEventListener('click', async () => {
  if (isStandalone()) {
    showInstallHelp();
    return;
  }

  if (!deferredPrompt) {
    showInstallHelp();
    return;
  }

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installButton.textContent = 'インストール方法';
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  if (installButton) {
    installButton.textContent = 'インストール済み';
  }
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
