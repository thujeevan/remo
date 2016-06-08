import {Schema, arrayOf} from 'normalizr';

const sessionSchema = new Schema('sessions', {
    idAttribute: session => sesssion.key
});

const permissionSchema = new Schema('permissions', {
    idAttribute: permission => permission.key
});

const groupSchema = new Schema('groups', {
    idAttribute: group => group.uid
});

sessionSchema.define({
    permissions: arrayOf(permissionSchema),
    primary_group: groupSchema
});

export const Schemas = {
    SESSION: sessionSchema,
    PERMISSION: permissionSchema,
    PERMISSION_ARRAY: arrayOf(permissionSchema),
    GROUP: groupSchema,
    GROUP_ARRAY: arrayOf(groupSchema)
};