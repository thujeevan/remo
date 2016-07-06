import {List, Map, fromJS, Record} from 'immutable';
import {v4} from 'node-uuid';

const error = Record({
    id: v4(),
    name: '',
    reason: '',
    status: null,
    stack: {},
    errors: []
});

export class BadRequestError extends error {
    constructor(props) {
        super({status: 400, name: 'BadRequestError', ...props});
    }
}

export class InternalServerError extends error {
    constructor(props) {
        super({status: 500, name: 'InternalServerError', ...props});
    }
}

export class NoPermissionError extends error {
    constructor(props) {
        super({status: 403, name: 'NoPermissionError', ...props});
    }
}

export class UnauthorizedError extends error {
    constructor(props) {
        super({status: 401, name: 'UnauthorizedError', ...props});
    }
}

export class ValidationError extends error {
    constructor(props) {
        super({status: 422, name: 'ValidationError', ...props});
    }
    
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

export class NotFoundError extends error {
    constructor(props) {
        super({status: 404, name: 'NotFoundError', ...props});
    }
}