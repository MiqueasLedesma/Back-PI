const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

const routeGenre = require('./routeGenres');
const routeVideogame = require('./routeVideogame');

router.use('/genres', routeGenre);
router.use('/videogames', routeVideogame);

module.exports = router;
