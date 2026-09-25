import { Response } from "express";
import Post from "../models/post.model";
import { AuthRequest } from "../middleware/authMiddleware";

// Create a post
export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, category } = req.body;
        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, content and category are required"
            });
        }

        const post = await Post.create({
            title,
            content,
            category,
            owner: req.user!.id
        });

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create post"
        });
    }
};

// Get all posts
export const getPosts = async (req: AuthRequest, res: Response) => {
    try {
        const { search, category, sort } = req.query;

        // Pagination
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            100
        );

        const skip = (page - 1) * limit;
        
        const filter: any = {};

        // Search title and content
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    content: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // Filter by category
        if (category) {
            filter.category = {
                $regex: `^${category}$`,
                $options: "i"
            };
        }

        // Sorting
        let sortOption: any = {
            createdAt: -1
        };

        if (sort) {
            const sortField = String(sort);

            if (sortField.startsWith("-")) {
                sortOption = {
                    [sortField.substring(1)]: -1
                };
            } else {
                sortOption = {
                    [sortField]: 1
                };
            }
        }

        // Get total number of matching posts
        const total = await Post.countDocuments(filter);

        // Get paginated posts
        const posts = await Post.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            count: posts.length,
            pagination: {
                page,
                limit,
                total,
                totalPages
            },
            posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve posts"
        });
    }
};
// Get one post
export const getPostById = async (req: AuthRequest, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.json({
            success: true,
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve post"
        });
    }
};

// Update a post
export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, category } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        post.title = title ?? post.title;
        post.content = content ?? post.content;
        post.category = category ?? post.category;

        await post.save();
        res.json({
            success: true,
            message: "Post updated successfully",
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update post"
        });
    }
};

// Delete a post
export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        await post.deleteOne();

        res.json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete post"
        });
    }
};