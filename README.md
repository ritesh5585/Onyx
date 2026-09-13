<div align="center">

# ONYX
### Luxury Full-Stack Fashion Commerce Platform

A modern e-commerce application built with the MERN stack, featuring a high-end luxury fashion storefront for buyers and a comprehensive management portal for sellers.

[Live Demo](https://onyx-e-commerce.netlify.app/) · [Issue Tracker](./issues.md)

</div>

---

## Overview

**ONYX** is a dual-persona commerce platform designed to mirror real-world production architectures. It bridges buyer-facing retail experiences (rich animations, dynamic variant selection, server-side cart aggregation) with seller-side catalog and inventory workflows (multi-image uploads, variant pricing, cloud asset lifecycle management).

---

## Tech Stack

### Frontend
- **Framework**: React 19 (Vite 7)
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router v7 (`react-router`, `react-router-dom`)
- **Styling**: TailwindCSS v4 (`@tailwindcss/vite`)
- **Animations**: GSAP (GreenSock Animation Platform)
- **HTTP Client**: Axios with credential cookies
- **Payment SDK**: `react-razorpay`
- **UI Notifications**: Sonner

### Backend
- **Runtime & Server**: Node.js, Express 5.x
- **Database & ODM**: MongoDB, Mongoose 9.x
- **Authentication**: JWT (HttpOnly secure cookies), Passport.js (Google OAuth 2.0), Bcrypt.js
- **File Uploads & Cloud Storage**: Multer (memoryStorage), ImageKit SDK (`@imagekit/nodejs`)
- **Payment Gateway**: Razorpay SDK
- **Logging & Utilities**: Morgan, Cookie-Parser, Express-Validator

---

## Core Features & System Capabilities

### 1. Authentication & Role-Based Access
- Local authentication (Registration & Login) with Bcrypt password hashing.
- Google OAuth 2.0 integration via Passport.
- JWT-based authentication delivered over `httpOnly` secure cookies.
- Role-based authorization: **Buyer** and **Seller** accounts with dedicated route protection.

### 2. Buyer Storefront
- **Curated Catalog**: Luxury editorial design with GSAP animations, parallax banners, and category previews.
- **Product Details & Variant Picker**: Dynamic multi-attribute selector (Size, Color) that reflects real-time price differences and stock availability.
- **Cart System**: Powered by MongoDB aggregation pipelines to calculate itemized pricing, subtotal, and stock validation on the server.
- **Wishlist**: Quick add/remove toggle with live item count badge and move-to-cart capability.

### 3. Seller Portal
- **Dashboard**: Overview of active listings and product inventory.
- **Product Creation**: Multi-image file upload (up to 7 images per product) processed via Multer memory storage and synced to ImageKit.
- **Variant Management**: Attach custom variants with individual stock, pricing, and attribute configurations.
- **Asset Lifecycle Management**: Automatically deletes associated ImageKit assets when products or individual variants are removed.

---

## Project Status & Roadmap

| Module | Status | Description |
|---|---|---|
| **Authentication** | ✅ Active | Local JWT + Google OAuth2, role-based route guarding |
| **Catalog & Storefront** | ✅ Active | Product listing, dynamic variant selectors, luxury UI |
| **Seller Management** | ✅ Active | Product upload, variant creation, ImageKit cloud cleanup |
| **Cart Engine** | ✅ Active | Aggregation-driven server price calculation & stock checks |
| **Wishlist** | ✅ Active | Add/remove items and one-click transfer to cart |
| **Payment Verification** | ⚠️ In Progress | Razorpay order creation active; signature verification & webhook in progress |
| **Order Management (OMS)** | ⏳ In Progress | Order model, buyer order history, and seller fulfillment |
| **Checkout & Addresses** | ⏳ In Progress | Saved shipping address book & multi-step checkout |

*For detailed tracking and issue tickets, check [issues.md](./issues.md).*

---

## Project Architecture

```
                                  ┌─────────────────────────────┐
                                  │   React 19 + Vite Client    │
                                  │   (TailwindCSS v4 + GSAP)   │
                                  └──────────────┬──────────────┘
                                                 │ HTTP / REST (Axios)
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │     Express 5.x Server      │
                                  │  (Routes -> Controllers)    │
                                  └──────┬───────────┬──────────┘
                         ┌───────────────┘           └───────────────┐
                         ▼                                           ▼
            ┌────────────────────────┐                  ┌────────────────────────┐
            │   DAO & Services Layer │                  │  Third-Party Services  │
            │ • cart.dao / product   │                  │ • ImageKit (Storage)   │
            │ • cartStats.service    │                  │ • Razorpay (Payments)  │
            └───────────┬────────────┘                  │ • Google OAuth 2.0     │
                        ▼                               └────────────────────────┘
            ┌────────────────────────┐
            │   MongoDB Database     │
            │ • Users, Products      │
            │ • Carts, Payments      │
            └────────────────────────┘
```

---

## Local Development & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- Package Manager: `npm` (comes with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/ritesh5585/Onyx.git
cd Onyx
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_TOKEN=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

# ImageKit Storage
IMAGE_PRIVATE_KEY=your_imagekit_private_key

# Razorpay Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=/api/auth/google/callback
```

Start the backend development server:
```bash
npm run dev
# Server running on http://localhost:3000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory (optional for local dev, defaults to `/api` proxy):
```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the frontend development server:
```bash
npm run dev
# Client running on http://localhost:5173
```

> **Note on Local Proxy**: Vite is configured in `client/vite.config.js` to automatically forward requests starting with `/api` to `http://localhost:3000`.

---

## REST API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **POST** | `/api/auth/register` | Public | Register new buyer or seller account |
| **POST** | `/api/auth/login` | Public | Authenticate user & issue HttpOnly JWT cookie |
| **POST** | `/api/auth/logout` | Authenticated | Clear session cookie |
| **GET** | `/api/auth/me` | Authenticated | Fetch authenticated user profile |
| **GET** | `/api/auth/google` | Public | Initiate Google OAuth flow |
| **GET** | `/api/product` | Public | Get all active products |
| **GET** | `/api/product/:id` | Public | Get detailed product information |
| **GET** | `/api/product/seller` | Seller | Retrieve products created by logged-in seller |
| **POST** | `/api/product` | Seller | Upload new product with images |
| **PATCH** | `/api/product/:id` | Seller | Update product details |
| **POST** | `/api/product/:id/variants` | Seller | Add variants to existing product |
| **DELETE** | `/api/product/product-deleting/:id` | Seller | Delete product and associated ImageKit assets |
| **GET** | `/api/cart/get` | Authenticated | Retrieve user cart with aggregated pricing |
| **POST** | `/api/cart/add/:productId/:variantId` | Authenticated | Add item to cart with stock validation |
| **PATCH** | `/api/cart/update/:cartItemId` | Authenticated | Update item quantity |
| **DELETE** | `/api/cart/remove/:cartItemId` | Authenticated | Remove item from cart |
| **GET** | `/api/wishlist` | Authenticated | Retrieve user wishlist |
| **POST** | `/api/wishlist` | Authenticated | Add product to wishlist |
| **DELETE** | `/api/wishlist/:id` | Authenticated | Remove product from wishlist |
| **POST** | `/api/payment/create/order` | Authenticated | Initialize Razorpay payment order |
| **POST** | `/api/payment/verify` | Authenticated | Verify Razorpay payment signature |

---

## License

This project is licensed under the [ISC License](./server/package.json).
