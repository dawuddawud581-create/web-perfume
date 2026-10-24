/* =========================================================================
   NAC PERFUME — PRODUCT DETAIL LOGIC
   ========================================================================= */

let currentProduct = null;
let selectedVolume = null;
let selectedQty = 1;
let selectedRatingInput = 0;

function relatedCardHTML(p) {
  const wished = NACWishlist.has(p.id);
  const priceHTML = p.oldPrice ? `<strong>${NAC_DATA.formatIDR(p.price)}</strong><del>${NAC_DATA.formatIDR(p.oldPrice)}</del>` : `<strong>${NAC_DATA.formatIDR(p.price)}</strong>`;
  return `
  <div class="product-card">
    <div class="product-media">
      <button class="wishlist-btn ${wished ? 'active' : ''}" data-id="${p.id}" aria-label="Wishlist"><i class="fa-${wished ? 'solid' : 'regular'} fa-heart"></i></button>
      <a href="product-detail.html?id=${p.id}">${bottleSVG(p.color, p.cap, p.shape)}</a>
      <div class="spot"></div>
    </div>
    <div class="product-info">
      <span class="product-cat">${p.category}</span>
      <h3><a href="product-detail.html?id=${p.id}">${p.name}</a></h3>
      <div class="rating-line"><span class="stars">${NACUI.renderStars(p.rating)}</span> (${p.reviewCount})</div>
      <div class="product-price">${priceHTML}</div>
    </div>
    <div class="product-actions">
      <a href="product-detail.html?id=${p.id}" class="btn btn-outline">Detail</a>
      <button class="icon-only quick-add-btn" data-id="${p.id}" aria-label="Tambah ke keranjang"><i class="fa-solid fa-bag-shopping"></i></button>
    </div>
  </div>`;
}

function renderGallery(p) {
  const main = document.getElementById('galleryMain');
  const thumbs = document.getElementById('galleryThumbs');
  const angles = [{ shape: p.shape, tint: 1 }, { shape: p.shape, tint: 0.7 }, { shape: p.shape === 'classic' ? 'facet' : 'classic', tint: 1 }];
  main.innerHTML = bottleSVG(p.color, p.cap, p.shape);
  thumbs.innerHTML = angles.map((a, i) => `<div class="pd-thumb ${i === 0 ? 'active' : ''}" data-i="${i}">${bottleSVG(p.color, p.cap, a.shape)}</div>`).join('');
  thumbs.querySelectorAll('.pd-thumb').forEach(t => t.addEventListener('click', () => {
    thumbs.querySelectorAll('.pd-thumb').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    const a = angles[t.dataset.i];
    main.innerHTML = '';
    main.appendChild(document.createRange().createContextualFragment(bottleSVG(p.color, p.cap, a.shape)));
  }));
}

