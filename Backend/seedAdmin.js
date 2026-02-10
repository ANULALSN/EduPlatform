import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import connectDB from './config/db.js';

const seedAdmin = async () => {
    await connectDB();

    const existing = await User.findOne({ email: 'admin@educonnect.com' });
    if (existing) {
        // Just update role to admin if already exists
        existing.role = 'admin';
        await existing.save();
        console.log('Existing user updated to admin role.');
    } else {
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        await User.create({
            fullName: 'Admin',
            email: 'admin@educonnect.com',
            password: hashedPassword,
            role: 'admin',
            mobile: '0000000000'
        });
        console.log('Admin account created!');
    }

    console.log('\n========================================');
    console.log('  ADMIN CREDENTIALS');
    console.log('  Email:    admin@educonnect.com');
    console.log('  Password: Admin@123');
    console.log('========================================\n');

    process.exit(0);
};

seedAdmin().catch(err => { console.error(err); process.exit(1); });
