const { settings } = require("../routes");

//PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO DE DESARROLLO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASE DE DATOS
const urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;
process.env.URL_DB = urlDB;

//VENCIMIENTO DEL TOKEN 60seg, 60min, 24hs, 30dias
process.env.CADUCIDAD_TOKEN =  60 * 60 * 24 * 30;

//SEDD DE AUTENTICACION
process.env.SEED = process.env.SEED || 'cadena-comprobacion';

//CLIENT ID GOOGLE SYNC
process.env.CLIENTE_ID = process.env.CLIENTE_ID || '133645650926-nsng5i71vibevpabsfvf91br5l0eco63.apps.googleusercontent.com';

