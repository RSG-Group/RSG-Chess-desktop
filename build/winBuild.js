// C:\Users\sdkca\Desktop\electron-workspace\build.js
var electronInstaller = require('electron-winstaller');

// In this case, we can use relative paths
var settings = {
    appDirectory: './dist/RSGChess-win32-x64',
    outputDirectory: './dist/RSGChess-installers',
    authors: 'RSG Group',
    exe: 'RSGChess.exe',
    icon: __dirname + '/icon.ico',
    setupIcon: __dirname + '/icon.ico'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);
 
resultPromise.then(() => {
    console.log("The installers of your application were succesfully created !");
}, (e) => {
    console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});