import dotenv from "dotenv";
import mongoose from "mongoose";
import connectToDb from "./src/config/database.js";
import productModel from "./src/models/product.js";
import userModel from "./src/models/user.js";

dotenv.config();

const sampleProducts = [
  {
    title: "Sony Alpha 7 IV Full-frame Mirrorless Camera",
    description: "Prepare to be inspired. The true hybrid full-frame camera that delivers amazing still image quality and cinematic 4K video recording. Features a 33MP Exmor R CMOS sensor.",
    category: "Accessories",
    price: { amount: 205000, currency: "INR" },
    images: [{ url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop", fileId: "seed-cam-1" }]
  },
  {
    title: "Apple AirPods Max - Space Gray",
    description: "A perfect balance of exhilarating high-fidelity audio and the effortless magic of AirPods. The ultimate personal listening experience.",
    category: "Accessories",
    price: { amount: 59900, currency: "INR" },
    images: [{ url: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=2000&auto=format&fit=crop", fileId: "seed-airpods-1" }]
  },
  {
    title: "Minimalist Ergonomic Office Chair",
    description: "Work in comfort. This premium ergonomic chair offers full lumbar support, adjustable armrests, and a breathable mesh back designed for 8+ hours of use.",
    category: "Tailoring",
    price: { amount: 25000, currency: "INR" },
    images: [{ url: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2000&auto=format&fit=crop", fileId: "seed-chair-1" }]
  },
  {
    title: "Mechanical Keyboard - Keychron K2",
    description: "A versatile wireless mechanical keyboard with Mac layout. Features tactile brown switches and full RGB backlighting for the ultimate typing experience.",
    category: "Accessories",
    price: { amount: 8500, currency: "INR" },
    images: [{ url: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2000&auto=format&fit=crop", fileId: "seed-keyboard-1" }]
  },
  {
    title: "Nike Air Force 1 '07",
    description: "The radiance lives on in the Nike Air Force 1 ’07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold colors and the perfect amount of flash to make you shine.",
    category: "Footwear",
    price: { amount: 9500, currency: "INR" },
    images: [{ url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2000&auto=format&fit=crop", fileId: "seed-shoes-1" }]
  }
];

const seedDB = async () => {
  try {
    await connectToDb();
    
    // Also update any existing products without a category to default to Accessories or matching category
    await productModel.updateMany(
      { $or: [{ category: { $exists: false } }, { category: null }, { category: "" }] },
      { $set: { category: "Accessories" } }
    );
    // Specific updates for known seed titles
    await productModel.updateOne({ title: { $regex: /Air Force/i } }, { $set: { category: "Footwear" } });
    await productModel.updateOne({ title: { $regex: /Office Chair/i } }, { $set: { category: "Tailoring" } });
    await productModel.updateOne({ title: { $regex: /Camera|AirPods|Keyboard/i } }, { $set: { category: "Accessories" } });

    // Find a seller to assign these products to
    let seller = await userModel.findOne({ role: "seller" });
    
    // If no seller exists, just grab the first user and make them a seller
    if (!seller) {
      seller = await userModel.findOne();
      if (!seller) {
         console.error("❌ No users found in the database. Please register at least one user from your frontend first!");
         process.exit(1);
      }
      console.log(`Making user ${seller.email} a seller for seed data...`);
      seller.role = "seller";
      await seller.save();
    }
    
    console.log(`Assigned products to seller: ${seller.email}`);

    // Map over products and add seller ID
    const productsToInsert = sampleProducts.map(p => ({
        ...p,
        seller: seller._id
    }));

    // Insert into DB if count is low
    const existingCount = await productModel.countDocuments();
    if (existingCount < 5) {
      await productModel.insertMany(productsToInsert);
      console.log("✅ Successfully seeded 5 premium products into the database!");
    } else {
      console.log(`✅ Products already exist (${existingCount} found). Updated categories!`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedDB();
