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
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    completedTasks: {
        type: Number,
        default: 0
    },
    pendingTasks: {
        type: Number,
        default: 0
    },
    performance: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;



