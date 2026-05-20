document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LOGIKA PLUS / MINUS JUMLAH ---
    const btnPlus = document.getElementById('btn-plus');
    const btnMinus = document.getElementById('btn-minus');
    const qtyInput = document.getElementById('qty-input');

    if (btnPlus && btnMinus && qtyInput) {
        btnPlus.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
        });

        btnMinus.addEventListener('click', () => {
            if (parseInt(qtyInput.value) > 1) {
                qtyInput.value = parseInt(qtyInput.value) - 1;
            }
        });
    }

    // --- 2. LOGIKA PILIH UKURAN ---
    const sizeBoxes = document.querySelectorAll('.size-box, .size-item');
    sizeBoxes.forEach(box => {
        box.addEventListener('click', function() {
            sizeBoxes.forEach(s => s.classList.remove('active', 'active-size'));
            this.classList.add('active', 'active-size');
        });
    });

    // --- 3. LOGIKA PILIH WARNA & GANTI GAMBAR ---
    const colorCircles = document.querySelectorAll('.color-circle, .color-item');
    const mainImage = document.getElementById('main-image');

    // Daftar Gambar Berdasarkan Warna (Fitur Keren Milikmu)
    const imageSources = {
        "Hitam": "images/Kaos Hitam.jpg",
        "Biru": "images/Kaos Biru.jpeg",
        "Merah": "images/Kaos Merah.jpg",
        "Putih": "images/Kaos Putih.jpg"
    };

    colorCircles.forEach(circle => {
        circle.addEventListener('click', function() {
            colorCircles.forEach(c => c.classList.remove('active', 'active-color'));
            this.classList.add('active', 'active-color');

            // Ganti gambar dengan efek transisi cepat
            const selectedColor = this.getAttribute('data-color');
            if (mainImage && imageSources[selectedColor]) {
                mainImage.style.opacity = 0; 
                setTimeout(() => {
                    mainImage.src = imageSources[selectedColor];
                    mainImage.style.opacity = 1;
                }, 200);
            }
        });
    });

    // --- 4. FUNGSI PENGAMBIL DATA PRODUK (DINAMIS & AKURAT) ---
    function dapatkanDataProduk() {
        const titleEl = document.querySelector('.p-title, .product-details h1');
        const priceEl = document.querySelector('.p-price-current, .price, .current-price');
        const oldPriceEl = document.querySelector('.p-price-old, .old-price, .price-old, del, strike, s'); 
        
        if (!titleEl || !priceEl || !mainImage) {
            alert('HTML produk tidak terdeteksi!'); return null;
        }

        let color = '-';
        if (colorCircles.length > 0) {
            const activeColor = document.querySelector('.color-circle.active, .color-item.active, .color-circle.active-color');
            if (!activeColor) { alert('Tunggu dulu! Silakan pilih warna.'); return null; }
            color = activeColor.getAttribute('data-color') || 'Terpilih';
        }

        let size = '-';
        if (sizeBoxes.length > 0) {
            const activeSize = document.querySelector('.size-box.active, .size-item.active, .size-box.active-size');
            if (!activeSize) { alert('Tunggu dulu! Silakan pilih ukuran.'); return null; }
            size = activeSize.innerText;
        }

        const price = parseInt(priceEl.innerText.replace(/[^0-9]/g, '')); 
        let oldPrice = price; 
        if (oldPriceEl) {
            oldPrice = parseInt(oldPriceEl.innerText.replace(/[^0-9]/g, ''));
        }

        return {
            id: Date.now(),
            title: titleEl.innerText,
            price: price,
            oldPrice: oldPrice,
            imageSrc: mainImage.src,
            qty: qtyInput ? parseInt(qtyInput.value) : 1,
            color: color,
            size: size,
            selected: true // PENTING: Otomatis siap dibayar
        };
    }

    // --- 5. LOGIKA TOMBOL "+ KERANJANG" ---
    const btnAddToCart = document.querySelector('.btn-cart, .btn-p-cart');
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', (e) => {
            e.preventDefault();
            const dataBarang = dapatkanDataProduk();
            if (dataBarang) {
                let cart = JSON.parse(localStorage.getItem('elvra_cart')) || [];
                cart.push(dataBarang);
                localStorage.setItem('elvra_cart', JSON.stringify(cart));
                alert(`Sip! ${dataBarang.title} berhasil masuk keranjang.`);
            }
        });
    }

    // --- 6. LOGIKA TOMBOL "BELI SEKARANG" (CHECKOUT LANGSUNG) ---
    const btnBuyNow = document.querySelector('.btn-checkout, .btn-p-buy');
    if (btnBuyNow) {
        btnBuyNow.addEventListener('click', (e) => {
            e.preventDefault();
            const dataBarang = dapatkanDataProduk();
            
            if (dataBarang) {
                let cart = JSON.parse(localStorage.getItem('elvra_cart')) || [];
                
                // Matikan centang barang lain agar tidak ikut terbayar
                cart.forEach(item => item.selected = false);
                
                // Simpan barang ini ke memori utama yang sama
                cart.push(dataBarang);
                localStorage.setItem('elvra_cart', JSON.stringify(cart));
                
                // Terbang ke halaman pembayaran
                window.location.href = 'payments.html';
            }
        });
    }

});