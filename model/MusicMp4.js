const mongoose = require("mongoose");
const MusicMp4Schema = new mongoose.Schema({
    keyId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    like: {
        type: Array,
        required: true,
    }
});

module.exports = mongoose.model("MusicMp4", MusicMp4Schema);