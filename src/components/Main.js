require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/main.scss');

import React from 'react';

// 获取图片相关的数据 直接使用 loader
// var imageDatas = require('../sources/imageDatas.json');
let imageDatas = require('json!../sources/imageDatas.json');

// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function getImageURL(imageDatasArr) {
    for (var i = 0; i < imageDatasArr.length; i++) {
        var singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
})(imageDatas);

class ImgFigure extends React.Component {
    render() {
        return (
            <figure>
                <img src={this.props.data.imageURL}
                    alt={this.props.data.title}
                />
                <figcaption>
                    <h2>{this.props.data.title}</h2>
                </figcaption>
            </figure>
        );
    }
}

class AppComponent extends React.Component {
    render() {
        var controllerUnits = [];
        var imgFigures = [];

        imageDatas.forEach(function(value, index) {
            imgFigures.push(<ImgFigure data={value} />);
        }.bind(this));

        return (
            <section className="stage">
                 <section className="img-sec">
                    {imgFigures}
                 </section>
                 <nav className="controller-nav">
                    {controllerUnits}
                 </nav>
             </section>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
