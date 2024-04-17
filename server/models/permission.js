import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    role: String,
    permissions: [String]
});

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;