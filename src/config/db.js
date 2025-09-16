// Mongo connection using environment

const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.log("❌ MongoDB Connection Error: " + error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
