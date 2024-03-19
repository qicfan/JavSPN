import {app, BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isPackaged = app.isPackaged
let win

const createWindow = async () => {
    const win = new BrowserWindow({
        minWidth: 800,
        minHeight: 800,
        webPreferences: {
          webSecurity: false,
          nodeIntegration: true,
          preload: path.join(__dirname, './preload.mjs')
        }
    })
    if (!isPackaged) {
      win.webContents.openDevTools()
      win.loadURL("http://localhost:5173")
        // win.loadFile('dist/index.html')
    } else {
      win.loadFile('dist/index.html')
    }
}


// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
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
