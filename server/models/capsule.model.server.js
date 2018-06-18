'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CapsuleSchema = new Schema({
    name: {
        type:String,
        trim: true
    },
    price: {
        type: Number
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String
    },
    strength: {
        type: Number,
        default: 0
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    company: {
        type: String
    }
});

mongoose.model('Capsule', CapsuleSchema);