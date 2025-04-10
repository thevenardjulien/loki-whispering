import express from "express";
import { dirname, sep } from "path";
import { fileURLToPath } from "url";
import process from "process";
import { createRequire } from "module";
import { verifToken } from "./middlewares/verifToken.js";
import userRoute from "./routes/usersRoute.js";
import whisperRoute from "./routes/whispersRoute.js";

const require = createRequire(import.meta.url);
const bdd = require("./bdd.json");
const app = express();
export const __dirname = dirname(fileURLToPath(import.meta.url)) + sep;

// Configuration
const cfg = {
  port: process.env.PORT || process.argv[2] || 3000,
  dir: {
    root: __dirname,
    public: __dirname + "public" + sep,
    views: __dirname + "views" + sep,
  },
};

// Static files
app.use(express.static(cfg.dir.public));

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Configuration EJS
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Verif token
app.use(verifToken);

// Routes
app.get("/", (req, res) => {
  const whispers = bdd.whispers;
  res.render("index", {
    title: "Whispering",
    whispers,
  });
});

app.get("/about", (req, res) => {
  const whispers = bdd.whispers;
  const whispersCount = whispers.length;
  res.render("about", {
    title: "About",
    whispersCount,
  });
});

app.use("/users", userRoute);
app.use("/whispers", whisperRoute);

// Gestion des erreurs
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.path}`);
  res.status(404).send("Page not found");
});

// Démarrage du serveur
app.listen(cfg.port, () => {
  console.log(`Serveur démarré sur http://localhost:${cfg.port}`);
});
