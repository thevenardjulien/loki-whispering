import express from "express";
import {
  AddUser,
  getUsers,
  RegisterForm,
  EditForm,
  EditUser,
  DeleteUser,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/register", RegisterForm);
router.post("/register/add", AddUser);
router.get("/edit/:id", EditForm);
router.post("/edit/:id", EditUser);
router.post("/delete/:id", DeleteUser);

export default router;
