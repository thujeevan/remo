import {Schema, arrayOf} from 'normalizr';
import isEqual from 'lodash/isEqual';

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
    permissions: arrayOf(permissionSchema)
});

const userSchema = new Schema('users', {
    idAttribute: user => user.uid
});
userSchema.define({
    primary_group: groupSchema,
    groups: arrayOf(groupSchema)
});

export const Schemas = {
    SESSION: sessionSchema,
    PERMISSION: permissionSchema,
    PERMISSION_ARRAY: arrayOf(permissionSchema),
    GROUP: groupSchema,
    GROUP_ARRAY: arrayOf(groupSchema),
    USER_SCHEMA: userSchema,
    USERS_SCHEMA: {
        users: arrayOf(userSchema)
    }
};

export const options = {
    USER_SCHEMA: {
        mergeIntoEntity: (entityA, entityB, entityKey) => {
            if (entityKey == 'user_group') return;
            
            for (let key in entityB) {
                if (!entityB.hasOwnProperty(key)) {
                    continue;
                }

                if (!entityA.hasOwnProperty(key) || isEqual(entityA[key], entityB[key])) {
                    entityA[key] = entityB[key];
                    continue;
                }
            }
        }
    }
}