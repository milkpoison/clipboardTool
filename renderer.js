const { ipcRenderer, clipboard } = require('electron');
const inputText = document.getElementById('inputText');
const copyButton = document.getElementById('copyButton');
const readButton = document.getElementById('readButton');
const clipboardContent = document.getElementById('clipboardContent');

copyButton.addEventListener('click', function () {
    const text = inputText.value;
    // 向主进程发送复制文本请求
    ipcRenderer.send('copy-text-to-clipboard', text);
});

readButton.addEventListener('click', function () {
    // 向主进程发送读取剪贴板文本请求
    ipcRenderer.send('read-clipboard-text');
});

// 监听主进程返回的剪贴板文本
ipcRenderer.on('clipboard-text', (event, text) => {
    clipboardContent.textContent = text;
});