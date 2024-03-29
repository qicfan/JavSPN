// preload.js
import { contextBridge, ipcRenderer } from 'electron'

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。

contextBridge.exposeInMainWorld('electronAPI', {
  gversion: () => ipcRenderer.invoke('version'),
  gname: () => ipcRenderer.invoke('appName'),
  gpath: () => ipcRenderer.invoke('appPath'),
  md5: (v) => ipcRenderer.invoke('md5', v),
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  loadIni: () => ipcRenderer.invoke('load-ini'),
  saveIni: (obj) => ipcRenderer.invoke('save-ini', obj),
  loadLibraryData: () => ipcRenderer.invoke('load-library-data'),
  saveLibraryData: (data) => ipcRenderer.invoke('save-library-data', data),
  scan: (p) => ipcRenderer.invoke('exec:scan', p),
  scrape: (data) => ipcRenderer.invoke('exec:scrape', data),
  openSetting: () => ipcRenderer.invoke('app:open-setting'),
  LoadNfo: (data) => ipcRenderer.invoke('load-nfo-data', data),
  editLibraryPath: () => ipcRenderer.invoke('edit-library-path'),
  onEditLibraryPath: (callback) =>
    ipcRenderer.on('edit-library-finish', () => {
      callback()
    })
})
