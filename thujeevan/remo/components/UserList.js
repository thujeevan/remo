import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import ListGroup from 'react-bootstrap/lib/ListGroup';

import VirtualList from './VirtualList';
import NavLink from './NavLink';

const UserList = (props) => {    
    const rowRenderer = (user, isLoading, isScrolling) => {
        const row = (            
            <NavLink to={isLoading ? '#': `/users/${user.get('uid')}`} className="list-group-item">
                <i className="fa fa-user fa-3x pull-left"></i>
                <h4 className="list-group-item-heading">
                    {isLoading ? 'loading...' : user.get('full_name')}
                </h4>
                <p className="list-group-item-text">
                    {isLoading ? 'loading...' : user.getIn(['primary_group', 'group_name'], 'Does not belong to any group')}
                </p>
            </NavLink>
        );
        return row;
    }
    
    const {children, ...other} = props;
    return (
        <div>
            <Panel header={<h3>Users</h3>}>
                <ListGroup fill>
                    <VirtualList {...other} rowRenderer={rowRenderer}/>
                </ListGroup>
            </Panel>
            <div className="user-profile">{children}</div>
        </div>        
    );
};

export default UserList;