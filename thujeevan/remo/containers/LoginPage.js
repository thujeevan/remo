import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {loginUser} from '../actions';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        // TODO: connect with store, actions
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    render() {
        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label for="username" className="col-sm-2 control-label">Username</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" name="username" placeholder="Username" value={this.state.username} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="form-group">
                <label for="inputPassword3" className="col-sm-2 control-label">Password</label>
                <div className="col-sm-10">
                  <input type="password" className="form-control" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  <button type="submit" className="btn btn-default">Sign in</button>
                </div>
              </div>
            </form>
        );
    }
}

export default LoginPage;