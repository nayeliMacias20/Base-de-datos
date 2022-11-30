const mongoose = require('mongoose');
const { intersection } = require('underscore');

let Schema = mongoose.Schema;

let cenasSchema = new Schema({
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
    collection: "cena"
});

module.exports = mongoose.model('cena', cenasSchema);