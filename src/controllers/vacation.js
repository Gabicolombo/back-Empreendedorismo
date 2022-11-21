const Vacation = require('../schemas/vacation');
const User = require('../schemas/user');
// const Budget = require('../schemas/budget');
const { ObjectId } = require('mongodb');

const helperUpdate = async(nameVacation, key, array, cond, id=0)=>{
    if(cond){
        console.log('addArray');
        console.log(key);
        await Vacation.updateOne(
            { nome: nameVacation },
            { $push: { [key]: array}}
        ).then(err => console.log(err))
    }else{
        console.log('setArray')
        
        let key1 = key+'.id';
        let key2 = key+'.$';
        console.log(key1);
        console.log(key2);
        await Vacation.findOneAndUpdate(
            {nome: nameVacation},
            {'roteiro.id': id},
            {$set: {'roteiro.$': array}},
        ).then(msg => console.log(msg))
    }
    
}

const registerVacation = async(req, res, next) => {
    try{
        const {nome} = req.body;

        if(await Vacation.findOne({nome: nome})) return res.status(422).json({message: 'Essa viagem já existe'});

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
            if(req.body.addItem == true)
                await helperUpdate(nameVacation, 'hotel', req.body.hotel, req.body.addItem);
            else
                console.log(req.params.id);
                await helperUpdate(nameVacation, 'hotel', req.body.hotel[0], req.body.addItem, req.params.id);
            delete req.body.hotel;
        }

        // if(req.body.hasOwnProperty('checklist')){
        //     if(req.body.addItem == true)
        //         await helperUpdate(nameVacation, 'checklist', req.body.checklist, req.body.addItem);
        //     else
        //         await helperUpdate(nameVacation, 'checklist', req.body.checklist[0], req.body.addItem, req.params.id);
        //     delete req.body.checklist;
        // }

        if(req.body.hasOwnProperty('transportes')){
            if(req.body.addItem == true)
                await helperUpdate(nameVacation, 'transportes', req.body.transportes, req.body.addItem);
            else
                await helperUpdate(nameVacation, 'transportes', req.body.transportes[0], req.body.addItem, req.params.id);
            delete req.body.transportes;
        }

        if(req.body.hasOwnProperty('roteiro')){
            if(req.body.addItem == true)
                await helperUpdate(nameVacation, 'roteiro', req.body.roteiro, req.body.addItem);
            else
                await helperUpdate(nameVacation, 'roteiro', req.body.roteiro[0], req.body.addItem, req.params.id);
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
        
        if(!await Vacation.find( {
            $or: [ 
                {'proprietario.nome_usuario': {$ne: req.user.nome_usuario }}, 
                {participantes: {$nin: [req.user.nome_usuario]}} 
            ]
        }))
            return res.status(400).json({message: 'Você não tem acesso a essa viagem.'});

        let vacations = await Vacation.aggregate([
            {
                $match: {
                    $or: [ 
                        {'proprietario.nome_usuario': req.user.nome_usuario }, 
                        {participantes: {$in: [req.user.nome_usuario]}} 
                    ]
                }
            },
            {
                $project:{
                    nome: 1,
                    origem: 1,
                    destino: 1,
                    dataInicio: 1,
                    dataFim: 1,
                    roteiro: 1,
                    _id: 1
                }
            }
        ]).allowDiskUse(true);

        return res.status(200).json({data: vacations});

    }catch(err){
        console.error(err);
        next();
    }
}

// const getBudget = async(req, res, next) => {
//     try{
//         const idVacation = req.params.id;

//         const vacation = await Vacation.aggregate([
//             {
//                 $match: {
//                     _id: new ObjectId(idVacation)
//                 }
//             },
//             {
//                 $project:{

//                 }
//             }
//         ]).allowDiskUse(true);
        
//         if(!vacation) return res.status(400).json({message: 'Não existe esse nome de férias'});


        
//     }catch(err){
//         console.error(err);
//         next();
//     }
// }

const deleteVacation = async(req, res, next) => {
    try{
       
        const idVacation = req.params.id;

        const vacation = await Vacation({_id: new ObjectId(idVacation)});

        if(vacation.length < 1) return res.status(404).json({message: 'Férias não encontradas'});

        await Vacation.deleteOne({_id: new ObjectId(idVacation)});

        return res.status(200).json({message: 'Férias deletada com sucesso'});

    }catch(err){
        console.error(err);
        next();
    }
}

module.exports = {
    registerVacation,
    //updateVacation,
    getVacation,
    deleteVacation
}