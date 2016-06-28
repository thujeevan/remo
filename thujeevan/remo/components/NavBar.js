import React, {Component, PropTypes} from 'react';
import BsNavBar from 'react-bootstrap/lib/Navbar';
import BsNav from 'react-bootstrap/lib/Nav';

import NavLink from './NavLink';

const NavBar = (props) => {
    const { auth: {isAuthenticated, isFetching, session}, logoutUser, router } = props;
    const handleLogout = (e) => {
        e.preventDefault();
        logoutUser();
        router.replace('/auth/login');
    };
    const renderLink = () => {
        if (isAuthenticated) {
            return (
                <p className="navbar-text">
                    Logged in as {session.full_name} (<a href="#" onClick={handleLogout}>logout</a>)
                </p>
            );
        }
        return <NavLink to="/auth/login">Login</NavLink>;
    };
    return (
        <BsNavBar fixedTop fluid>
            <BsNavBar.Header>
                <BsNavBar.Brand>
                    <NavLink onlyActiveOnIndex={true} to="/">
                        <i className="fa fa-home"></i> REMO
                    </NavLink>
                </BsNavBar.Brand>
            </BsNavBar.Header>
            <BsNavBar.Collapse>                  
                <BsNav pullRight>
                    <li>{renderLink()}</li>
                </BsNav>
            </BsNavBar.Collapse>
        </BsNavBar>
    );
};

NavBar.propTypes = {
    auth: PropTypes.shape({
        isAuthenticated: PropTypes.bool.isRequired,
        isFetching: PropTypes.bool.isRequired,
        session: PropTypes.shape({
            full_name: PropTypes.string
        })
    }),
    router: PropTypes.shape({
        replace: PropTypes.func.isRequired
    }),
    logoutUser: PropTypes.func.isRequired
};

export default NavBar;