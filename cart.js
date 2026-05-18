// ==========================================================
// LOGIKA HALAMAN KERANJANG (Hanya jalan di cart.html)
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    const cartList = document.getElementById('cart-list');
    const grandTotalEl = document.getElementById('grand-total');
    
    // Pastikan kode ini hanya jalan di halaman cart.html
    if (cartList) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        function renderCart() {
            if (cartItems.length === 0) {
                cartList.innerHTML = '<h3 style="text-align: center; color: #888; margin-top: 50px;">Keranjang belanja Anda kosong.</h3>';
                grandTotalEl.innerText = 'Rp0';
                return;
            }

            cartList.innerHTML = ''; 
            
            cartItems.forEach((item, index) => {
                const p = Number(item.price) || 150000;
                
                cartList.innerHTML += `
                    <div class="product-card selected" data-index="${index}" data-price="${p}">
                        <img src="${item.image || 'Kaos Hitam.jpg'}" alt="Produk" class="product-image" onerror="this.src='Kaos Hitam.jpg'">
                        
                        <div class="product-info">
                            <h3>${item.name || 'Kaos Polos Premium'}</h3>
                            <p>
                                Kualitas : Premium<br>
                                Warna &nbsp;&nbsp;&nbsp;: ${item.color || 'Hitam'}<br>
                                Ukuran &nbsp;&nbsp;: ${item.size || 'M'}
                            </p>
                        </div>
                        
                        <div class="product-price">
                            <div class="current-price">Rp${p.toLocaleString('id-ID')}</div>
                            <div class="old-price">Rp400.000</div>
                        </div>
                        
                        <div class="selector-circle"></div>
                    </div>
                `;
            });

            calculateTotal();
            attachClickEvents();
        }

        function calculateTotal() {
            let total = 0;
            const cards = document.querySelectorAll('.product-card.selected');
            
            cards.forEach(card => {
                total += Number(card.getAttribute('data-price'));
            });
            
            if (grandTotalEl) grandTotalEl.innerText = 'Rp' + total.toLocaleString('id-ID');
        }

        function attachClickEvents() {
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('selected');
                    calculateTotal();
                });
            });
        }

        const btnLanjut = document.getElementById('btn-lanjut-checkout');
        if (btnLanjut) {
            btnLanjut.addEventListener('click', () => {
                const selectedCards = document.querySelectorAll('.product-card.selected');
                
                if(selectedCards.length === 0) {
                    alert('Pilih minimal satu produk untuk di-checkout!');
                    return;
                }

                let itemsToCheckout = [];
                selectedCards.forEach(card => {
                    let index = card.getAttribute('data-index');
                    itemsToCheckout.push(cartItems[index]);
                });

                // Simpan barang yang dicentang ke pendingOrder agar dibaca oleh checkout.html
                localStorage.setItem('pendingOrder', JSON.stringify(itemsToCheckout));
                window.location.href = 'pageCheckout.html';
            });
        }

        renderCart();
    }
});