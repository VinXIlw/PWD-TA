document.addEventListener('DOMContentLoaded', () => {
    const productsListContainer = document.getElementById('checkout-products-list');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryGrandTotal = document.getElementById('summary-grand-total');
    const shippingSelect = document.getElementById('shipping-select');
    const btnBuatPesanan = document.getElementById('btn-buat-pesanan');

    // 1. Ambil data keranjang & Filter HANYA yang tercentang
    let cart = JSON.parse(localStorage.getItem('elvra_cart')) || [];
    let checkoutItems = cart.filter(item => item.selected);

    // Kalau kosong/belum pilih, tendang balik ke cart
    if (checkoutItems.length === 0) {
        alert('Tidak ada produk yang dipilih untuk di-checkout!');
        window.location.href = 'cart.html';
        return;
    }

    let subtotalProduk = 0;

    // 2. Gambar produk di layar
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

    // 3. Kalkulasi Otomatis pas Kurir diganti
    function hitungTotalAkhir() {
        let biayaOngkir = parseInt(shippingSelect.value);
        let grandTotal = subtotalProduk + biayaOngkir;

        summaryShipping.innerText = 'Rp ' + biayaOngkir.toLocaleString('id-ID');
        summaryGrandTotal.innerText = 'Rp ' + grandTotal.toLocaleString('id-ID');
    }
    shippingSelect.addEventListener('change', hitungTotalAkhir);

    // 4. Proses Tombol "Buat Pesanan Sekarang"
    btnBuatPesanan.addEventListener('click', () => {
        // AMBIL DATA FORM ALAMAT
        const namaPenerima = document.getElementById('input-nama').value.trim();
        const noTelp = document.getElementById('input-telepon').value.trim();
        const alamatLengkap = document.getElementById('input-alamat').value.trim();

        // VALIDASI: Cek apakah ada yang masih kosong?
        if (namaPenerima === '' || noTelp === '' || alamatLengkap === '') {
            alert('Tunggu dulu! Tolong isi Nama, Nomor Telepon, dan Alamat Pengiriman dengan lengkap.');
            return; // Berhentikan proses
        }

        // Kalau aman, ambil metode pembayaran
        const metodeTerpilih = document.querySelector('input[name="payment-method"]:checked').value;
        
        // Tampilkan Notifikasi Sukses
        alert(`Yeay! Pesanan Berhasil Dibuat.\n\nAtas Nama: ${namaPenerima}\nMetode: ${metodeTerpilih}\n\nTerima kasih telah berbelanja di Elvra!`);

        // Hapus barang yang dibeli dari keranjang, sisakan yang tidak dicentang
        let sisaKeranjang = cart.filter(item => !item.selected);
        localStorage.setItem('elvra_cart', JSON.stringify(sisaKeranjang));

        // Pindah ke Homepage
        window.location.href = 'homePage.html';
    });

    renderCheckoutItems();
});