const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 500,
    minWidth: 300,       // 最小寬度
    minHeight: 500,      // 最小高度
    resizable: false,    // 禁用調整窗口大小
    fullscreen: false,   // 禁用全螢幕模式
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
	mainWindow.setMaximizable(false); // 禁用最大化
  mainWindow.loadURL('http://localhost:3000');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});