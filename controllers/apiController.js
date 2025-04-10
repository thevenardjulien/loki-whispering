import bdd from "../bdd.json" with { type: "json" };
import fs from "fs";
import path from "path";
import { __dirname } from "../index.js";

export const getWhispers = (req, res) => {
  const whispers = bdd.whispers;
  if (whispers && whispers.length > 0) {
    res.status(200).send(whispers);
  } else {
    res.status(404).send("Not found");
  }
};

export const getOneWhisper = (req, res) => {
  const { id } = req.params;
  const whisper = bdd.whispers.find((w) => w.id === id);
  if (whisper) {
    res.status(200).send(whisper);
  } else {
    res.status(404).send("Not found");
  }
};

export const AddWhisper = (req, res) => {
  const { name, message } = req.body;
  if (name && message) {
    const whisper = {
      id: Math.random().toString(36).slice(2),
      userName: name,
      message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bdd.whispers = [...bdd.whispers, whisper].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );

    fs.writeFileSync(
      path.resolve(__dirname, "bdd.json"),
      JSON.stringify(bdd, null, 2),
    );

    res.send(whisper);
  } else {
    res.status(400).send("Bad request");
  }
};

export const UpdateWhisper = (req, res) => {
  const { id, name, message } = req.body;
  const whisper = bdd.whispers.find((w) => w.id === id);
  if (whisper) {
    if (name && message) {
      whisper.userName = name;
      whisper.message = message;

      fs.writeFileSync(
        path.resolve(__dirname, "bdd.json"),
        JSON.stringify(bdd, null, 2),
      );

      res.send(whisper);
    } else {
      res.status(400).send("Bad request");
    }
  } else {
    res.status(404).send("Not found");
  }
};

export const DeleteWhisper = (req, res) => {
  const { id } = req.body;
  const whisper = bdd.whispers.find((w) => w.id === id);
  if (whisper) {
    const index = bdd.whispers.findIndex((w) => w.id === id);
    if (index !== -1) {
      bdd.whispers.splice(index, 1);
      fs.writeFileSync(
        path.resolve(__dirname, "bdd.json"),
        JSON.stringify(bdd, null, 2),
      );
    }

    res.redirect("/");
  } else {
    res.status(404).send("Not found");
  }
};
