const { app, BrowserWindow, clipboard, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform!== 'darwin') app.quit();
});

// 监听来自渲染进程的读取剪贴板内容请求
ipcMain.on('read-clipboard-content', (event) => {
    const formats = clipboard.availableFormats();
    const content = [];

    formats.forEach((format) => {
        if (format === 'text/html') {
            const html = clipboard.readHTML();
            content.push({ type: 'html', value: html });
        } else if (format.includes('image')) {
            const image = clipboard.readImage();
            if (!image.isEmpty()) {
                const dataURL = image.toDataURL();
                content.push({ type: 'image', value: dataURL });
            }
        } else if (format === 'application/json') {
            const jsonText = clipboard.read('application/json');
            try {
                const jsonData = JSON.parse(jsonText);
                content.push({ type: 'json', value: jsonData });
            } catch (error) {
                console.error('解析 JSON 数据时出错:', error);
            }
        }
    });

    event.sender.send('clipboard-content', content);
});

// 监听来自渲染进程的调整窗口大小请求
ipcMain.on('resize-window', (event, width, height) => {
    mainWindow.setSize(width, height);
});