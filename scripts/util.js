const execa = require('execa')
const fs = require('fs')
const path = require('path')
const packagesDir = path.resolve(__dirname, '../packages/@fee-management')
const files = fs.readdirSync(packagesDir)

function execaShell (command, cwd) {
  return execa.command(command, {
    stdout: 'inherit',
    cwd
  })
}

function script (script) {
  for (const micTask of files) {
    const packagePath = path.resolve(packagesDir, micTask)
    execaShell(`npm run ${script}`, packagePath)
  }
}

exports.execaShell = execaShell

exports.serve = function () {
  script('serve')
}

exports.build = function () {
  script('build')
}
