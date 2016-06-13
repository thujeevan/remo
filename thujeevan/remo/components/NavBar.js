import React, {Component, PropTypes} from 'react';
import NavLink from './NavLink';

const NavBar = (props) => {
    const { auth: {isAuthenticated, isFetching, session}, logoutUser, router } = props;
    const handleLogout = (e) => {
        e.preventDefault();
        logoutUser();
        router.replace('/');
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