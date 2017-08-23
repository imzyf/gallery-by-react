import 'normalize.css/normalize.css';
import 'styles/main.scss';

import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';

// 获取图片相关的数据 直接使用 loader
import imageJsonDatas from 'json!../data/imageDatas.json';
import {getRangeRandom, get30DegRandom} from '../util/util';
import ControllerUnit from 'components/ControllerUnit';


const imageDatas = imageJsonDatas.map((image) => {
    image.imageUrl = require('../images/' + image.fileName);
    return image;
});

class ImgFigure extends Component {
    constructor(props) {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
    }

    // 处理 imgFigure 的点击处理
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

    render() {
        let styleObj = {};

        let {pos, rotate, isInverse, isCenter} = this.props.arrange;

        // 设置图片位置
        if (pos) {
            styleObj = pos;
        }

        // 设置旋转角度
        if (rotate) {
            (['MozTransform', 'msTransform', 'Webkittransform', 'transform']).forEach((value) => {
                styleObj[value] = 'rotate(' + rotate + 'deg)'
            })
        }

        // 图片翻转
        let imgFigureClassName = 'img-figure';
        imgFigureClassName += isInverse ? ' is-inverse' : '';

        if (isCenter) {
            styleObj.zIndex = 11;
        }

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={(e) => this.handleClick(e)}>
                <img src={this.props.data.imageUrl}
                     alt={this.props.data.title}
                />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={(e) => this.handleClick(e)}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}

export default class AppComponent extends Component {
    constructor(props) {
        super(props);
        this.Constant = {
            centerPos: {  // 中心图片位置
                left: 0,
                top: 0
            },
            leftSection: {  // 左扇区，x和y临界值
                x: [0, 0],
                y: [0, 0]
            },
            rightSection: { // 右扇区，x和y临界值
                x: [0, 0],
                y: [0, 0]
            },
            topSection: {   // 上扇区，x和y临界值
                x: [0, 0],
                y: [0, 0]
            }
        };
        this.state = {
            imgsArrangeArr: [{
                // // 图片定位
                // pos:{
                //     left: 0,
                //     top: 0
                // },
                // // 图片旋转角度
                // rotate:0,
                // // 图片正反面
                // isInverse: false,
                // // 图片是否居中
                // isCenter: false,
            }]
        }

    }

    componentDidMount() {
        /** 拿到舞台的大小，计算一半的值*/
        let stageDOM = findDOMNode(this.refs.stage), // 拿到舞台dom节点
            stageW = stageDOM.scrollWidth,              // 舞台宽度
            stageH = stageDOM.scrollHeight,             // 舞台高度
            halfStageW = Math.ceil(stageW / 2),         // 舞台一半宽度
            halfStageH = Math.ceil(stageH / 2);         // 舞台一半高度

        /** 拿到一个imgFigure的大小，因为所有imgFigure都一样，所以这里去第一个imgFigure0*/
        let imgFigureDOM = findDOMNode(this.refs.imgFigure0), // 拿到随便一个图片节点
            imgW = imgFigureDOM.scrollWidth,                     // 图片宽度
            imgH = imgFigureDOM.scrollHeight,                    // 图片高度
            halfImgW = Math.ceil(imgW / 2),                      // 图片一半宽度
            halfImgH = Math.ceil(imgH / 2);                      // 图片一半高度

        /** 计算左扇区，x和y的临界值 */
        this.Constant.leftSection.x[0] = -halfImgW;                         // 左扇区最左值，这里设定最多超多舞台左边界图片宽度的一半
        this.Constant.leftSection.x[1] = halfStageW - halfImgW * 3;         // 左扇区最右值，注意这里绝对定位的left是指图片左边距离屏幕左边界的距离，所以这里是1.5倍图片宽度，临界情况是图片右边紧贴中心图片最左边
        this.Constant.leftSection.y[0] = -halfImgH;                         // 左扇区的最上，这里设定最多超多舞台上边界图片高度的一半
        this.Constant.leftSection.y[1] = stageH - halfImgH;                 // 左扇区的最下，这里设定高于舞台下边界图片高度的一半

        /** 计算右扇区，x和y的临界值*/
        this.Constant.rightSection.x[0] = halfStageW + halfImgW;            // 右扇区最左值，贴到中心图片的右边，距离中心线半个图片宽度
        this.Constant.rightSection.x[1] = stageW - halfImgW;                // 右扇区最右值，道理同左扇区最右值
        this.Constant.rightSection.y[0] = this.Constant.leftSection.y[0];  // 同左扇区最上
        this.Constant.rightSection.y[1] = this.Constant.leftSection.y[1];  // 同左扇区最下

        /** 计算上扇，x和y的临界值 */
        this.Constant.topSection.y[0] = -halfImgH;                          // 上扇区最上，同左右扇区最上
        this.Constant.topSection.y[1] = halfStageH - halfImgH * 3;          // 上扇区最下，道理同左扇区最右值
        this.Constant.topSection.x[0] = halfStageW - imgW;                  // 上扇区最左，中轴线往左一个图片宽度
        this.Constant.topSection.x[1] = halfStageW;                         // 上扇区最右，中轴线（注意left值是以左边为准）

        // 中心位置
        this.Constant.centerPos.top = halfStageH - halfImgH;
        this.Constant.centerPos.left = halfStageW - halfImgW;


        this.rearrange(0); //默认指定第一张居中

    }

