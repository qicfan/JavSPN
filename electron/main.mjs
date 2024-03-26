import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import path from 'node:path'
import process from 'node:process'

import {
  __dirname,
  md5,
  parseIni,
  saveIni,
  loadNfo,
  loadLibraryData,
  result,
  saveLibraryData,
  scan,
  scrape
} from './func.mjs'

const isPackaged = app.isPackaged
const appPath = isPackaged ? process.cwd() : app.getAppPath()
const javSPPath = path.join(appPath, './resources/JavSP')
let win
let settingWin
let JavSPCommand = 'JavSP'

if (process.platform !== 'darwin') {
  Menu.setApplicationMenu(null)
}
if (process.platform == 'win32') {
  JavSPCommand = 'JavSP.exe'
}
const JAV_EXEC = path.join(javSPPath, './' + JavSPCommand)

async function createWindow() {
  win = new BrowserWindow({
    title: app.getName() + ' ' + app.getVersion(),
    minWidth: 850,
    minHeight: 800,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      webSecurity: false,
      sandbox: false,
      preload: path.join(__dirname, './preload.mjs')
    }
  })
  if (!isPackaged) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile('dist/index.html')
  }
}

async function createSettingWindow() {
  settingWin = new BrowserWindow({
    parent: win,
    title: '设置',
    minWidth: 600,
    minHeight: 600,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, './preload.mjs')
    }
  })
  if (!isPackaged) {
    settingWin.loadURL('http://localhost:5173/setting.html')
    settingWin.webContents.openDevTools()
  } else {
    settingWin.loadFile('dist/setting.html')
  }
  return settingWin
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  //创建主窗口
  createWindow()
})

app.on('activate', () => {
  // 在 macOS 系统内, 如果没有已开启的应用窗口
  // 点击托盘图标时通常会重新创建一个新窗口
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('version', async () => {
  return result(app.getVersion())
})
ipcMain.handle('appName', async () => {
  return result(app.getAppName())
})
ipcMain.handle('appPath', async () => {
  return result(app.getAppPath())
})
ipcMain.handle('md5', (_event, beforeHashString) => {
  return md5(beforeHashString)
})
ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  })
  if (!canceled) {
    return result(filePaths[0])
  }
  return result('')
})
ipcMain.handle('app:open-setting', async () => {
  await createSettingWindow()
  win.setEnabled(false)
  settingWin.on('close', () => {
    win.setEnabled(true)
  })
})
ipcMain.handle('load-ini', () => {
  return parseIni(path.join(javSPPath, './config.ini'))
})
ipcMain.handle('save-ini', (_event, data) => {
  return saveIni(path.join(javSPPath, './config.ini'), JSON.parse(data))
})
ipcMain.handle('load-library-data', () => {
  return loadLibraryData()
})
ipcMain.handle('save-library-data', (_event, dataString) => {
  return saveLibraryData(dataString)
})
ipcMain.handle('exec:scan', (_event, p) => {
  const result = scan(p, JAV_EXEC)
  console.log(result)
  return result
})
ipcMain.handle('exec:scrape', (_event, data) => {
  return scrape(data, JAV_EXEC)
})
ipcMain.handle('load-nfo-data', (_event, nfoFile) => {
  return loadNfo(nfoFile)
})
ipcMain.handle('edit-library-path', () => {
  return win.webContents.send('edit-library-finish', '')
})
