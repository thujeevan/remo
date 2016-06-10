import React from 'react';
import {connect} from 'react-redux';

import NavBar from '../components/NavBar';

function mapStateToProps(state, ownProps) {
    // TODO: colocate (perhaps in separate auth reducer)
    return state.auth.toJS();
}

export default connect(mapStateToProps)(NavBar);