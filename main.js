
const {ipcMain,app,BrowserWindow} = require('electron');
const path = require('path');
const fetch = require("node-fetch");
const fs = require('fs');
const funct = require('./functions')
let mainWindow = null


//flask and electron 
const PY_DIST_FOLDER = 'apidist'
const PY_FOLDER = 'api'
const PY_MODULE = 'futApi' // without .py suffix

let apiProc = null
let apiPort = null

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER)
  return require('fs').existsSync(fullPath)
}

const getScriptPath = () => {
  if (!guessPackaged()) {
    return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
  }
  if (process.platform === 'win32') {
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
  }
  return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
}

const selectPort = () => {
  apiPort = 5000
  return apiPort
}

const createPyProc = () => {
  let script = getScriptPath()
  let port = '' + selectPort()

  if (guessPackaged()) {
    apiProc = require('child_process').execFile(script, [port])
  } else {
    apiProc = require('child_process').spawn('python', [script, port])
  }
 
  if (apiProc != null) {
    //console.log(pyProc)
    console.log('child process success on port ' + port)
  }
}

const exitPyProc = () => {
  apiProc.kill()
  apiProc = null
  apiPort = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)



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

// electron part
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
      accounts[0][data.email] =  {"password":data.password,"token":"","cookies":""}
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
  if(data.type === 'login'){
    fetch(`http://127.0.0.1:5000/login?email=${data.email}&password=${data.password}&cookies=${data.cookies}&token=${data.token}`)
      .then(res => res.json())
      .then(data => console.log(data));
  }
  if(data.type === 'startBuy'){
    console.log(data.email);
  }
});

