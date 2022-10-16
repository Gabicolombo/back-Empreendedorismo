const Vacation = require('../schemas/vacation');
const User = require('../schemas/user');

const addArray = async(nameVacation, key, array)=>{
    console.log('addArray');
    let keyName = key;
    console.log(keyName);
    await Vacation.updateOne(
        { nome: nameVacation },
        { $push: { [key]: array}}
    ).then(err => console.log(err))
}

const registerVacation = async(req, res, next) => {
    try{
        const {nome} = req.body;

        if(await Vacation.findOne({nome: nome})) return res.status(200).json({message: 'Essa viagem já existe'});

        req.body.proprietario = req.user;

        await Vacation.create(req.body);
        
        await User.updateOne(
            {nome_usuario: req.user.nome_usuario}, 
            {$push: {viagens: req.body.nome}} 
        );

        return res.status(200).json({message: 'Cadastro feito com sucesso'});

    }catch(err){
        console.error(err);
        next();
    }
}

const updateVacation = async(req, res, next) => {
    try{
        console.log('updateVacation');
        console.log(req.params)
        const nameVacation = req.params.id;
        console.log(nameVacation)
        // verificar se o req.user.nome_usuario é igual proprietario
        const vacation = await Vacation.find({
            $and: [
                {'proprietario.nome_usuario': req.user.nome_usuario}, 
                {nome: nameVacation}
            ]
        });
        if(!vacation) 
            return res.status(400).json({message: 'Você não tem nenhuma viagem cadastrada'});
        
        // verificando os gastos
        if(req.body.hasOwnProperty('gastos')){
            req.body.gastos.alimentos ?  vacation.gastos.alimentos+=req.body.gastos.alimentos : vacation.gastos.alimentos+=0;
            req.body.gastos.transporte ?  vacation.gastos.transporte+=req.body.gastos.transporte : vacation.gastos.transporte+=0;
            req.body.gastos.hospedagem ?  vacation.gastos.hospedagem+=req.body.gastos.hospedagem : vacation.gastos.hospedagem+=0;
            req.body.gastos.objetos ?  vacation.gastos.objetos+=req.body.gastos.objetos : vacation.gastos.objetos+=0;
            req.body.gastos.saude ?  vacation.gastos.saude+=req.body.gastos.saude : vacation.gastos.saude+=0;
            req.body.gastos.outros ?  vacation.gastos.outros+=req.body.gastos.outros : vacation.gastos.outros+=0;
        }

        if(req.body.hasOwnProperty('hotel')){
            await addArray(nameVacation, 'hotel', req.body.hotel);
            delete req.body.hotel;
        }

        if(req.body.hasOwnProperty('checklist')){
            await addArray(nameVacation,'checklist', req.body.checklist);
            delete req.body.checklist;
        }

        if(req.body.hasOwnProperty('transportes')){
            await addArray(nameVacation, 'transportes', req.body.transportes);
            delete req.body.transportes;
        }

        if(req.body.hasOwnProperty('roteiro')){
            await addArray(nameVacation, 'roteiro', req.body.roteiro);
            delete req.body.roteiro;
        }
       
        await Vacation.updateOne(
            { nome: nameVacation },
            { $set: req.body },
        )
        
        res.status(200).json({ message: 'Atualizado com sucesso' });

    }catch(err){
        console.error(err);
        next();
    }
}

const getVacation = async(req, res, next) => {
    try{
        
        if(await Vacation.find( {
            $and: [ 
                {proprietario: {$ne: req.user.nome_usuario }}, 
                {participantes: {$nin: [req.user.nome_usuario]}} 
            ]
        }))
            return res.status(400).json({message: 'Você não tem acesso a essa viagem.'});

        let vacation = await Vacation.findOne({
            $or: [ 
                {proprietario: req.user.nome_usuario }, 
                {participantes: {$in: [req.user.nome_usuario]}} 
            ]
        })

        return res.status(200).json({data: vacation});


        // if(!await Vacation.find({proprietario: req.user.nome_usuario} ) ) 
        //     return res.status(400).json({message: 'Você não tem nenhuma viagem cadastrada'});

        // if(!await Vacation.find({participantes: {$in: [req.user.nome_usuario]}}))
        //     return res.status(400).json({message: 'Você não tem acesso a essa viagem'});

        

    }catch(err){
        console.error(err);
        next();
    }
}

module.exports = {
    registerVacation,
    updateVacation,
    getVacation
}