const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
var fs = require('fs')
let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL(require('url').format({
    pathname: path.join(__dirname, 'static/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', ()=>{
    createWindow();

    if (!fs.existsSync('./accounts.json')) {
        fs.writeFile('accounts.json','[{}]', function (err) {
            if (err) throw err;
        });
    } 
})
app.on('window-all-closed', () => {
    app.quit()
  
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})