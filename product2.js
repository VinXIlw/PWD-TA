document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. FUNGSI KLIK PILIH WARNA
    // ==========================================
    const colorCircles = document.querySelectorAll('.color-circle, .color-item');
    colorCircles.forEach(circle => {
        circle.addEventListener('click', function() {
            colorCircles.forEach(c => c.classList.remove('active', 'active-color'));
            this.classList.add('active', 'active-color');
        });
    });

    // ==========================================
    // 2. FUNGSI KLIK PILIH UKURAN
    // ==========================================
    const sizeBoxes = document.querySelectorAll('.size-box, .size-item');
    sizeBoxes.forEach(box => {
        box.addEventListener('click', function() {
            sizeBoxes.forEach(b => b.classList.remove('active', 'active-size'));
            this.classList.add('active', 'active-size');
        });
    });

    // ==========================================
    // 3. FUNGSI TAMBAH KE KERANJANG
    // ==========================================
    const btnAddToCart = document.querySelector('.btn-cart, .btn-p-cart');
    
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            
            const titleEl = document.querySelector('.p-title, .product-details h1');
            const priceEl = document.querySelector('.p-price-current, .price');
            const oldPriceEl = document.querySelector('.p-price-old'); // <-- Radar Harga Coret Baru
            const imageEl = document.getElementById('main-image');
            const qtyInput = document.getElementById('qty-input');
            
            if (!titleEl || !priceEl || !imageEl) {
                alert('Oops, struktur HTML produk tidak terdeteksi dengan benar!');
                return;
            }

            let color = '-'; 
            if (colorCircles.length > 0) {
                const activeColor = document.querySelector('.color-circle.active, .color-item.active, .color-circle.active-color, .color-item.active-color');
                if (!activeColor) {
                    alert('Silakan pilih warna produk terlebih dahulu!');
                    return;
                }
                color = activeColor.getAttribute('data-color') || 'Terpilih';
            }

            let size = '-';
            if (sizeBoxes.length > 0) {
                const activeSize = document.querySelector('.size-box.active, .size-item.active, .size-box.active-size, .size-item.active-size');
                if (!activeSize) {
                    alert('Silakan pilih ukuran produk terlebih dahulu!');
                    return;
                }
                size = activeSize.innerText;
            }

            // Olah angka harga asli
            const priceText = priceEl.innerText;
            const price = parseInt(priceText.replace(/[^0-9]/g, '')); 
            
            // Olah angka harga coret (Jika tidak ada di HTML, pakai rumus cadangan +50k)
            let oldPrice = price + 50000;
            if (oldPriceEl) {
                oldPrice = parseInt(oldPriceEl.innerText.replace(/[^0-9]/g, ''));
            }

            const imageSrc = imageEl.src;
            const qty = qtyInput ? parseInt(qtyInput.value) : 1;

            const productData = {
                id: Date.now(),
                title: titleEl.innerText,
                price: price,
                oldPrice: oldPrice, // <-- Simpan harga coret asli
                imageSrc: imageSrc,
                qty: qty,
                color: color,
                size: size,
                selected: true 
            };

            let cart = JSON.parse(localStorage.getItem('elvra_cart')) || [];
            cart.push(productData);
            localStorage.setItem('elvra_cart', JSON.stringify(cart));

            if (color !== '-') {
                alert(`Sip! ${productData.title} (Warna: ${color}, Ukuran: ${size}) berhasil masuk keranjang.`);
            } else {
                alert(`Sip! ${productData.title} (Ukuran: ${size}) berhasil masuk keranjang.`);
            }
        });
    }

});