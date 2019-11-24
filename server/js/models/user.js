let mongoose = require('mongoose')
let validator = require('validator')

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
        validate: (value) => {
            return validator.isAlphanumeric(value)
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
    password: {
        type: String,
        required: true
    },
    highscore: {
        highestNumberOfKills: {
            type: Number
        },
        highestLevel: {
            type: Number
        },
        longestTimeAlive: {
            type: Number
        }
    }
})

var User = mongoose.model('User', userSchema)

module.exports = User