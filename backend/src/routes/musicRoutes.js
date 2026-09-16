import { Router } from "express";
import { getNowPlayingTrack } from "../controllers/musicController.js";

const router = Router();

router.get("/now-playing", getNowPlayingTrack);

export default router;
