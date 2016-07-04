import React, {Component, PropTypes} from 'react';
import {Map, List, fromJS} from 'immutable';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

import Modal from '../components/Modal';

class User extends Component {
    constructor(props) {
        super(props);
        
        const {user} = props;
        this.state = {
            isEditing: false,
            isOpen: false,
            user
        };
    }
    componentDidMount() {
        this.showModal();
    }
    showModal() {
        return this.setState({
            isOpen: true
        });
    }
    toggleEdit() {
        const {isEditing} = this.state;
        this.setState({
            isEditing: !isEditing
        });
    }
    rollback() {
        const {user} = this.props;
        this.setState({
            user: user
        }, () => {
            this.toggleEdit();
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
    onChange(e) {
        const {user} = this.state;
        const {name, value} = e.target;
        this.setState({
            user: user.set(name, value)
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        const {user} = this.state;
        const {handleSubmit} = this.props;
        handleSubmit(user.toJSON());
    }
    render() {
        const {isOpen, isEditing, user} = this.state;
        
        const createFormControl = (type) => (disabled = false) => (label, key, value) => {
            if (isEditing && !disabled) {
                return <FormControl type={type} name={key} value={value} onChange={this.onChange.bind(this)}/>;
            }
            return <FormControl.Static>{value}</FormControl.Static>;
        }
        
        const renderFormGroup = (typeRenderer, label, key, value) => {
            value = typeof value === 'function' ? value(user) : user.get(key);
            return (
                <FormGroup>
                    <Col sm={2} componentClass={ControlLabel}>{label}</Col>
                    <Col sm={10}>{typeRenderer(label, key, value)}</Col>
                </FormGroup>
            );
        };
        
        const hasChanged = this.state.user != this.props.user;
        const buttons = isEditing ? 
                    <ButtonToolbar style={{display: 'inline-block'}}>
                        <Button type="submit" bsStyle="primary" disabled={!hasChanged}>Save</Button> 
                        <Button onClick={this.rollback.bind(this)}>Cancel</Button>
                    </ButtonToolbar> : 
                    <ButtonToolbar style={{display: 'inline-block'}}>
                        <Button bsStyle="primary" onClick={this.toggleEdit.bind(this)}>Edit</Button>
                        <Button onClick={this.hideModal.bind(this)}>Close</Button>
                    </ButtonToolbar>;
        
        // TODO: make other elements editable - select, radio
        // currently only text fields editable
        const text = createFormControl('text')();
        const disabledText = createFormControl('text')(true);
        const email = createFormControl('email')();
        
        const body = (
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                {renderFormGroup(text, 'Full Name', 'full_name')}
                {renderFormGroup(disabledText, 'Username', 'username')}
                {renderFormGroup(email,'Email', 'email')}
                {renderFormGroup(disabledText, 'Account Status', 'user_status')}
                {renderFormGroup(disabledText, 'User Role', 'role')}
                {renderFormGroup(disabledText, 'Primary Group', 'primary_group', user => user.getIn(['primary_group', 'group_name']))}
                {renderFormGroup(disabledText, 'Groups', 'groups', user => user.get("groups").map(group => group.get('group_name')).join(','))}
                {<div className="text-right">{buttons}</div>}
            </Form>
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
    onHideModal: PropTypes.func,
    handleSubmit: PropTypes.func.isRequired
};

export default User;