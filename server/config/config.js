//=======================
//Puerto
//======================

process.env.PORT = process.env.PORT || 3005;


//=======================
//Entorno
//======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=======================
//DB
//======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


let urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/CursoNodeDB' : process.env.MONGO_URI;

process.env.URLDB = urlDB;

//=======================
//Vencimiento token
//======================
process.env.CADUCIDAD_TOKEN = process.env.SEED || 60 * 60 * 60;


//=======================
//SEED del token 
//======================
process.env.SEED = 'secret-gon-node-si';

//=======================
//Google client
//======================
process.env.GOOGLE_CLIENT = process.env.GOOGLE_CLIENT || '338816405587-b94snmnd4i5lhcuob5k8l88va1l28o85.apps.googleusercontent.com';