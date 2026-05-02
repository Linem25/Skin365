const express = require("express");
const path = require("path");
const app = express();
const db = require('./db');

// Cấu hình EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Chỉ đường dẫn đến thư mục views mới đổi tên

app.use(express.static(path.join(__dirname, "public")));

// Route Trang chủ
app.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories");
        // Gửi data sang index.ejs
        res.render("index", { categories: rows }); 
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
});

// Route Trang danh mục sản phẩm
app.get("/category", async (req, res) => {
    const catId = req.query.id;
    try {
        const [products] = await db.query("SELECT * FROM products WHERE category_id = ?", [catId]);
        // Gửi danh sách sản phẩm sang category.ejs
        res.render("category", { products: products}); 
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
});

app.listen(3000, () => {
    console.log("Server Skin365 đang chạy tại http://localhost:3000");
});