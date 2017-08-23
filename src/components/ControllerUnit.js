import React, {Component} from 'react';

export default class ControllerUnit extends Component {


    handleClick(e){
        e.stopPropagation();
        e.preventDefault();
    }

    render(){
        return(
            <span className="controller-unit" onClick={(e)=>this.handleClick(e)}></span>
        );
    }

}
