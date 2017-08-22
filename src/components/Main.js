import 'normalize.css/normalize.css';
import 'styles/main.scss';

import React, {Component} from 'react';

// 获取图片相关的数据 直接使用 loader
import imageJsonDatas from 'json!../data/imageDatas.json';
/* 获取图片相关json数据 */

const imageDatas = imageJsonDatas.map((image) => {
    image.imageUrl = require('../images/' + image.fileName);
    return image;
});

class ImgFigure extends Component {
    constructor(props) {
        super(props);
    }

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

export default class AppComponent extends Component {
    render() {
        var controllerUnits = [];
        var imgFigures = [];

        imageDatas.forEach((value, index) => {
            imgFigures.push(<ImgFigure key={index} data={value}/>);
        });

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

