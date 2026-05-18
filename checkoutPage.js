// KODE JAVASCRIPT MANDIRI - TIDAK BUTUH SCRIPT.JS UNTUK HALAMAN INI
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.getElementById('display-produk');
            const subEl = document.getElementById('txt-sub');
            const totEl = document.getElementById('txt-total');

            // 1. Ambil data (Cek Keranjang atau Beli Langsung)
            let items = JSON.parse(localStorage.getItem('cartItems')) || [];
            let direct = JSON.parse(localStorage.getItem('pendingOrder'));
            
            if (items.length === 0 && direct) {
                items.push(direct);
            }

            // 2. Jika Benar-benar Kosong
            if (items.length === 0) {
                container.innerHTML = '<p style="color:red; font-size:13px;">Belum ada produk dipilih.</p>';
                return;
            }

            // 3. Render & Hitung
            container.innerHTML = '';
            let subtotal = 0;

            items.forEach(item => {
                let p = Number(item.price) || 150000;
                let q = Number(item.qty) || 1;
                subtotal += (p * q);

                container.innerHTML += `
                    <div class="order-item">
                        <img src="${item.image}">
                        <div>
                            <h4 style="font-size:13px;">${item.name}</h4>
                            <p style="font-size:11px; color:#666;">${item.color} | Size ${item.size}</p>
                            <p style="font-size:13px; font-weight:700;">${q} x Rp${p.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                `;
            });
            
            // 4. Update Tampilan Harga
            subEl.innerText = 'Rp' + subtotal.toLocaleString('id-ID');
            totEl.innerText = 'Rp' + (subtotal + 15000).toLocaleString('id-ID');

            // 5. Tombol Bayar
            document.getElementById('btn-konfirmasi').addEventListener('click', function() {
                alert('Pesanan Dibuat!');
                localStorage.clear();
                window.location.href = 'homePage.html';
            });
        });