const CheckList = require('../schemas/checklist');
const User = require('../schemas/user');
const Vacation = require('../schemas/vacation');
const { ObjectId } = require('mongodb');

const getChecklist = async(req, res, next)=>{
    try{
        // verificando o usuário autenticado
        const user = req.user.nome_usuario;
        const idTravel = req.query.id_viagem;

        const vacation = await Vacation.findOne({_id: new ObjectId(idTravel)});
      
        let result = [];

        // categoria da home - Documentos
        if(req.query.hasOwnProperty('categoria')){
            result = await CheckList.aggregate([
                {
                    $match:{usuario: user, categoria: req.query.categoria}
                },
                {
                    $project:{
                        usuario: 1,
                        viagem: 1,
                        categoria: 1,
                        descricao: 1,
                        status: 1
                    }
                },
                {
                    $group:{
                        _id: '$viagem',
                        info: {
                            $push: {
                              categoria: '$categoria',
                              id: '$_id',
                              descricao: '$descricao',
                              status: '$status'
                            }
                        }
                    }
                }
            ]).allowDiskUse(true);
        }else{
     
            result = await CheckList.aggregate([
                {
                    $match:{usuario: user, viagem:vacation.nome}
                },
                {
                    $group: {
                        _id: "$categoria",
                        info: {
                            $push: {
                                descricao: "$descricao",
                                status: "$status",
                                id: '$_id'
                            },
                        },
                    },
                }
            ]).allowDiskUse(true);
        }
      
        return res.status(200).json(result);


    }catch(err){
        console.error(err);
        next();
    }
}

const putChecklist = async(req, res, next) => {
    try{

        const id = req.params.id;
      
        let user = await User.find({nome_usuario: req.user.nome_usuario});

        if(!user) return res.status(404).json({message: 'Esse usuário não tem acesso'});

        await CheckList.findByIdAndUpdate(id, {$set : req.body});

        return res.status(200).json({message: 'Atualizado com sucesso'});

    }catch(err){
        console.error(err);
        next();
    }
}

const postChecklist = async(req, res, next)=>{
    try{

        req.body.usuario = req.user.nome_usuario;

        let {viagem} = req.body;
    
        let result = await User.find(
            {
                $and: [ 
                    {viagens:{$in: [viagem]}}, 
                    {nome_usuario: req.user.nome_usuario}
                ]
            }
        )

        if(result.length === 0 ) 
            return res.status(400).json({message: 'Você não tem acesso a essa viagem.'});

        await CheckList.create(req.body);

        return res.status(200).json({message: 'Criado com Sucesso'});


    }catch(err){
        console.error(err);
        next();
    }
}

module.exports = {
    postChecklist,
    getChecklist,
    putChecklist
}