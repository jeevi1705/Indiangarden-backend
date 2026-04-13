const mongoose = require('mongoose');

const connectDB = async () => {
  let mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.warn('WARNING: MONGO_URI not found in environment. Using hardcoded fallback.');
    mongoURI = "mongodb+srv://sjeevithajeevi005_db_user:lQOoPl72XOkJ0vlb@cluster0.47dbmtm.mongodb.net/flowers?appName=Cluster0";
  }

  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('DB NOT CONNECTED - Enabling Demo Mode fallback.');
  }
};

module.exports = connectDB;