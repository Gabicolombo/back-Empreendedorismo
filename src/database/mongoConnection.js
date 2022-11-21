const mongoose = require('mongoose');

module.exports = async() => {
    try{
        // const url = "mongodb://localhost/Empreendedorismo";
        const url = "mongodb+srv://sua-mochila:empreendedorismo@cluster0.d8qvk54.mongodb.net/?retryWrites=true&w=majority";
        await mongoose.connect(url);
        console.log('Connected to database');
    }catch(err){
        console.error(err.message());
    }
}