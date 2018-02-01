import React, { Component } from 'react';
import withAuth from './withAuth';
import Layout from './Layout';
import CommentsPanel from './CommentsPanel';
import ImagePanel from './ImagePanel';
import SideBar from './SideBar';
import BodyColumn from './BodyColumn';
import SideBarColumn from './SideBarColumn';

class ShowImage extends Component {
constructor(props) {
        super();
//        console.log(props);
this.state ={
        loadedImage: {}
}

}
componentDidMount() {
        
        this.loadData();
        }        

loadData() {
        //console.log(this.props.match.params.id);
        fetch(`/api/images/${this.props.match.params.id}`).then(response => {
                if (response.ok) {
                response.json().then(image => {
                console.log(image);
                
              this.setState({ loadedImage: image });
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
let imageLoaded=false;
if(this.state.loadedImage.image!==undefined) imageLoaded=true;
if(!imageLoaded)return null; else
return(
<Layout> 
<BodyColumn>
<ImagePanel params={this.props.match.params} loadedImage={this.state.loadedImage} />
<CommentsPanel params={this.props.match.params} loadedImage={this.state.loadedImage} />
</BodyColumn>
<SideBarColumn>
<SideBar />
</SideBarColumn>


</Layout>
)
}
}
export default withAuth(ShowImage);