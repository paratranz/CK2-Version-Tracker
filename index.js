const path = require('path')
const {execSync} = require('child_process')
const fs = require('fs-extra')
const gameFolder = fs.readFileSync('./game.folder.txt').toString()

if (!gameFolder) {
  console.error('No game folder provided')
  process.exit(1)
}

const version = fs.readFileSync(path.join(__dirname, 'version.txt'))
const diffDir = path.join(__dirname, 'diff')

const filelist = fs.readFileSync(path.join(__dirname, 'filelist.txt')).toString().split(/\r?\n/).filter(line => line && line.trim())

for (const item of filelist) {
  fs.copySync(path.join(gameFolder, item), path.join(__dirname, item))
  console.log(item, 'copied')
}

fs.removeSync(path.join(__dirname, 'diff'))

execSync(`git add .`)
execSync(`git commit -am ${version}`)

const changedFiles = execSync('git diff --name-only HEAD~1').toString()
  .split(/\r?\n/).filter(file => /\//.test(file))

fs.removeSync(diffDir)

for (const file of changedFiles) {
  if (!file || !fs.existsSync(file)) {
    continue
  }
  if (!/\.(txt|csv)$/.test(file) || /diff/.test(file) || !/\//.test(file)) {
    continue
  }
  fs.outputFileSync(path.join(diffDir, file), fs.readFileSync(file))
  console.log(file, 'copied')
}

execSync(`git add .`)
execSync(`git commit -a -m "diff ${version}"`)