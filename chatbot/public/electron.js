import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev'; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 500,
    minWidth: 300,       // 最小寬度
    minHeight: 500,      // 最小高度
    // resizable: false,    // 禁用調整窗口大小
    fullscreen: false,   // 禁用全螢幕模式
    webPreferences: {
      preload: isDev
        ? path.join(__dirname, '../src/preload.js') // 開發模式路徑
        : path.join(app.getAppPath(), 'src/preload.js'), // 打包後路徑
      contextIsolation: true,
      enableRemoteModule: false, 
      nodeIntegration: false,
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

ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});