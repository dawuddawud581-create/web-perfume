/* =========================================================================
   NAC PERFUME — SHARED CORE LOGIC (dipakai di semua halaman)
   ========================================================================= */

/* -------------------------------------------------------------------------
   0. STORAGE ADAPTER
   Memakai localStorage (persist antar halaman & kunjungan — perilaku
   normal e-commerce). Jika browser/preview memblokir localStorage, otomatis
   fallback ke memori sementara agar situs tetap berjalan tanpa error.
   ------------------------------------------------------------------------- */
const NACStore = (() => {
  let memory = {};
  let available = true;
  try {
    const t = '__nac_test__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
  } catch (e) { available = false; }

  return {
    get(key, fallback) {
      try {
        const raw = available ? window.localStorage.getItem(key) : memory[key];
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try {
        const raw = JSON.stringify(value);
        if (available) window.localStorage.setItem(key, raw);
        else memory[key] = raw;
      } catch (e) { /* silent */ }
    }
  };
})();

/* -------------------------------------------------------------------------
   1. THEME (DARK MODE)
   ------------------------------------------------------------------------- */
const NACTheme = {
  init() {
    const saved = NACStore.get('nac_theme', 'light');
    document.documentElement.setAttribute('data-theme', saved);
    document.querySelectorAll('.theme-toggle i').forEach(i => {
      i.className = saved === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    NACStore.set('nac_theme', next);
    document.querySelectorAll('.theme-toggle i').forEach(i => {
      i.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
  }
};

/* -------------------------------------------------------------------------
   2. CART STORE
   Item shape: { productId, name, price, volume, qty, color, cap, shape }
   ------------------------------------------------------------------------- */
const NACCart = {
  KEY: 'nac_cart',
  getAll() { return NACStore.get(this.KEY, []); },
  save(items) { NACStore.set(this.KEY, items); NACUI.updateBadges(); },
  add(product, volume, qty = 1) {
    const items = this.getAll();
    const existing = items.find(i => i.productId === product.id && i.volume === volume.ml);
    if (existing) { existing.qty += qty; }
    else {
      items.push({
        productId: product.id, name: product.name, volume: volume.ml, price: volume.price,
        qty, color: product.color, cap: product.cap, shape: product.shape, category: product.category
      });
    }
    this.save(items);
    NACUI.toast(`${product.name} (${volume.ml}ml) ditambahkan ke keranjang`, 'success');
  },
  updateQty(productId, volume, qty) {
    const items = this.getAll();
    const item = items.find(i => i.productId === productId && i.volume === volume);
    if (item) { item.qty = Math.max(1, qty); this.save(items); }
  },
  remove(productId, volume) {
    let items = this.getAll();
    items = items.filter(i => !(i.productId === productId && i.volume === volume));
    this.save(items);
  },
  clear() { this.save([]); },
  count() { return this.getAll().reduce((s, i) => s + i.qty, 0); },
  subtotal() { return this.getAll().reduce((s, i) => s + i.price * i.qty, 0); }
};

/* -------------------------------------------------------------------------
   3. WISHLIST STORE
   ------------------------------------------------------------------------- */
const NACWishlist = {
  KEY: 'nac_wishlist',
  getAll() { return NACStore.get(this.KEY, []); },
  save(ids) { NACStore.set(this.KEY, ids); NACUI.updateBadges(); },
  has(productId) { return this.getAll().includes(productId); },
  toggle(productId) {
    let ids = this.getAll();
    if (ids.includes(productId)) { ids = ids.filter(id => id !== productId); }
    else { ids.push(productId); }
    this.save(ids);
    return ids.includes(productId);
  },
  count() { return this.getAll().length; }
};

/* -------------------------------------------------------------------------
   4. UI HELPERS (badges, toast, loading screen, navbar, drawer, search)
   ------------------------------------------------------------------------- */
const NACUI = {
  init() {
    this.hideLoadingScreen();
    this.bindNavbarScroll();
    this.bindMobileDrawer();
    this.bindSearch();
    this.bindBackToTop();
    this.bindThemeToggle();
    this.bindChatWidget();
    this.bindNewsletter();
    this.updateBadges();
    this.setActiveNav();
    this.setYear();
    if (window.AOS) AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
  },

  hideLoadingScreen() {
    const el = document.getElementById('loading-screen');
    if (!el) return;
    const start = Date.now();
    const minTime = 700;
    const finish = () => {
      const elapsed = Date.now() - start;
      setTimeout(() => el.classList.add('hidden'), Math.max(0, minTime - elapsed));
    };
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish);
  },

  bindNavbarScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  },

  bindMobileDrawer() {
    const toggle = document.querySelector('.nav-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const close = document.querySelector('.mobile-drawer-close');
    if (!toggle || !drawer) return;
    toggle.addEventListener('click', () => drawer.classList.add('open'));
    close?.addEventListener('click', () => drawer.classList.remove('open'));
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));
  },

  bindSearch() {
    const trigger = document.querySelectorAll('.search-trigger');
    const overlay = document.querySelector('.search-overlay');
    const closeBtn = document.querySelector('.search-close');
    const input = document.querySelector('.search-box input');
    const results = document.querySelector('.search-results');
    if (!overlay) return;

    trigger.forEach(t => t.addEventListener('click', () => {
      overlay.classList.add('open');
      setTimeout(() => input?.focus(), 300);
    }));
    closeBtn?.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.classList.remove('open'); });

    input?.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { results.innerHTML = ''; return; }
      const matches = NAC_DATA.products.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.includes(q) || p.shortDesc.toLowerCase().includes(q)
      ).slice(0, 6);
      if (!matches.length) {
        results.innerHTML = `<p class="search-empty">Tidak ada produk yang cocok dengan "${input.value}"</p>`;
        return;
      }
      results.innerHTML = matches.map(p => `
        <a href="product-detail.html?id=${p.id}" class="search-result-item">
          <span class="thumb">${bottleSVG(p.color, p.cap, p.shape)}</span>
          <div><h4>${p.name}</h4><span>${NAC_DATA.formatIDR(p.price)}</span></div>
        </a>`).join('');
    });
  },

  bindBackToTop() {
    const btn = document.querySelector('.float-btn.top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) btn.classList.add('show'); else btn.classList.remove('show');
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  },

  bindThemeToggle() {
    document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', () => NACTheme.toggle()));
  },

  bindChatWidget() {
    const trigger = document.querySelector('.float-btn.chat');
    const panel = document.querySelector('.chat-panel');
    const closeBtn = document.querySelector('.chat-head button');
    const form = document.querySelector('.chat-foot');
    const body = document.querySelector('.chat-body');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', () => panel.classList.toggle('open'));
    closeBtn?.addEventListener('click', () => panel.classList.remove('open'));
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const msg = input.value.trim();
      if (!msg) return;
      body.insertAdjacentHTML('beforeend', `<div class="chat-msg user">${this.escapeHTML(msg)}</div>`);
      input.value = '';
      body.scrollTop = body.scrollHeight;
      setTimeout(() => {
        const reply = this.mockChatReply(msg);
        body.insertAdjacentHTML('beforeend', `<div class="chat-msg bot">${reply}</div>`);
        body.scrollTop = body.scrollHeight;
      }, 700);
    });
  },

  mockChatReply(msg) {
    const m = msg.toLowerCase();
    if (m.includes('harga') || m.includes('promo') || m.includes('diskon')) return 'Untuk info promo terbaru, cek halaman Produk — flash sale kami perbarui tiap minggu ✨';
    if (m.includes('kirim') || m.includes('ongkir') || m.includes('sampai')) return 'Estimasi pengiriman 1-4 hari tergantung kurir & kota tujuan. Bisa dicek juga di halaman Keranjang.';
    if (m.includes('retur') || m.includes('tukar')) return 'Produk bisa ditukar dalam 7 hari selama segel belum dibuka. Hubungi kami via WhatsApp untuk proses lebih lanjut.';
    return 'Terima kasih sudah menghubungi NAC Perfume 🌟 Tim kami akan segera membalas. Untuk respon lebih cepat, silakan chat via WhatsApp ya.';
  },

  bindNewsletter() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        if (!input.value.trim()) return;
        this.toast('Terima kasih! Email kamu terdaftar untuk update terbaru NAC.', 'success');
        input.value = '';
      });
    });
  },

  updateBadges() {
    document.querySelectorAll('.cart-badge').forEach(b => { b.textContent = NACCart.count(); b.style.display = NACCart.count() ? 'flex' : 'none'; });
    document.querySelectorAll('.wishlist-badge').forEach(b => { b.textContent = NACWishlist.count(); b.style.display = NACWishlist.count() ? 'flex' : 'none'; });
  },

  setActiveNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-drawer nav a').forEach(a => {
      if (a.getAttribute('href') === page) a.classList.add('active');
    });
  },

  setYear() {
    document.querySelectorAll('.current-year').forEach(el => el.textContent = new Date().getFullYear());
  },

  toast(message, type = 'success') {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${this.escapeHTML(message)}</span>`;
    stack.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; setTimeout(() => el.remove(), 300); }, 3200);
  },

  escapeHTML(str) {
    const div = document.createElement('div'); div.textContent = str; return div.innerHTML;
  },

  renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) html += '<i class="fa-solid fa-star"></i>';
      else if (rating >= i - 0.5) html += '<i class="fa-solid fa-star-half-stroke"></i>';
      else html += '<i class="fa-regular fa-star far"></i>';
    }
    return html;
  }
};

/* -------------------------------------------------------------------------
   5. WISHLIST BUTTON BINDING (event delegation — bekerja untuk kartu yang
   dirender dinamis di halaman manapun)
   ------------------------------------------------------------------------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.wishlist-btn');
  if (!btn) return;
  e.preventDefault();
  const id = Number(btn.dataset.id);
  const active = NACWishlist.toggle(id);
  document.querySelectorAll(`.wishlist-btn[data-id="${id}"]`).forEach(b => {
    b.classList.toggle('active', active);
    b.innerHTML = active ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
  });
  NACUI.toast(active ? 'Ditambahkan ke wishlist' : 'Dihapus dari wishlist', 'success');
});

/* Quick add-to-cart from product cards (default volume = first option) */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.quick-add-btn');
  if (!btn) return;
  e.preventDefault();
  const product = NAC_DATA.getProduct(btn.dataset.id);
  if (!product) return;
  NACCart.add(product, product.volumes[product.volumes.length - 1], 1);
});

document.addEventListener('DOMContentLoaded', () => {
  NACTheme.init();
  NACUI.init();
});