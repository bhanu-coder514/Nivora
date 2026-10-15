require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB Connected');
    console.log('\nSeeding database...\n');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'NIVORA Admin',
      email: 'admin@nivora.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin'
    });

    const owner = await User.create({
      name: 'Rajesh Kumar',
      email: 'owner@nivora.com',
      phone: '9876543210',
      password: 'owner123',
      role: 'owner'
    });

    const student = await User.create({
      name: 'Priya Sharma',
      email: 'student@nivora.com',
      phone: '9876543211',
      password: 'student123',
      role: 'student'
    });

    console.log('✓ Created test users');

    // Create sample properties
    const properties = await Property.insertMany([
      {
        owner: owner._id,
        title: 'Spacious Single Room near IIT Delhi',
        description: 'A well-furnished single room perfect for students. Located just 500m from IIT Delhi campus.',
        propertyType: 'independent-room',
        roomType: 'single',
        address: {
          street: '45, Ber Sarai',
          city: 'Delhi',
          locality: 'Hauz Khas',
          state: 'Delhi',
          pinCode: '110016'
        },
        nearbyCollege: 'IIT Delhi',
        maxOccupancy: 1,
        furnishingStatus: 'furnished',
        amenities: ['bed', 'mattress', 'wardrobe', 'study-table', 'chair', 'fan', 'attached-bathroom', 'wifi'],
        monthlyRent: 8000,
        rentBasis: 'per-room',
        securityDeposit: 8000,
        monthlyExpenses: [
          { label: 'Electricity', amount: 500, type: 'variable' },
          { label: 'Water', amount: 100, type: 'fixed' },
          { label: 'Wi-Fi', amount: 300, type: 'fixed' }
        ],
        images: [{
          url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
          publicId: 'sample1',
          isCover: true
        }],
        availabilityStatus: 'available',
        minimumStay: 6
      },
      {
        owner: owner._id,
        title: 'Double Sharing PG in Koramangala',
        description: 'Premium boys PG accommodation with double sharing rooms. Includes meals and housekeeping.',
        propertyType: 'pg',
        roomType: 'double-sharing',
        address: {
          street: '5th Block, 80 Feet Road',
          city: 'Bangalore',
          locality: 'Koramangala',
          state: 'Karnataka',
          pinCode: '560034'
        },
        nearbyCollege: 'Christ University',
        maxOccupancy: 2,
        furnishingStatus: 'furnished',
        amenities: ['bed', 'mattress', 'wardrobe', 'ac', 'wifi', 'parking', 'security'],
        monthlyRent: 7500,
        rentBasis: 'per-person',
        securityDeposit: 15000,
        monthlyExpenses: [
          { label: 'Food (3 meals)', amount: 3500, type: 'fixed' },
          { label: 'Electricity', amount: 500, type: 'shared' },
          { label: 'Laundry', amount: 500, type: 'fixed' }
        ],
        images: [{
          url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
          publicId: 'sample2',
          isCover: true
        }],
        availabilityStatus: 'available',
        minimumStay: 3
      },
      {
        owner: owner._id,
        title: 'Modern 1 BHK Flat in Andheri West',
        description: 'Beautiful 1 BHK apartment in prime location. Close to metro station and malls.',
        propertyType: 'flat',
        roomType: '1bhk',
        address: {
          street: 'Link Road, Near Infinity Mall',
          city: 'Mumbai',
          locality: 'Andheri West',
          state: 'Maharashtra',
          pinCode: '400053'
        },
        nearbyWorkplace: 'Andheri MIDC',
        maxOccupancy: 2,
        furnishingStatus: 'semi-furnished',
        amenities: ['wardrobe', 'ac', 'parking', 'lift', 'security'],
        monthlyRent: 22000,
        rentBasis: 'per-room',
        securityDeposit: 50000,
        monthlyExpenses: [
          { label: 'Maintenance', amount: 2500, type: 'fixed' },
          { label: 'Electricity', amount: null, type: 'usage-based', note: 'Meter based, avg ₹1500-2500/month' }
        ],
        oneTimeExpenses: [
          { label: 'Brokerage', amount: 22000, type: 'fixed', note: '1 month rent' }
        ],
        images: [{
          url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
          publicId: 'sample3',
          isCover: true
        }],
        availabilityStatus: 'available',
        minimumStay: 11
      },
      {
        owner: owner._id,
        title: 'Budget Triple Sharing Room near Anna University',
        description: 'Affordable triple sharing room ideal for college students.',
        propertyType: 'hostel',
        roomType: 'triple-sharing',
        address: {
          street: '2nd Cross Street, Kotturpuram',
          city: 'Chennai',
          locality: 'Guindy',
          state: 'Tamil Nadu',
          pinCode: '600025'
        },
        nearbyCollege: 'Anna University',
        maxOccupancy: 3,
        furnishingStatus: 'semi-furnished',
        amenities: ['bed', 'mattress', 'fan', 'shared-bathroom'],
        monthlyRent: 4000,
        rentBasis: 'per-person',
        securityDeposit: 4000,
        monthlyExpenses: [
          { label: 'Electricity', amount: 500, type: 'shared' },
          { label: 'Water', amount: 100, type: 'fixed' }
        ],
        images: [{
          url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
          publicId: 'sample4',
          isCover: true
        }],
        availabilityStatus: 'available',
        minimumStay: 3
      },
      {
        owner: owner._id,
        title: 'Cozy Studio Apartment in Hinjewadi',
        description: 'Compact studio apartment perfect for IT professionals working in Hinjewadi IT Park.',
        propertyType: 'studio',
        roomType: 'studio',
        address: {
          street: 'Phase 1, Hinjewadi',
          city: 'Pune',
          locality: 'Hinjewadi',
          state: 'Maharashtra',
          pinCode: '411057'
        },
        nearbyWorkplace: 'Hinjewadi IT Park Phase 1',
        maxOccupancy: 1,
        furnishingStatus: 'furnished',
        amenities: ['bed', 'wardrobe', 'ac', 'wifi', 'parking', 'lift'],
        monthlyRent: 15000,
        rentBasis: 'per-room',
        securityDeposit: 30000,
        monthlyExpenses: [
          { label: 'Maintenance', amount: 1500, type: 'fixed' },
          { label: 'Wi-Fi', amount: 500, type: 'fixed' }
        ],
        oneTimeExpenses: [
          { label: 'Brokerage', amount: 7500, type: 'fixed', note: 'Half month rent' }
        ],
        images: [{
          url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          publicId: 'sample5',
          isCover: true
        }],
        availabilityStatus: 'available',
        minimumStay: 6
      }
    ]);

    console.log(`✓ Created ${properties.length} sample properties\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Database seeded successfully!\n');
    console.log('📧 Test Login Credentials:');
    console.log('   Admin:   admin@nivora.com / admin123');
    console.log('   Owner:   owner@nivora.com / owner123');
    console.log('   Student: student@nivora.com / student123\n');
    console.log(`🏠 Sample Properties: ${properties.length} properties created`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
