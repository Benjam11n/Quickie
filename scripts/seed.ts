import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';

import Wishlist from '@/database/wishlist.model';

import Brand from '../database/brand.model';
import Collection from '../database/collection.model';
import NoteFamily from '../database/note-family.model';
import Note from '../database/note.model';
import Perfume from '../database/perfume.model';
import Tag from '../database/tag.model';
import dbConnect from '../lib/mongoose';

dotenv.config({ path: '.env.local' });

// Seed Data Function
async function seedData() {
  try {
    // Connect to MongoDB
    await dbConnect();
    console.log('Connected to MongoDB');

    await Collection.findByIdAndUpdate('67725f9a513b755049187bfd', {
      perfumes: [],
    });
    await Wishlist.find();
    await Wishlist.updateMany({}, { perfumes: [] });
    await Tag.deleteMany({});
    await NoteFamily.deleteMany({});
    await Note.deleteMany({});
    await Brand.deleteMany({});
    await Perfume.deleteMany({});
    console.log('Cleared existing data');

    // Step 1: Seed Tags
    const tags = [
      { name: 'Floral', type: 'perfume', perfumesCount: 0 },
      { name: 'Citrus', type: 'perfume', perfumesCount: 0 },
      { name: 'Woody', type: 'perfume', perfumesCount: 0 },
      { name: 'Oriental', type: 'perfume', perfumesCount: 0 },
      { name: 'Fresh', type: 'perfume', perfumesCount: 0 },
      { name: 'Luxury', type: 'perfume', perfumesCount: 0 },
      { name: 'Romantic', type: 'perfume', perfumesCount: 0 },

      { name: 'Summer', type: 'moodboard', perfumesCount: 0 },
      { name: 'Evening', type: 'moodboard', perfumesCount: 0 },
      { name: 'Winter', type: 'moodboard', perfumesCount: 0 },
    ];

    const tagResults = await Tag.insertMany(tags);
    const tagIds = tagResults.map((tag) => tag._id);
    console.log('Tags seeded:', tagIds);

    // Step 2: Seed Note Families
    const noteFamilies = [
      { name: 'Citrus', color: '#F59E0B', perfumesCount: 0 },
      { name: 'Floral', color: '#EC4899', perfumesCount: 0 },
      { name: 'Woody', color: '#92400E', perfumesCount: 0 },
      { name: 'Oriental', color: '#7C3AED', perfumesCount: 0 },
      { name: 'Fresh', color: '#10B981', perfumesCount: 0 },
      { name: 'Spicy', color: '#EF4444', perfumesCount: 0 },
      { name: 'Green', color: '#34D399', perfumesCount: 0 },
      { name: 'Aquatic', color: '#0EA5E9', perfumesCount: 0 },
      { name: 'Gourmet', color: '#f05729', perfumesCount: 0 },
    ];

    const noteFamilyResults = await NoteFamily.insertMany(noteFamilies);
    const noteFamilyIds = noteFamilyResults.map((family) => family._id);
    console.log('Note Families seeded:', noteFamilyIds);

    // Step 3: Seed Notes
    const notes = [
      { name: 'Bergamot', family: noteFamilyIds[0], perfumes: 0 },
      { name: 'Pink Pepper', family: noteFamilyIds[5], perfumes: 0 },
      { name: 'Cardamom', family: noteFamilyIds[5], perfumes: 0 },
      { name: 'Bulgarian Rose', family: noteFamilyIds[1], perfumes: 0 },
      { name: 'Jasmine', family: noteFamilyIds[1], perfumes: 0 },
      { name: 'Iris', family: noteFamilyIds[1], perfumes: 0 },
      { name: 'Sandalwood', family: noteFamilyIds[2], perfumes: 0 },
      { name: 'Lemon', family: noteFamilyIds[1], perfumes: 0 },
      { name: 'Orange', family: noteFamilyIds[1], perfumes: 0 },
      { name: 'Amber', family: noteFamilyIds[2], perfumes: 0 },
      { name: 'Musk', family: noteFamilyIds[1], perfumes: 0 },
      { name: 'Vanilla Bourbon', family: noteFamilyIds[8], perfumes: 0 },
    ];

    const noteResults = await Note.insertMany(notes);
    const noteIds = noteResults.map((note) => note._id);
    console.log('Notes seeded:', noteIds);

    // Step 4: Seed Brands (added)
    const brands = [
      { name: 'Quickie Signature', perfumesCount: 0 },
      { name: 'YSL', perfumesCount: 0 },
      { name: 'Dior', perfumesCount: 0 },
      { name: 'Chanel', perfumesCount: 0 },
    ];

    const brandResults = await Brand.insertMany(brands);
    const brandIds = brandResults.map((brand) => brand._id);
    console.log('Brands seeded:', brandIds);

    // Step 5: Seed Perfumes (without deleting)
    const authorId = new Types.ObjectId('67653f80f5e53f9472caa184'); // Fixed author ID

    const perfumes = Array.from({ length: 50 }, () => ({
      name: faker.commerce.productName(),
      brand: brandIds[faker.number.int({ min: 0, max: brandIds.length - 1 })], // Random brand
      affiliateLink: 'example.com',
      description: faker.commerce.productDescription(),
      notes: {
        top: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(
          () => ({
            note: noteIds[
              faker.number.int({ min: 0, max: noteIds.length - 1 })
            ],
            intensity: faker.number.int(10),
            noteFamily:
              noteFamilyIds[
                faker.number.int({ min: 0, max: noteFamilyIds.length - 1 })
              ],
          })
        ),
        middle: Array.from({
          length: faker.number.int({ min: 1, max: 3 }),
        }).map(() => ({
          note: noteIds[faker.number.int({ min: 0, max: noteIds.length - 1 })],
          intensity: faker.number.int(10),
          noteFamily:
            noteFamilyIds[
              faker.number.int({ min: 0, max: noteFamilyIds.length - 1 })
            ],
        })),
        base: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(
          () => ({
            note: noteIds[
              faker.number.int({ min: 0, max: noteIds.length - 1 })
            ],
            intensity: faker.number.int(10),
            noteFamily:
              noteFamilyIds[
                faker.number.int({ min: 0, max: noteFamilyIds.length - 1 })
              ],
          })
        ),
      },
      images: Array.from({ length: 5 }).map(() => faker.image.url()),
      scentProfile: {
        intensity: faker.number.int(5),
        longevity: faker.number.int(5),
        sillage: faker.number.int(5),
        versatility: faker.number.int(5),
        uniqueness: faker.number.int(5),
        value: faker.number.int(5),
      },
      fullPrice: parseFloat(faker.commerce.price()),
      size: faker.number.int({ min: 50, max: 250, multipleOf: 50 }),
      tags: tagIds, // Tags seeded earlier
      author: authorId, // Fixed author ID
      seasonalCompatibility: {
        summer: faker.number.int({ min: 10, max: 100 }),
        fall: faker.number.int({ min: 10, max: 100 }),
        winter: faker.number.int({ min: 10, max: 100 }),
        spring: faker.number.int({ min: 10, max: 100 }),
      },
      rating: {
        average: 0,
        count: 0,
        distribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      },
    }));

    // Insert Fake Data into Perfume Collection
    const result = await Perfume.insertMany(perfumes);
    console.log(`${result.length} perfumes added to the database`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run Seeder
seedData();
