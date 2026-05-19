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
        "Hitam": "images/Kaos Hitam.jpg",
        "Biru": "images/Kaos Biru.jpeg",
        "Merah": "images/Kaos Merah.jpg",
        "Putih": "images/Kaos Putih.jpg"
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

const btnCheckoutSubmit = document.querySelector('.btn-checkout');

// Aksi saat tombol "CheckOut" diklik
if (btnCheckoutSubmit) {
    btnCheckoutSubmit.addEventListener('click', (e) => {
        e.preventDefault(); // Mencegah halaman ke-refresh
        
        // Ambil data produk yang sedang aktif/dipilih saat ini
        const newItem = getSelectedData();

        /* Gunakan nama key yang berbeda (misal: 'checkoutItem') 
           agar halaman checkout tahu bahwa ini adalah barang "Beli Langsung", 
           bukan dari seluruh daftar keranjang belanjaan.
        */
        
        // 1. Karena beli langsung, kita buat array baru berisi 1 barang ini saja
        let checkoutData = [newItem];
        
        // 2. Simpan ke dalam memori browser khusus untuk sesi checkout
        localStorage.setItem('checkoutItem', JSON.stringify(checkoutData));

        // 3. LANGSUNG PINDAH KE HALAMAN CHECKOUT.HTML
        window.location.href = 'payments.html'; 
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

const btnAddToCart = document.querySelector('.btn-cart');

if(btnAddToCart) {
    btnAddToCart.addEventListener('click', () => {
        // 1. Ambil data produk yang sedang dilihat
        const title = document.querySelector('.product-details h1').innerText;
        const priceText = document.querySelector('.price').innerText;
        const price = parseInt(priceText.replace(/[^0-9]/g, '')); // Ubah "Rp150.000" jadi angka 150000
        const imageSrc = document.getElementById('main-image').src;
        const qty = parseInt(document.getElementById('qty-input').value) || 1;
        const color = document.querySelector('.color-circle.active').getAttribute('data-color');
        const size = document.querySelector('.size-box.active').innerText;

        // 2. Buat format data untuk disimpan
        const productData = {
            id: Date.now(), // id unik
            title: title,
            price: price,
            imageSrc: imageSrc,
            qty: qty,
            color: color,
            size: size
        };

        // 3. Simpan ke database sementara di browser (LocalStorage)
        let cart = JSON.parse(localStorage.getItem('elvra_cart')) || [];
        cart.push(productData);
        localStorage.setItem('elvra_cart', JSON.stringify(cart));

        // 4. Kasih notifikasi tanpa pindah halaman
        alert('Produk berhasil ditambahkan ke keranjang!');
    });
}
