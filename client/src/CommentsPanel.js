import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';


function CommentRow(props) {    

    const comment = props.comment;

    let dateString = new Date(comment.timestamp).toDateString();
       
        return (
                <ul className="media-list">
            
                <li className="media">
                {/* eslint-disable jsx-a11y/href-no-hash */}
                    <a className="pull-left" href="#">
                        <img className="media-object img-circle" src={`https://www.gravatar.com/avatar/${comment.gravatar}?s=25`} alt=""></img>
                    </a>
                    <div className="media-body">
                {comment.comment}
                <br/><strong className="media-heading">{comment.name}</strong> <small className="text-muted">{dateString}</small>
                    </div>
                </li>
                
                </ul>
        )
    }

function CommentList(props) {
        //    console.log(props.images);
                const commentRows = props.comments.map(comment => (
                  <CommentRow key={comment._id} comment={comment} />
                ));
            return (
                <div>
                {commentRows}
                </div>
            )
            }


export default class CommentsPanel extends Component {
constructor(props){
    super(props);
    this.state ={
        errorMessage: "",
        formOpen: false,
        comments: this.props.loadedImage.comments
    }

this.handleSubmit = this.handleSubmit.bind(this);
}

handleSubmit = event => {
    event.preventDefault();
    console.log('Inside Submit');
    let form = document.forms.commentForm;
    const formData = new FormData(form);

    
    function status(response){
        if(response.status >=200 && response.status <300){
        return Promise.resolve(response);
        }else { return Promise.reject(new Error("Error: Could not process comment."))
        }
    }
    
    function json(response) {
    //console.log(response);
        return response.json();
    }
    
    fetch(`/api/images/${this.props.params.id}/comment`, {
        method: 'POST',
        headers: {'Accept': 'application/json'},
        body: formData
        }).then(status)
        .then(json)
        .then(data=> {
//            console.log('Success', data);
            this.setState({comments:[...this.state.comments, data.comment]});
            this.setState({formOpen: false});
            document.getElementById("commentForm").reset();

        }).catch(error=>{
            //console.log('Request failed', error.message);
            this.setState({errorMessage: error.message});
        });
        
    }

render(){
//console.log(this.props.loadedImage.comments)
return(

<div className="panel panel-default">
    <div className="panel-heading">
        <div className="row">
            <div className="col-md-8">
                <strong className="panel-title">Comments</strong>
            </div>
            <div className="col-md-4 text-right">
                <button className="btn btn-default btn-sm" onClick={()=>this.setState({formOpen: !this.state.formOpen})} id="btn-comment" data-id={this.props.loadedImage.image.uniquieId}><i className="fa fa-comments-o"> Post Comment...</i></button>
            </div>
        </div>
    </div>
    <div className="panel-body">
    <Panel collapsible expanded={this.state.formOpen}>
        <blockquote id="post-comment">
            <div className="row">
{/*                <form method="post" action={`/images/${this.props.loadedImage.image.uniquieId}/comment`}> */}
                <form name= "commentForm" id="commentForm" onSubmit={this.handleSubmit} encType= "multipart/form-data">
                    <div className="form-group col-sm-12">
                        <label className="col-sm-2 control-label" htmlFor="name">Name:</label>
                        <div className="col-sm-10">
                            <input className="form-control" type="text" name="name"></input>
                        </div>
                    </div>
                    <div className="form-group col-sm-12">
                        <label className="col-sm-2 control-label" htmlFor="email">Email:</label>
                        <div className="col-sm-10">
                            <input className="form-control" type="text" name="email"></input>
                        </div>
                    </div>
                    <div className="form-group col-sm-12">
                        <label className="col-sm-2 control-label" htmlFor="comment">Comment:</label>
                        <div className="col-sm-10">
                            <textarea className="form-control" name="comment" rows="2"></textarea>
                        </div>
                    </div>
                    <div className="form-group col-sm-12">
                        <div className="col-sm-12 text-right">
                            <button type="submit" id="comment-btn" className="btn btn-success"><i className="fa fa-comment"></i>Post</button>
                        </div>
                    </div>
                </form>
            </div>
        </blockquote>
        </Panel>
<CommentList comments={this.state.comments} />

    </div>
</div>

)
}
}
