window.addEventListener('DOMContentLoaded', () => {
  const { contextBridge, ipcRenderer, app  } = require('electron');

  contextBridge.exposeInMainWorld('electron', {
    openExternal: (url) => ipcRenderer.send('open-external', url),
    // getAppPath: async () => app.getAppPath()
  });
});