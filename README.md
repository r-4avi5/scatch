# Scatch 🛍️

A full-stack e-commerce web application built with Node.js, Express, and MongoDB. Scatch allows users to browse products, manage a shopping cart, and enables owners to manage their product catalog through an admin panel.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Author](#author)

---

## Features

- User registration and login with JWT-based authentication
- Secure password hashing with bcrypt
- Shopping cart — add products and view a computed bill
- Product browsing on a dedicated shop page
- Owner admin panel to create and manage products
- Image upload for products via Multer
- Flash messages for user feedback
- Session management with express-session
- EJS-based server-side rendered views
- Role-based access: owner creation restricted to development environment

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Runtime     | Node.js                             |
| Framework   | Express.js v5                       |
| Database    | MongoDB (via Mongoose)              |
| Templating  | EJS                                 |
| Auth        | JSON Web Tokens (JWT) + bcrypt      |
| File Upload | Multer                              |
| Sessions    | express-session + connect-flash     |
| Config      | dotenv + config                     |

---

## Project Structure

```
Scatch/
├── app.js                        # App entry point, middleware setup
├── config/
│   ├── development.json          # Environment-specific config
│   ├── mongoose-connection.js    # MongoDB connection
│   └── multer-config.js         # File upload configuration
├── controllers/
│   └── authController.js        # Register, login, logout logic
├── middlewares/
│   └── isLoggedIn.js            # JWT auth middleware
├── models/
│   ├── owner-model.js           # Owner schema
│   ├── product-model.js         # Product schema
│   └── user-model.js            # User schema (with cart & orders)
├── routes/
│   ├── index.js                 # Home, shop, cart routes
│   ├── ownersRouter.js          # Owner/admin routes
│   ├── productsRouter.js        # Product creation routes
│   └── usersRouter.js           # User auth routes
├── utils/
│   └── generateToken.js         # JWT token generator
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── shop.ejs
│   ├── cart.ejs
│   ├── admin.ejs
│   ├── createproducts.ejs
│   └── owner-login.ejs
├── public/
│   └── images/                  # Static product images
├── .env                         # Environment variables
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally on port `27017`

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/scatch.git
   cd scatch
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) below).

4. **Start the server**

   ```bash
   node app.js
   ```

5. Open your browser and visit `http://localhost:3000`

---

## Environment Variables

Create a `.env` file in the project root with the following keys:

```env
JWT_KEY=your_jwt_secret_key
EXPRESS_SESSION_SECRET=your_session_secret
NODE_ENV=development
```

> ⚠️ Never commit your `.env` file to version control. Add it to `.gitignore`.

---

## API Routes

### General

| Method | Route                     | Description                        | Auth Required |
|--------|---------------------------|------------------------------------|---------------|
| GET    | `/`                       | Landing / home page                | No            |
| GET    | `/shop`                   | Browse all products                | Yes           |
| GET    | `/cart`                   | View shopping cart with bill       | Yes           |
| GET    | `/addtocart/:productid`   | Add a product to cart              | Yes           |
| GET    | `/logout`                 | Log out user                       | Yes           |

### Users

| Method | Route              | Description         |
|--------|--------------------|---------------------|
| POST   | `/users/register`  | Register a new user |
| POST   | `/users/login`     | Login a user        |
| GET    | `/users/logout`    | Logout user         |

### Owners

| Method | Route             | Description                                   |
|--------|-------------------|-----------------------------------------------|
| POST   | `/owners/create`  | Create an owner (development environment only)|
| GET    | `/owners/admin`   | Access the product creation admin panel       |

### Products

| Method | Route               | Description                         |
|--------|---------------------|-------------------------------------|
| POST   | `/products/create`  | Create a new product (with image upload) |

---

## Author

**Ravi Kumar**
