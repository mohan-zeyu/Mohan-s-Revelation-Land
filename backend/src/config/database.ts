import BetterSqlite3 from 'better-sqlite3';
import type { Database as BetterSqliteDatabase } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'blog.db');
const db: BetterSqliteDatabase = new BetterSqlite3(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export const initDatabase = () => {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      abstract TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
  `);

  const postColumns = db.prepare("PRAGMA table_info(posts)").all();
  const hasAbstract = postColumns.some((column: any) => column.name === 'abstract');

  if (!hasAbstract) {
    db.exec("ALTER TABLE posts ADD COLUMN abstract TEXT NOT NULL DEFAULT ''");
  }

  console.log('Database initialized successfully');
};

export default db;
