const mongoose = require('mongoose');
const { intersection } = require('underscore');

let Schema = mongoose.Schema;

let colacionesSchema = new Schema({
    name: {
        type: String
    },
    ingredientes: {
        type: String
    },
    calorias: {
        type: String
    },
    porciones:{
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "colaciones"
});

module.exports = mongoose.model('colaciones', colacionesSchema);