const mongoose = require('mongoose');
const User = require('./src/models/User');
const ServiceListing = require('./src/models/ServiceListing');

require('dotenv').config();

const MONGO_URI = 'mongodb+srv://kachholi0_db_user:bbpur@cluster0.tesrwdg.mongodb.net/skillbridge?retryWrites=true&w=majority';

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected.');

        // Clear out any old existing data (if the database was already populated)
        await User.deleteMany({});
        await ServiceListing.deleteMany({});
        console.log('Cleared existing data.');

        // 1. Create a Provider
        const provider1 = await User.create({
            name: "Alex Developer",
            email: "alex@example.com",
            password: "password123", // Will be hashed automatically by the User schema middleware
            role: "provider",
            bio: "Senior full stack developer focusing on React and Node.js solutions.",
            skills: ["ReactJS", "Tailwind CSS", "Node.js", "MongoDB"]
        });

        // 2. Create another Provider
        const provider2 = await User.create({
            name: "Sarah Design",
            email: "sarah@example.com",
            password: "password123",
            role: "provider",
            bio: "Creative UI/UX designer with a passion for minimal, glassmorphism aesthetics.",
            skills: ["Figma", "UI/UX", "Adobe XD", "Wireframing"]
        });

        // 3. Create a normal User (Client)
        const client = await User.create({
            name: "John Client",
            email: "john@example.com",
            password: "password123",
            role: "user"
        });

        console.log('Successfully created test users.');

        // 4. Create Service Listings
        await ServiceListing.create([
            {
                providerId: provider1._id,
                title: "Custom React Application with Tailwind",
                description: "I will build a highly responsive and animated React application matching your SaaS design requirements.",
                category: "Tech & Dev",
                price: 450,
                images: ["https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000"]
            },
            {
                providerId: provider1._id,
                title: "Backend API using Express & MongoDB",
                description: "Robust REST API development including JWT Authentication and Mongoose schemas.",
                category: "Tech & Dev",
                price: 300,
                images: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000"]
            },
            {
                providerId: provider2._id,
                title: "Mobile App UI Redesign",
                description: "Complete UI/UX overhaul of your iOS/Android app to make it visually stunning.",
                category: "Design & Creative",
                price: 500,
                images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000"]
            }
        ]);

        console.log('Successfully created service listings.');
        console.log('\n--- SEED COMPLETE ---');
        console.log('You can now log in with:');
        console.log('Provider 1: alex@example.com / password123');
        console.log('Provider 2: sarah@example.com / password123');
        console.log('Client: john@example.com / password123');
        
        process.exit();
    } catch (err) {
        console.error('Failed to seed database:', err);
        process.exit(1);
    }
};

seedDB();
