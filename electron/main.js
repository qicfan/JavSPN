import { app, BrowserWindow, Menu } from 'electron'

const isPackaged = app.isPackaged

Menu.setApplicationMenu(null)
console.log(process.platform)
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        minWidth: 800,
        minHeight: 800

    })
    if (!isPackaged) {
        mainWindow.webContents.openDevTools()
    }
    // mainWindow.loadFile("electron/index.html")
    mainWindow.loadURL("http://localhost:5173")
}

app.whenReady().then(() => {
    createWindow()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})