const path = require('path')
const {execSync} = require('child_process')
const fs = require('fs-extra')
const defaultDir = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Crusader Kings II'

const version = process.argv[2]
const gameDir = process.argv[3] || defaultDir

if (!/^[.\d]+$/.test(version)) {
  console.error('Please specify a valid version, eg. 2.8.3.2')
  process.exit(1)
}

const filelist = fs.readFileSync(path.join(__dirname, 'filelist.txt')).toString().split(/\r?\n/).filter(line => line && line.trim())

for (const item of filelist) {
  fs.copySync(path.join(gameDir, item), path.join(__dirname, item))
  console.log(item, 'copied')
}

execSync(`git add .`)
execSync(`git commit -am ${version}`)
