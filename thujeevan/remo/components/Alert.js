import React, {Component, PropTypes} from 'react';
import {VelocityTransitionGroup} from 'velocity-react';
import {List} from 'immutable';

export const Alert = ({type, children, onClose, ...other}) => {
    const style = {
        marginBottom: 5
    };
    
    return (
        <div className={`alert alert-${type} alert-dismissable`} role="alert" style={style} {...other}>
            <button type="button" className="close" aria-label="close" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
            </button>
            {children}
        </div>
    );
}

Alert.propTypes = {
    type: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
}

export const AlertContainer = (props) => {    
    const {alerts, renderAlert} = props;
    const style = {
        position: 'fixed',
        minWidth: 300,
        top: 55,
        right: 5,
        zIndex: 1060
    };
    
    return (
        <div style={style}>
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                {alerts.map(alert => renderAlert(alert))}
            </VelocityTransitionGroup>
        </div>
    );       
}

AlertContainer.propTypes ={
    renderAlert: PropTypes.func.isRequired
}