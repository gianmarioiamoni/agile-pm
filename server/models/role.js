import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: String,
    roles: [
        {
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
        }]
});  

const Role = mongoose.model('Role', roleSchema);

export default Role;