import React, { Component } from 'react';
import {Modal} from 'react-bootstrap';


export default class YesNoModal extends Component {

constructor(props){
    super(props);
    this.state ={
        errorMessage: "",
        show: false
        
    }
}
    render(){
        
        return(
          <Modal show={this.props.show} onHide={this.props.handleNo}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {this.props.text}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className = "btn btn-primary" onClick={this.props.handleNo}><i className="fa fa-times">{this.props.noButton}</i></button>
            <button className = "btn btn-danger" onClick={this.props.handleYes}><i className="fa fa-times">{this.props.yesButton}</i></button>
          </Modal.Footer>
        </Modal>
        )
    }
}