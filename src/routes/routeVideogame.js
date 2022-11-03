const { Router } = require('express');
const { getVideogames, createVideogame, searchGame, getGamesDetail } = require('./controllers/videogameControllers');


const router = Router();

router.get('/', getVideogames);
router.post('/', createVideogame);
router.get('/search', searchGame);
router.get('/detail', getGamesDetail);

module.exports = router;