const execa = require('execa')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const Koa = require('koa')
const del = require('del')
const distPath = path.resolve(process.cwd(), 'dist')
const packagesDir = path.resolve(__dirname, '../packages/@fengleaf')
const files = fs.readdirSync(packagesDir)
const ignorePackages = ['qiankun']

function execaShell (command, cwd) {
  return execa.command(command, {
    stdout: 'inherit',
    cwd
  })
}

exports.serve = function () {
  for (const app of files) {
    if (ignorePackages.includes(app)) continue
    const packagePath = path.resolve(packagesDir, app)
    execaShell(`npm run serve`, packagePath)
  }
}

exports.build = async function () {
  await del([distPath])
  for (const app of files) {
    if (ignorePackages.includes(app)) continue
    const packagePath = path.resolve(packagesDir, app)
    await execaShell(`npm run build`, packagePath)
    if (app === 'main') {
      fse.copySync(path.join(packagePath, 'dist'), path.join(process.cwd(), `dist`))
    } else {
      fse.copySync(path.join(packagePath, 'dist'), path.join(process.cwd(), `dist/${app}`))
    }
  }
}

exports.productionTest = async function () {
  const app = new Koa()
  app.use(require('koa-static')(distPath))
  app.listen(8080)
  console.log('app listen at http://localhost:8080')
}

exports.execaShell = execaShell
