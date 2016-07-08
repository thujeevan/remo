import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Alert, AlertContainer} from '../components/Alert';
import {removeAlert, clearAlerts} from '../actions';
import {getAlerts} from '../reducers/alerts';

const Container = ({alerts, removeAlert}) => {
    const onCloseAlert = (alert, e) => {
        removeAlert(alert);
    }
    
    const renderAlert = (alert) => {
        const renderList = () => {
            return (
                <ul>
                    {typeof alert.getErrors === 'function' && alert.getErrors().map((error, id) => <li key={id}>{error}</li>)}
                </ul>
            )
        };
        
        const timeout = setTimeout(() => {
            onCloseAlert(alert);
        }, 5000);
        
        return (
            <Alert 
                key={alert.get('id')} 
                type={alert.type == 'error' ? 'danger' : alert.type} 
                onClose={onCloseAlert.bind(null, alert)}
            >
                {alert.reason || alert.message || renderList()}
            </Alert>
        );
    }
    
    return (
        <AlertContainer alerts={alerts} renderAlert={renderAlert} />
    );
}

function mapStateToProps(state, ownProps) {
    return {
        alerts: getAlerts(state.alerts)
    };
}

export default connect(mapStateToProps, {
    removeAlert,
    clearAlerts
})(Container);