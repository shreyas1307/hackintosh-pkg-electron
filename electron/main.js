const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { channels } = require('../src/shared/constants')
const path = require('path');
const url = require('url');

let mainWindow;
function createWindow() {
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true,
    });
    Menu.setApplicationMenu(null)
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 1200, height: 900,
        minWidth: 1200, minHeight: 900, maxWidth: 1200, maxHeight: 900, webPreferences: { preload: path.join(__dirname, 'preload.js'), devTools: false, webSecurity: true },
    });
    mainWindow.webContents.openDevTools()
    // mainWindow.removeMenu()
    mainWindow.loadURL(startUrl);
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on(channels.APP_INFO, (event) => {
    event.sender.send(channels.APP_INFO, {
        appName: app.getName(),
        appVersion: app.getVersion()
    });
});

