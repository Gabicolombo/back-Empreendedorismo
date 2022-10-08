const Vacation = require('../schemas/vacation');

const registerVacation = async(req, res, next) => {
    try{
        const {nome} = req.body;

        if(await Vacation.findOne({nome: nome})) return res.status(200).json({message: 'Essa viagem já existe'});

        req.body.proprietario = req.user;

        await Vacation.create(req.body);

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
                {proprietario: req.user.nome_usuario}, 
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

        let hotelArray = [{}]

        if(req.body.hasOwnProperty('hotel')){
            hotelArray = req.body.hotel;
            delete req.body.hotel;
        }

        let checklist = {}
        if(req.body.hasOwnProperty('checklist')){
            checklist = req.bodu.checklist;
            delete req.body.checklist;
        }

        let ida = {}
        if(req.body.hasOwnProperty('ida')){
            ida = req.body.ida;
            delete req.body.ida;
        }

        let volta = {}
        if(req.body.hasOwnProperty('volte')){
            volta = req.body.volta;
            delete req.body.volta;
        }
        
        await Vacation.updateOne(
            { nome: nameVacation },
            { $set: req.body },
            { $push: {hotel: hotelArray}},
            { $push: {ida: ida}},
            // { $push: {volta: volta}},
            // { $push: {checklist: checklist}},
            // checklist,
            // ida,
            // volta
        ).exec();
    
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