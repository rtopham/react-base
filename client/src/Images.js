import React, { Component } from 'react';
import withAuth from './withAuth';
import Layout from './Layout';
//import NewestImages from './NewestImages';
import UploadForm from './UploadForm';
import BodyColumn from './BodyColumn';
import SideBarColumn from './SideBarColumn';
import SideBar from './SideBar';
import YourImages from './YourImages';
import AuthService from './AuthService';

class UploadImage extends Component {
    constructor(props){
        super(props);

    this.Auth = new AuthService();

    }
render(){

return(
<Layout> 
<BodyColumn>
<UploadForm />
<YourImages user_id={this.Auth.getProfile()._id} />
</BodyColumn>
<SideBarColumn>
<SideBar />
</SideBarColumn>
</Layout>
)
}
}
export default withAuth(UploadImage);