import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
    key: { type: String, required: true },
    content: { type: String, required: true },
    sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', default: null },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
