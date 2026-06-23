const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const { createProduct } = require("../controllers/productController");
const isOwnerLoggedIn = require("../middlewares/isOwnerLoggedIn");

// Show product creation form (owner only)
router.get("/create-page", isOwnerLoggedIn, function (req, res) {
    let success = req.flash("success");
    let error   = req.flash("error");
    res.render("createproducts", { success, error, loggedin: false });
});

// Handle product creation with image upload (owner only)
router.post("/create", isOwnerLoggedIn, upload.single("image"), createProduct);

module.exports = router;
