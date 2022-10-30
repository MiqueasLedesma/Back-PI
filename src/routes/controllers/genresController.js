const { Genre } = require('../../db');

const getGenres = async (req, res) => {
    try {
        let info = await Genre.findAll();
        let arr = [];
        for (let genre of info) {
            if (!arr.includes(genre.name)) arr.push(genre.name)
        };
        return res.send(arr);
    } catch (error) {
        console.log(error.message);
        return res.status(400).send(error.message);
    };
};

module.exports = {
    getGenres
};