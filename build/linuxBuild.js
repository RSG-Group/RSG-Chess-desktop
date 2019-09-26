const { debian, redhat, flatpak, snap } = require('electron-installer-linux')

console.log('If you are generating a flatpak installer, please install flatpak and flatpak-builder.')
console.log('If you are generating a .rpm installer, please install rpm or rpm-build depending on your distro.')
console.log('If you are generating a .deb installer, please install fakeroot and dpkg.')
console.log('If you are generating a snap installer, please install snapd and snapcraft (via snap).')

let arch = process.arch
if (process.arch === 'x64') arch = 'amd64'
if (process.arch === 'x86') arch = 'i386'
if (process.arch === 'ia32') arch = 'i386'

const options = {
  src: `./dist/RSGChess-linux-${process.arch}`,
  dest: './dist/installers',
  arch,
  categories: ['Utility'],
  icon: {
    '16x16': 'build/icons/16x16.png',
    '32x32': 'build/icons/32x32.png',
    '64x64': 'build/icons/64x64.png',
    '128x128': 'build/icons/128x128.png'
  }
}
const flatpakOptions = {
  id: 'RSG-Chess-desktop',
  arch, icon: options.icon, categories: options.categories, dest: options.dest, src: options.src
}
const snapOptions = {
  confinement: 'classic', grade: 'stable', description: `RSG Chess stuff.`,
  arch, icon: options.icon, categories: options.categories, dest: options.dest, src: options.src
}

const callback = () => console.log(`Successfully created package at ${options.dest}`)
const errCallback = (err) => console.error(err, err.stack)
const args = process.argv

if (args.includes('--build') && (
  args.includes('redhat') || args.includes('debian') ||
  args.includes('snap') || args.includes('flatpak')
)) {
  process.argv.forEach((arg) => {
    if (arg === 'debian') debian(options).then(callback).catch(errCallback)
    else if (arg === 'redhat') redhat(options).then(callback).catch(errCallback)
    else if (arg === 'flatpak') flatpak(flatpakOptions).then(callback).catch(errCallback)
    else if (arg === 'snap') snap(snapOptions).then(callback).catch(errCallback)
  })
} else {
  console.log('No arguments given, generating .deb, .rpm, snap and .flatpak.')
  debian(options).then(callback).catch(errCallback)
  redhat(options).then(callback).catch(errCallback)
  snap(snapOptions).then(callback).catch(errCallback)
  flatpak(flatpakOptions).then(callback).catch(errCallback)
}
