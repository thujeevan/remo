import {v4} from 'node-uuid';

import Alert, {createAlert} from './alert';

export const BadRequestError = createAlert('error', 'BadRequestError');
export const InternalServerError = createAlert('error', 'InternalServerError');
export const NoPermissionError = createAlert('error', 'NoPermissionError');
export const UnauthorizedError = createAlert('error', 'UnauthorizedError');
export const NotFoundError = createAlert('error', 'NotFoundError');

export class ValidationError extends createAlert('error', 'ValidationError') {
    getErrors() {
        let errors = [];
        Object.keys(this.errors).forEach(field => {
            if (this.errors[field].length) {
                errors = errors.concat(this.errors[field]);
            }
        });
        return errors;
    }
}