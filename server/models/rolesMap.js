import mongoose from 'mongoose';

// Schema for permission of a role
const rolePermissionsSchema = new mongoose.Schema({
    role: String,
    projectPermissions: [{ type: String }],
    // Altri tipi di permessi
});

// Schema for roles collection
const rolesMapSchema = new mongoose.Schema({
    name: { type: String, enum: ['default', 'current'] }, 
    roles: [rolePermissionsSchema], // Array role objects
});

const RolesMap = mongoose.model('RolesMap', rolesMapSchema);

export default RolesMap;

