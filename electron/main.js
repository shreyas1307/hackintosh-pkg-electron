const { app, BrowserWindow, ipcMain } = require('electron');
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

    mainWindow = new BrowserWindow({
        width: 1100, height: 900, webPreferences: { preload: path.join(__dirname, 'preload.js'), devTools: false, webSecurity: true },
    });
    mainWindow.webContents.openDevTools()
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

