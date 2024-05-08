import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    roleKey: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },
    roleDescription: {
        type: String,
        // required: true,
    }
});  

const Role = mongoose.model('Role', roleSchema);

export default Role;