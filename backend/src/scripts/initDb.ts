import { initDatabase } from '../config/database';
import { UserModel } from '../models/User';
import path from 'path';
import fs from 'fs';

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
initDatabase();

// Create default admin user if it doesn't exist
const adminUsername = 'admin';
const adminPassword = 'admin123'; // Change this in production!

const existingAdmin = UserModel.findByUsername(adminUsername);

if (!existingAdmin) {
  UserModel.create(adminUsername, adminPassword);
  console.log('Default admin user created');
  console.log('Username: admin');
  console.log('Password: admin123');
  console.log('⚠️  IMPORTANT: Change the admin password after first login!');
} else {
  console.log('Admin user already exists');
}

console.log('Database initialization complete');
