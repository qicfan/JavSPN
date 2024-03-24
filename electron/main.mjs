import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import crypto from 'node:crypto'
import xml2json from 'xml2json'

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

function parseIni(iniString) {
  const lines = iniString.split('\r\n')
  const ini = {}
  let dictName = ''
  for (const idx in lines) {
    const line = lines[idx]
    // 注释，跳过
    if (line == '') continue
    if (line.startsWith('#')) continue
    if (line.startsWith('[')) {
      // 一个小节，对应一个字典
      dictName = line.replace('[', '').replace(']', '').trim()
      ini[dictName] = {}
      continue
    }
    // 用等号分割
    const tmpStr = line.split('=')
    const key = tmpStr[0].trim()
    const value = tmpStr[1].trim()
    ini[dictName][key] = value
  }
  return ini
}

function dumpIni(iniObject) {
  const lines = []
  for (const dictName in iniObject) {
    lines.push(`[${dictName}]`)
    for (const key in iniObject[dictName]) {
      const value = iniObject[dictName][key]
      lines.push(`${key} = ${value}`)
    }
  }
  return lines.join('\r\n')
}

// 读取配置文件
function loadIni() {
  const iniFile = path.join(javSPPath, './config.ini')
  let iniData = fs.readFileSync(iniFile, 'utf-8')
  const config = parseIni(iniData)
  return new Promise((rs) => {
    rs(config)
  })
}

function saveIni(data) {
  const iniFile = path.join(javSPPath, './config.ini')
  const iniData = dumpIni(JSON.parse(data))
  fs.writeFileSync(iniFile, iniData, 'utf-8')
  return new Promise((rs) => {
    rs(true)
  })
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

function checkFile(filename, suffix, name) {
  const baseName = path.basename(filename, path.extname(filename))
  const baseDir = path.dirname(filename)
  const aName = path.join(baseDir, baseName) + suffix
  const bName = path.join(baseDir, name)
  const aE = fs.existsSync(aName)
  const bE = fs.existsSync(bName)
  if (aE) return aName
  if (bE) return bName
  return ''
}

function scan(libraryPath) {
  const javSP = path.join(javSPPath, './JavSP.exe')
  const dataCacheFile = path.join(appPath, './tmp.json')
  const command = `${javSP} -i=${libraryPath} --only-scan --data-cache-file=${dataCacheFile}`
  exec(command, () => {
    // 读取缓存文件
    fs.readFile(dataCacheFile, { encoding: 'utf-8' }, (err, data) => {
      if (!data) return
      const movies = JSON.parse(data)
      // 识别是否有Nfo，poster，fanart
      const l = movies.length
      for (let i = 0; i < l; i++) {
        const file = movies[i].files[0]
        movies[i].nfo_file = checkFile(file, '.nfo', 'movie.nfo')
        movies[i].poster_file = checkFile(file, '-poster.jpg', 'poster.jpg')
        movies[i].fanart_file = checkFile(file, '-fanart.jpg', 'fanart.jpg')
      }
      return win.webContents.send('scan-finish', movies)
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
async function saveLibraryData(jsonString) {
  const dataCacheFile = path.join(appPath, './data.json')
  fs.writeFileSync(dataCacheFile, jsonString, { encoding: 'utf-8' })
  return true
}

async function md5(str) {
  const hash = crypto.createHash('md5').update(str).digest('hex')
  return hash
}

function laodNfo(p) {
  const nfoData = fs.readFileSync(p, { encoding: 'utf-8' })
  const data = xml2json.toJson(nfoData)
  return new Promise((rs) => {
    rs(data)
  })
}

function editLibraryPath() {
  return new Promise((rs) => {
    win.webContents.send('edit-library-finish', '')
    return rs(true)
  })
}

async function createWindow() {
  win = new BrowserWindow({
    title: appName + ' ' + version,
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
  ipcMain.handle('load-ini', () => {
    return loadIni()
  })
  ipcMain.handle('save-ini', (_event, ...args) => {
    return saveIni(...args)
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
  ipcMain.handle('load-nfo-data', (_event, ...args) => {
    return laodNfo(...args)
  })
  ipcMain.handle('edit-library-path', async () => {
    return editLibraryPath()
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
