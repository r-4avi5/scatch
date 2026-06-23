const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");

// Use MONGODB_URI from .env if available, else fall back to config package
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

mongoose
    .connect(`${MONGODB_URI}/scatch`)
    .then(function () {
        dbgr("MongoDB connected successfully");
    })
    .catch(function (err) {
        dbgr("MongoDB connection error:", err.message);
        process.exit(1); // Exit if DB can't connect
    });

module.exports = mongoose.connection;
