import { Response, NextFunction } from "express";
import Post from "../models/post.model";
import { AuthRequest } from "./authMiddleware";

export const checkPostOwnership = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (post.owner.toString() !== req.user!.id) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this post"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to check post ownership"
        });
    }
};