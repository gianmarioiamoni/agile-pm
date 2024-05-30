import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
    title: { type: String, required: true, default: 'Untitled' },
    description: { type: String, required: true },
    backlogItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'BacklogItem', default: null },
    status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } 
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
