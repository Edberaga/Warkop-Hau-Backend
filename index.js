const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

// Initialize express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// PostgreSQL database configuration
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:voaM9tkfLiN5@ep-rough-bread-a1077b2t-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});

// Routes

// List all events
app.get("/meja", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM meja ORDER BY id");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific table
app.put("/meja/:id", async (req, res) => {
  const { id } = req.params;
  const { booked, customer_name, book_time } = req.body;
  try {
    const result = await pool.query(
      `UPDATE meja SET booked = $1, customer_name = $2, book_time = $3 WHERE id = $4 RETURNING *`,
      [booked, customer_name, book_time, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meja tidak ditemukan..." });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
