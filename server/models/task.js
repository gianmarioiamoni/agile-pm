import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
    key: { type: String, required: true },
    title: { type: String, required: true, default: 'Untitled' },
    content: { type: String, required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'BacklogItem', default: null },
    sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', default: null },
    status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } 
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
