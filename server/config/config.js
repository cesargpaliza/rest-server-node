//PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO DE DESARROLLO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASE DE DATOS
const urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe'
                                    : 'mongodb+srv://admuser:8sl0Y2j6VinQu83H@cluster0.2ydlt.mongodb.net/cafe';


process.env.URL_DB = urlDB;
