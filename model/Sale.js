const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
    phan_tram: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model("Sale", SaleSchema);