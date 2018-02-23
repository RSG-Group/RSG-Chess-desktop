const { app, BrowserWindow, Menu } = require('electron');
let mainWindow;

const menuTemplate = [
  {
    label: 'Tools',
    submenu: [
      { label: 'New game (choose to select mode)' },
      { label: 'Rotate (or restore) the black pieces' }
    ]
  },
  {
    role: 'about',
    label: 'About',
    submenu: [
      { label: 'License' },
      { label: 'Source code' },
      { label: 'Report a problem' }
    ]
  },
  {
    role: 'help',
    submenu: [
      { label: 'Learn More' },
      { label: 'Learn playing chess' }
    ]
  }
]

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 800,
    icon: './res/icon_192.png'
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');
});

app.on('browser-window-created',function(e,window) {
  const menu = Menu.buildFromTemplate(menuTemplate);
  window.setMenu(menu);
});
