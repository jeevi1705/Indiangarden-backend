const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://sjeevithajeevi005_db_user:lQOoPl72XOkJ0vlb@cluster0.47dbmtm.mongodb.net/flowers?appName=Cluster0');

    const adminEmail = 'adminjeevi@gmail.com';
    const adminPassword = 'jeevi';

    const userExists = await User.findOne({ email: adminEmail });

    if (userExists) {
      userExists.isAdmin = true;
      await userExists.save();
      console.log('Admin user updated with isAdmin: true');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await User.create({
      name: 'Admin Jeevi',
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
    });

    console.log('Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
