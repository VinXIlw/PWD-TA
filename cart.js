document.addEventListener('DOMContentLoaded', () => {
    const cartList = document.getElementById('cart-list');
    const grandTotal = document.getElementById('grand-total');
    
    // Ambil data keranjang dari browser
    let cart = JSON.parse(localStorage.getItem('elvra_cart')) || [];

    // Fungsi menggambar produk ke dalam HTML
    function renderCart() {
        if (cart.length === 0) {
            cartList.innerHTML = '<p style="text-align: center; color: #888; font-size: 18px; margin: 40px 0;">Keranjangmu masih kosong. Yuk belanja!</p>';
            grandTotal.innerText = 'Rp 0';
            return;
        }

        let html = '';
        let total = 0;

        cart.forEach((item, index) => {
            // Jika status selected belum ada, buat otomatis jadi true
            if (item.selected === undefined) {
                item.selected = true;
            }

            let subtotal = item.price * item.qty;
            let oldPrice = (item.price + 50000) * item.qty; 

            // HANYA hitung ke total keseluruhan jika produk sedang dipilih
            if (item.selected) {
                total += subtotal;
            }

            html += `
            <div class="cart-item-card">
                <div class="item-selector ${item.selected ? 'selected' : ''}" onclick="togglePilih(${index})"></div>
                
                <img src="${item.imageSrc}" class="item-img" alt="Product">
                
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p>Kualitas &nbsp;: Premium<br>Warna &nbsp;&nbsp;&nbsp;&nbsp;: ${item.color}<br>Ukuran &nbsp;&nbsp;&nbsp;: ${item.size}</p>
                </div>
                
                <div class="item-price-col">
                    <div class="qty-control-box">
                        <button onclick="updateQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQty(${index}, 1)">+</button>
                    </div>
                    <div class="price-current">Rp ${subtotal.toLocaleString('id-ID')}</div>
                    <div class="price-old">Rp ${oldPrice.toLocaleString('id-ID')}</div>
                </div>

                <button class="btn-delete" onclick="hapusProduk(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            `;
        });

        cartList.innerHTML = html;
        grandTotal.innerText = 'Rp ' + total.toLocaleString('id-ID');
    }

    // Fungsi Mengubah status pilih/tidak produk
    window.togglePilih = function(index) {
        cart[index].selected = !cart[index].selected; 
        localStorage.setItem('elvra_cart', JSON.stringify(cart)); 
        renderCart(); 
    }

    // Fungsi Tambah / Kurang Qty
    window.updateQty = function(index, change) {
        let currentQty = cart[index].qty;
        let newQty = currentQty + change;
        
        if (newQty >= 1) {
            cart[index].qty = newQty;
            localStorage.setItem('elvra_cart', JSON.stringify(cart));
            renderCart(); 
        }
    }

    // Fungsi Hapus Produk
    window.hapusProduk = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('elvra_cart', JSON.stringify(cart));
        renderCart();
    }

    // Tampilkan data keranjang pertama kali
    renderCart();
    
    // FIX: Memasukkan '.btn-neu-checkout' ke dalam pencarian JS!
    const btnSelesaikan = document.querySelector('.btn-neu-checkout, .btn-selesaikan, .btn-checkout, #btn-lanjut-checkout');
    
    if (btnSelesaikan) {
        btnSelesaikan.addEventListener('click', () => {
            // Ambil data paling baru dari browser agar akurat
            let cartTerbaru = JSON.parse(localStorage.getItem('elvra_cart')) || [];
            
            // Cek apakah ada produk yang dicentang
            let sedangDipilih = cartTerbaru.some(item => item.selected === true || item.selected === undefined);
            
            if (sedangDipilih) {
                window.location.href = 'payments.html'; // Pindah ke halaman pembayaran
            } else {
                alert('Silakan pilih minimal 1 produk di keranjang terlebih dahulu!');
            }
        });
    } else {
        console.log("Tombol checkout tidak ditemukan di HTML!");
    }

});