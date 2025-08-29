const express = require("express");
const BariketDB = require("../db/Bariket");

const categoriesRouter = express.Router();

// GET همه دسته‌بندی‌ها
categoriesRouter.get("/", async (req, res) => {
  try {
    const [results] = await BariketDB.query(
      "SELECT id, name FROM categories ORDER BY id ASC"
    );
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
});

// GET یک دسته‌بندی
categoriesRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await BariketDB.query(
      "SELECT id, name FROM categories WHERE id=?",
      [id]
    );
    if (!results[0]) return res.status(404).json({ message: "Category not found" });
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching category", error: err.message });
  }
});

// POST دسته‌بندی جدید
categoriesRouter.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "نام دسته‌بندی الزامی است" });

    const [result] = await BariketDB.query(
      "INSERT INTO categories (name) VALUES (?)",
      [name]
    );
    res.status(201).json({ insertedId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding category", error: err.message });
  }
});

// PUT ویرایش دسته‌بندی
categoriesRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const [existing] = await BariketDB.query("SELECT * FROM categories WHERE id=?", [id]);
    if (!existing[0]) return res.status(404).json({ message: "Category not found" });

    const updatedName = name ?? existing[0].name;

    const [result] = await BariketDB.query(
      "UPDATE categories SET name=? WHERE id=?",
      [updatedName, id]
    );
    res.json({ affectedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating category", error: err.message });
  }
});

// DELETE دسته‌بندی
categoriesRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await BariketDB.query("SELECT * FROM categories WHERE id=?", [id]);
    if (!existing[0]) return res.status(404).json({ message: "Category not found" });

    await BariketDB.query("DELETE FROM categories WHERE id=?", [id]);
    res.json({ deletedId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting category", error: err.message });
  }
});

module.exports = categoriesRouter;
