const mongoose = require('mongoose');

const VacationSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    origem: {
        type: String,
        required: true
    },
    destino: {
        type: String,
        required: true
    },
    dataInicio: {
        type: String,
        required: true
    },
    dataFim: {
        type: String,
        required: true
    },
    transportes: [{ // primeira tela junto com hotel
        id: { type: Number },
        tipo: { type: String }, // transporte
        descricao: { type: String },
        data: { type: String }, // talvez vai mudar para date
        caminho: { type: String } // ida e volta
    }],
    proprietario: {
        type: mongoose.Schema.Types.Object,
        ref: 'Usuarios'
    },
    participantes: [{
        type: mongoose.Schema.Types.Object,
        ref: 'Usuarios',
        unique: false
    }],
    gastos: {
        type: mongoose.Schema.Types.Object,
        ref: 'Orçamentos'
    },
    gastos: { // outra tela 2ª tela
        type: Object,
        alimentos: { type: Number },
        transporte: { type: Number },
        hospedagem: { type: Number },
        objetos: { type: Number },
        saude: { type: Number },
        outros: { type: Number }

    },
    hotel: [{  // primeira tela junto com transporte
        id: { type: Number },
        nome: { type: String },
        endereco: { type: String },
        check_in: { type: String }, // talvez vai mudar o tipo
        check_out: { type: String } // talvez vai mudar o tipo
    }],
    roteiro: [{ // 3ª tela
        id: { type: Number },
        dia: { type: Number },
        hora: { type: Number },
        local: { type: String },
        descricao: { type: String }
    }],
    total_disponivel: { // 2ª tela
        type: Number,
        required: true
    },
    gasto_total: { // 2ª tela
        type: Number
    }
})

VacationSchema.virtual('users', {
    ref: 'User',
    localField: 'viagens',
    foreignField: 'nome'
}
    , { ref: 'Budget', localField: '_id', foreignField: 'orçamento' }
)

VacationSchema.pre('save', async function (next) {
    const vacation = this;

    next();
});

const Vacation = mongoose.model('Férias', VacationSchema);
module.exports = Vacation;