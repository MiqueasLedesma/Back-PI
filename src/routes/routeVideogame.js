const { Router } = require('express');
const { getVideogames, createVideogame, searchGame, getGamesDetail, getFiltredGames } = require('./controllers/videogameControllers');


const router = Router();

router.post('/', createVideogame);
router.get('/', getVideogames);
router.get('/search', searchGame);
router.get('/detail', getGamesDetail);
router.get('/filter', getFiltredGames);

module.exports = router;