import { Router } from "express";
import { getGithubBuildNumber, getGithubContributions } from "../controllers/githubController.js";

const router = Router();

router.get("/:username/contributions", getGithubContributions);
router.get("/:owner/:repo/build-number", getGithubBuildNumber);

export default router;
