import express from "express";
import { dirname, sep } from "path";
import { fileURLToPath } from "url";
import process from "process";

// Import des routeurs
import userRoute from "./routes/usersRoute.js";

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
app.set("views", cfg.dir.views);

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Whispering",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
  });
});

app.use("/users", userRoute);

// Gestion des erreurs
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.path}`);
  res.status(404).send("Page not found");
});

// Démarrage du serveur
app.listen(cfg.port, () => {
  console.log(`Serveur démarré sur http://localhost:${cfg.port}`);
});
