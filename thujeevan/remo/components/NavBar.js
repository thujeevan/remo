import React, {Component} from 'react';
import NavLink from './NavLink';

const NavBar = ({isAuthenticated}) => {
    const renderLink = () => {
        if (isAuthenticated) {
            return <NavLink to="#">Logged in as ...</NavLink>;
        }
        return <NavLink to="/auth/login">Login</NavLink>;
    };
    return (
        <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <NavLink onlyActiveOnIndex={true} to="/" className="navbar-brand">REMO</NavLink>
                </div>
                <div className="collapse navbar-collapse">                  
                    <ul className="nav navbar-nav navbar-right">
                        <li>{renderLink()}</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;