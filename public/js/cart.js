// Chạy ngay khi trang web load xong
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});

// Hàm cập nhật số lượng hiển thị trên Badge
function updateCartBadge() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
    
    cartCountElement.innerText = totalItems;
    cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Hàm thêm sản phẩm ( gọi từ nút "Thêm vào giỏ" ở trang category)
// Trong file public/js/cart.js
function addToCart(id, name, price, image, originalPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            id, 
            name, 
            price, // Đây là giá đã giảm (finalPrice)
            image, 
            originalPrice, // Lưu thêm giá gốc ở đây
            quantity: 1 
        });
    }
        // Cập nhật lại con số trên header ngay lập tức

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}
