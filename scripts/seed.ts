import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';

import Brand from '../database/brand.model';
import Collection from '../database/collection.model';
import NoteFamily from '../database/note-family.model';
import Note from '../database/note.model';
import Perfume from '../database/perfume.model';
import Review from '../database/review.model';
import Tag from '../database/tag.model';
import VendingMachine from '../database/vending-machine.model';
import Wishlist from '../database/wishlist.model';
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
    await Review.deleteMany({});
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

    const perfumes = Array.from({ length: 200 }, () => ({
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

// scripts/seed.ts
async function seedReviews() {
  try {
    await dbConnect();
    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');

    // Get all perfumes
    const perfumes = await Perfume.find();

    // Create multiple author IDs to simulate different reviewers
    const authorIds = [
      new Types.ObjectId('67653f80f5e53f9472caa184'), // Your original author
      new Types.ObjectId(), // Random additional reviewers
      new Types.ObjectId(),
      new Types.ObjectId(),
      new Types.ObjectId(),
    ];

    // Review templates and word banks (same as before)
    const reviewTemplates = [
      'A {adjective} fragrance that {impression}. The {note} notes are {description}.',
      'This scent is {adjective} and {adjective}. {impression}.',
      'Wearing this makes me feel {emotion}. The {note} in the {phase} is {description}.',
      '{impression} Perfect for {occasion}.',
      'A {adjective} composition that {impression}. The {phase} phase is particularly {description}.',
    ];

    const adjectives = [
      'sophisticated',
      'elegant',
      'bold',
      'subtle',
      'captivating',
      'enchanting',
      'mysterious',
      'refreshing',
      'warm',
      'cool',
      'intoxicating',
      'delicate',
    ];

    const impressions = [
      'leaves a lasting impression',
      'evolves beautifully on the skin',
      'creates an aura of sophistication',
      'captures attention without being overwhelming',
      'brings out the best of each note',
      "blends seamlessly with one's natural scent",
    ];

    const descriptions = [
      'beautifully balanced',
      'expertly blended',
      'masterfully crafted',
      'harmoniously integrated',
      'artfully composed',
      'perfectly proportioned',
    ];

    const emotions = [
      'confident',
      'sophisticated',
      'energized',
      'relaxed',
      'romantic',
      'powerful',
    ];

    const occasions = [
      'evening wear',
      'special occasions',
      'daily wear',
      'formal events',
      'summer days',
      'winter nights',
      'spring mornings',
      'autumn evenings',
    ];

    const phases = ['opening', 'heart', 'base', 'dry down'];
    const notes = [
      'floral',
      'woody',
      'citrus',
      'oriental',
      'spicy',
      'fresh',
      'green',
    ];

    // Generate reviews
    const reviews = [];
    for (const perfume of perfumes) {
      // Generate 1-5 reviews per perfume
      const numReviews = faker.number.int({ min: 1, max: 5 });

      // Use different authors for each review
      const shuffledAuthors = faker.helpers
        .shuffle([...authorIds])
        .slice(0, numReviews);

      for (let i = 0; i < numReviews; i++) {
        // Use a different author for each review
        const author = shuffledAuthors[i];

        // Generate review text (same as before)
        const template = faker.helpers.arrayElement(reviewTemplates);
        const review = template
          .replace('{adjective}', faker.helpers.arrayElement(adjectives))
          .replace('{impression}', faker.helpers.arrayElement(impressions))
          .replace('{description}', faker.helpers.arrayElement(descriptions))
          .replace('{emotion}', faker.helpers.arrayElement(emotions))
          .replace('{occasion}', faker.helpers.arrayElement(occasions))
          .replace('{phase}', faker.helpers.arrayElement(phases))
          .replace('{note}', faker.helpers.arrayElement(notes));

        // Generate ratings
        const baseRating = faker.number.int({ min: 3, max: 5 });
        const variation = () => faker.number.int({ min: -1, max: 1 });

        reviews.push({
          author,
          perfume: perfume._id,
          rating: {
            sillage: Math.max(1, Math.min(5, baseRating + variation())),
            longevity: Math.max(1, Math.min(5, baseRating + variation())),
            value: Math.max(1, Math.min(5, baseRating + variation())),
            uniqueness: Math.max(1, Math.min(5, baseRating + variation())),
            complexity: Math.max(1, Math.min(5, baseRating + variation())),
          },
          review,
        });
      }
    }

    // Insert reviews in batches to avoid timeout
    const batchSize = 100;
    for (let i = 0; i < reviews.length; i += batchSize) {
      const batch = reviews.slice(i, i + batchSize);
      await Review.insertMany(batch);
      console.log(
        `Inserted reviews ${i + 1} to ${Math.min(i + batchSize, reviews.length)}`
      );
    }

    // Update perfume ratings
    for (const perfume of perfumes) {
      const perfumeReviews = reviews.filter((r) =>
        r.perfume.equals(perfume._id)
      );

      if (perfumeReviews.length > 0) {
        const avgRating = {
          sillage: 0,
          longevity: 0,
          value: 0,
          uniqueness: 0,
          complexity: 0,
        };

        perfumeReviews.forEach((review) => {
          (Object.keys(avgRating) as (keyof typeof avgRating)[]).forEach(
            (key) => {
              avgRating[key] += review.rating[key];
            }
          );
        });

        Object.keys(avgRating).forEach((key) => {
          avgRating[key as keyof typeof avgRating] /= perfumeReviews.length;
        });

        await Perfume.findByIdAndUpdate(perfume._id, {
          'rating.average':
            Object.values(avgRating).reduce((a, b) => a + b) / 5,
          'rating.count': perfumeReviews.length,
        });
      }
    }

    console.log('Successfully seeded reviews and updated perfume ratings');
  } catch (error) {
    console.error('Error seeding reviews:', error);
    throw error; // Rethrow to handle in main function
  }
}

async function seedVendingMachines() {
  try {
    await VendingMachine.deleteMany({});
    console.log('Cleared existing vending machines');

    // Get perfumes for inventory
    const perfumes = await Perfume.find();
    const authorId = new Types.ObjectId('67653f80f5e53f9472caa184');

    // Singapore locations with areas
    const locations = [
      {
        coordinates: [103.8522, 1.2874], // Marina Bay Sands
        address: '10 Bayfront Avenue, Marina Bay Sands',
        area: 'Marina Bay',
      },
      {
        coordinates: [103.8519, 1.3039], // Suntec City
        address: '3 Temasek Boulevard, Suntec City',
        area: 'City Hall',
      },
      {
        coordinates: [103.8332, 1.3048], // Orchard ION
        address: '2 Orchard Turn, ION Orchard',
        area: 'Orchard',
      },
      {
        coordinates: [103.8557, 1.2846], // Raffles Place
        address: '5 Raffles Place',
        area: 'CBD',
      },
      {
        coordinates: [103.8451, 1.2768], // VivoCity
        address: '1 HarbourFront Walk, VivoCity',
        area: 'HarbourFront',
      },
      {
        coordinates: [103.849, 1.3512], // NEX
        address: '23 Serangoon Central, NEX',
        area: 'Serangoon',
      },
      {
        coordinates: [103.8492, 1.3766], // Junction 8
        address: '9 Bishan Place, Junction 8',
        area: 'Bishan',
      },
      {
        coordinates: [103.7467, 1.338], // Jurong East MRT
        address: '10 Jurong East Street 12',
        area: 'Jurong East',
      },
      {
        coordinates: [103.8927, 1.3197], // Paya Lebar Quarter
        address: '10 Paya Lebar Road, PLQ',
        area: 'Paya Lebar',
      },
      {
        coordinates: [103.8936, 1.3516], // Hougang Mall
        address: '90 Hougang Avenue 10',
        area: 'Hougang',
      },
    ];

    const vendingMachines = locations.map((location) => {
      // Generate random inventory for each machine
      const inventory = faker.helpers
        .shuffle([...perfumes])
        .slice(0, faker.number.int({ min: 5, max: 10 }))
        .map((perfume) => ({
          perfume: perfume._id,
          stock: faker.number.int({ min: 0, max: 20 }),
          lastRefilled: faker.date.recent({ days: 14 }),
        }));

      // Generate popular times (24 hours)
      const popularTimes: Record<string, number> = {};
      for (let hour = 0; hour < 24; hour++) {
        const timeKey = `${hour.toString().padStart(2, '0')}:00`;
        // More traffic during lunch (11-14) and after work (17-20)
        const isLunchHour = hour >= 11 && hour <= 14;
        const isAfterWork = hour >= 17 && hour <= 20;
        const baseTraffic =
          isLunchHour || isAfterWork
            ? faker.number.int({ min: 70, max: 100 })
            : faker.number.int({ min: 10, max: 40 });
        popularTimes[timeKey] = baseTraffic;
      }

      return {
        location: {
          type: 'Point',
          coordinates: location.coordinates,
          address: location.address,
          area: location.area,
        },
        inventory,
        status: faker.helpers.arrayElement([
          'active',
          'active',
          'active',
          'maintenance',
          'inactive',
        ]), // 60% chance of being active
        metrics: {
          totalSamples: faker.number.int({ min: 100, max: 1000 }),
          popularTimes,
        },
        author: authorId,
      };
    });

    await VendingMachine.insertMany(vendingMachines);
    console.log(`Seeded ${vendingMachines.length} vending machines`);
  } catch (error) {
    console.error('Error seeding vending machines:', error);
    throw error;
  }
}

async function main() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Run seeders sequentially
    // await seedData();
    console.log('Completed seeding base data');

    await seedReviews();
    console.log('Completed seeding reviews');

    await seedVendingMachines();
    console.log('Completed seeding vending machines');
  } catch (error) {
    console.error('Error in seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the main function
main().catch(console.error);
