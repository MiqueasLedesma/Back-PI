require('dotenv').config();
const { API_KEY } = process.env;
const axios = require('axios');
const { Genre, Videogame } = require('./db');

const injectGenres = async () => {
    let genres;
    try {
        await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`).then(r => genres = r.data.results.map(p => p.name))
        genres.forEach(e => {
            Genre.findOrCreate({
                where: {
                    name: e
                }
            });
        });
    } catch (e) {
        console.log(e);
    };
};

const InjectVideogames = async () => {

    let iHaveGames = await Videogame.findAll();

    if (iHaveGames.length > 0) return;

    let info = [];
    try {
        await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=100`)
            .then(r => info = r.data.results);
        await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=2&page_size=100`)
            .then(r => info = info.concat(r.data.results));
        await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=3&page_size=100`)
            .then(r => info = info.concat(r.data.results))
        let response = info.map(e => {
            return {
                fromApi: e.id,
                name: e.name,
                image: e.background_image,
                released: e.released,
                rating: e.rating,
                platforms: e.platforms.map(ch => ch.platform.name),
                genres: e.genres.map(ch => ch.name)
            }
        }).slice(0, 100);

        response.forEach(async e => {
            let newGame = await Videogame.findOrCreate({
                where: {
                    fromApi: e.fromApi,
                    name: e.name,
                    released: e.released,
                    rating: e.rating,
                    platforms: e.platforms,
                    image: e.image,
                    description: await axios.get(`https://api.rawg.io/api/games/${e.fromApi}?key=${API_KEY}`).then(r => r.data.description)
                }
            })

            for (let i = 0; i < e.genres.length; i++) {
                await Genre.findAll({
                    where: {
                        name: e.genres[i]
                    }
                })
                    .then(r => newGame[0].addGenre(r))
            }
        })
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    InjectVideogames,
    injectGenres
};