const mongoose = require('mongoose')
const Schema = mongoose.Schema
     
const HighScoreSchema = new Schema({
    _id: { type: String },
    username: { type: String, required: true },
    highScores: { type: Object, required: true }
});

module.exports = mongoose.model('HighScore', HighScoreSchema);