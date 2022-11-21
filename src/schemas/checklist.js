const mongoose = require('mongoose');

const CheckListSchema = new mongoose.Schema({
    usuario:{
        type: mongoose.Schema.Types.String,
        ref: 'Usuarios'
    },
    viagem: {type: mongoose.Schema.Types.String, ref: 'Viagem'},
    status: {type: Boolean},
    descricao: {type: String},
    categoria: {type: String}
});

CheckListSchema.virtual('vacation', {
    ref:'Vacation',
    localField: 'nome',
    foreignField: 'viagem'  
});

CheckListSchema.virtual('user', {
    ref:'User',
    localField: 'nome_usuario',
    foreignField: 'usuario'  
});

CheckListSchema.pre('save', async function(next){
    const checklist = this;

    next();
});

const CheckList = mongoose.model('CheckList', CheckListSchema);
module.exports = CheckList;