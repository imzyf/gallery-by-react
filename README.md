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

安装脚手架 generator-react-webpack [Yeoman generator for ReactJS and Webpack](https://github.com/react-webpack-generators/generator-react-webpack)
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
npm run start
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
|---cfg  这里存放 webpack 配置
| |---base.js  webpack 基础配置
| |---defaults.js  webpack 一些其他的默认配置
| |---dev.js       测试环境的 webpack 配置，启动 npm run start 的时候会使用这份 webpack 设置。
| |---dist.js      线上环境的 webpack 配置，启动 npm run dist 的时候会使用。
| |---test.js      做单元测试的时候使用 npm run test。
|---dist           webpack 存放最终打包输出的用于生产环境的项目文件
|---src                       # 存放开发环境项目源码
| |---/actions/               # flux actions目录（没用到）
| |---/components/            # 组件目录
| |---/config/                # 配置目录（没用到）
| |---/sources/               # flux datasources目录（没用到）
| |---/stores/                # flux stores(没用到)
| |---/styles/                # 样式文件目录，内有一个App.css基础css文件
| |---index.html              # 项目入口文件
| |---index.js                # js入口文件
|---/test/                    # 单元测试和集成测试目录
|---.babelrc                  # Babel 配置文件
|---.editorconfig             # EditorConfig 插件配置文件，用于统一编码风格。
|---.eslintrc                 # ESLint代码风格检测配置文件
|---.gitignore                # 需要 git 同步时忽略文件夹的配置文件
|---.yo-rc.json               # yeoman的配置文件
|---karma.conf.js             # karma测试框架的配置
|---package.json              # npm 的依赖配置项
|---server.js                 # 项目运行的js文件，命令可查看package.json中的script
|---webpack.config.js         # webpack配置文件，不同环境的配置项在cfg目录下
```

## 舞台构建
安装 [postcss/autoprefixer: Parse CSS and add vendor prefixes to rules by Can I Use](https://github.com/postcss/autoprefixer)

> 待确认是否需要：autoprefixer

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

VCD 原则：View Controller Data。

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

json 中获取图片路径 ES6：
``` javascript
import imageJsonDatas from 'json!../data/imageDatas.json';

const imageDatas = imageJsonDatas.map((image) => {
    image.imageUrl = require('../images/' + image.fileName);
    return image;
});
```

## 图片组件构建
``` javascript
class ImgFigure extends React.Component {
    render() {
        return (
            <figure className="img-figure">
                <img src={this.props.data.imageUrl}
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

### 设置图片位置
- scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。
- clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。
- offsetWidth：对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变。

通过 `this.Constant` 初始化图片区域范围，在 `componentDidMount` 计算设置数值。

通过 `rearrange(centerIndex){}` 给每一个图片设置位置值。

### 设置图片旋转
设置图片旋转角度，思路和设置图片位置一样：
```javascript
topImgs[index] = {
    pos: {
        top: getRangeRandom(topSection.y[0], topSection.y[1]),
        left: getRangeRandom(topSection.x[0], topSection.x[1])
    },
    rotate: get30DegRandom()
}
```
设置角度样式，兼容游览器：
```javascript
if (rotate) {
    (['MozTransform', 'msTransform', 'Webkittransform', 'transform']).forEach((value) => {
        styleObj[value] = 'rotate(' + rotate + 'deg)'
    })
}
```

### 设置图片正反翻转、居中
设置修改 state.isInverse 的方法：
```javascript
inverse(index) {
    let {imgsArrangeArr} = this.state;
    imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
    this.setState({
        imgsArrangeArr
    })
}
```

```javascript
let imgFigureClassName = 'img-figure';
imgFigureClassName += isInverse ? ' is-inverse' : '';
```

视图中 `onClick` 方法：
```javascript
<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
</figure>
```

处理点击方法：
```javascript
handleClick(e) {

    let {isCenter} = this.props.arrange;
    if (isCenter) {
        this.props.inverse()
    } else {
        this.props.center()
    }

    e.stopPropagation();
    e.preventDefault();
}
```

### 设置过渡动画
补间动画：
```css
transition: transform .6s ease-in-out,left .6s ease-in-out, top .6s ease-in-out;
```

更自然的图片翻转，翻转时转轴同时移动：
```css
transform-origin: 0 50% 0; /* 50% 50% 0 */
    
    transform: translate(0) rotateY(180deg);
```

增强透视，父节点添加：
```css
perspective: 1800px;
```

## 控制组件
```javascript
render() {
    return(
        <span className="controller-unit" onClick={(e)=>this.handleClick(e)}></span>
    );
}
```

### 使用 Iconfont 添加箭头
[Iconfont-阿里巴巴矢量图标库](http://www.iconfont.cn/)

- Iconfont 的体积更小。
- Iconfont 是矢量图，拉伸不变形，颜色可自行更换，支持 CSS3 对字体的修饰效果。

```css
@font-face {
    font-family: 'icons-turn-arrow';
    src: url('../fonts/icons/turn-arrow.eot') format('enbedded'),
    url('../fonts/icons/turn-arrow.woff') format('woff'),
    url('../fonts/icons/turn-arrow.ttf') format('truetype'),
    url('../fonts/icons/turn-arrow.svg') format('svg');
}
```

修改 `cfg/defaults.js`:
```js
test: /\.(png|jpg|gif|woff|woff2)$/,

改为：
test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
```

> Reference:
> - [React 实战 —— 打造画廊应用](http://www.imooc.com/video/11739)
> - [ckinmind/gallery-by-react](https://github.com/ckinmind/gallery-by-react)
