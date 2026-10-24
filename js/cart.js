/* =========================================================================
   NAC PERFUME — CART LOGIC
   ========================================================================= */

const SHIPPING_RATES = { Pekanbaru: 15000, bandung: 18000, yogyakarta: 22000, surabaya: 25000, denpasar: 30000, medan: 35000, lainnya: 40000 };
const VOUCHERS = { NAC10: { type: 'percent', value: 10 }, NACWELCOME: { type: 'percent', value: 15, max: 300000 }, FREESHIP: { type: 'freeship' } };

function cartRowHTML(item) {
  const product = NAC_DATA.getProduct(item.productId);
  return `
  <div class="cart-item" data-key="${item.productId}-${item.volume}">
    <div class="cart-item-media">${bottleSVG(item.color, item.cap, item.shape)}</div>
    <div class="cart-item-info">
      <h4><a href="product-detail.html?id=${item.productId}">${item.name}</a></h4>
      <span>${item.volume}ml · ${product ? product.category : ''}</span>
      <div class="qty-stepper mt-2">
        <button class="cart-qty-minus" aria-label="Kurangi">−</button>
        <span>${item.qty}</span>
        <button class="cart-qty-plus" aria-label="Tambah">+</button>
      </div>
      <button class="cart-remove"><i class="fa-solid fa-trash-can"></i> Hapus</button>
    </div>
    <div></div>
    <div class="cart-item-price">${NAC_DATA.formatIDR(item.price * item.qty)}</div>
  </div>`;
}

function renderCart() {
  const items = NACCart.getAll();
  const wrap = document.getElementById('cartContent');

  if (!items.length) {
    wrap.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-bag-shopping"></i>
        <h2>Keranjang Anda Masih Kosong</h2>
        <p class="mt-4" style="max-width:400px; margin-left:auto; margin-right:auto;">Belum ada parfum pilihan di sini. Jelajahi koleksi kami dan temukan signature scent Anda.</p>
        <a href="products.html" class="btn btn-gold mt-8">Mulai Belanja</a>
      </div>`;
    return;
  }

  const subtotal = NACCart.subtotal();
  const voucherCode = NACStore.get('nac_voucher', '');
  const city = NACStore.get('nac_shipping_city', '');
  let discount = 0, shipping = city ? SHIPPING_RATES[city] : 0;

  if (voucherCode && VOUCHERS[voucherCode]) {
    const v = VOUCHERS[voucherCode];
    if (v.type === 'percent') discount = Math.min(subtotal * (v.value / 100), v.max || Infinity);
    if (v.type === 'freeship') shipping = 0;
  }
  const total = Math.max(0, subtotal - discount + shipping);

  wrap.innerHTML = `
    <div class="cart-layout">
      <div>
        <div id="cartItemsList">${items.map(cartRowHTML).join('')}</div>
        <a href="products.html" class="btn-ghost mt-6"><i class="fa-solid fa-arrow-left" style="margin-right:6px;"></i>Lanjut Belanja</a>
      </div>
      <div class="summary-box">
        <h3 style="margin-bottom:var(--sp-5);">Ringkasan Belanja</h3>

        <label class="field-hint" style="text-transform:uppercase; letter-spacing:.08em; font-size:var(--fs-xs); display:block;">Kode Voucher</label>
        <div class="voucher-row">
          <input type="text" id="voucherInput" placeholder="Contoh: NAC10" value="${voucherCode}">
          <button id="applyVoucher">Pakai</button>
        </div>
        <div class="voucher-msg" id="voucherMsg"></div>

        <label class="field-hint" style="text-transform:uppercase; letter-spacing:.08em; font-size:var(--fs-xs); display:block; margin-top:var(--sp-5);">Estimasi Ongkir</label>
        <div class="select-wrap mt-2">
          <select id="citySelect">
            <option value="">Pilih Kota Tujuan</option>
            <option value="Pekanbaru" ${city === 'Pekanbaru' ? 'selected' : ''}>Pekanbaru — Rp 15.000</option>
            <option value="bandung" ${city === 'bandung' ? 'selected' : ''}>Bandung — Rp 18.000</option>
            <option value="yogyakarta" ${city === 'yogyakarta' ? 'selected' : ''}>Yogyakarta — Rp 22.000</option>
            <option value="surabaya" ${city === 'surabaya' ? 'selected' : ''}>Surabaya — Rp 25.000</option>
            <option value="denpasar" ${city === 'denpasar' ? 'selected' : ''}>Denpasar — Rp 30.000</option>
            <option value="medan" ${city === 'medan' ? 'selected' : ''}>Medan — Rp 35.000</option>
            <option value="lainnya" ${city === 'lainnya' ? 'selected' : ''}>Kota Lainnya — Rp 40.000</option>
          </select>
        </div>

        <div class="mt-6">
          <div class="summary-row"><span>Subtotal</span><strong>${NAC_DATA.formatIDR(subtotal)}</strong></div>
          <div class="summary-row"><span>Diskon Voucher</span><strong style="color:${discount ? '#2E7D4F' : 'inherit'}">${discount ? '−' + NAC_DATA.formatIDR(discount) : NAC_DATA.formatIDR(0)}</strong></div>
          <div class="summary-row"><span>Ongkos Kirim</span><strong>${city ? NAC_DATA.formatIDR(shipping) : 'Pilih kota'}</strong></div>
          <div class="summary-row total"><span>Total</span><strong>${NAC_DATA.formatIDR(total)}</strong></div>
        </div>

        <a href="checkout.html" class="btn btn-gold btn-block mt-6">Checkout Sekarang <i class="fa-solid fa-arrow-right"></i></a>

        <div class="trust-badges">
          <div><i class="fa-solid fa-shield-halved"></i>Pembayaran Aman</div>
          <div><i class="fa-solid fa-truck-fast"></i>Pengiriman Cepat</div>
          <div><i class="fa-solid fa-rotate-left"></i>Retur 7 Hari</div>
        </div>
      </div>
    </div>`;

  bindCartEvents();
}

function bindCartEvents() {
  document.querySelectorAll('.cart-item').forEach(row => {
    const [productId, volume] = row.dataset.key.split('-').map(Number);
    const items = NACCart.getAll();
    const item = items.find(i => i.productId === productId && i.volume === volume);
    row.querySelector('.cart-qty-plus').addEventListener('click', () => { NACCart.updateQty(productId, volume, item.qty + 1); renderCart(); });
    row.querySelector('.cart-qty-minus').addEventListener('click', () => { if (item.qty > 1) { NACCart.updateQty(productId, volume, item.qty - 1); renderCart(); } });
    row.querySelector('.cart-remove').addEventListener('click', () => { NACCart.remove(productId, volume); renderCart(); NACUI.toast('Produk dihapus dari keranjang', 'success'); });
  });

  document.getElementById('applyVoucher').addEventListener('click', () => {
    const code = document.getElementById('voucherInput').value.trim().toUpperCase();
    const msg = document.getElementById('voucherMsg');
    if (!code) return;
    if (VOUCHERS[code]) {
      NACStore.set('nac_voucher', code);
      msg.textContent = `Voucher "${code}" berhasil digunakan!`;
      msg.className = 'voucher-msg show ok';
      renderCart();
    } else {
      NACStore.set('nac_voucher', '');
      msg.textContent = 'Kode voucher tidak valid atau sudah kedaluwarsa.';
      msg.className = 'voucher-msg show err';
    }
  });

  document.getElementById('citySelect').addEventListener('change', (e) => { NACStore.set('nac_shipping_city', e.target.value); renderCart(); });
}

document.addEventListener('DOMContentLoaded', renderCart);