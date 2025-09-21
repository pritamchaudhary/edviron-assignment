const mongoose = require('mongoose');
const dotenv = require('dotenv');
const School = require('./models/School');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    // Optional: Delete all previous school data to start fresh
    await School.deleteMany();

    const schools = [
      {
        _id: '65b0e6293e9f76a9694d84b4',
        name: 'EDV DEMO SCHOOL',
      },
      // You can add more schools here if they have different IDs
    ];

    await School.insertMany(schools);

    console.log('School Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();