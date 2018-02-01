import React, { Component } from 'react';
import withAuth from './withAuth';
import Layout from './Layout';
import NewestImages from './NewestImages';
import UploadForm from './UploadForm';
import BodyColumn from './BodyColumn';
import SideBarColumn from './SideBarColumn';
import SideBar from './SideBar';


class UploadImage extends Component {

render(){

return(
<Layout> 
<BodyColumn>
<UploadForm />
<NewestImages />
</BodyColumn>
<SideBarColumn>
<SideBar />
</SideBarColumn>
</Layout>
)
}
}
export default withAuth(UploadImage);