function renderInfo(p) {
  document.getElementById('pdInfo').innerHTML = `
    <span class="product-cat">${p.category}</span>
    <h1>${p.name}</h1>
    <div class="pd-rating">
      <span class="stars" style="font-size:.95rem;">${NACUI.renderStars(p.rating)}</span>
      <span>${p.rating} / 5</span>
      <a href="#reviews" id="jumpToReviews">${p.reviewCount} review</a>
    </div>
    <div class="pd-price" id="pdPrice"></div>
    <p class="pd-desc">${p.shortDesc}</p>

    <span class="pd-option-label">Pilih Volume</span>
    <div class="volume-options" id="volumeOptions">
      ${p.volumes.map((v, i) => `<button class="volume-opt ${i === p.volumes.length - 1 ? 'active' : ''}" data-i="${i}">${v.ml}ml</button>`).join('')}
    </div>

    <span class="pd-option-label">Jumlah</span>
    <div class="qty-stepper">
      <button id="qtyMinus" aria-label="Kurangi">−</button>
      <span id="qtyValue">1</span>
      <button id="qtyPlus" aria-label="Tambah">+</button>
    </div>

    <div class="pd-cta-row">
      <button class="btn btn-outline" id="addToCartBtn"><i class="fa-solid fa-bag-shopping"></i> Tambah Keranjang</button>
      <button class="btn btn-gold" id="buyNowBtn">Beli Sekarang</button>
      <button class="wishlist-btn ${NACWishlist.has(p.id) ? 'active' : ''}" data-id="${p.id}" style="position:static; width:52px; height:52px; border:1px solid var(--border);" aria-label="Wishlist">
        <i class="fa-${NACWishlist.has(p.id) ? 'solid' : 'regular'} fa-heart"></i>
      </button>
    </div>

    <div class="pd-meta-grid">
      <div><i class="fa-solid fa-hourglass-half"></i><strong>${p.longevity} Jam</strong><span>Ketahanan</span></div>
      <div><i class="fa-solid fa-wind"></i><strong>${p.sillage}</strong><span>Sillage</span></div>
      <div><i class="fa-solid fa-shield-heart"></i><strong>Cruelty-Free</strong><span>Formula Etis</span></div>
    </div>
  `;

  selectedVolume = p.volumes[p.volumes.length - 1];
  selectedQty = 1;
  updatePriceDisplay(p);

  document.querySelectorAll('.volume-opt').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.volume-opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedVolume = p.volumes[Number(btn.dataset.i)];
    updatePriceDisplay(p);
  }));
  document.getElementById('qtyMinus').addEventListener('click', () => { selectedQty = Math.max(1, selectedQty - 1); document.getElementById('qtyValue').textContent = selectedQty; });
  document.getElementById('qtyPlus').addEventListener('click', () => { selectedQty += 1; document.getElementById('qtyValue').textContent = selectedQty; });
  document.getElementById('addToCartBtn').addEventListener('click', () => NACCart.add(p, selectedVolume, selectedQty));
  document.getElementById('buyNowBtn').addEventListener('click', () => { NACCart.add(p, selectedVolume, selectedQty); location.href = 'checkout.html'; });
  document.getElementById('jumpToReviews')?.addEventListener('click', (e) => { e.preventDefault(); document.querySelector('[data-tab="reviews"]').click(); document.querySelector('.pd-tabs').scrollIntoView({ behavior: 'smooth' }); });
}

function updatePriceDisplay(p) {
  const el = document.getElementById('pdPrice');
  const oldRatio = p.oldPrice ? p.oldPrice / p.price : null;
  const shownOld = oldRatio ? Math.round(selectedVolume.price * oldRatio) : null;
  el.innerHTML = `<strong>${NAC_DATA.formatIDR(selectedVolume.price)}</strong>` + (shownOld ? `<del>${NAC_DATA.formatIDR(shownOld)}</del>` : '');
}

function renderDescTab(p) {
  document.getElementById('fullDescText').textContent = p.fullDesc;
  document.getElementById('metaGrid').innerHTML = `
    <div><i class="fa-solid fa-flask-vial"></i><strong>Eau de Parfum</strong><span>Konsentrasi</span></div>
    <div><i class="fa-solid fa-droplet"></i><strong>${p.volumes.map(v => v.ml).join(' / ')} ml</strong><span>Volume Tersedia</span></div>
    <div><i class="fa-solid fa-box"></i><strong>${p.stock} Unit</strong><span>Stok Tersedia</span></div>
  `;
}

function renderNotesTab(p) {
  document.getElementById('notesPyramid').innerHTML = `
    <div class="note-tier"><div class="num">1</div><h4>Top Notes</h4><span>Kesan Pertama</span>
      <div class="chips">${p.notes.top.map(n => `<span class="tag">${n}</span>`).join('')}</div></div>
    <div class="note-tier"><div class="num">2</div><h4>Middle Notes</h4><span>Karakter Utama</span>
      <div class="chips">${p.notes.middle.map(n => `<span class="tag">${n}</span>`).join('')}</div></div>
    <div class="note-tier"><div class="num">3</div><h4>Base Notes</h4><span>Kesan Akhir</span>
      <div class="chips">${p.notes.base.map(n => `<span class="tag">${n}</span>`).join('')}</div></div>
  `;
  document.getElementById('lvLabel').textContent = `${p.longevity} jam (${p.sillage})`;
  document.getElementById('lvFill').style.width = Math.min(100, (p.longevity / 10) * 100) + '%';
}

