require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({}); // Clears existing users

    await User.create({
      userName: 'admin',
      password: 'admin1' // Hashing executes automatically here!
    });

    console.log('✅ Test user injected! Username: admin | Password: SuperSecurePassword123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedUser();