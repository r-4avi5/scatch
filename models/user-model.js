const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }],
    contact: {
        type: Number,
    },
    picture: {
        type: String,
        default: "",
    },
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);
