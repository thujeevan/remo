import React, {Component, PropTypes} from 'react';
import {Map, List} from 'immutable';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

import Modal from '../components/Modal';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }
    componentDidMount() {
        this.showModal();
    }
    showModal() {
        return this.setState({
            isOpen: true
        });
    }
    hideModal() {
        const {onHideModal} = this.props;
        return this.setState({
            isOpen: false
        }, () => {
            onHideModal && onHideModal();
        });
    }
    render() {
        const {isOpen} = this.state;
        const {user} = this.props;
        
        const renderFormGroup = (label, key) => {
            const val = (typeof key === 'function') ? key(user) : user.get(key);
            return (
                <FormGroup>
                    <Col sm={2} componentClass={ControlLabel}>{label}</Col>
                    <Col sm={10}><FormControl.Static>{val}</FormControl.Static></Col>
                </FormGroup>
            );
        };
        
        const body = (
            <Form horizontal>
                {renderFormGroup('Full Name', 'full_name')}
                {renderFormGroup('Username', 'username')}
                {renderFormGroup('Email', 'email')}
                {renderFormGroup('Account Status', 'user_status')}
                {renderFormGroup('User Role', 'role')}
                {renderFormGroup('Primary Group', user => user.getIn(['primary_group', 'group_name']))}
                {renderFormGroup('Groups', user => user.get("groups").map(group => group.get('group_name')).join(','))}
            </Form>
        );
        
        const footer = (
            <Button onClick={this.hideModal.bind(this)}>Close</Button>
        );
        
        const dialog = (
            <Modal 
                bsStyle="lg" 
                backdrop={true} 
                show={isOpen} 
                animation={false} 
                onHide={this.hideModal.bind(this)}
                title={user.get('full_name')}
                body={body}
                footer={footer}
            />
        );
        return dialog;
    }
}

User.propTypes = {
    user: PropTypes.shape({
        groups: React.PropTypes.instanceOf(List),
        primary_group: React.PropTypes.instanceOf(Map)
    }),
    onHideModal: PropTypes.func
};

export default User;