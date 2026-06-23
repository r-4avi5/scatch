const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

// Home page
router.get("/", function (req, res) {
    let error = req.flash("error");
    let success = req.flash("success");
    res.render("index", { loggedin: false, error, success });
});

// Shop page — lists products with sort and filter support
router.get("/shop", isLoggedIn, async function (req, res) {
    try {
        let { sortby, filter } = req.query;

        let query = {};
        if (filter === "discounted") query.discount = { $gt: 0 };

        let sortOption = { createdAt: -1 }; // default: newest
        if (sortby === "popular")    sortOption = { createdAt: -1 };
        if (sortby === "newest")     sortOption = { createdAt: -1 };
        if (sortby === "price_asc")  sortOption = { price: 1 };
        if (sortby === "price_desc") sortOption = { price: -1 };

        let products = await productModel.find(query).sort(sortOption);
        let success = req.flash("success");
        let error = req.flash("error");
        res.render("shop", { products, success, error });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/");
    }
});

// Cart page — shows items in the user's cart with full bill
router.get("/cart", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel
            .findOne({ email: req.user.email })
            .populate("cart");

        let success = req.flash("success");
        let error = req.flash("error");

        if (!user.cart || user.cart.length === 0) {
            return res.render("cart", { user, bill: 0, success, error });
        }

        // Total bill: sum of (price - discount) for each item + ₹20 platform fee
        const bill = user.cart.reduce((total, item) => {
            return total + (Number(item.price) - Number(item.discount));
        }, 0) + 20;

        res.render("cart", { user, bill, success, error });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/shop");
    }
});

// Add a product to cart
router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        // Prevent duplicate — compare as strings since cart stores ObjectIds
        const alreadyInCart = user.cart.some(
            (id) => id.toString() === req.params.productid
        );
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

// Remove a product from cart
router.get("/removefromcart/:productid", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        user.cart = user.cart.filter(
            (id) => id.toString() !== req.params.productid
        );
        await user.save();

        req.flash("success", "Removed from cart");
        res.redirect("/cart");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/cart");
    }
});

// Logout
router.get("/logout", isLoggedIn, function (req, res) {
    res.clearCookie("token");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
});

module.exports = router;
