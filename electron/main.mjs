import { app, BrowserWindow, BrowserView, Menu, ipcMain, dialog } from 'electron'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import ini from 'ini'
import crypto from 'node:crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const version = app.getVersion()
const appName = app.getName()

const isPackaged = app.isPackaged
const appPath = isPackaged ? process.cwd() : app.getAppPath()
const javSPPath = path.join(appPath, './resources/JavSP')
let win
let settingWin
if (process.platform !== 'darwin') {
  Menu.setApplicationMenu(null)
}

async function getVersion() {
  return version
}

async function getAppName() {
  return appName
}

async function getAppPath() {
  return appPath
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  })
  if (!canceled) {
    return filePaths[0]
  }
  return ''
}

// 读取配置文件
async function loadIni() {
  const iniFile = path.join(javSPPath, './config.ini')
  const config = ini.parse(fs.readFileSync(iniFile, 'utf-8'))
  win.webContents.send('load-ini-finish', config)
}

// 读取媒体库数据
async function loadLibraryData() {
  const data = []
  const dataCacheFile = path.join(appPath, './data.json')
  if (!fs.existsSync(dataCacheFile)) {
    win.webContents.send('load-library-finish', data)
    return
  }
  fs.readFile(dataCacheFile, { encoding: 'utf-8' }, (err, d) => {
    if (err) console.log('read data-cache-file error:', err)
    const jsonData = JSON.parse(d)
    for (let idx in jsonData) {
      data.push(jsonData[idx])
    }
    win.webContents.send('load-library-finish', data)
  })
}

function scan(libraryPath) {
  const javSP = path.join(javSPPath, './JavSP.exe')
  const dataCacheFile = path.join(appPath, './tmp.json')
  const command = `${javSP} -i=${libraryPath} --only-scan --data-cache-file=${dataCacheFile}`
  exec(command, () => {
    // 读取缓存文件
    fs.readFile(dataCacheFile, { encoding: 'utf-8' }, (err, data) => {
      if (!data) return
      return win.webContents.send('scan-finish', JSON.parse(data))
    })
  })
}

/**
 * 将movieData格式化成Json字符串后写入临时文件
 * @param {any[]} data
 */
function scrape(jsonString) {
  const javSP = path.join(javSPPath, './JavSP.exe')
  const dataCacheFile = path.join(appPath, './tmp.json')
  fs.writeFileSync(dataCacheFile, jsonString, { encoding: 'utf-8' })
  const command = `${javSP} -i=${appPath} --only-fetch --data-cache-file=${dataCacheFile}`
  fs.writeFileSync(path.join(appPath, './tmp.txt'), command, { encoding: 'utf-8' })
  exec(command, () => {
    // 读取缓存文件
    fs.readFile(dataCacheFile, { encoding: 'utf-8' }, (err, data) => {
      let jsonStr = ''
      if (data) jsonStr = data
      return win.webContents.send('scrape-finish', jsonStr)
    })
  })
}

/**
 * 保存数据文件
 * @param {any[]} dataItems
 */
function saveLibraryData(jsonString) {
  const dataCacheFile = path.join(appPath, './data.json')
  return fs.writeFile(dataCacheFile, jsonString, { encoding: 'utf-8' })
}

async function md5(str) {
  const hash = crypto.createHash('md5').update(str).digest('hex')
  return hash
}

async function createWindow() {
  win = new BrowserWindow({
    title: appName + ' ' + version,
    minWidth: 800,
    minHeight: 800,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
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
    settingWin.loadURL('http://localhost:5173#/setting')
    settingWin.webContents.openDevTools()
  } else {
    settingWin.loadFile('dist/index.html#/setting')
  }
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  ipcMain.handle('version', getVersion)
  ipcMain.handle('appName', getAppName)
  ipcMain.handle('appPath', getAppPath)
  ipcMain.handle('md5', (_event, ...args) => {
    return md5(...args)
  })
  ipcMain.handle('dialog:openDirectory', handleFileOpen)
  ipcMain.handle('exec:scan', async (_event, ...args) => {
    return scan(...args)
  })
  ipcMain.handle('load-ini', async () => {
    return loadIni()
  })
  ipcMain.handle('load-library-data', async () => {
    return loadLibraryData()
  })
  ipcMain.handle('exec:scrape', async (_event, ...args) => {
    return scrape(...args)
  })
  ipcMain.handle('save-library-data', async (_event, ...args) => {
    return saveLibraryData(...args)
  })
  ipcMain.handle('app:open-setting', async () => {
    await createSettingWindow()
    win.setEnabled(false)
    settingWin.on('close', () => {
      win.setEnabled(true)
    })
  })

  createWindow()

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
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
