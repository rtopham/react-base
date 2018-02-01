import React, { Component } from 'react';

export default class BodyColumn extends Component{
    render(){
        return(
                <div className="col-sm-8">
                    {this.props.children}
                </div>
           
        )

    }

}