const form = document.getElementById('contactForm');

// Dengarkan saat form dikirim (di-submit)
form.addEventListener('submit', function(e) {
  // 1. KUNCI UTAMA: Hentikan browser agar TIDAK refresh/reload halaman
  e.preventDefault(); 

  const nama = document.getElementById('nama').value;
  const email = document.getElementById('email').value;
  const pesan = document.getElementById('pesan').value;

  alert(`Halo ${nama}, pesanmu berhasil diproses!`);
  form.reset();
});