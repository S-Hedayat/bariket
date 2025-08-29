const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");

const BariketDB = require("./db/Bariket");

const productsRouter = require("./routes/productsRoutes");
const categoriesRouter = require("./routes/categoriesRoutes");
const accountsRouter = require("./routes/accountsRoutes");
const commentsRouter = require("./routes/commentsRoutes");
const ordersRouter = require("./routes/ordersRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/orders", ordersRouter);

// Serve Vite Frontend
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} - server.js:40`);
});