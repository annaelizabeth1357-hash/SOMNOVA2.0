import express from "express";
import { createServer as createViteServer } from "vite";
import session from "express-session";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("dreams.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE
  );
  CREATE TABLE IF NOT EXISTS dreams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    completed_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(session({
    secret: "somnova-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: true, 
      sameSite: 'none',
      httpOnly: true 
    }
  }));

  // Auth Middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!(req.session as any).userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // API Routes
  app.post("/api/login", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) {
      const info = db.prepare("INSERT INTO users (email) VALUES (?)").run(email);
      user = { id: info.lastInsertRowid, email };
    }

    (req.session as any).userId = user.id;
    res.json({ success: true, user });
  });

  app.get("/api/me", (req, res) => {
    if (!(req.session as any).userId) return res.status(401).json({ error: "Not logged in" });
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get((req.session as any).userId);
    res.json(user);
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/dreams", requireAuth, (req, res) => {
    const dreams = db.prepare("SELECT * FROM dreams WHERE user_id = ? ORDER BY created_at DESC").all((req.session as any).userId);
    res.json(dreams);
  });

  app.post("/api/dreams", requireAuth, (req, res) => {
    const { content, completed_text } = req.body;
    const info = db.prepare("INSERT INTO dreams (user_id, content, completed_text) VALUES (?, ?, ?)")
      .run((req.session as any).userId, content, completed_text);
    res.json({ id: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
