const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const bcrypt = require("bcrypt");
const { loginOwner, logoutOwner } = require("../controllers/ownerController");
const { getAllProducts, deleteProduct } = require("../controllers/productController");
const isOwnerLoggedIn = require("../middlewares/isOwnerLoggedIn");

if (process.env.NODE_ENV === "development") {
    router.post("/create", async function (req, res) {
        try {
            let owners = await ownerModel.find();
            if (owners.length > 0) return res.status(503).send("An owner already exists.");
            let { fullname, email, password } = req.body;
            if (!fullname || !email || !password) return res.status(400).send("All fields are required");
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            let createdOwner = await ownerModel.create({ fullname, email, password: hash });
            res.status(201).json({ message: "Owner created successfully", owner: { id: createdOwner._id, fullname, email } });
        } catch (err) {
            res.status(500).send(err.message);
        }
    });
}

router.get("/login", function (req, res) {
    res.render("owner-login", { loggedin: false, ...req.getFlash() });
});

router.post("/login", loginOwner);
router.get("/logout", logoutOwner);
router.get("/admin", isOwnerLoggedIn, getAllProducts);
router.get("/delete/:id", isOwnerLoggedIn, deleteProduct);

module.exports = router;
