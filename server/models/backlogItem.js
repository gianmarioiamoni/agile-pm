import mongoose from 'mongoose';

const { Schema } = mongoose;

const backlogItemSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    priority: {
        type: Number,
        default: 1
    },
    points: {
        type: Number,
        default: 0,
        required: true
    },
    sprint: {
        type: Schema.Types.ObjectId,
        ref: 'Sprint',
        default: null
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task', default: [] }],
    status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BacklogItem = mongoose.model('BacklogItem', backlogItemSchema);

export default BacklogItem;
