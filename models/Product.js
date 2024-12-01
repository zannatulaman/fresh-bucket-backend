const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        price: {
            type: Number,
            required: true
        },
        review: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
           
        },
        type:{
            type: String,
            required: true
        },
        image: {
            type: String
        },
        category:{
            type: Number,
            required: true
        },

}, {timestamps: true})

module.exports = mongoose.model("product", productSchema);