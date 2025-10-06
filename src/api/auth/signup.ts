import { Router } from 'express';
import { db } from '../../db/client';
import { users } from '../../db/users';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt'; 

const router = Router();

router.post('/', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with hashed password and created_at automatically
    await db.insert(users).values({
      email,
      password: hashedPassword,
      // created_at will be auto-set because of defaultNow()
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