    /**
     *  重新布局所有图片
     *  @param: centerIndex指定居中排布哪个图片
     */
    rearrange(centerIndex) {
        let {imgsArrangeArr} = this.state;
        let {centerPos, leftSection, rightSection, topSection} = this.Constant;

        // 上部图片
        let topImgs = [],
            // 上部图片 数量 0 或 1
            topImgsNum = Math.floor(Math.random() * 2),
            // 上部图片 索引
            topImgsIndex = 0,
            // 中心图片
            centerImgs = [];

        // 处理 中心图片
        centerImgs = imgsArrangeArr.splice(centerIndex, 1);
        centerImgs[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        };

        // 处理 上部图片
        topImgsIndex = Math.random() * (imgsArrangeArr.length - 1  );
        topImgs = imgsArrangeArr.splice(Math.floor(topImgsIndex), topImgsNum);
        // topImgs 最多只有一个值，通过遍历总不会错
        topImgs.forEach((value, index) => {
            topImgs[index] = {
                pos: {
                    top: getRangeRandom(topSection.y[0], topSection.y[1]),
                    left: getRangeRandom(topSection.x[0], topSection.x[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            }
        });

        // 处理 两侧图片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let section = [];
            if (i < k) {
                // 前半部分图片在 左部
                section = leftSection;
            } else {
                // 后半部分图片在 右部
                section = rightSection;
            }

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(section.y[0], section.y[1]),
                    left: getRangeRandom(section.x[0], section.x[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            }
        }

        // 将中心、上部图片填回数组
        if (centerImgs && centerImgs[0]) {
            imgsArrangeArr.splice(centerIndex, 0, centerImgs[0])
        }

        if (topImgs && topImgs[0]) {
            imgsArrangeArr.splice(topImgsIndex, 0, topImgs[0])
        }

        this.setState({
            imgsArrangeArr
        })

    }

    // 翻转图片
    inverse(index) {
        let {imgsArrangeArr} = this.state;
        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
        this.setState({
            imgsArrangeArr
        })
    }

    render() {
        let controllerUnits = [];
        let imgFigures = [];

        imageDatas.forEach((value, index) => {
            // 初始化每一个图片位置
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            const commonProps = {
                arrange: this.state.imgsArrangeArr[index],
                inverse: () => this.inverse(index),
                center: () => this.rearrange(index)
            };
            imgFigures.push(<ImgFigure
                key={index}
                data={value}
                ref={'imgFigure' + index}
                {...commonProps}/>);

            controllerUnits.push(<ControllerUnit key={index} {...commonProps}/>)
        });

        return (
            <section className="stage" ref="stage">
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
