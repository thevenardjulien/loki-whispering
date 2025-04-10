import express from "express";
import {
  getWhispers,
  getOneWhisper,
  AddWhisper,
  UpdateWhisper,
  DeleteWhisper,
} from "../controllers/apiController.js";

const router = express.Router();

// V1
router.get("/v1/whisper", getWhispers);
router.get("/v1/whisper/:id", getOneWhisper);
router.post("/v1/whisper/add", AddWhisper);
router.put("/v1/whisper/edit", UpdateWhisper);
router.delete("/v1/whisper/delete", DeleteWhisper);

export default router;
