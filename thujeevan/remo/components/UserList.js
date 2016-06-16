import React from 'react';
import VirtualList from './VirtualList';

const UserList = (props) => {    
    const rowRenderer = (user, isLoading, isScrolling) => {
        const row = (            
            <a href="#" className="list-group-item">
                <i className="fa fa-user fa-3x pull-left"></i>
                <h4 className="list-group-item-heading">
                    {isLoading ? 'loading...' : user.get('full_name')}
                </h4>
                <p className="list-group-item-text">
                    {isLoading ? 'loading...' : user.getIn(['primary_group', 'group_name'], 'Does not belong to any group')}
                </p>
            </a>
        );
        return row;
    }
    
    return (
        <div className="panel panel-default">
            <div className="panel-heading">Users</div>
            <div className="list-group">
                <VirtualList {...props} rowRenderer={rowRenderer}/>
            </div>
        </div>        
    );
};

export default UserList;