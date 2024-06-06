// models/rolesMap.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define Schema for permissions of a single role
const PermissionSchema = new Schema({
    project: [String],
    sprint: [String],
    backlog: [String],
    agile: [String],
    obstacle: [String],
    task: [String],
    collaboration: [String],
});

// Define Schema for a role with relative permissions
const RolePermissionsSchema = new Schema({
    role: { type: String, required: true },
    permissions: [{ type: Object }] 
});

// Define Schema for the whole collection
const RolesMapSchema = new Schema({
    name: { type: String, enum: ['default', 'current'], required: true },
    roles: [{
        role: { type: String, required: true },
        permissions: [{ type: Object }] 
    }]
});

const RolesMap = mongoose.model('RolesMap', RolesMapSchema);


export default RolesMap;

