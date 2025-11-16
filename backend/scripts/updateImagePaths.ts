import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SweetModel from '../src/models/Sweet';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet_shop';

// Helper function to get correct image URL
const getImageUrl = (sweetName: string): string => {
  const imageName = sweetName.toLowerCase().replace(/\s+/g, '-');
  return `/images/${imageName}.jpg`;
};

async function updateImagePaths() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all sweets
    const sweets = await SweetModel.find();
    console.log(`Found ${sweets.length} sweets in database`);

    // Update image paths for all sweets
    let updated = 0;
    for (const sweet of sweets) {
      const correctImagePath = getImageUrl(sweet.name);
      
      // Only update if image path is different or is a placeholder URL
      if (sweet.image !== correctImagePath && 
          (sweet.image?.startsWith('http') || !sweet.image)) {
        await SweetModel.updateOne(
          { _id: sweet._id },
          { $set: { image: correctImagePath } }
        );
        console.log(`✅ Updated ${sweet.name}: ${sweet.image} -> ${correctImagePath}`);
        updated++;
      } else {
        console.log(`ℹ️  Skipped ${sweet.name}: already has correct path`);
      }
    }

    console.log(`\n✨ Updated ${updated} sweets with correct image paths!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating image paths:', error);
    process.exit(1);
  }
}

// Run the update function
updateImagePaths();

