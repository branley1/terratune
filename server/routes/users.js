import express from 'express';
import { getDb } from '../db/index.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    // Fetch user including name, bio, avatar
    const result = db.exec(`
      SELECT id, username, email, name, bio, avatar, created_at
      FROM users
      WHERE id = ?
    `, [id]);
    
    if (result.length === 0 || !result[0].values || result[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = result[0].values[0];
    const user = {
      id: userData[0],
      username: userData[1],
      email: userData[2],
      name: userData[3],
      bio: userData[4],
      avatar: userData[5],
      created_at: userData[6]
    };
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile (name, bio, avatar only)
router.put('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10); // Parse ID once
    const { name, bio, avatar } = req.body;

    console.log(`[PUT /api/users/${parsedId}] Received body:`, req.body);
    
    // Basic validation
    if (name === undefined || bio === undefined || avatar === undefined) {
      return res.status(400).json({ error: 'Missing required fields: name, bio, avatar' });
    }

    // Check if user is updating their own profile
    if (req.user.id !== parsedId) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }
    
    const db = getDb();

    // 1. Fetch current user data BEFORE update to get immutable fields
    const currentUserResult = db.exec(`
      SELECT username, email, created_at
      FROM users
      WHERE id = ?
    `, [parsedId]);

    if (currentUserResult.length === 0 || !currentUserResult[0].values || !currentUserResult[0].values.length === 0) {
        console.error(`User not found for ID: ${parsedId} before update attempt.`);
        return res.status(404).json({ error: 'User not found.' });
    }
    const currentUserData = currentUserResult[0].values[0];
    const currentUsername = currentUserData[0];
    const currentEmail = currentUserData[1];
    const currentCreatedAt = currentUserData[2];

    // 2. Perform the update
    db.run(`
      UPDATE users
      SET name = ?, bio = ?, avatar = ?
      WHERE id = ?
    `, [name, bio, avatar, parsedId]);

    // 3. Construct the response using fetched immutable data + new data from request body
    const updatedUserResponse = {
      id: parsedId, // Use the ID from params
      username: currentUsername,
      email: currentEmail,
      name: name, // Use new name from body
      bio: bio,   // Use new bio from body
      avatar: avatar, // Use new avatar from body
      created_at: currentCreatedAt
    };

    // 4. Send the response
    res.json(updatedUserResponse);

  } catch (err) {
    console.error(`[PUT /api/users/${req.params.id}] Error:`, err); // Log error with ID
    res.status(500).json({ error: 'Server error during profile update' }); // More specific error
  }
});

export default router; 