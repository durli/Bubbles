const Game = require('../models/game_data');

module.exports.home = function (req, res) {
    Game.find({}).populate('user').exec(function (err, games) {
        return res.render('home', {
            title: "Home",
            games: games
        });
    })

}
