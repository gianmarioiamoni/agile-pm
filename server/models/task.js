import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
    key: { type: String, required: true },
    title: { type: String, required: true, default: 'Untitled' },
    content: { type: String, required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'BacklogItem', default: null },
    sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', default: null }, // TO BE REMOVED
    status: { type: String, required: true, default: 'To Do' } // 'To Do', 'In Progress', 'Done'
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
