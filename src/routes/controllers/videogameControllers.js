require('dotenv').config();
const { API_KEY } = process.env;
const axios = require('axios');
const { Op } = require('sequelize');
const { Videogame, Genre } = require('../../db');

const getVideogames = async (req, res) => {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);
    let page = 0;
    let size = 12;
    let type = req.query.type || 'id';
    let sort = req.query.sort || 'DESC';
    if (!Number.isNaN(pageAsNumber) && pageAsNumber >= 0) page = pageAsNumber;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber >= 1) size = sizeAsNumber;
    try {
        await Videogame.findAndCountAll({
            where: {
                status: 'true'
            },
            limit: size,
            offset: page * size,
            include: [
                Genre
            ],
            order: [
                [type, sort]
            ]
        })
            .then(r => res.send({
                content: r.rows,
                pages: Math.ceil(r.count / (size * 2) - 1)
            }));
    } catch (error) {
        console.log(error.message);
        return res.status(400).send(error.message);
    };
};

const createVideogame = async (req, res) => {
    const { name, description, platforms, rating, genres } = req.body;
    if (!name || !description || !platforms || !rating || !genres) return res.status(400).send('You must complete the entire form');
    try {
        let newGame = await Videogame.create({
            name,
            description,
            platforms,
            rating
        })
        console.log(newGame);
        for (let i = 0; i < genres.length; i++) {
            await Genre.findAll({
                where: {
                    name: genres[i]
                }
            })
                .then(r => newGame.addGenre(r))
        }

        return res.send('Videogame has been created!');

    } catch (error) {
        console.log(error.message);
        return res.status(400).send(error.message);
    }
}

const searchGame = async (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).send('This require a name for search!');
    try {
        let gamesFromApi = await axios.get(`https://api.rawg.io/api/games?search=${name.split(' ').join('-')}&key=${API_KEY}`)
            .then(r => r.data.results)

        let apiGamesRefact = gamesFromApi.map(e => {
            return {
                name: e.name,
                released: e.released,
                image: e.background_image,
                rating: e.rating,
                platforms: e.platforms.map(ch => ch.platform),
                fromApi: e.id,
                genres: e.genres
            }
        });

        let gamesFromDB = await Videogame.findAll({
            where: {
                name: {
                    [Op.iLike]: '%' + name + '%'
                }
            }
        })

        return res.send(gamesFromDB.concat(apiGamesRefact).slice(0, 15));

    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
}

const getGamesDetail = async (req, res) => {
    let { id } = req.query;
    if (Number.isNaN(Number(id))) {
        try {
            await Videogame.findByPk(id).then(r => res.send(r));
            return;
        } catch (error) {
            console.log(error.message);
            return res.status(400).send(error.message);
        }
    }
    else {
        try {
            await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
                .then(r => r.data)
                .then(e => res.send({
                    id: e.id,
                    name: e.name,
                    released: e.released,
                    image: e.background_image,
                    platforms: e.platforms.map(ch => ch.platform.name),
                    description: e.description,
                    rating: e.rating
                }))
        } catch (error) {
            console.log(error.message);
            return res.status(400).send(error.message);
        }
    }
}

module.exports = {
    getVideogames,
    createVideogame,
    searchGame,
    getGamesDetail
};


// .map(e => {
//     return {

//     }
// })