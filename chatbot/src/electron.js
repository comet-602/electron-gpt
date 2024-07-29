import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev'; 

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    minWidth: 300,       // 最小寬度
    minHeight: 500,      // 最小高度
    // resizable: false,    // 禁用調整窗口大小
    fullscreen: false,   // 禁用全螢幕模式
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false
    },
  });
	// mainWindow.setMaximizable(false); // 禁用最大化

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
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
