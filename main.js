
const {ipcMain,app,BrowserWindow} = require('electron');
const path = require('path');
var fs = require('fs');
let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({width: 800, height: 600,minHeight:300,minWidth:400,webPreferences: {
    nodeIntegration: true
  }});
  mainWindow.loadURL(require('url').format({
    pathname: path.join(__dirname, 'static/index.html'),
    protocol: 'file:',
    slashes: true
  }));
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

ipcMain.on('requestHandler', (event, data) => {

  if (data.type === 'addAccount'){
    fs.readFile('accounts.json', (err, value) => {  
      if (err) throw err;
      let accounts = JSON.parse(value);
      accounts[0][data.email] =  {"password":data.password}
      fs.writeFileSync('accounts.json', JSON.stringify(accounts)); 
    }); 
  }
  if (data.type === 'deleteAccount'){
    fs.readFile('accounts.json', (err, value) => {  
      if (err) throw err;
      let accounts = JSON.parse(value);
      delete accounts[0][data.email];
      fs.writeFileSync('accounts.json', JSON.stringify(accounts));
    });
  }
});