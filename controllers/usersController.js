import bdd from "../bdd.json" with { type: "json" };
import { __dirname } from "../index.js";
import path from "path";
import fs from "fs";
import { hashPassword, verifyPassword } from "../lib/password.js";
import jwt from "jsonwebtoken";
import process from "process";

export const getUsers = async (req, res) => {
  const users = bdd.users.map((user) => {
    const { id, name, email } = user;
    return { id, name, email };
  });
  if (users) {
    res.render("users/index", {
      title: "Users",
      users,
    });
  } else {
    res.status(404).send("Not found");
  }
};

export const RegisterForm = (req, res) => {
  res.render("users/register", {
    title: "Register",
  });
};

export const AddUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: Math.random().toString(36).slice(2),
      name,
      email,
      password: hashedPassword,
    };
    bdd.users.push(newUser);

    // Update bdd.json
    fs.writeFileSync(
      path.resolve(__dirname, "bdd.json"),
      JSON.stringify(bdd, null, 2),
    );

    res.redirect("/users");
  } else {
    res.status(400).send("Bad request");
  }
};

export const EditForm = (req, res) => {
  const { id } = req.params;
  const user = bdd.users.find((user) => user.id === id);
  if (user) {
    res.render("users/edit", {
      title: "Edit",
      user,
    });
  } else {
    res.status(404).send("Not found");
  }
};

export const EditUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const user = bdd.users.find((user) => user.id === id);

  if (!user) return res.status(404).send("Utilisateur introuvable");

  const isPasswordValid = await verifyPassword(user.password, password);
  if (!isPasswordValid) {
    return res.status(401).send("Mot de passe incorrect");
  }

  user.name = name;
  user.email = email;

  fs.writeFileSync(
    path.resolve(__dirname, "bdd.json"),
    JSON.stringify(bdd, null, 2),
  );

  res.redirect("/users");
};

export const DeleteUser = async (req, res) => {
  console.log("delete user");
  const { id } = req.params;
  const user = bdd.users.find((user) => user.id === id);
  if (user) {
    const index = bdd.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      bdd.users.splice(index, 1);
      fs.writeFileSync(
        path.resolve(__dirname, "bdd.json"),
        JSON.stringify(bdd, null, 2),
      );
    }

    res.redirect("/users");
  } else {
    res.status(404).send("Not found");
  }
};

export const LoginForm = (req, res) => {
  res.render("users/login", {
    title: "Login",
  });
};

export const LoginSubmit = async (req, res) => {
  const { email, password } = req.body;
  const user = bdd.users.find((user) => user.email === email);
  if (user) {
    const isPasswordValid = await verifyPassword(user.password, password);
    if (isPasswordValid) {
      const expireIn = 60 * 60 * 24 * 7;
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: expireIn,
      });
      res.cookie("token", token, {
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
        maxAge: expireIn,
      });
      res.redirect("/");
    } else {
      res.status(401).send("Mot de passe incorrect");
    }
  } else {
    res.status(404).send("Utilisateur introuvable");
  }
};
