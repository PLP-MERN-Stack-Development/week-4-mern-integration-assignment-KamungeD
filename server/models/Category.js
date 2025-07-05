const mongoose = require('mongoose');

// Category schema
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Category', CategorySchema);