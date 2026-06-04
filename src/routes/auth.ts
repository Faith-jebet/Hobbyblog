import { protect, AuthRequest } from '../middleware/auth';
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/user';
import { getDriver } from '../db/neo4j';

const router = Router();

router.get('/profile', protect, async (req: AuthRequest, res: Response) => {
    const driver = getDriver();
    const session = driver.session();
    try {
        const result = await session.run(
            'MATCH (u:User {id: $userId}) RETURN u',
            { userId: req.userId }
        );
        if (result.records.length === 0) return res.status(404).json({ error: 'User not found' });
        const user = result.records[0].get('u').properties;
        res.json({ user: { id: user.id, email: user.email, name: user.name } });

    } finally {
        await session.close();
    }
});

// Register route
router.post('/signup', async (req: Request, res: Response) => {
    const { email, name, password } = req.body;

    if (!name || !email || !password) 
        return res.status(400).json({ message: 'All fields are required'});

    try {
        const existing = await findUserByEmail(email);
        if (existing) return res.status(400).json({ message: 'Email already in use' });

        const user = await createUser(name, email, password);
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d'} );

        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(400).json({ error: 'Invalid Credentials'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid Credentials' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;