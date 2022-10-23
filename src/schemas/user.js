const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/off.json');

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    nome_usuario:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    senha: {
        type: String,
        trim: true,
        select: false,
        required: true
    },
    viagens: [{
        type: mongoose.Schema.Types.String,
        ref: 'Viagem'
    }],
    checklist: [{
        id: {type: Number},
        viagem: {type: mongoose.Schema.Types.String, ref: 'Viagem'},
        status: {type: Boolean},
        descricao: {type: String},
        categoria: {type: String}
    }],
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

});

// verificar o usuário premium

// UserSchema.virtual('itinerary', {
//     ref:'Itinerary',
//     localField: 'usuario',
//     foreignField: 'nome_usuario'
// })

UserSchema.virtual('vacation', {
    ref:'Vacation',
    localField: 'proprietario',
    foreignField: 'nome_usuario'  
}, {
    ref:'Vacation',
    localField: 'participantes',
    foreignField: 'nome_usuario'  
})

UserSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user.id.toString()}, config.secret)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

UserSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('senha')){
        user.senha = await bcryptjs.hash(user.senha, 8);
    }

    next();
});

const User = mongoose.model('Usuários', UserSchema);
module.exports = User;