const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CandidateSchema = new Schema({
    firstName: String,
    lastName: String,
    status: String,
    lastContact: String,
    matchScore: Number,
    phoneNumber: String
});

module.exports = mongoose.model('Candidate', CandidateSchema);