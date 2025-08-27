import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  AddPost,
  getPosts,
  updatePost,
  getPostById,
  deletePost,
  toggleLike,
  addComment,
  getComments,
} from "../controllers/PostController.js";

const router = Router();

router.post("/addpost", authenticateToken, AddPost);
router.get("/getpost", authenticateToken, getPosts);
router.post("/updatepost/:id", authenticateToken, updatePost);
router.get("/getpost", authenticateToken, getPostById);
router.post("/deletepost/:id", authenticateToken, deletePost);

// Like/Dislike routes
router.post("/like/:id", authenticateToken, toggleLike);

// Comment routes
router.post("/comment/:id", authenticateToken, addComment);
router.get("/comments/:id", getComments);

export default router;
