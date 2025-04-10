import express from "express";
import {
  getWhispers,
  whispersAddForm,
  whisperSubmitForm,
  whisperDeleteForm,
  whisperEditForm,
  whisperSubmitEdit,
} from "../controllers/whispersController.js";

const router = express.Router();

router.get("/", getWhispers);
router.get("/new", whispersAddForm);
router.post("/new/add", whisperSubmitForm);
router.get("/edit/:id", whisperEditForm);
router.post("/edit/:id", whisperSubmitEdit);
router.post("/delete/:id", whisperDeleteForm);

export default router;
