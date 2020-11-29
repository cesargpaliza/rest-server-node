//PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO DE DESARROLLO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASE DE DATOS
const urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;


process.env.URL_DB = urlDB;
