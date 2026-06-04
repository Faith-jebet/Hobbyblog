import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';

console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
console.log('NEO4J_URI loaded:', !!process.env.NEO4J_URI);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});