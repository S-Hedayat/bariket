// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");

// Routers
const productsRouter = require("./routes/productsRoutes");
const categoriesRouter = require("./routes/categoriesRoutes");
const accountsRouter = require("./routes/accountsRoutes");
const commentsRouter = require("./routes/commentsRoutes");
const ordersRouter = require("./routes/ordersRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------- CORS -----------------
const allowedOrigins = [
  "http://localhost:5173",        // لوکال برای توسعه
  "https://bariket.onrender.com", // فرانت روی Render
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // اجازه ارسال کوکی/Authorization header
  })
);

// ----------------- Parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// ----------------- Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads"), { maxAge: '7d' }));

// ----------------- API routes
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/orders", ordersRouter);

// ----------------- Serve Frontend
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ----------------- Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} - server.js:60`);
});
