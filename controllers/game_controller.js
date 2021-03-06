const Game = require('../models/game_data')

module.exports.create = async function (req, res) {
    const filter = { user: req.user._id };

    let temp1 = Game.find(filter, async function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            if (docs.length > 0) {
                console.log("User already exists. ");
                // console.log("docs.length = ", docs.length);
                console.log("score = ", docs[0].score);

                // temp1.score = req.body.score;
                // temp1.save();
                if (docs[0].score < req.body.score) {
                    const update = { score: req.body.score };
                    await Game.updateOne(filter, update);
                }

            } else {
                Game.create({
                    score: req.body.score,
                    user: req.user._id
                }, function (err, game) {
                    console.log("req.body: ", req.body);
                    if (err) { console.log('error in creating a post'); return; }
                    console.log("content: ", req.body.score);
                    return res.redirect('back');
                });
            }
        }
    });

}