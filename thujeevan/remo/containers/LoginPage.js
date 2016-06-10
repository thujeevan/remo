import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

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
        let creds = Object.assign({}, this.state);
        let {loginUser, router, location} = this.props;

        loginUser(creds).then(() => {
            if (location.state && location.state.nextPathname) {
              router.replace(location.state.nextPathname)
            } else {
              router.replace('/')
            }
        }).catch((error) => {
            // TODO: proper logging, error notifications
            console.log(error);
        });
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    renderButton() {
        const {isFetching} = this.props;
        if (isFetching) {
            return <button type="submit" className="btn btn-default" disabled>Logging in...</button>;
        }
        return <button type="submit" className="btn btn-default">Log in</button>;
    }
    render() {
        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label className="col-sm-2 control-label">Username</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" name="username" placeholder="Username" value={this.state.username} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">Password</label>
                <div className="col-sm-10">
                  <input type="password" className="form-control" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  {this.renderButton()}
                </div>
              </div>
            </form>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const isFetching = state.auth.get('isFetching');
    return { isFetching };
}

const LoginPageContainer = withRouter(connect(
    mapStateToProps, 
    {loginUser}
)(LoginPage));

LoginPageContainer.onEnter = (store, nextState, replace) => {
    const {auth} = store.getState();
    if (auth.get('isAuthenticated')) {
        return replace('/');
    }
};

export default LoginPageContainer;