import bdd from "../bdd.json" with { type: "json" };
import fs from "fs";
import path from "path";
import { __dirname } from "../index.js";

const whispers = bdd.whispers
  .slice()
  .map((w) => ({
    ...w,
    timestamp: new Date(w.createdAt).getTime(),
  }))
  .sort((a, b) => b.timestamp - a.timestamp);

export const getWhispers = (req, res) => {
  res.render("whispers/whispering", {
    title: "Whispering",
    whispers: whispers,
    helpers: {
      formatDate: (date) => new Date(date).toLocaleString(),
    },
  });
};

export const whispersAddForm = (req, res) => {
  res.render("whispers/add", {
    title: "Add Whisper",
  });
};

export const whisperSubmitForm = (req, res) => {
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

    res.redirect("/");
  }
};

export const whisperDeleteForm = (req, res) => {
  const { id } = req.params;
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

export const whisperEditForm = (req, res) => {
  const { id } = req.params;
  const whisper = bdd.whispers.find((w) => w.id === id);
  if (whisper) {
    res.render("whispers/edit", {
      title: "Edit",
      whisper,
    });
  } else {
    res.status(404).send("Not found");
  }
};

export const whisperSubmitEdit = (req, res) => {
  const { id } = req.params;
  const { name, message } = req.body;
  const whisper = bdd.whispers.find((w) => w.id === id);

  if (!whisper) return res.status(404).send("Whisper not found");

  whisper.userName = name;
  whisper.message = message;

  fs.writeFileSync(
    path.resolve(__dirname, "bdd.json"),
    JSON.stringify(bdd, null, 2),
  );

  res.redirect("/");
};
