const mongoose = require('mongoose');


const gameSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    }
}, {
    timestamps: true
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;