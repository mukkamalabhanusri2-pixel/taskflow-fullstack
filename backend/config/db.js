/**
 * Database configuration - MongoDB connection helper
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow');
  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
