const { app, BrowserWindow, clipboard, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
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
    if (process.platform !== 'darwin') app.quit();
});

// 监听来自渲染进程的复制文本请求
ipcMain.on('copy-text-to-clipboard', (event, text) => {
    clipboard.writeText(text);
});

// 监听来自渲染进程的读取剪贴板文本请求
ipcMain.on('read-clipboard-text', (event) => {
    const text = clipboard.readText();
    event.sender.send('clipboard-text', text);
});
// test