// 1. Đảm bảo hàm này được chạy ngay khi trang web tải xong
document.addEventListener('DOMContentLoaded', () => {
    console.log("File main.js đã kết nối thành công!");
    loadCategories();
});

async function loadCategories() {
    const container = document.getElementById('categories-container');
    
    // Kiểm tra xem có tìm thấy thẻ div để chèn data không
    if (!container) {
        console.error("Không tìm thấy thẻ có id='categories-container' trong HTML");
        return;
    }

    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        console.log("Dữ liệu từ Server trả về:", categories);

        if (categories.length === 0) {
            container.innerHTML = "<p>Database có vẻ đang trống...</p>";
            return;
        }

        // Xóa nội dung cũ (nếu có) và render dữ liệu mới
        let htmlContent = "";
        categories.forEach(cat => {
            // Xử lý đường dẫn ảnh để không bị lỗi 
            const imgSrc = cat.img_url.startsWith('/') ? cat.img_url : `/${cat.img_url}`;
            
            // SỬA: Bao bọc bằng thẻ <a> trỏ tới trang category kèm ID
            htmlContent += `
                <a href="/category?id=${cat.id}" class="category-item" style="text-decoration: none;">
                    <img src="${imgSrc}" alt="${cat.name}" onerror="this.src='https://via.placeholder.com/100'">
                    <p style="margin-top: 5px; font-weight: 500; color: #333;">${cat.name}</p>
                </a>
            `;
        });
        
        container.innerHTML = htmlContent;

    } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
    }
}