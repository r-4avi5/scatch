const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        minlength: [3, "Full name must be at least 3 characters"],
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    products: {
        type: Array,
        default: [],
    },
    picture: {
        type: String,
    },
    gstin: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("owner", ownerSchema);
