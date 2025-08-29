const express = require("express");
const BariketDB = require("../db/Bariket");

const ordersRouter = express.Router();

// ----------------- Get all orders -----------------
ordersRouter.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [orders] = await BariketDB.query(
      `SELECT orders.*, accounts.name AS userName 
       FROM orders 
       INNER JOIN accounts ON orders.accountID = accounts.id 
       ORDER BY orders.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [[{ total }]] = await BariketDB.query(
      "SELECT COUNT(*) as total FROM orders"
    );

    res.json({
      data: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("❌ خطا در گرفتن سفارش‌ها: - ordersRoutes.js:33", err);
    res.status(500).json({ message: "خطای سرور", error: err.message });
  }
});


// ----------------- Get single order -----------------
ordersRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // اطلاعات سفارش
    const [orders] = await BariketDB.query(
      `SELECT orders.*, accounts.name AS userName 
       FROM orders 
       INNER JOIN accounts ON orders.accountID = accounts.id 
       WHERE orders.id=?`,
      [id]
    );

    if (orders.length === 0) return res.status(404).send("سفارش پیدا نشد");

    // آیتم‌های سفارش
    const [items] = await BariketDB.query(
      `SELECT order_items.*, products.brand AS productBrand, products.model AS productModel
       FROM order_items
       INNER JOIN products ON order_items.productID = products.id
       WHERE order_items.orderID=?`,
      [id]
    );

    res.json({ order: orders[0], items });
  } catch (err) {
    console.error("❌ خطا در گرفتن سفارش: - ordersRoutes.js:66", err);
    res.status(500).json({ message: "Error fetching order", error: err.message });
  }
});

// ----------------- Add new order -----------------
ordersRouter.post("/", async (req, res) => {
  try {
    const { accountID, total, status, items } = req.body;

    if (!accountID || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).send("اطلاعات سفارش ناقص است");
    }

    // اضافه کردن سفارش
    const [orderResult] = await BariketDB.query(
      "INSERT INTO orders (accountID, total, status) VALUES (?, ?, ?)",
      [accountID, total || 0, status || "pending"]
    );

    const orderID = orderResult.insertId;

    // اضافه کردن آیتم‌ها
    const itemsQuery = `INSERT INTO order_items (orderID, productID, quantity, price) VALUES ?`;
    const itemsValues = items.map(item => [orderID, item.productID, item.quantity || 1, item.price || 0]);
    await BariketDB.query(itemsQuery, [itemsValues]);

    res.json({ insertedId: orderID });
  } catch (err) {
    console.error("❌ خطا در افزودن سفارش: - ordersRoutes.js:95", err);
    res.status(500).json({ message: "Error adding order", error: err.message });
  }
});

// ----------------- Update order -----------------
ordersRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { total, status } = req.body;

    const [check] = await BariketDB.query("SELECT * FROM orders WHERE id=?", [id]);
    if (check.length === 0) return res.status(404).send("سفارش پیدا نشد");

    const updatedTotal = total ?? check[0].total;
    const updatedStatus = status ?? check[0].status;

    const [result] = await BariketDB.query(
      "UPDATE orders SET total=?, status=? WHERE id=?",
      [updatedTotal, updatedStatus, id]
    );

    res.json({ affectedRows: result.affectedRows });
  } catch (err) {
    console.error("❌ خطا در ویرایش سفارش: - ordersRoutes.js:119", err);
    res.status(500).json({ message: "Error updating order", error: err.message });
  }
});

// ----------------- Delete order -----------------
ordersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [check] = await BariketDB.query("SELECT * FROM orders WHERE id=?", [id]);
    if (check.length === 0) return res.status(404).send("سفارش پیدا نشد");

    await BariketDB.query("DELETE FROM orders WHERE id=?", [id]);
    res.json({ deletedId: id });
  } catch (err) {
    console.error("❌ خطا در حذف سفارش: - ordersRoutes.js:135", err);
    res.status(500).json({ message: "Error deleting order", error: err.message });
  }
});

module.exports = ordersRouter;
