import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    name: String,
    permissions: [
        {
            role: {
                type: String,
                required: true,
            },
            permissions: {
                type:[String],
                required: true,
            },
        }]
});

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;