// models/sprint.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const sprintSchema = new Schema({
    name: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    goal: { type: String },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BacklogItem', default: [] }],
    status: { type: String, enum: ['Planned', 'Active', 'Completed'], default: 'Planned' },
    completedPoints: { type: Number, default: 0 }
});

const Sprint = mongoose.model('Sprint', sprintSchema);

export default Sprint;
