import React, {Component} from 'react';

export default class ControllerUnit extends Component {

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
        let {isInverse, isCenter} = this.props.arrange;

        let controllerUnitClassName = "controller-unit";
        if (isCenter) {
            controllerUnitClassName += " is-center";

            if (isInverse) {
                controllerUnitClassName += " is-inverse";
            }
        }

        return (
            <span className={controllerUnitClassName} onClick={(e) => this.handleClick(e)}></span>
        );
    }

}
