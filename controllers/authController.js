const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;

        // Validate inputs
        if (!email || !password || !fullname) {
            req.flash("error", "All fields are required");
            return res.redirect("/");
        }

        if (password.length < 6) {
            req.flash("error", "Password must be at least 6 characters");
            return res.redirect("/");
        }

        // Check if user already exists
        let existingUser = await userModel.findOne({ email });
        if (existingUser) {
            req.flash("error", "An account with this email already exists");
            return res.redirect("/");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create user
        let user = await userModel.create({
            fullname,
            email,
            password: hash,
        });

        let token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.redirect("/shop");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/");
    }
};

module.exports.loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            req.flash("error", "Email and password are required");
            return res.redirect("/");
        }

        let user = await userModel.findOne({ email });
        if (!user) {
            req.flash("error", "Email or password incorrect");
            return res.redirect("/");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash("error", "Email or password incorrect");
            return res.redirect("/");
        }

        let token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.redirect("/shop");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/");
    }
};

module.exports.logout = function (req, res) {
    res.clearCookie("token");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
};
