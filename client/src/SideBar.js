import React, { Component } from 'react';


function ImageRow(props) {    

    return (
<div className="col-md-4 text-center" style={{paddingBottom: '.5em'}}>
<a href={`/images/${props.image._id}`}><img src={`/upload/${props.image.filename}`}style={{width: '75px', height: '75px'}} className="img-thumbnail" alt=" "></img></a>
</div>    
    )
}

function ImageTable(props) {
        const imageRows = props.stats.popular.map(image => (
          <ImageRow key={image._id} image={image} />
        ));
    return (
        <div>
        {imageRows}
        </div>
    )
    }

function PopularImages(props){
    console.log(props);
    let Table = () => null;
    if(props.stats.popular) Table = () => <ImageTable stats={props.stats} /> 
return(
<div className="panel panel-default">
    <div className="panel-heading">
        <h3 className="panel-title">
            Most Popular
        </h3>
    </div>
    <div className="panel-body">
        <Table />

        
    </div>
</div>

)
}


function CommentRow(props) {    
//console.log(props.image)
    const comment = props.comment;

    const dateString = new Date(comment.timestamp).toDateString();

    return (
            <ul className="media-list">
        
 
            <li className="media">
            <a className="pull-left" style={{paddingLeft: '5px', paddingTop: '5px'}} href={`/images/${props.image[0]._id}`}>
                    <img className="media-object" width="45" height="45" src={`/upload/${props.image[0].filename}`} alt=" "></img>
                </a>
            
                <div className="media-body" style= {{paddingTop: '10px'}}>
 

            {/* eslint-disable jsx-a11y/href-no-hash */}
                <a className="pull-left" href="#">
                    <img className="media-object img-circle" src={`https://www.gravatar.com/avatar/${comment.gravatar}?s=25`} alt=""></img>
                </a>
                <div className="media-body">
            {comment.comment}
            <br/><strong className="media-heading">{comment.name}</strong> <small className="text-muted">{dateString}</small>
                </div>
                </div>
            </li>
            
            </ul>
            
    )
}

function CommentList(props) {

    const commentRows = props.stats.latestComments.map(comment => (
        <CommentRow stats={props.stats} key={comment._id} comment={comment} image={comment.image} />
    ));
return (

<div>
{commentRows}
</div>
        )
        }



function LatestComments(props){
    let Table = () => null;
    if(props.stats.latestComments) Table = () => <CommentList stats={props.stats} /> 
    return(
<div className="panel panel-default">
    <div className="panel-heading">
        <h3 className="panel-title">
            Latest Comments
        </h3>
    </div>
<Table />
</div>

    )
}



export default class SideBar extends Component {
constructor(props) {
    super();
//    console.log(props);
this.state ={
        stats: {}
}

}
componentDidMount() {
        
        this.loadData();
        }        

loadData() {

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
    
    fetch(`/api/stats`)
        .then(status)
        .then(json)
        .then(data=> {
            console.log('Success', data);
            this.setState({stats: data});

        }).catch(error=>{
            //console.log('Request failed', error.message);
            this.setState({errorMessage: error.message});
        });
        }

render(){


return(

<div>
                <div className="panel panel-default">
    <div className="panel-heading">
        <h3 className="panel-title">
            Stats
        </h3>
    </div>
    <div className="panel-body">
        <div className="row">
            <div className="col-md-2 text-left">Images:</div>
            <div className="col-md-10 text-right">{this.state.stats.images}</div>
        </div>
        <div className="row">
            <div className="col-md-2 text-left">Comments:</div>
            <div className="col-md-10 text-right">{this.state.stats.comments}</div>
        </div>
        <div className="row">
            <div className="col-md-2 text-left">Views:</div>
            <div className="col-md-10 text-right">{this.state.stats.views}</div>
        </div>
        <div className="row">
            <div className="col-md-2 text-left">Likes:</div>
            <div className="col-md-10 text-right">{this.state.stats.likes}</div>
        </div>
    </div>
</div>

<PopularImages stats ={this.state.stats} />
<LatestComments stats={this.state.stats} />


</div>

)
}
}
