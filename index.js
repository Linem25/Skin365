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
// Route Trang giỏ hàng
app.get("/cart", (req, res) => {
    res.render("cart"); 
});

// Đặt hàng
app.use(express.json()); // Để xử lý dữ liệu JSON gửi từ Fetch API

// Cách viết đơn giản hơn nếu không dùng Transaction phức tạp
app.post("/checkout", async (req, res) => {
    const { customer_name, phone, address, cart } = req.body;
    let total_amount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
        // Lưu đơn hàng
        const [orderResult] = await db.query(
            "INSERT INTO orders (customer_name, phone, address, total_amount) VALUES (?, ?, ?, ?)",
            [customer_name, phone, address, total_amount]
        );
        const orderId = orderResult.insertId;

        // Lưu chi tiết (Dùng vòng lặp cơ bản)
        for (const item of cart) {
            await db.query(
                "INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                [orderId, item.id, item.quantity, item.price]
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.error("LỖI TẠI SERVER:", err); // Dòng này sẽ hiện lỗi chi tiết ở Terminal
        res.status(500).json({ success: false, message: err.message });
    }
});
app.listen(3000, () => {
    console.log("Server Skin365 đang chạy tại http://localhost:3000");
});