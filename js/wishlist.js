/* =========================================================================
   NAC PERFUME — WISHLIST LOGIC
   ========================================================================= */

function wishlistCardHTML(p) {
  const priceHTML = p.oldPrice ? `<strong>${NAC_DATA.formatIDR(p.price)}</strong><del>${NAC_DATA.formatIDR(p.oldPrice)}</del>` : `<strong>${NAC_DATA.formatIDR(p.price)}</strong>`;
  return `
  <div class="product-card">
    <div class="product-media">
      <button class="wishlist-btn active" data-id="${p.id}" aria-label="Hapus dari wishlist"><i class="fa-solid fa-heart"></i></button>
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

function renderWishlist() {
  const ids = NACWishlist.getAll();
  const grid = document.getElementById('wishlistGrid');
  const empty = document.getElementById('wishlistEmpty');
  const products = ids.map(id => NAC_DATA.getProduct(id)).filter(Boolean);

  if (!products.length) { grid.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  grid.innerHTML = products.map(wishlistCardHTML).join('');
}

// Re-render setiap kali status wishlist berubah (klik ikon hati)
document.addEventListener('click', (e) => {
  if (e.target.closest('.wishlist-btn')) setTimeout(renderWishlist, 0);
});

document.addEventListener('DOMContentLoaded', renderWishlist);