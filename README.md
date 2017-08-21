# React 画廊应用
## 项目搭建
### 生成项目
安装 yeoman [The web's scaffolding tool for modern webapps | Yeoman](http://yeoman.io/)
``` bash
npm install -g yo
```

查看 yeoman 版本
``` bash
yo --version
```

安装 generator-react-webpack [Yeoman generator for ReactJS and Webpack](https://github.com/react-webpack-generators/generator-react-webpack)
``` bash
npm install -g generator-react-webpack
```

查看 generator 版本
``` bash
npm ls -g --depth=1 2>/dev/null | grep generator-
```
- `npm ls -g`：列出全局安装的所有npm包
- `--depth=1`：树状结构最多向下展示一层
- `2>/dev/null`：如果执行 `npm ls -g` 的过程中，有错误消息，把错误消息重定向到我们的空设备文件上
- `>`：重定向
 - `1` 表示 standard out 标准输出
 - `2` 表示 standard error 标准错误
 - `/dev/null` 表示空设备文件
- `|`：通道，用来将上一个命令的输出内容作为下一个命令的输入内容
- `grep generator-`：在前面的输出结果中，检索 generator 开头的关键字内容

生成项目
``` bash
yo react-webpack gallery-by-react
```

启动服务，根据 `package.json` 中的 `scripts` 可以看出。
``` bash
npm start
```

<!-- more -->

我这里发生了一个报错：
``` bash
ERROR in ./src/components/Main.js
Module not found: Error: Cannot resolve module 'sass-loader' in ...
```

解决方法：
``` bash
npm install node-sass --save-dev
npm install sass-loader --save-dev
```

还遇到一个问题：
如果页面空白，可以尝试 `ctrl + f5`。

Generating new stateless functional components
``` bash
yo react-webpack:component my/namespaced/components/name --stateless
```

### Webpack
[webpack](https://webpack.js.org/) is a module bundler.

关于 `generator-react-webpack` 目录结构大变样，已经是只需要 `webpack` 就能启动项目，其目录：
``` bash
|---.babelrc  ES6 配置文件
|---.editorconfig  EditorConfig 插件配置文件，用于统一编码风格。
|---.eslintrc  ESLint 配置文件
|---.gitignore  需要 git 同步时忽略文件夹的配置文件
|---.yo-rc.json  未知
|---cfg  这里存放 webpack 配置
| |---base.js  webpack 基础配置
| |---defaults.js  webpack 一些其他的默认配置
| |---dev.js  测试环境的 webpack 配置，启动 npm run start 的时候会使用这份 webpack 设置。
| |---dist.js  线上环境的 webpack 配置，启 动npm run dist 的时候会使用。
| |---test.js  做单元测试的时候使用，npm run test
|---dist  webpack 输出目录
| |---README.md
| |---static
| | |---favicon.ico
| | |---README.md
|---karma.conf.js  单元测试配置文件
|---npm-debug.log  日志文件
|---package.json  重要！包结构配置文件，并且存放了启动脚本，npm script
|---server.js  node 服务器，用于本地启动这个项目，正是这个脚本启动了 webpack 编译。
|---src  源代码目录
|---test  单元测试目录
|---webpack.config.js  重要，webpack 配置文件入口
```

## 舞台与图片组件构建
### 舞台构建
安装 [postcss/autoprefixer: Parse CSS and add vendor prefixes to rules by Can I Use](https://github.com/postcss/autoprefixer)
``` bash
npm install autoprefixer-loader --save-dev
```

修改 `cfg/defaults.js` 将：
``` javascript
{
	test: /\.scss/,
	loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
},
```
改为：
``` javascript
{
	test: /\.scss/,
	loader: 'style-loader!css-loader!autoprefixer-loader?{browser:["last 2 version"]}!sass-loader?outputStyle=expanded'
},
```

VCD 原则：view controller data

创建 `src/sources/imageDatas.json`
``` json
[
  {
    "fileName": "1.jpg",
    "title": "Heaven of time",
    "desc": "Here he comes Here comes Speed Racer."
  },
  {
    "fileName": "2.jpg",
    "title": "Heaven of time",
    "desc": "Here he comes Here comes Speed Racer."
  },
]
```

安装 [webpack-contrib/json-loader: json loader module for webpack](https://github.com/webpack-contrib/json-loader)：
``` bash
npm install --save-dev json-loader
```

json 中获取图片路径
``` javascript
// 获取图片相关的数据 直接使用 loader
let imageDatas = require('json!../sources/imageDatas.json');

function getImageURL(imageDatasArr) {
    for (var i = 0; i < imageDatasArr.length; i++) {
        var singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
}
imageDatas = getImageURL(imageDatas);

// 可以修改为:
// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function getImageURL(imageDatasArr) {
    for (var i = 0; i < imageDatasArr.length; i++) {
        var singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
})(imageDatas);
```

### 图片组件构建
``` javascript
class ImgFigure extends React.Component {
    render() {
        return (
            <figure className="img-figure">
                <img src={this.props.data.imageURL}
                    alt={this.props.data.title}
                />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
        );
    }
}
```




> Reference:
> - [react实践介绍-慕课网](http://www.imooc.com/video/11739)
