import express from "express";
import {
  signup,
  signin,
  uploadimage,
  getProfile,
} from "../controllers/AuthController.js";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/uploadimage", authenticateToken, uploadimage);
router.get("/profile", authenticateToken, getProfile);

export default router;