function renderReviewsTab(p) {
  const reviews = NAC_DATA.reviews[p.id] || [];
  const dist = [5, 4, 3, 2, 1].map(star => ({ star, count: reviews.filter(r => r.rating === star).length }));
  const maxCount = Math.max(1, ...dist.map(d => d.count));

  document.getElementById('reviewSummary').innerHTML = `
    <div class="review-score">
      <strong>${p.rating}</strong>
      <div class="stars" style="justify-content:center; font-size:1rem;">${NACUI.renderStars(p.rating)}</div>
      <span style="font-size:var(--fs-xs); color:var(--text-muted);">${p.reviewCount} review</span>
    </div>
    <div class="review-bars">
      ${dist.map(d => `<div><span>${d.star} <i class="fa-solid fa-star" style="color:var(--gold); font-size:.65rem;"></i></span><div class="rb-track"><div class="rb-fill" style="width:${(d.count / maxCount) * 100}%"></div></div><span>${d.count}</span></div>`).join('')}
    </div>
  `;

  const listEl = document.getElementById('reviewList');
  if (!reviews.length) {
    listEl.innerHTML = `<p style="color:var(--text-muted); padding:var(--sp-6) 0;">Belum ada review untuk produk ini. Jadilah yang pertama memberi ulasan!</p>`;
  } else {
    listEl.innerHTML = reviews.map(r => `
      <div class="review-item">
        <div class="review-item-head">
          <div class="review-who">
            <div class="review-avatar">${r.name.charAt(0)}</div>
            <div><strong>${r.name}</strong><span>${new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
          </div>
          <span class="stars">${NACUI.renderStars(r.rating)}</span>
        </div>
        <p style="font-size:var(--fs-sm);">${r.comment}</p>
      </div>`).join('');
  }
}

function bindReviewForm(p) {
  const stars = document.querySelectorAll('#starInput i');
  stars.forEach(s => s.addEventListener('click', () => {
    selectedRatingInput = Number(s.dataset.v);
    stars.forEach(x => x.classList.toggle('active', Number(x.dataset.v) <= selectedRatingInput));
  }));
  document.getElementById('reviewForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedRatingInput) { NACUI.toast('Silakan pilih rating bintang terlebih dahulu', 'error'); return; }
    const inputs = e.target.querySelectorAll('input');
    const name = inputs[0].value.trim();
    const comment = e.target.querySelector('textarea').value.trim();
    if (!NAC_DATA.reviews[p.id]) NAC_DATA.reviews[p.id] = [];
    NAC_DATA.reviews[p.id].unshift({ name, rating: selectedRatingInput, date: new Date().toISOString().slice(0, 10), comment });
    p.reviewCount += 1;
    renderReviewsTab(p);
    e.target.reset();
    stars.forEach(x => x.classList.remove('active'));
    selectedRatingInput = 0;
    NACUI.toast('Terima kasih! Review Anda berhasil dikirim.', 'success');
  });
}

function bindTabs() {
  const btns = document.querySelectorAll('.pd-tab-nav button');
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.pd-tab-panel').forEach(p => p.classList.remove('active'));
    b.classList.add('active');
    document.querySelector(`[data-panel="${b.dataset.tab}"]`).classList.add('active');
  }));
}

function renderRelated(p) {
  document.getElementById('relatedGrid').innerHTML = NAC_DATA.getRelated(p, 4).map(relatedCardHTML).join('');
}

function loadProduct() {
  const id = new URLSearchParams(location.search).get('id') || 1;
  const p = NAC_DATA.getProduct(id);
  if (!p) {
    document.querySelector('.pd-wrap .container').innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h3>Produk tidak ditemukan</h3><a href="products.html" class="btn btn-gold mt-6">Kembali ke Produk</a></div>`;
    return;
  }
  currentProduct = p;
  document.getElementById('pageTitle').textContent = `${p.name} — NAC Perfume`;
  document.getElementById('breadcrumb').innerHTML = `<a href="index.html">Home</a> <i class="fa-solid fa-chevron-right" style="font-size:.6rem;"></i> <a href="products.html">Produk</a> <i class="fa-solid fa-chevron-right" style="font-size:.6rem;"></i> <span>${p.name}</span>`;

  renderGallery(p);
  renderInfo(p);
  renderDescTab(p);
  renderNotesTab(p);
  renderReviewsTab(p);
  bindReviewForm(p);
  bindTabs();
  renderRelated(p);
}

document.addEventListener('DOMContentLoaded', loadProduct);