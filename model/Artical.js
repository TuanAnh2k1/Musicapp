const mongoose = require("mongoose");

const ArticalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model("Artical", ArticalSchema);