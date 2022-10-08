const mongoose = require('mongoose');

const VacationSchema = new mongoose.Schema({
    nome: {
       type: String,
       required: true,
       unique: true 
    },
    origem:{
        type: String,
        required: true
    },
    destino: {
        type: String,
        required: true
    },
    ida: {
        transportes: [{
            tipo: {type: String},
            descricao: {type: String},
            horario: {type: String}
        }],
    },
    volta: {
        transportes: [{
            tipo: {type: String},
            descricao: {type: String},
            horario: {type: String}
        }],
    },
    proprietario: {
        type: mongoose.Schema.Types.Object,
        ref: 'Usuarios'
    },
    participantes: [{
        type: mongoose.Schema.Types.String,
        unique: true,
        ref: 'Usuarios' 
    }],
    checklist: [{
        status: {type: Boolean},
        categoria: {type: String}
    }],
    gastos: {
        alimentos: {type: Number},
        transporte: {type: Number},
        hospedagem: {type: Number},
        objetos: {type: Number},
        saude: {type: Number},
        outros: {type: Number}
    },
    hotel: [{
        nome: {type: String},
        endereco: {type: String},
        check_in: {type: String},
        check_out: {type: String}
    }],
    roteiro: {
        type: mongoose.Schema.Types.Array,
        ref: 'Roteiro'
    },
    orcamento_total: {
        type: Number
    }
})

VacationSchema.virtual('users', {
    ref:'User',
    localField: 'viagens',
    foreignField: 'nome'
})

VacationSchema.pre('save', async function(next){
    const vacation = this;

    next();
});

const Vacation = mongoose.model('Produtos', VacationSchema);
module.exports = Vacation;