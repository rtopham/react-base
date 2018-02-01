import React, { Component } from 'react';

export default class SideBarColumn extends Component{
    render(){
        return(
            
            <div className="col-sm-4">
            {this.props.children}
            </div>
            
        )

    }

}