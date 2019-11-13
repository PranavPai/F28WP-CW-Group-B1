let mongoose = require('mongoose')
let validator = require('validator')

let playerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isAlpha(value)
        }
    },
    lastname: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isAlpha(value)
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
        validate: (value) => {
            return validator.isAlphanumeric(value)
        }
    },
    password: {
        type: String,
        required: true
    },
    player_position: {
        x: {
            type: Number
        },
        y: {
            type: Number
        }
    },
    isOnline: {
        type: Boolean
    }
})

module.exports = mongoose.model('Player', playerSchema)