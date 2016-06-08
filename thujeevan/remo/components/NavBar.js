import React, {Component} from 'react';
import NavLink from './NavLink';

export default class NavBar extends Component {
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <NavLink onlyActiveOnIndex={true} to="/" className="navbar-brand">REMO</NavLink>
                    </div>
                    <div className="collapse navbar-collapse">                  
                        <ul className="nav navbar-nav navbar-right">
                            <li><NavLink to="/auth/login">Login</NavLink></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}