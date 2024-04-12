// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true, 
    },
}, { timestamps: true }); // Add timestamp to store creation and update dates 

const Project = mongoose.model('Project', projectSchema);

export default Project;

