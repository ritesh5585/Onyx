import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import User from "../src/models/user.js";
import Order from "../src/models/order.js";
import Product from "../src/models/product.js";
import { config } from "../src/config/config.js";

let mongoServer;
let testUser;
let testToken;
let testProduct;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Close any existing connections before opening a new one
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri);

  // Ensure config.JWT exists for test environment
  if (!config.JWT) {
    config.JWT = "testsecret";
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Order.deleteMany({});
  await Product.deleteMany({});

  testUser = await User.create({
    fullname: "Test User",
    email: "test@example.com",
    password: "password123",
    role: "buyer"
  });

  testToken = jwt.sign({ id: testUser._id }, config.JWT, { expiresIn: '1h' });

  testProduct = await Product.create({
    title: "Test Product",
    description: "A great product",
    seller: testUser._id,
    price: { amount: 100, currency: "USD" },
    images: [{ url: "http://example.com/image.jpg" }]
  });
});

describe("Order API", () => {
  it("should create a new order", async () => {
    const orderData = {
      items: [
        {
          product: testProduct._id,
          name: testProduct.title,
          quantity: 2,
          price: 100
        }
      ],
      shippingAddress: {
        fullName: "Test User",
        addressLine1: "123 Test St",
        city: "Test City",
        state: "Test State",
        zipCode: "12345",
        country: "Testland"
      },
      paymentMethod: "Credit Card",
      totalAmount: 200
    };

    const res = await request(app)
      .post("/api/order")
      .set("Cookie", [`token=${testToken}`])
      .send(orderData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.status).toBe("placed");
    expect(res.body.order.trackingEvents).toHaveLength(1);
    expect(res.body.order.trackingEvents[0].status).toBe("placed");
  });

  it("should fetch user orders", async () => {
    await Order.create({
      user: testUser._id,
      items: [{ product: testProduct._id, name: "Test Item", quantity: 1, price: 100 }],
      shippingAddress: { fullName: "Test User" },
      paymentMethod: "Cash",
      totalAmount: 100,
      status: "placed"
    });

    const res = await request(app)
      .get("/api/order")
      .set("Cookie", [`token=${testToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.orders).toHaveLength(1);
  });

  it("should cancel an order", async () => {
    const order = await Order.create({
      user: testUser._id,
      items: [{ product: testProduct._id, name: "Test Item", quantity: 1, price: 100 }],
      shippingAddress: { fullName: "Test User" },
      paymentMethod: "Cash",
      totalAmount: 100,
      status: "placed"
    });

    const res = await request(app)
      .patch(`/api/order/${order._id}/cancel`)
      .set("Cookie", [`token=${testToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.order.status).toBe("cancelled");
  });
});
