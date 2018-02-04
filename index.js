const { app, BrowserWindow } = require('electron');
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 800,
    icon: './res/icon_192.png'
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');
});

app.on('browser-window-created',function(e,window) {
  window.setMenu(null);
});
