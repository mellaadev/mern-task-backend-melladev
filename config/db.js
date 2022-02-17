const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO);
        console.log("Database's app connected...");
    } catch (error) {
        console.log(error);
        process.exit(1); // DETENER LA APP EN CASO DE QUE HAYA UN ERROR EN LA CONEXIÓN A LA DB
    }
}

module.exports = conectarDB;