import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/index.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = getDb();
    
    // Generate username from email (or use a separate field if preferred)
    const username = email.split('@')[0]; // Simple example

    // Check if user exists (by email or username)
    const existingUser = db.exec(`SELECT * FROM users WHERE email = '${email}' OR username = '${username}'`);
    if (existingUser.length > 0 && existingUser[0].values && existingUser[0].values.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email or username' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user with name
    db.run(`
      INSERT INTO users (username, email, password, name)
      VALUES (?, ?, ?, ?)
    `, [username, email, hashedPassword, name]);
    
    const newUserResult = db.exec('SELECT last_insert_rowid() as id');
    const newUserId = newUserResult[0]?.values[0]?.[0];

    if (!newUserId) {
      console.error("Failed to retrieve new user ID after insert");
      return res.status(500).json({ error: 'Server error during registration' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: newUserId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: newUserId,
        username,
        email,
        name
      }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[Auth Login] Attempting login for email: ${email}`); // Log email
    const db = getDb();
    
    // Fetch user including name
    const result = db.exec(`SELECT id, username, email, password, name FROM users WHERE email = ?`, [email]);
    if (result.length === 0 || !result[0].values || result[0].values.length === 0) {
      console.log(`[Auth Login] User not found for email: ${email}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Use column names from the result for clarity
    const columns = result[0].columns; // ['id', 'username', 'email', 'password', 'name']
    const values = result[0].values[0]; // [1, 'testuser', 'test@example.com', '$2a$10$...', 'Test User']
    const user = {};
    columns.forEach((col, index) => {
      user[col] = values[index];
    });

    console.log(`[Auth Login] User found: ID ${user.id}, Email ${user.email}, Name: ${user.name}`);
    
    // Verify password
    console.log('[Auth Login] Comparing provided password with stored hash...');
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(`[Auth Login] Password validation result: ${validPassword}`); // Log comparison result
    
    if (!validPassword) {
      console.log(`[Auth Login] Password mismatch for user ID: ${user.id}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    console.log(`[Auth Login] Password valid for user ID: ${user.id}. Generating token...`);
    // Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error('[Auth Login] Error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

export default router; 