const mongoose = require('mongoose');
const { intersection } = require('underscore');

let Schema = mongoose.Schema;

let comidaSchema = new Schema({
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
    collection: "comida"
});

module.exports = mongoose.model('comida', comidaSchema);