const { Router } = require('express');
const { getVideogames, createVideogame, searchGame } = require('./controllers/videogameControllers');


const router = Router();

router.get('/', getVideogames);
router.post('/', createVideogame);
router.get('/search', searchGame);

module.exports = router;