require("dotenv").config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("./middlewares/flash");

const db = require("./config/mongoose-connection");

const ownersRouter   = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter    = require("./routes/usersRouter");
const indexRouter    = require("./routes/index");

// --- Core Middleware (order matters) ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session — must be before flash
app.use(
    expressSession({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    })
);

// Flash — must be before routes
app.use(flash);

// --- Routes ---
app.use("/owners", ownersRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/", indexRouter);

// --- 404 handler ---
app.use((req, res) => {
    res.status(404).send(`
        <div style="font-family:sans-serif;text-align:center;padding:80px">
            <h1 style="font-size:72px;color:#e4e4e7;margin:0">404</h1>
            <p style="color:#71717a;font-size:18px">Page not found</p>
            <a href="/" style="color:#3b82f6;text-decoration:none;font-size:14px">← Go Home</a>
        </div>
    `);
});

// --- Global error handler ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong. Please try again.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Scatch server running at http://localhost:${PORT}`);
});
