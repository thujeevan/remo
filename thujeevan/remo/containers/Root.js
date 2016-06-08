import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'
import { Router } from 'react-router'

export default class Root extends Component {
  render() {
    const { history } = this.props;
    return <Router history={history} routes={routes} />;
  }
}

Root.propTypes = {
    history: PropTypes.object.isRequired
};