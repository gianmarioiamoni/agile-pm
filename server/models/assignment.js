import mongoose from 'mongoose';


const assignmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    role: {
        type: Number,
        required: true
    },
    roleDescription: {
        type: String,
        required: true
    }
}, { timestamps: true });


const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;


