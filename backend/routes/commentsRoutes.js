const express = require("express");
const BariketDB = require("../db/Bariket");

const commentsRouter = express.Router();

// ----------------- Get all comments -----------------
commentsRouter.get("/", async (req, res) => {
  try {
    const query = `
      SELECT comments.id, comments.content, comments.created_at,
             accounts.name AS accountName,
             products.brand AS productBrand,
             products.model AS productModel
      FROM comments
      INNER JOIN accounts ON comments.accountID = accounts.id
      INNER JOIN products ON comments.productID = products.id
      ORDER BY comments.id DESC
    `;
    const [results] = await BariketDB.query(query);
    res.json(Array.isArray(results) ? results : []);
  } catch (err) {
    console.error("خطا در گرفتن کامنت‌ها: - commentsRoutes.js:22", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

// ----------------- Add new comment -----------------
commentsRouter.post("/", async (req, res) => {
  try {
    const { accountID, productID, content } = req.body;

    if (!accountID || !productID || !content) {
      return res.status(400).send("فیلدهای ضروری ارسال نشده‌اند");
    }

    const query = `
      INSERT INTO comments (accountID, productID, content)
      VALUES (?, ?, ?)
    `;
    const [result] = await BariketDB.query(query, [accountID, productID, content]);

    res.json({ insertedId: result.insertId });
  } catch (err) {
    console.error("خطا در افزودن کامنت: - commentsRoutes.js:44", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

// ----------------- Update comment -----------------
commentsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const [check] = await BariketDB.query("SELECT * FROM comments WHERE id=?", [id]);
    if (check.length === 0) return res.status(404).send("کامنت پیدا نشد");

    const updatedContent = content ?? check[0].content;

    const query = `
      UPDATE comments SET content=?
      WHERE id=?
    `;
    const [result] = await BariketDB.query(query, [updatedContent, id]);

    res.json({ affectedRows: result.affectedRows });
  } catch (err) {
    console.error("خطا در ویرایش کامنت: - commentsRoutes.js:68", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

// ----------------- Delete comment -----------------
commentsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [check] = await BariketDB.query("SELECT * FROM comments WHERE id=?", [id]);
    if (check.length === 0) return res.status(404).send("کامنت پیدا نشد");

    await BariketDB.query("DELETE FROM comments WHERE id=?", [id]);
    res.json({ deletedId: id });
  } catch (err) {
    console.error("خطا در حذف کامنت: - commentsRoutes.js:84", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

module.exports = commentsRouter;
