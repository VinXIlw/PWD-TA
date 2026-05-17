document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SETUP VARIABEL ---
    const productPrice = 150000; // Harga produk
    const productName = "Kaos Polos Premium";

    const btnPlus = document.getElementById('btn-plus');
    const btnMinus = document.getElementById('btn-minus');
    const qtyInput = document.getElementById('qty-input');
    
    const sizeBoxes = document.querySelectorAll('.size-box');
    const colorCircles = document.querySelectorAll('.color-circle');
    const mainImage = document.getElementById('main-image');

    // Daftar Gambar Berdasarkan Warna
    const imageSources = {
        "Hitam": "Kaos Hitam.jpg",
        "Biru": "Kaos Biru.jpeg",
        "Merah": "Kaos Merah.jpg",
        "Putih": "Kaos Putih.jpg"
    };

    // --- 2. LOGIKA PLUS / MINUS JUMLAH ---
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

    // --- 3. LOGIKA PILIH UKURAN ---
    sizeBoxes.forEach(box => {
        box.addEventListener('click', () => {
            sizeBoxes.forEach(s => s.classList.remove('active'));
            box.classList.add('active');
        });
    });

    // --- 4. LOGIKA PILIH WARNA & GANTI GAMBAR ---
    colorCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            // Ubah garis seleksi
            colorCircles.forEach(c => c.classList.remove('active'));
            circle.classList.add('active');

            // Ganti gambar dengan efek transisi cepat
            const selectedColor = circle.getAttribute('data-color');
            mainImage.style.opacity = 0; 
            
            setTimeout(() => {
                if (imageSources[selectedColor]) {
                    mainImage.src = imageSources[selectedColor];
                }
                mainImage.style.opacity = 1;
            }, 200);
        });
    });

    // ==========================================================
// LOGIKA TAMBAH KE KERANJANG DI HALAMAN PRODUK (product1.html)
// ==========================================================
const btnCartSubmit = document.querySelector('.btn-cart');

// Fungsi untuk mengambil pilihan user (Warna, Ukuran, Jumlah)
function getSelectedData() {
    const qtyInput = document.getElementById('qty-input');
    const activeColor = document.querySelector('.color-circle.active');
    const activeSize = document.querySelector('.size-box.active');
    const mainImage = document.getElementById('main-image');

    return {
        name: "Kaos Polos Premium", // Sesuaikan nama produk
        price: 150000,              // Sesuaikan harga produk
        color: activeColor ? activeColor.getAttribute('data-color') : 'Hitam',
        size: activeSize ? activeSize.innerText : 'M',
        qty: qtyInput ? parseInt(qtyInput.value) : 1,
        image: mainImage ? mainImage.src : 'Kaos Hitam.jpg'
    };
}

// Aksi saat tombol "+ Keranjang" diklik
if (btnCartSubmit) {
    btnCartSubmit.addEventListener('click', (e) => {
        e.preventDefault(); // Mencegah halaman ke-refresh
        
        const newItem = getSelectedData();

        // 1. Ambil data keranjang yang sudah ada di memori
        let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // 2. Masukkan produk baru ini ke dalam daftar keranjang
        cart.push(newItem);
        
        // 3. Simpan ulang daftarnya ke memori browser
        localStorage.setItem('cartItems', JSON.stringify(cart));

        // 4. LANGSUNG PINDAH KE HALAMAN CART.HTML
        window.location.href = 'cart.html';
    });
}

    // --- 6. LOGIKA BUKA/TUTUP SIDEBAR ---
    const closeCartBtn = document.getElementById('close-cart');
    const iconCartHeader = document.getElementById('open-cart-btn');

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if (iconCartHeader) {
        iconCartHeader.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        });
    }

    // --- 7. LOGIKA CHECKOUT (PINDAH HALAMAN) ---
    // Berlaku untuk tombol checkout di halaman utama maupun di dalam sidebar
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-checkout') || e.target.classList.contains('btn-checkout-sidebar')) {
            e.preventDefault();
            
            // Simpan data pilihan user ke LocalStorage agar halaman Checkout tahu apa yang dibeli
            const checkoutData = getSelectedData();
            localStorage.setItem('pendingOrder', JSON.stringify(checkoutData));
            
            // Arahkan ke file checkout
            window.location.href = 'checkout.html';
        }
    });

});

