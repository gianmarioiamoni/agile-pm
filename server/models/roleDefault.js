import mongoose from 'mongoose';

const roleDefaultSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },
    description: {
        type: String,
        required: true,
    },
});  

const RoleDefault = mongoose.model('RoleDefault', roleDefaultSchema);

export default RoleDefault;