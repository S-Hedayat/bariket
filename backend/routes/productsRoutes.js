const express = require("express");
const BariketDB = require("../db/Bariket");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const productsRouter = express.Router();

// 📂 مسیر آپلود
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 🗂️ multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    ),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // ⛔ محدودیت حجم 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [".png", ".jpg", ".jpeg", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error("فرمت فایل مجاز نیست"));
    cb(null, true);
  },
});

// 📥 آپلود تصویر محصول + WebP + Thumbnail
productsRouter.post("/upload", upload.single("avator"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "هیچ فایلی آپلود نشد!" });

    const inputPath = req.file.path;
    const baseName = req.file.filename.replace(path.extname(req.file.filename), "");
    const webpPath = path.join(uploadDir, `${baseName}.webp`);
    const thumbPath = path.join(uploadDir, `${baseName}-thumb.webp`);

    // 🔹 تبدیل به WebP با حداکثر 1200px (اصلی)
    await sharp(inputPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .toFormat("webp", { quality: 80 })
      .toFile(webpPath);

    // 🔹 نسخه Thumbnail برای کارت‌ها (300px)
    await sharp(inputPath)
      .resize({ width: 300 })
      .toFormat("webp", { quality: 70 })
      .toFile(thumbPath);

    // حذف فایل اصلی
    fs.unlinkSync(inputPath);

    res.json({
      filePath: `/uploads/${baseName}.webp`,
      thumbnailPath: `/uploads/${baseName}-thumb.webp`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در پردازش تصویر" });
  }
});

// ✅ GET همه محصولات + pagination
productsRouter.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const [results] = await BariketDB.query(
      `
      SELECT p.id, p.brand, p.model, p.priceUSD, p.avator, c.name AS categoryName
      FROM products p
      JOIN categories c ON p.categoryID = c.id
      ORDER BY p.id ASC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    const [[{ total }]] = await BariketDB.query(`SELECT COUNT(*) as total FROM products`);

    res.json({
      products: results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// 📤 ارائه فایل‌ها استاتیک
productsRouter.use("/uploads", express.static(uploadDir));

module.exports = productsRouter;
