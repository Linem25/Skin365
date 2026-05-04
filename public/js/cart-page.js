document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('total-price');
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center">Giỏ hàng đang trống. <a href="/">Mua sắm ngay!</a></p>';
        totalElement.innerText = '0đ';
        return;
    }

    let html = '';
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        // Trong file public/js/cart-page.js, đoạn html += `...`
html += `
    <div class="card mb-3 shadow-sm border-0">
        <div class="card-body d-flex align-items-center">
            <img src="${item.image}" style="width: 80px; height: 80px; object-fit: cover;" class="rounded me-3">
            <div class="flex-grow-1">
                <h6 class="mb-1">${item.name}</h6>
                <div class="price-box">
                    <span class="text-danger fw-bold small">${Number(item.price).toLocaleString()}đ</span>
                    ${item.originalPrice && item.originalPrice > item.price 
                        ? `<del class="text-muted ms-2" style="font-size: 11px;">${Number(item.originalPrice).toLocaleString()}đ</del>` 
                        : ''
                    }
                </div>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary" style="padding: 0px 8px;" onclick="changeQty(${index}, -1)">-</button>
                <span class="mx-3 fw-bold" style="min-width: 20px; text-align: center;">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary" style="padding: 0px 8px;" onclick="changeQty(${index}, 1)">+</button>
            </div>
            <div class="ms-4 text-end" style="min-width: 100px;">
                <p class="mb-0 fw-bold text-dark">${(item.price * item.quantity).toLocaleString()}đ</p>
                <button class="btn btn-sm text-muted p-0" onclick="removeItem(${index})" style="font-size: 12px;">
                    <i class="bi bi-trash"></i> Xóa
                </button>
            </div>
        </div>
    </div>
`;
    });

    container.innerHTML = html;
    totalElement.innerText = total.toLocaleString() + 'đ';
}

// Hàm thay đổi số lượng
window.changeQty = function(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += delta;

    if (cart[index].quantity < 1) {
        if(confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = 1;
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // Vẽ lại giao diện
    if (typeof updateCartBadge === "function") updateCartBadge(); // Cập nhật số trên Header
}

// Hàm xóa item
window.removeItem = function(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    if (typeof updateCartBadge === "function") updateCartBadge();
}
// Hàm hiện Form khi bấm nút Đặt Hàng Ngay
window.showCheckoutForm = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return alert("Giỏ hàng trống!");

    const form = document.getElementById('checkout-form');
    const btn = document.getElementById('btn-show-form');

    form.style.display = 'block';
    btn.style.display = 'none'; // Ẩn hẳn nút cũ
    
    // Cuộn nhẹ lên đầu form để user thấy rõ các ô nhập
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};
// Đặt hàng
async function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return alert("Giỏ hàng trống!");

    const customer_name = document.getElementById('cus_name').value;
    const phone = document.getElementById('cus_phone').value;
    const address = document.getElementById('cus_address').value;

    if (!customer_name || !phone || !address) {
        return alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
    }

    const orderData = { customer_name, phone, address, cart };

    try {
        const response = await fetch('/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        if (result.success) {
            alert("🎉 Chúc mừng! Đơn hàng của bạn đã được hệ thống Skin365 ghi nhận.");
            localStorage.removeItem('cart'); // Xóa giỏ hàng sau khi đặt xong
            window.location.href = "/"; // Quay về trang chủ
        } else {
            alert("Lỗi: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Có lỗi xảy ra khi đặt hàng!");
    }
}