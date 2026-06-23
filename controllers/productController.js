const productModel = require("../models/product-model");

// POST /products/create — create a new product
module.exports.createProduct = async function (req, res) {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        if (!req.file) {
            req.flash("error", "Product image is required");
            return res.redirect("/products/create-page");
        }

        if (!name || !price) {
            req.flash("error", "Product name and price are required");
            return res.redirect("/products/create-page");
        }

        if (Number(discount) >= Number(price)) {
            req.flash("error", "Discount cannot be equal to or greater than the price");
            return res.redirect("/products/create-page");
        }

        await productModel.create({
            image: req.file.buffer,
            name: name.trim(),
            price: Number(price),
            discount: Number(discount) || 0,
            bgcolor:    bgcolor    || "#ffffff",
            panelcolor: panelcolor || "#ffffff",
            textcolor:  textcolor  || "#000000",
        });

        req.flash("success", `"${name}" created successfully!`);
        res.redirect("/owners/admin");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/products/create-page");
    }
};

// GET /owners/admin — list all products, newest first
module.exports.getAllProducts = async function (req, res) {
    try {
        let products = await productModel.find().sort({ createdAt: -1 });
        let success = req.flash("success");
        let error   = req.flash("error");
        res.render("admin", { products, success, error, loggedin: false });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/owners/login");
    }
};

// GET /owners/delete/:id — delete a single product
module.exports.deleteProduct = async function (req, res) {
    try {
        let product = await productModel.findByIdAndDelete(req.params.id);
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/owners/admin");
        }
        req.flash("success", `"${product.name}" deleted successfully`);
        res.redirect("/owners/admin");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/owners/admin");
    }
};
