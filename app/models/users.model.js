const mongoose = require('mongoose');
const { intersection } = require('underscore');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La password es necesaria']
    },
    caloriastotales: {
        type: String,
        required: [true, 'Las calorias son necesarias']
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "user"
});

module.exports = mongoose.model('user', userSchema);