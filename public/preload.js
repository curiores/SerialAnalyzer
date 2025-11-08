const { remote, ipcRenderer, dialog } = require('electron');

// Expose a safe method to get app version from renderer
try {
  window.getAppVersion = () => ipcRenderer.invoke('getAppVersion');
  window.getAppName = () => ipcRenderer.invoke('getAppName');
} catch (e) {
  // no-op in browser environment
}