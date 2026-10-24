/* =========================================================================
   NAC PERFUME — PRODUCTS LISTING LOGIC
   ========================================================================= */

const ShopState = { category: [], min: null, max: null, rating: 0, flash: false, isNew: false, best: false, sort: 'default', page: 1, perPage: 8, query: '' };

function pcHTML(p) {
  const wished = NACWishlist.has(p.id);
  const badges = [];
  if (p.isFlashSale) badges.push('<span class="tag tag-gold">Flash Sale</span>');
  else if (p.isNew) badges.push('<span class="tag tag-dark">New</span>');
  else if (p.isBestSeller) badges.push('<span class="tag tag-outline">Best Seller</span>');
  const priceHTML = p.oldPrice ? `<strong>${NAC_DATA.formatIDR(p.price)}</strong><del>${NAC_DATA.formatIDR(p.oldPrice)}</del>` : `<strong>${NAC_DATA.formatIDR(p.price)}</strong>`;
  return `
  <div class="product-card">
    <div class="product-media">
      <div class="product-badges">${badges.join('')}</div>
      <button class="wishlist-btn ${wished ? 'active' : ''}" data-id="${p.id}" aria-label="Wishlist"><i class="fa-${wished ? 'solid' : 'regular'} fa-heart"></i></button>
      <a href="product-detail.html?id=${p.id}">${bottleSVG(p.color, p.cap, p.shape)}</a>
      <div class="spot"></div>
    </div>
    <div class="product-info">
      <span class="product-cat">${p.category}</span>
      <h3><a href="product-detail.html?id=${p.id}">${p.name}</a></h3>
      <div class="rating-line"><span class="stars">${NACUI.renderStars(p.rating)}</span> (${p.reviewCount})</div>
      <p class="product-desc">${p.shortDesc}</p>
      <div class="product-price">${priceHTML}</div>
    </div>
    <div class="product-actions">
      <a href="product-detail.html?id=${p.id}" class="btn btn-outline">Detail</a>
      <button class="icon-only quick-add-btn" data-id="${p.id}" title="Tambah Keranjang" aria-label="Tambah ke keranjang"><i class="fa-solid fa-bag-shopping"></i></button>
    </div>
  </div>`;
}

function applyFiltersToProducts() {
  let list = [...NAC_DATA.products];
  if (ShopState.query) {
    const q = ShopState.query.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q));
  }
  if (ShopState.category.length) list = list.filter(p => ShopState.category.includes(p.category));
  if (ShopState.min != null) list = list.filter(p => p.price >= ShopState.min);
  if (ShopState.max != null) list = list.filter(p => p.price <= ShopState.max);
  if (ShopState.rating) list = list.filter(p => p.rating >= ShopState.rating);
  if (ShopState.flash) list = list.filter(p => p.isFlashSale);
  if (ShopState.isNew) list = list.filter(p => p.isNew);
  if (ShopState.best) list = list.filter(p => p.isBestSeller);

  switch (ShopState.sort) {
    case 'price-asc': list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'rating': list.sort((a, b) => b.rating - a.rating); break;
    case 'newest': list.sort((a, b) => (b.isNew === a.isNew) ? 0 : b.isNew ? 1 : -1); break;
  }
  return list;
}

