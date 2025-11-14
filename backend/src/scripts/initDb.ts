import { initDatabase } from '../config/database';
import { UserModel } from '../models/User';

// Initialize database (directory is created automatically in database.ts)
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
