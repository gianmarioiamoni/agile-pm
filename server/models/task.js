// models/task.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
    title: { type: String, required: true, default: 'Untitled' },
    description: { type: String, required: true },
    backlogItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'BacklogItem', default: null },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
    points: { type: Number, default: 0, required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    order: { type: Number, default: 0 },
}, { timestamps: true }); // Add timestamp to store creation and update dates);

const Task = mongoose.model('Task', taskSchema);

export default Task;
