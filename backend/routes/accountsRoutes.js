const express = require("express");
const BariketDB = require("../db/Bariket");
const bcrypt = require("bcrypt");

const accountsRouter = express.Router();

// ----------------- Login -----------------
accountsRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "ایمیل و رمز عبور الزامی است" });

    const [users] = await BariketDB.query("SELECT * FROM accounts WHERE email=?", [email]);
    if (users.length === 0) return res.status(401).json({ message: "کاربری با این ایمیل پیدا نشد" });

    const user = users[0];
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ message: "رمز عبور اشتباه است" });

    // بدون JWT (ساده)
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (err) {
    console.error("❌ خطا در لاگین: - accountsRoutes.js:29", err);
    res.status(500).json({ message: "خطای سرور در لاگین", error: err.message });
  }
});

// ----------------- Get all accounts with pagination -----------------
accountsRouter.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [users] = await BariketDB.query(
      "SELECT id, name, email, role, status, created_at FROM accounts ORDER BY id ASC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const [[{ total }]] = await BariketDB.query("SELECT COUNT(*) as total FROM accounts");

    res.json({ data: users, total });
  } catch (err) {
    console.error("خطا در گرفتن حساب‌ها: - accountsRoutes.js:50", err);
    res.status(500).json({ message: "Error fetching accounts", error: err.message });
  }
});

// ----------------- Get single account -----------------
accountsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await BariketDB.query(
      "SELECT id, name, email, role, status, created_at FROM accounts WHERE id=?",
      [id]
    );
    res.json(results[0] || null);
  } catch (err) {
    console.error("خطا در گرفتن حساب: - accountsRoutes.js:65", err);
    res.status(500).json({ message: "Error fetching account", error: err.message });
  }
});

// ----------------- Add new account -----------------
accountsRouter.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).send("فیلدهای ضروری ارسال نشده‌اند");

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await BariketDB.query(
      "INSERT INTO accounts (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "user"]
    );

    res.json({ insertedId: result.insertId });
  } catch (err) {
    console.error("خطا در افزودن حساب: - accountsRoutes.js:84", err);
    res.status(500).json({ message: "Error adding account", error: err.message });
  }
});

// ----------------- Update account -----------------
accountsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;

    const [check] = await BariketDB.query("SELECT * FROM accounts WHERE id=?", [id]);
    if (check.length === 0) return res.status(404).send("حساب پیدا نشد");

    const updatedName = name ?? check[0].name;
    const updatedEmail = email ?? check[0].email;
    const updatedPassword = password ? await bcrypt.hash(password, 10) : check[0].password;
    const updatedRole = role ?? check[0].role;
    const updatedStatus = status ?? check[0].status;

    const [result] = await BariketDB.query(
      "UPDATE accounts SET name=?, email=?, password=?, role=?, status=? WHERE id=?",
      [updatedName, updatedEmail, updatedPassword, updatedRole, updatedStatus, id]
    );

    res.json({ affectedRows: result.affectedRows });
  } catch (err) {
    console.error("خطا در ویرایش حساب: - accountsRoutes.js:111", err);
    res.status(500).json({ message: "Error updating account", error: err.message });
  }
});

// ----------------- Delete account -----------------
accountsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [check] = await BariketDB.query("SELECT * FROM accounts WHERE id=?", [id]);
    if (check.length === 0) return res.status(404).send("حساب پیدا نشد");

    await BariketDB.query("DELETE FROM accounts WHERE id=?", [id]);
    res.json({ deletedId: id });
  } catch (err) {
    console.error("خطا در حذف حساب: - accountsRoutes.js:126", err);
    res.status(500).json({ message: "Error deleting account", error: err.message });
  }
});

module.exports = accountsRouter;
