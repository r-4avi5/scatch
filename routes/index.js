const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", function (req, res) {
    res.render("index", { loggedin: false, ...req.getFlash() });
});

router.get("/shop", isLoggedIn, async function (req, res) {
    try {
        let { sortby, filter } = req.query;
        let query = {};
        if (filter === "discounted") query.discount = { $gt: 0 };
        let sortOption = { createdAt: -1 };
        if (sortby === "price_asc")  sortOption = { price: 1 };
        if (sortby === "price_desc") sortOption = { price: -1 };
        let products = await productModel.find(query).sort(sortOption);
        res.render("shop", { products, ...req.getFlash() });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/shop");
    }
});

router.get("/cart", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel
            .findOne({ email: req.user.email })
            .populate("cart");
        const bill = !user.cart || user.cart.length === 0 ? 0 :
            user.cart.reduce((t, item) => t + (Number(item.price) - Number(item.discount)), 0) + 20;
        res.render("cart", { user, bill, ...req.getFlash() });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/shop");
    }
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        const alreadyInCart = user.cart.some(id => id.toString() === req.params.productid);
        if (alreadyInCart) {
            req.flash("error", "Product already in cart");
            return res.redirect("/shop");
        }
        user.cart.push(req.params.productid);
        await user.save();
        req.flash("success", "Added to cart!");
        res.redirect("/shop");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/shop");
    }
});

router.get("/removefromcart/:productid", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        user.cart = user.cart.filter(id => id.toString() !== req.params.productid);
        await user.save();
        req.flash("success", "Removed from cart");
        res.redirect("/cart");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/cart");
    }
});

router.get("/logout", isLoggedIn, function (req, res) {
    res.clearCookie("token");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
});

module.exports = router;
