document.addEventListener('DOMContentLoaded', () => {
    const productsListContainer = document.getElementById('checkout-products-list');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryGrandTotal = document.getElementById('summary-grand-total');
    const shippingSelect = document.getElementById('shipping-select');
    const btnBuatPesanan = document.getElementById('btn-buat-pesanan');

    // 1. Ambil database keranjang
    let cart = JSON.parse(localStorage.getItem('elvra_cart')) || [];

    // 2. Filter: HANYA ambil produk yang dicentang (selected === true)
    let checkoutItems = cart.filter(item => item.selected);

    // Keamanan: Jika iseng akses checkout.html padahal belum milih barang, balikin ke cart
    if (checkoutItems.length === 0) {
        alert('Tidak ada produk pilihan untuk di-checkout!');
        window.location.href = 'cart.html';
        return;
    }

    let subtotalProduk = 0;

    // 3. Fungsi Menampilkan Ringkasan Produk Pesanan
    function renderCheckoutItems() {
        let html = '';
        subtotalProduk = 0;

        checkoutItems.forEach(item => {
            let itemSubtotal = item.price * item.qty;
            subtotalProduk += itemSubtotal;

            html += `
            <div class="checkout-item-row">
                <img src="${item.imageSrc}" class="checkout-item-img" alt="Product">
                <div class="checkout-item-info">
                    <h4>${item.title}</h4>
                    <p>Warna: ${item.color} | Ukuran: ${item.size} | Qty: ${item.qty} pcs</p>
                </div>
                <div class="checkout-item-price">
                    Rp ${itemSubtotal.toLocaleString('id-ID')}
                </div>
            </div>
            `;
        });

        productsListContainer.innerHTML = html;
        summarySubtotal.innerText = 'Rp ' + subtotalProduk.toLocaleString('id-ID');
        hitungTotalAkhir();
    }

    // 4. Fungsi Mengalkulasi Total Akhir (Subtotal + Ongkir Kurir)
    function hitungTotalAkhir() {
        let biayaOngkir = parseInt(shippingSelect.value);
        let grandTotal = subtotalProduk + biayaOngkir;

        summaryShipping.innerText = 'Rp ' + biayaOngkir.toLocaleString('id-ID');
        summaryGrandTotal.innerText = 'Rp ' + grandTotal.toLocaleString('id-ID');
    }

    // Event saat pilihan kurir diubah-ubah oleh pembeli
    shippingSelect.addEventListener('change', hitungTotalAkhir);

    // 5. Trigger Tombol "Buat Pesanan Sekarang" (Aksi Final)
    btnBuatPesanan.addEventListener('click', () => {
        const metodeTerpilih = document.querySelector('input[name="payment-method"]:checked').value.toUpperCase();
        
        alert(`Pesanan Berhasil Dibuat!\nMetode Pembayaran: ${metodeTerpilih}\nTerima kasih telah berbelanja di Elvra.`);

        // SHOPEE LOGIC: Hapus produk yang dibeli ini dari data keranjang utama
        // Sisakan produk yang tadi TIDAK dicentang di dalam keranjang
        let sisaKeranjang = cart.filter(item => !item.selected);
        localStorage.setItem('elvra_cart', JSON.stringify(sisaKeranjang));

        // Bersihkan data dan tendang kembali ke homepage utama
        window.location.href = 'homePage.html';
    });

    // Eksekusi render pesanan
    renderCheckoutItems();
});