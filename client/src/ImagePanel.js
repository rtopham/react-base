import React, { Component } from 'react';
import YesNoModal from './YesNoModal.js'
import AuthService from './AuthService';


export default class ImagePanel extends Component {

constructor(props){
    super(props);
    this.state ={
        errorMessage: "",
        showDeleteModal: false,
        likes: this.props.loadedImage.image.likes
    }
    this.Auth = new AuthService();

this.updateLikes = this.updateLikes.bind(this);
this.deleteImage = this.deleteImage.bind(this);
this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
}


toggleDeleteModal = () => {
    this.setState({showDeleteModal: !this.state.showDeleteModal})
}

deleteImage = () =>{

//console.log('You just deleted an image')

fetch(`/api/images/${this.props.params.id}/delete`).then(response => {
    if (response.ok) {
    response.json().then(message => {
    console.log(message);

    });
    } else {
    response.json().then(error => {
    this.showError(`Failed to delete image: ${error.message}`);
    });
    }
    }).catch(err => {
            this.showError(`Error in deleting image: ${err.message}`);
    });

this.toggleDeleteModal();

}

updateLikes = () => {

    fetch(`/api/images/${this.props.params.id}/like`).then(response => {
        if (response.ok) {
        response.json().then(likes => {
        console.log(likes);
        
      this.setState({ likes: likes.likes});
        });
        } else {
        response.json().then(error => {
        this.showError(`Failed to update likes: ${error.message}`);
        });
        }
        }).catch(err => {
                this.showError(`Error in updating likes: ${err.message}`);
        });
         
      }



render(){
const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"];
let date = new Date(this.props.loadedImage.image.timestamp);
let dateString = months[date.getMonth()] + " " + date.getFullYear();

let DeleteButton = () => null;
if(this.props.loadedImage.image.user_id===this.Auth.getProfile()._id) DeleteButton = () => <button className="btn btn-danger" onClick={this.toggleDeleteModal} id="btn-delete" data-id={this.props.loadedImage.image._id}><i className="fa fa-times">Delete</i></button> 

return(

<div className="panel panel-primary">
    <div className="panel-heading">
<h2 className="panel-title">{this.props.loadedImage.image.title}</h2>
    </div>
    <div className="panel-body">
<p>{this.props.loadedImage.image.description}</p>
        <div className="col-md-12 text-center">
            <img src={`/upload/${this.props.loadedImage.image.filename}`} alt=" " className="img-thumbnail"></img>
        </div>
    </div>
    <div className="panel-footer">
        <div className="row">
            <div className="col-md-8">
                <button className="btn btn-success" onClick={this.updateLikes} id="btn-like" data-id={this.props.loadedImage.image._id}><i className="fa fa-heart">Like</i></button>
<strong className="likes-count">&nbsp;{this.state.likes}</strong> &nbsp; - &nbsp; <i className="fa fa-eye"></i> <strong>Views: {this.props.loadedImage.image.views}</strong>
&nbsp; - &nbsp; Posted: <em className="text-muted">{dateString}</em>
            </div>
            <div className="col-md-4 text-right">
                <DeleteButton />
            </div>
        </div>
    </div>

<YesNoModal show={this.state.showDeleteModal} handleYes={this.deleteImage} handleNo={this.toggleDeleteModal} title="Delete Image"
text="Are you sure you want to delete this Image?" yesButton="Delete" noButton="Cancel" />

    
</div>

)
}
}
