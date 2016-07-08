import {Record} from 'immutable';
import {v4} from 'node-uuid';
import {capitalize} from 'lodash/string';

const AlertClass = Record({
    id: null,
    type: '',
    name: '',
    status: null,
    reason: '',
    message: null,
    stack: null,
    errors: null
});

export default AlertClass;

export function createAlert(type, name) {
    name = name || capitalize(type);
    
    return class Alert extends AlertClass {
        constructor(props) {
            super({id: v4(), type, name, ...props});
        }
    };
}

export const Success = createAlert('success');
export const Info = createAlert('info');
export const Warning = createAlert('warning');