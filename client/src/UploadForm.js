import React, { Component } from 'react';

import AuthService from './AuthService';

export default class UploadForm extends Component {
    constructor(props){
        super(props);
        this.state ={
            errorMessage: ""
        }
    this.Auth = new AuthService();
    this.handleSubmit = this.handleSubmit.bind(this);
    }


handleSubmit = event => {
event.preventDefault();
const form = document.forms.uploadForm;
const formData = new FormData(form);
formData.append('user_id', this.Auth.getProfile()._id)

function status(response){
  if(response.status >=200 && response.status <300){
    return Promise.resolve(response);
  }else { return Promise.reject(new Error("Error: Please choose an image file."))
    }
}

function json(response) {
//console.log(response);
    return response.json();
}

fetch('/api/images', {
    method: 'POST',
    headers: {'Accept': 'application/json'},
    body: formData
  }).then(status)
    .then(json)
    .then(data=> {
        
        console.log('Success', data);
    }).catch(error=>{
        //console.log('Request failed', error.message);
        this.setState({errorMessage: error.message});
    });
   
}


render(){
    console.log(this.Auth.getProfile())
return(
<div className="panel panel-primary">
    <div className="panel-heading">
        <h3 className="panel-title">
            Upload an Image
        </h3>
    </div>
{/*    <form method="post" action="/api/images" encType="multipart/form-data">*/}
<form name= "uploadForm" onSubmit={this.handleSubmit} encType="multipart/form-data">
        <div className="panel-body form-horizontal">
            <div className="form-group col-md-12">
                <label className="col-sm-2 control-label" htmlFor="file">Browse:</label>
                <div className="col-md-10">
                    <input className="form-control" type="file" name="file"></input>
                </div>
            </div>
            <div className="form-group col-md-12">
                <label className="col-md-2 control-label" htmlFor="title">Title:</label>
                <div className="col-md-10">
                    <input className="form-control" type="text" name="title"></input>
                </div>
            </div>
            <div className="form-group col-md-12">
                <label className="col-md-2 control-label" htmlFor="description">Description:</label>
                <div className="col-md-10">
                    <textarea className="form-control" name="description" rows="2"></textarea>
                </div>
            </div>
            <br></br><p className="centerthis error">{this.state.errorMessage}</p>
            <div className="form-group col-md-12">
                <div className="col-md-12 text-right">
                    <button type="submit" id="login-btn" className="btn btn-success"><i className="fa fa-cloud-upload "></i> Upload Image</button>
                </div>
            </div>
        </div>

    </form>
</div>

)
}
}
