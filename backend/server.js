require("dotenv").config();

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.host,
  port: Number(process.env.port),
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database");

  const createTableSql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      user_email VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      due_date DATE DEFAULT NULL,
      priority VARCHAR(20) DEFAULT 'none',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(createTableSql, (tableErr) => {
    if (tableErr) {
      console.error("Error creating tasks table:", tableErr);
    } else {
      console.log("Tasks table ready");
    }
  });

  const migrations = [
    "ALTER TABLE tasks ADD COLUMN due_date DATE DEFAULT NULL",
    "ALTER TABLE tasks ADD COLUMN priority VARCHAR(20) DEFAULT 'none'",
  ];
  migrations.forEach((sql) => {
    db.query(sql, (migErr) => {
      if (migErr && migErr.errno !== 1060) {
        console.error("Migration error:", migErr);
      }
    });
  });
});

app.get("/", (req, res) => {
  res.send("Task Manager API is running");
});

app.get("/tasks/:email", (req, res) => {
  const email = req.params.email;
  const sql = "SELECT * FROM tasks WHERE user_email = ? ORDER BY created_at DESC";

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

app.post("/add-task", (req, res) => {
  const { title, description, user_email, due_date, priority } = req.body;
  const sql =
    "INSERT INTO tasks (title, description, user_email, status, due_date, priority) VALUES (?, ?, ?, 'pending', ?, ?)";

  db.query(
    sql,
    [title, description, user_email, due_date || null, priority || "none"],
    (err, result) => {
      if (err) {
        console.error("Error inserting task:", err);
        return res.status(500).send(err);
      }
      res.status(201).send("Task added");
    }
  );
});

app.put("/edit-task/:id", (req, res) => {
  const id = req.params.id;
  const { title, description, due_date, priority } = req.body;
  const sql =
    "UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ? WHERE id = ?";

  db.query(
    sql,
    [title, description, due_date || null, priority || "none", id],
    (err) => {
      if (err) {
        console.error("Error editing task:", err);
        return res.status(500).send(err);
      }
      res.send("Task updated");
    }
  );
});

app.put("/toggle-task/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE tasks SET status = CASE WHEN status = 'completed' THEN 'pending' ELSE 'completed' END WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Error toggling task:", err);
      return res.status(500).send(err);
    }
    res.send("Task toggled");
  });
});

app.delete("/delete-task/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM tasks WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res.status(500).send(err);
    }
    res.send("Task deleted");
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});