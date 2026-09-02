import { Router } from "express";
import { getGithubContributions } from "../controllers/githubController.js";

const router = Router();

router.get("/:username/contributions", getGithubContributions);

export default router;
