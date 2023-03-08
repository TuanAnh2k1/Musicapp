const mongoose = require("mongoose");
const ShirtSchema = new mongoose.Schema({
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
    price: {
        type: String,
        required: true,
    },
    supplier: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Shirt", ShirtSchema);