import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {fetchUsers} from '../actions';

import UserList from '../components/UserList';

class Users extends Component {
    constructor(props) {
        super(props);
    }
    
    componentWillMount() {
        let {location : {query: {page = 1}}} = this.props;
        const {fetchUsers, router} = this.props;
        // TODO: remove hard coded page size property
        fetchUsers({page_size: 50, page}).then(() => {
            router.replace({
                pathname: '/users',
                query: { page }
            });
        });
    }
    
    componentWillReceiveProps(nextProps) {
        
    }
    
    render() {
        let {location : {query: {page = 1}}} = this.props;
        const {fetchUsers, router} = this.props;
        
        const loadNextPage = ({startIndex, stopIndex}) => {
            return fetchUsers({page_size: 50, page: +page + 1}).then(() => {
                router.push({
                    pathname: '/users',
                    query: { page: +page + 1 }
                });
            });
        };
        return <UserList {...this.props} loadNextPage={loadNextPage}/>;
    }
}

function mapStateToProps({users}, ownProps) {
    const {location : {query: {page = 1}}} = ownProps;     
    const total = users.getIn(['meta', 'total']);
    const pages = Math.ceil(total/50);
    
    return {
        hasNextPage: page < pages,
        isNextPageLoading: users.get('isFetching'),
        list: users.get('users')
    }
}

export default withRouter(connect(mapStateToProps, {fetchUsers})(Users));

