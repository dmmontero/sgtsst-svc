/** Port configuration (for node API) */
process.env.PORT = process.env.PORT || 8088;

/**
 * Entorno NODE
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/**
 * Token expitation time (24 hours)
 */
process.env.CADUCIDAD_TOKEN = '24 hours';

/**
 * Token seed
 */
process.env.SEED = process.env.SEED || "token-seed-sgsst";

/**
 * Entorno base de datos
 */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/sgsst';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;
