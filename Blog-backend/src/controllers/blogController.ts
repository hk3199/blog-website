import { Request, Response } from 'express';
import  Blog  from '../models/blog';

interface AuthRequest extends Request {
    user?: any;
  }

export const createPost = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const newPost = new Blog({
        title,
        content,
        createdBy: req.user.userId,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err });
  }
};

// Get all blogs
export const getAllBlogs = async (req: Request, res: Response): Promise<Response> => {
    try {
    // const blogs = await Blog.find().populate('createdBy', 'email');
    // return res.status(200).json(blogs);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .populate('createdBy', 'email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); 

    const totalBlogs = await Blog.countDocuments();

    return res.status(200).json({
      totalBlogs,
      totalPages: Math.ceil(totalBlogs / limit),
      currentPage: page,
      blogs
    });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching blogs', error });
    }
  };
  
  // Get a blog by ID
  export const getBlogById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const blogDetails = await Blog.findById(req.params.id).populate('createdBy', 'email');
  
      if (!blogDetails) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      return res.status(200).json(blogDetails);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching blog', error });
    }
  };

  export const updateBlog = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {

        const { title, content } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
    
        if (blog.createdBy.toString() !== req.user.userId) {
          return res.status(403).json({ message: 'Unauthorized to update this blog' });
        }
    
        blog.title = title || blog.title;
        blog.content = content || blog.content;
    
        const updatedBlog = await blog.save();
        return res.status(200).json(updatedBlog);
    
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching blog', error });
    }

   }
// Delete a blog by ID
export const deleteBlog = async (req: Request, res: Response): Promise<Response> => {
    try {
      const blog = await Blog.findById(req.params.id);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      // @ts-ignore
      if (blog.createdBy.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized to delete this blog' });
      }
  
      await blog.deleteOne();
  
      return res.status(200).json({ message: 'Blog deleted successfully' });
  
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting blog', error });
    }
  };

  // Get all blogs for the current user
export const getMyBlogs = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {

      const myBlogs = await Blog
        .find({ createdBy: req.user.userId })
        .sort({ createdAt: -1 });
      return res.status(200).json(myBlogs);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching your blogs', error });
    }
  };
  
  
  