const { ipcRenderer } = require('electron');
const readButton = document.getElementById('readButton');
const clipboardContentDiv = document.getElementById('clipboardContent');

// 初始读取剪贴板内容
readButton.click();

// 监听读取按钮点击事件
readButton.addEventListener('click', function () {
    // 向主进程发送读取剪贴板内容请求
    ipcRenderer.send('read-clipboard-content');
});

// 监听主进程返回的剪贴板内容
ipcRenderer.on('clipboard-content', (event, content) => {
    clipboardContentDiv.innerHTML = '';

    content.forEach((item) => {
        if (item.type === 'text') {
            const p = document.createElement('p');
            p.textContent = item.value;
            clipboardContentDiv.appendChild(p);
        } else if (item.type === 'html') {
            const div = document.createElement('div');
            div.innerHTML = item.value;
            clipboardContentDiv.appendChild(div);
        } else if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.value;
            clipboardContentDiv.appendChild(img);
        } else if (item.type === 'json') {
            const pre = document.createElement('pre');
            pre.textContent = JSON.stringify(item.value, null, 2);
            clipboardContentDiv.appendChild(pre);
        }
    });

    // 调整窗口大小
    adjustWindowSize();
});

// 调整窗口大小的函数
function adjustWindowSize() {
    const width = clipboardContentDiv.offsetWidth + 20; // 添加一些边距
    const height = clipboardContentDiv.offsetHeight + 30;
    ipcRenderer.send('resize-window', width, height);
}

// 使用 MutationObserver 监测内容变化
const observer = new MutationObserver(() => {
    adjustWindowSize();
});

const config = { childList: true, subtree: true };
observer.observe(clipboardContentDiv, config);