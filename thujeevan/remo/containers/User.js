import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import {getUserByUID} from '../reducers/users';
import User from '../components/User';

function mapStateToProps({users, entities}, ownProps) {    
    const {params: {uid}} = ownProps;
    const user = getUserByUID(users, entities, uid);
    return {user};
}

const UserContainer = withRouter(({router, ...other}) => {
    const onHideModal = () => {
        router.goBack();
    }
    
    return <User onHideModal={onHideModal} {...other} />;
});

export default connect(mapStateToProps)(UserContainer);