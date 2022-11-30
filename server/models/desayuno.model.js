const mongoose = require('mongoose');
const { intersection } = require('underscore');

let Schema = mongoose.Schema;

let desayunoSchema = new Schema({
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
    collection: "desayunos"
});

module.exports = mongoose.model('desayunos', desayunoSchema);