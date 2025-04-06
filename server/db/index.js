import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedDatabase } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'music.db');

let db;
let SQL;

export const initDatabase = async () => {
  try {
    SQL = await initSqlJs();
    
    // Check if database file exists
    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
    } else {
      // Create new database
      db = new SQL.Database();
      // Initialize schema
      const schema = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
      db.exec(schema);
      // Save to file
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
      
      // Seed the database with sample data
      await seedDatabase(db);
      // Save again after seeding
      saveDatabase();
    }

    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

export const execQuery = (query, params = []) => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  try {
    return db.exec(query, params);
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

export const saveDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}; 