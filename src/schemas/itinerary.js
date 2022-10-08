const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.String,
        ref: 'Usuarios'
    },
    itinerario: [{
        dia: {type: Number},
        hora: {type: Number},
        local: {type: String},
        descricao: {type: String}
    }]
})

ItinerarySchema.virtual('vacation', {
    ref:'Vacation',
    localField: 'roteiro',
    foreignField: 'itinerario'
})

ItinerarySchema.pre('save', async function(next){
    const itinerary = this;

    next();
});

const Itinerary = mongoose.model('Roteiros', ItinerarySchema);
module.exports = Itinerary;