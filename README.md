<div align="center">

# ONYX
### Premium Full-Stack Fashion Commerce Platform

A modern, production-inspired e-commerce application built with the MERN Stack, designed with a luxury fashion experience while focusing on scalability, security, and real-world engineering practices.

Live: https://onyx-e-commerce.netlify.app/
---

# Overview

ONYX is a premium fashion commerce platform inspired by modern luxury brands.

The objective was **not only to build an e-commerce website**, but to understand how production-grade applications are designed.

Instead of stopping after implementing CRUD operations, the project focuses on:

- Production-like architecture
- Secure backend practices
- Seller & Buyer workflows
- Cloud asset management
- Payment processing
- Performance optimization
- Mobile-first responsive UI
- Better state management
- Real engineering debugging

---

# Tech Stack

## Frontend

- React 19
- React Router
- Redux Toolkit
- GSAP
- SCSS Modules
- Axios
- React Icons

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Multer
- Cloudinary
- Razorpay

---

# Features

## Authentication

- Register
- Login
- JWT Authentication
- Google OAuth
- Seller Registration
- Protected Routes
- Logout

---

## Buyer

- Browse Products
- Product Details
- Add To Cart
- Quantity Management
- Remove Cart Item
- Checkout
- Razorpay Payment

---

## Seller Portal

- Seller Dashboard
- Upload Products
- Edit Product
- Delete Product
- Variant Management
- Inventory Management
- Cloud Image Management

---

## Product Variants

Supports

- Size
- Color
- Price
- Stock

Seller can

- Add Variant
- Remove Variant
- Update Variant

---

## Payment

Integrated with Razorpay

Flow

```
Create Order
      ↓
Open Razorpay Checkout
      ↓
Payment
      ↓
Signature Verification
      ↓
Order Confirmation
```

---

# Architecture

```
               React Frontend

                      │

                      ▼

             Express REST APIs

                      │

      ┌───────────────┴───────────────┐

      ▼                               ▼

 MongoDB                        Cloudinary

      │

      ▼

 Razorpay
```

---

# Project Structure

```
client/

src/

app/

features/

auth/

products/

cart/

checkout/

shared/

hooks/

redux/

components/

server/

src/

config/

controllers/

middlewares/

models/

routes/

services/

validators/

utils/

```

---

# Engineering Challenges

This project taught much more than writing components.

## 1. React Re-rendering

### Problem

Updating cart quantity wasn't updating UI.

User had to refresh the page.

### Solution

- Better Redux state updates
- useEffect dependency corrections
- Better component rendering

---

## 2. Cloudinary Cleanup

### Problem

Deleting products removed MongoDB records.

Cloudinary images still existed.

Which means

Database

✅ Deleted

Cloud Storage

❌ Not Deleted

Eventually increasing storage usage.

### Solution

Implemented proper Cloudinary cleanup while deleting products.

Now

```
Delete Product

↓

Delete Mongo Document

↓

Delete Cloudinary Images

↓

Return Success
```

---

## 3. Aggregation Pipeline

Most beginner projects calculate cart totals on frontend.

That allows manipulation.

Instead,

MongoDB Aggregation Pipeline calculates

- Total
- Quantity
- Price
- Currency

inside database.

Benefits

- Secure
- Faster
- Harder to manipulate
- Production-like

---

## 4. Responsive Design

One of the hardest parts.

Instead of relying completely on AI-generated layouts, every screen was manually adjusted.

Responsive support

Desktop

Tablet

Mobile

---

## 5. Payment Security

Implemented Razorpay payment flow

```
Create Order

↓

Payment

↓

Verify Signature

↓

Save Order

↓

Clear Cart
```

Learning

Never trust frontend payment response directly.

Always verify on backend.

---

# UI Philosophy

ONYX follows a luxury fashion aesthetic.

Design Principles

- Minimal
- Editorial
- Premium
- Spacious
- Elegant Typography
- Dark Theme
- Gold Accent

---

# What I Learned

Building this project changed how I think.

I learned

- Backend architecture
- REST API Design
- Authentication
- State Management
- MongoDB Aggregation
- Payment Integration
- Cloud Asset Lifecycle
- Debugging Production Bugs
- Component Architecture
- Performance Optimization

Most importantly

> Building features is easy.

> Understanding systems is difficult.

---

# Future Roadmap

- Wishlist
- Reviews
- Coupons
- Order Tracking
- Admin Dashboard
- Analytics
- Email Notifications
- Search
- Filters
- Recommendation Engine
- AI Product Search
- Redis Caching
- Docker
- CI/CD
- AWS Deployment

---

# Screenshots

| Home | Dashboard |
|-------|-----------|
| Image | Image |

| Cart | Checkout |
|-------|----------|
| Image | Image |

| Product | Mobile |
|----------|--------|
| Image | Image |

---

# Author

## Ritesh Vishwakarma

Full Stack Developer

Building products while learning how real systems work.

LinkedIn

GitHub

Portfolio

---

# If you like this project

⭐ Give this repository a Star.

Feedback and suggestions are always welcome.
