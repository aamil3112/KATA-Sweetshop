import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SweetModel from '../src/models/Sweet';
import UserModel from '../src/models/User';
import { hashPassword } from '../src/utils/password';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet_shop';

// Helper function to get image URL
// Uses local images from frontend/public/images/ folder
const getImageUrl = (sweetName: string): string => {
  const imageName = sweetName.toLowerCase().replace(/\s+/g, '-');
  // Local image path (served from frontend/public/images/)
  // Frontend will automatically try .jpeg, .png, .webp if .jpg doesn't work
  return `/images/${imageName}.jpg`;
};

// Indian sweets with images
// Images are loaded from frontend/public/images/ folder
// Save your photos there with names like: gulab-jamun.jpg, rasgulla.jpg, etc.
const sampleSweets = [
  {
    name: 'Gulab Jamun',
    category: 'Milk Based',
    price: 50,
    quantity: 100,
    description: 'Soft, spongy milk balls soaked in sweet rose-flavored syrup',
    image: getImageUrl('Gulab Jamun'),
  },
  {
    name: 'Rasgulla',
    category: 'Milk Based',
    price: 45,
    quantity: 120,
    description: 'Soft cottage cheese balls in light sugar syrup, garnished with pistachios',
    image: getImageUrl('Rasgulla'),
  },
  {
    name: 'Jalebi',
    category: 'Fried',
    price: 40,
    quantity: 150,
    description: 'Crispy, spiral-shaped sweet soaked in sugar syrup',
    image: getImageUrl('Jalebi'),
  },
  {
    name: 'Kaju Katli',
    category: 'Dry Sweet',
    price: 600,
    quantity: 50,
    description: 'Diamond-shaped cashew fudge, rich and creamy',
    image: getImageUrl('Kaju Katli'),
  },
  {
    name: 'Barfi',
    category: 'Milk Based',
    price: 350,
    quantity: 80,
    description: 'Dense milk-based sweet, available in various flavors',
    image: getImageUrl('Barfi'),
  },
  {
    name: 'Soan Papdi',
    category: 'Flaky Sweet',
    price: 250,
    quantity: 85,
    description: 'Flaky, layered sweet with a melt-in-mouth texture',
    image: getImageUrl('Soan Papdi'),
  },
  {
    name: 'Besan Ladoo',
    category: 'Round Sweet',
    price: 320,
    quantity: 65,
    description: 'Gram flour ladoos with ghee and cardamom',
    image: getImageUrl('Besan Ladoo'),
  },
  {
    name: 'Modak',
    category: 'Steamed',
    price: 35,
    quantity: 110,
    description: 'Steamed dumplings filled with coconut and jaggery',
    image: getImageUrl('Modak'),
  },
  {
    name: 'Sandesh',
    category: 'Milk Based',
    price: 280,
    quantity: 95,
    description: 'Bengali sweet made from fresh cottage cheese',
    image: getImageUrl('Sandesh'),
  },
  {
    name: 'Rabri',
    category: 'Milk Based',
    price: 90,
    quantity: 55,
    description: 'Thickened sweetened milk with layers of cream',
    image: getImageUrl('Rabri'),
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing sweets (optional - comment out if you want to keep existing data)
    const deletedSweets = await SweetModel.deleteMany({});
    console.log(`Cleared ${deletedSweets.deletedCount} existing sweets`);

    // Insert sample sweets
    const insertedSweets = await SweetModel.insertMany(sampleSweets);
    console.log(`✅ Successfully inserted ${insertedSweets.length} Indian sweets`);

    // Check if admin user exists, if not create one
    const adminExists = await UserModel.findOne({ role: 'admin' });
    if (!adminExists) {
      const adminPassword = await hashPassword('admin123');
      const adminUser = await UserModel.create({
        email: 'admin@sweetshop.com',
        password_hash: adminPassword,
        role: 'admin',
      });
      console.log('✅ Created admin user:');
      console.log('   Email: admin@sweetshop.com');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Display summary
    console.log('\n📊 Database Summary:');
    const totalSweets = await SweetModel.countDocuments();
    const totalUsers = await UserModel.countDocuments();
    console.log(`   Total Sweets: ${totalSweets}`);
    console.log(`   Total Users: ${totalUsers}`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('🍬 Indian sweets are now available in your shop!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
