const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require("url");

let win = null;

function createWindow() {
    // create new window
    win = new BrowserWindow({
        height: 600,
        width: 800
    });

    // load file
    win.loadURL(
        url.format({
            pathname: path.join(__dirname + 'dist/index.htnl'),
            protocol: 'file:',
            slashes: true
        })
    );

    win.on('closed', () => {

        // clear from memory
        win = null;
    })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows
app.on('ready', createWindow());

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})