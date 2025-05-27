import express from "express";
import cors from "cors";
import connectDB from './config/db'
import dotenv from "dotenv";
import userRoutes from './routes/userRoutes';
import blogRoute from './routes/blogRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to Blog API!');
  });

app.use('/api/users', userRoutes);
app.use('/api/blog', blogRoute);

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});