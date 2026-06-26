const ownerModel = require("../models/owner-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.loginOwner = async function (req, res) {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            req.flash("error", "Email and password are required");
            return res.redirect("/owners/login");
        }
        let owner = await ownerModel.findOne({ email });
        if (!owner) {
            req.flash("error", "Invalid email or password");
            return res.redirect("/owners/login");
        }
        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) {
            req.flash("error", "Invalid email or password");
            return res.redirect("/owners/login");
        }
        let token = jwt.sign(
            { email: owner.email, id: owner._id },
            process.env.JWT_KEY,
            { expiresIn: "1d" }
        );
        res.cookie("ownerToken", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.redirect("/owners/admin");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/owners/login");
    }
};

module.exports.logoutOwner = function (req, res) {
    res.clearCookie("ownerToken");
    req.flash("success", "Logged out successfully");
    res.redirect("/owners/login");
};
