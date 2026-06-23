const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owner-model");

module.exports = async function (req, res, next) {
    if (!req.cookies.ownerToken || req.cookies.ownerToken === "") {
        req.flash("error", "Owner login required");
        return res.redirect("/owners/login");
    }

    try {
        let decoded = jwt.verify(req.cookies.ownerToken, process.env.JWT_KEY);
        let owner = await ownerModel
            .findOne({ email: decoded.email })
            .select("-password");

        if (!owner) {
            req.flash("error", "Owner not found. Please login again.");
            return res.redirect("/owners/login");
        }

        req.owner = owner;
        next();
    } catch (err) {
        req.flash("error", "Session expired. Please login again.");
        res.clearCookie("ownerToken");
        return res.redirect("/owners/login");
    }
};
