import mongoose from 'mongoose';

const roleDefaultSchema = new mongoose.Schema({
    roleId: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },
    roleDescription: {
        type: String,
        // required: true,
    },
});  

const RoleDefault = mongoose.model('DefaultRole', roleDefaultSchema);

export default RoleDefault;