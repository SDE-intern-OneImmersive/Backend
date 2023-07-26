const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TestModel = new Schema({
    name: String,
    Registry: String
})

module.exports = mongoose.model('TestModel', TestModel);