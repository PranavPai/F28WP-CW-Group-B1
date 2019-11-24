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
    firstname: {
        type: String,
        trim: true,
        validate: (value) => {
            return validator.isAlpha(value)
        }
    },
    lastname: {
        type: String,
        trim: true,
        validate: (value) => {
            return validator.isAlpha(value)
        }
    },
    highscore: {
        numberOfKills: {
            type: Number
        },
        highestLevel: {
            type: Number
        },
        longestTimeAlive: {
            type: Number
        }
    },
    isOnline: {
        type: Boolean
    }
})

var User = mongoose.model('User', userSchema)

module.exports = User