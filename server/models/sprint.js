// models/Sprint.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const sprintSchema = new Schema({
    name: { type: String, required: true },
    projectId: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    goal: { type: String, required: false },
});

const Sprint = mongoose.model('Sprint', sprintSchema);

export default Sprint;
