const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    isCompleted:{
        type: Boolean
    },
    todo: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

mongoose.models = {}
module.exports = mongoose.model('Crud', todoSchema)