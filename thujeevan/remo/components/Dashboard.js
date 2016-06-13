import React, {Component} from 'react';
import NavLink from './NavLink';

const Dashboard = (props) => {
    const renderItem = ({heading, url, key}) => {
        return (
            <div className="col-lg-2 col-md-2" key={key}>
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-3">
                                <i className={`fa fa-${key} fa-4x`}></i>
                            </div>
                            <div className="col-xs-9 text-right">
                                <div style={{fontSize: 20}}>{heading}</div>
                            </div>
                        </div>
                    </div>
                    <NavLink to={url}>
                        <div className="panel-footer">
                            <span className="pull-left">View</span>
                            <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
                            <div className="clearfix"></div>
                        </div>
                    </NavLink>
                </div>
            </div>
        );
    };
    // TODO: get it from props
    const items = [
        {heading: 'Users', url: '/users', key: 'users'}
    ];
    return (
        <div className="row">
            {items.map(renderItem)}
        </div>
    )
};

// TODO: should be handled by a container component
Dashboard.onEnter = (store, nextState, replace) => {
    const {auth} = store.getState();
    if (!auth.get('isAuthenticated')) {
        return replace('/auth/login');
    }
};

export default Dashboard;