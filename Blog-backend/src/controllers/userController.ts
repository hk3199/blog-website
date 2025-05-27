import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import jwt from 'jsonwebtoken';

export const signupUser = async (req: Request, res: Response): Promise<Response | void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user', error });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<Response | void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, email: user.email, userName: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error });
  }
};

export const getProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId).select('username email blogTitle blogDescription blogBanner');
     console.log('User ID:', userId); // Debugging line to check user ID
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};


export const updateUserProfile = async (req: Request & { user?: any }, res: Response): Promise<Response> => {
  try {
    const userId = req.user.userId; //update later
   console.log('User ID:', userId); 
    const { blogTitle, blogDescription, blogBanner } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        blogTitle,
        blogDescription,
        blogBanner
      },
      { new: true } // returns the updated document
    ).select('-password'); // exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update profile', error });
  }
};
