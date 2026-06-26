const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const { createProduct } = require("../controllers/productController");
const isOwnerLoggedIn = require("../middlewares/isOwnerLoggedIn");

router.get("/create-page", isOwnerLoggedIn, function (req, res) {
    res.render("createproducts", { loggedin: false, ...req.getFlash() });
});

router.post("/create", isOwnerLoggedIn, upload.single("image"), createProduct);

module.exports = router;
