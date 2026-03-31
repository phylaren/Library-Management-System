import express from 'express';

import bookRoutes from './routes/bookRoutes'; 
import userRoutes from './routes/userRoutes'; 
import loanRoutes from './routes/loanRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());

app.use('/books', bookRoutes);
app.use('/users', userRoutes);
app.use('/loans', loanRoutes);
app.use('/auth', authRoutes);
app.use('/uploads', express.static('uploads'));

export default app;