const {app, BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const url = require('url')
const path = require('path')

function CreateMainWindow(){
    const mainWindow = new BrowserWindow({
        title: "Pomodoro", 
        width: 400, 
        height: 410,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, "preload.js"), // Path to preload script
            contextIsolation: true,   // Keeps context isolated for security
            nodeIntegration: false,   // Disables Node.js in the renderer (security best practice)
        },
    });

    const startUrl = url.format({
        pathname: path.join(__dirname, "../build/index.html"), // connect to react app
        protocol: "file"
    });

    // make some UI disappear for the *aesthetic*
    mainWindow.setWindowButtonVisibility(false);
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL(startUrl); // load app in electron window

    ipcMain.on('close-app', () => {
        app.quit();
    });

}

app.whenReady().then(() => {
    app.setIcon('../src/assets/seal.icns');
})
app.whenReady().then(CreateMainWindow)