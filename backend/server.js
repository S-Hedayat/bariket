const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");

// اتصال به دیتابیس
const BariketDB = require("./db/Bariket");

// روترها
const productsRouter = require("./routes/productsRoutes");
const categoriesRouter = require("./routes/categoriesRoutes");
const accountsRouter = require("./routes/accountsRoutes");
const commentsRouter = require("./routes/commentsRoutes");
const ordersRouter = require("./routes/ordersRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// 📂 پوشه آپلودها (تصاویر)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Routes ----------
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/orders", ordersRouter);

// ---------- Serve React Frontend ----------
const frontendPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} - server.js:45`);
});
