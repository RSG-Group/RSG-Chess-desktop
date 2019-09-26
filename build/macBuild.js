// Import sir DMG.
// eslint-disable-next-line import/no-extraneous-dependencies
const createDMG = require('electron-installer-dmg')

createDMG({
  appPath: '../dist/Decaffeinater-darwin-x64/Decaffeinater.app',
  name: 'Decaffeinater',
  out: '../dist',
  overwrite: true,
  icon: './icon.icns'
}, err => console.log(`No dice: ${err}`)) // eslint-disable-line no-console
