const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression"); // ✅ اضافه شد

// اتصال به دیتابیس
const BariketDB = require("./db/Bariket");

// روترها
const productsRouter = require("./routes/productsRoutes");
const categoriesRouter = require("./routes/categoriesRoutes");
const accountsRouter = require("./routes/accountsRoutes.js");
const commentsRouter = require("./routes/commentsRoutes");
const ordersRouter = require("./routes/ordersRoutes.js");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ فعال‌کردن gzip فشرده‌سازی
app.use(compression());

// 📂 پوشه آپلودها (تصاویر)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Routes ----------
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/orders", ordersRouter);

// ---------- Root ----------
app.get("/", (req, res) => {
  res.send("Bariket API is running ✅ (with gzip compression)");
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT} - server.js:44`);
});
