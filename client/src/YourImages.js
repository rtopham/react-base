import React, { Component } from 'react';

function ImageRow(props) {    

    const image = props.image;
    return (
        <div className="col-md-4 text-center" style={{paddingBottom: '1em'}}>
        <a href={`/images/${image._id}`}><img src={`/upload/${image.filename}`} alt={image.title} style={{width: '175px', height: '175px'}}  className="img-thumbnail"/></a>
        </div>
    )
}

function ImageTable(props) {
        const imageRows = props.images.map(image => (
          <ImageRow key={image._id} image={image} />
        ));
    return (
        <div>
        {imageRows}
        </div>
    )
    }

export default class YourImages extends Component {
constructor(props) {
    super();
//  console.log(props);
this.state ={
        images: []
}
}
componentDidMount() {


    
    this.loadData();
    }        

loadData() {
        //console.log(this.props.match.params.id);
        fetch(`/api/images/${this.props.user_id}/gallery`).then(response => {
                if (response.ok) {
                response.json().then(loadedImages => {
//                console.log(images);
                
              this.setState({ images: loadedImages.images});
                });
                } else {
                response.json().then(error => {
                this.showError(`Failed to fetch image: ${error.message}`);
                });
                }
        }).catch(err => {
                this.showError(`Error in fetching data from server: ${err.message}`);
        });
        }


render(){
let arrayExists=false;
if(this.state.images[0])arrayExists=true;
//console.log(arrayExists);
if(!arrayExists)return null;else
return(

<div className="panel panel-default">
    <div className="panel-heading">
        <h3 className="panel-title">
            Your Images
        </h3>
    </div>
    <div className="panel-body">
    <ImageTable images={this.state.images}/>
    </div>
</div>

)
}
}
