import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { checkPostOwnership } from "../middleware/ownershipMiddleware";
import { authorize } from "../middleware/authorizationMiddleware";

import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
} from "../controllers/post.controller";

const router = Router();

// All post routes require authentication
router.use(authenticate);

// Admin-only test route
router.get("/admin/test", authorize("admin"), (req, res) => {
    res.json({
        success: true,
        message: "Admin authorization successful"
    });
});

router.post("/", createPost);

router.get("/", getPosts);

router.get("/:id", getPostById);

// Only the owner can update or delete a post
router.put("/:id", checkPostOwnership, updatePost);

router.delete("/:id", checkPostOwnership, deletePost);

export default router;