const { src, dest, series } = require('gulp')
const execa = require('execa')
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const Koa = require('koa')
const proxy = require('koa-proxies')
const del = require('del')
const distPath = path.resolve(process.cwd(), 'dist')
const packagesDir = path.resolve(__dirname, './packages/@fengleaf')
const files = fs.readdirSync(packagesDir)
const ignorePackages = ['qiankun']

function execaShell (command, cwd) {
  return execa.command(command, {
    stdout: 'inherit',
    cwd
  })
}

const start = function () {
  const promises = []
  for (const app of files) {
    if (ignorePackages.includes(app)) continue
    const packagePath = path.resolve(packagesDir, app)
    promises.push(execaShell(`npm run serve`, packagePath))
  }
  return Promise.all(promises)
}

const clear = function () {
  return del([distPath])
}

const build = async function () {
  for (const app of files) {
    if (ignorePackages.includes(app)) continue
    const packagePath = path.resolve(packagesDir, app)
    await execaShell(`npm run build`, packagePath)
    src(`${path.join(packagePath, 'dist')}/**`).pipe(dest(path.join(process.cwd(), app === 'main' ? `dist` : `dist/${app}`)))
  }
}

const prodTest = async function () {
  const app = new Koa()
  app.use(require('koa-static')(distPath))
  app.use(proxy('/finance-common', {
    target: 'http://172.16.6.213',
    logs: true
  }))
  app.listen(8080)
  console.log('app listen at http://localhost:8080')
}

const genLogger = function (word) {
  return async function logger () {
    return console.log(`${chalk.green(word)}`)
  }
}

exports.start = start

exports.release = series(clear, build)

exports.releaseTest = prodTest
