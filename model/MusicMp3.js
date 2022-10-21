const mongoose = require("mongoose");
const MusicMp3Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    describe: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = mongoose.model("MusicMp3", MusicMp3Schema);