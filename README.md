

## 项目结构
```
my-lerna-repo/
    ┣━ packages/ 
    ┃     ┣━ main/ 微应用主项目
    ┃     ┃      ┣━ ...
    ┃     ┃      ┗━ package.json
    ┃     ┣━ package-1/ 微应用子项目
    ┃     ┃      ┣━ ...
    ┃     ┃      ┗━ package.json
    ┃     ┗━ package-2/
    ┃            ┣━ ...
    ┃            ┗━ package.json
    ┣━ ...
    ┣━ lerna.json
    ┗━ package.json

```

##项目开发流程

### 安装依赖
首先全局安装 lerna
```
sudo npm install -g lerna
```
执行`npm install`

其次安装所有packages的依赖
```
lerna bootstrap
```

### 开发服务器
```
npm run serve
```

### 构建生产版本
```
npm run build
```

### 本地部署生产环境
先执行
```
npm run build
```
在执行
```
npm run depoly:test
```
