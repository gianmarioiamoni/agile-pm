// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    // altri campi...
});

module.exports = mongoose.model('Project', projectSchema);