function renderProducts() {
  const filtered = applyFiltersToProducts();
  const grid = document.getElementById('productGrid');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('resultCount');
  const pagWrap = document.getElementById('pagination');

  count.textContent = `Menampilkan ${filtered.length} produk`;

  if (!filtered.length) {
    grid.innerHTML = ''; empty.classList.remove('hidden'); pagWrap.innerHTML = '';
    return;
  }
  empty.classList.add('hidden');

  const totalPages = Math.ceil(filtered.length / ShopState.perPage);
  if (ShopState.page > totalPages) ShopState.page = 1;
  const start = (ShopState.page - 1) * ShopState.perPage;
  const pageItems = filtered.slice(start, start + ShopState.perPage);
  grid.innerHTML = pageItems.map(pcHTML).join('');

  if (totalPages <= 1) { pagWrap.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === ShopState.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  pagWrap.innerHTML = html;
  pagWrap.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    ShopState.page = Number(b.dataset.page);
    renderProducts();
    document.querySelector('.shop-toolbar').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

function renderActiveChips() {
  const wrap = document.getElementById('activeFilters');
  const chips = [];
  ShopState.category.forEach(c => chips.push({ label: c, type: 'category', value: c }));
  if (ShopState.min != null || ShopState.max != null) chips.push({ label: `${ShopState.min ? NAC_DATA.formatIDR(ShopState.min) : '0'} - ${ShopState.max ? NAC_DATA.formatIDR(ShopState.max) : '∞'}`, type: 'price' });
  if (ShopState.rating) chips.push({ label: `Rating ${ShopState.rating}+`, type: 'rating' });
  if (ShopState.flash) chips.push({ label: 'Flash Sale', type: 'flash' });
  if (ShopState.isNew) chips.push({ label: 'Terbaru', type: 'new' });
  if (ShopState.best) chips.push({ label: 'Terlaris', type: 'best' });

  wrap.innerHTML = chips.map(c => `<span class="chip" data-type="${c.type}" data-value="${c.value || ''}">${c.label} <button><i class="fa-solid fa-xmark"></i></button></span>`).join('');
  wrap.querySelectorAll('.chip button').forEach(btn => btn.addEventListener('click', () => {
    const chip = btn.closest('.chip');
    const type = chip.dataset.type, value = chip.dataset.value;
    if (type === 'category') {
      ShopState.category = ShopState.category.filter(c => c !== value);
      document.querySelector(`.f-category[value="${value}"]`).checked = false;
    } else if (type === 'price') { ShopState.min = null; ShopState.max = null; document.getElementById('priceMin').value = ''; document.getElementById('priceMax').value = ''; }
    else if (type === 'rating') { ShopState.rating = 0; document.querySelector('input[name="f-rating"][value="0"]').checked = true; }
    else if (type === 'flash') { ShopState.flash = false; document.getElementById('f-flash').checked = false; }
    else if (type === 'new') { ShopState.isNew = false; document.getElementById('f-new').checked = false; }
    else if (type === 'best') { ShopState.best = false; document.getElementById('f-best').checked = false; }
    ShopState.page = 1;
    renderActiveChips(); renderProducts();
  }));
}

function readFiltersFromDOM() {
  ShopState.category = Array.from(document.querySelectorAll('.f-category:checked')).map(c => c.value);
  const min = document.getElementById('priceMin').value, max = document.getElementById('priceMax').value;
  ShopState.min = min ? Number(min) : null;
  ShopState.max = max ? Number(max) : null;
  ShopState.rating = Number(document.querySelector('input[name="f-rating"]:checked').value);
  ShopState.flash = document.getElementById('f-flash').checked;
  ShopState.isNew = document.getElementById('f-new').checked;
  ShopState.best = document.getElementById('f-best').checked;
  ShopState.page = 1;
}

function updateCategoryCounts() {
  ['men', 'women', 'unisex'].forEach(cat => {
    const n = NAC_DATA.products.filter(p => p.category === cat).length;
    document.querySelector(`[data-cat-count="${cat}"]`).textContent = `(${n})`;
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await window.NAC_PRODUCTS_READY;
  updateCategoryCounts();

  const params = new URLSearchParams(location.search);
  if (params.get('category')) {
    ShopState.category = [params.get('category')];
    const cb = document.querySelector(`.f-category[value="${params.get('category')}"]`);
    if (cb) cb.checked = true;
  }
  if (params.get('sale') === 'flash') { ShopState.flash = true; document.getElementById('f-flash').checked = true; }
  if (params.get('q')) { ShopState.query = params.get('q'); }

  document.getElementById('applyFilters').addEventListener('click', () => {
    readFiltersFromDOM(); renderActiveChips(); renderProducts();
    document.getElementById('filterPanel').classList.remove('open');
  });
  document.getElementById('resetFilters').addEventListener('click', () => {
    document.querySelectorAll('.f-category').forEach(c => c.checked = false);
    document.getElementById('priceMin').value = ''; document.getElementById('priceMax').value = '';
    document.querySelector('input[name="f-rating"][value="0"]').checked = true;
    document.getElementById('f-flash').checked = false; document.getElementById('f-new').checked = false; document.getElementById('f-best').checked = false;
    Object.assign(ShopState, { category: [], min: null, max: null, rating: 0, flash: false, isNew: false, best: false, page: 1, query: '' });
    renderActiveChips(); renderProducts();
  });
  document.getElementById('sortBy').addEventListener('change', (e) => { ShopState.sort = e.target.value; ShopState.page = 1; renderProducts(); });
  document.getElementById('mobileFilterToggle').addEventListener('click', () => document.getElementById('filterPanel').classList.toggle('open'));

  renderActiveChips();
  renderProducts();
});