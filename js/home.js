/* =========================================================================
   NAC PERFUME — HOME PAGE LOGIC
   ========================================================================= */

function productCardHTML(p) {
  const wished = NACWishlist.has(p.id);
  const badges = [];
  if (p.isFlashSale) badges.push('<span class="tag tag-gold">Flash Sale</span>');
  else if (p.isNew) badges.push('<span class="tag tag-dark">New</span>');
  else if (p.isBestSeller) badges.push('<span class="tag tag-outline">Best Seller</span>');
  const priceHTML = p.oldPrice
    ? `<strong>${NAC_DATA.formatIDR(p.price)}</strong><del>${NAC_DATA.formatIDR(p.oldPrice)}</del>`
    : `<strong>${NAC_DATA.formatIDR(p.price)}</strong>`;
  return `
  <div class="product-card">
    <div class="product-media">
      <div class="product-badges">${badges.join('')}</div>
      <button class="wishlist-btn ${wished ? 'active' : ''}" data-id="${p.id}" aria-label="Wishlist">
        <i class="fa-${wished ? 'solid' : 'regular'} fa-heart"></i>
      </button>
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

/* Hero bottle + ambient gold particles */
function initHeroVisual() {
  const heroBottle = document.getElementById('heroBottle');
  if (heroBottle) heroBottle.innerHTML = bottleSVG('#3D2817', '#D4AF37', 'classic').replace('viewBox="0 0 120 210"', 'viewBox="0 0 120 210" style="width:100%"');
  const particleWrap = document.getElementById('heroParticles');
  if (particleWrap) {
    let html = '';
    for (let i = 0; i < 22; i++) {
      const top = Math.random() * 100, left = Math.random() * 100, delay = Math.random() * 10, dur = 8 + Math.random() * 8;
      html += `<span style="top:${top}%; left:${left}%; animation-delay:-${delay}s; animation-duration:${dur}s;"></span>`;
    }
    particleWrap.innerHTML = html;
  }
}

function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  const words = ['Aroma Premium', 'Bahan Pilihan', 'Tahan Lama', 'Kemasan Mewah', 'Made in Indonesia', 'Cruelty-Free'];
  const item = words.map(w => `<span>${w} <i class="fa-solid fa-gem"></i></span>`).join('');
  track.innerHTML = item + item; // duplikat untuk loop mulus
}

function initFlashSale() {
  const grid = document.getElementById('flashSaleGrid');
  if (!grid) return;
  const items = NAC_DATA.products.filter(p => p.isFlashSale).slice(0, 4);
  grid.innerHTML = items.map(productCardHTML).join('');
}

function initCountdown() {
  const target = Date.now() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000); // ~2 hari 14 jam dari sekarang
  const d = document.getElementById('cd-days'), h = document.getElementById('cd-hours'),
        m = document.getElementById('cd-mins'), s = document.getElementById('cd-secs');
  if (!d) return;
  function tick() {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    d.textContent = String(days).padStart(2, '0');
    h.textContent = String(hours).padStart(2, '0');
    m.textContent = String(mins).padStart(2, '0');
    s.textContent = String(secs).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}

function initProductTabs() {
  const grid = document.getElementById('tabProductGrid');
  const tabs = document.querySelectorAll('.tabs button');
  if (!grid) return;
  function render(type) {
    const items = (type === 'new' ? NAC_DATA.products.filter(p => p.isNew) : NAC_DATA.products.filter(p => p.isBestSeller)).slice(0, 8);
    grid.innerHTML = items.map(productCardHTML).join('');
  }
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    render(t.dataset.tab);
  }));
  render('bestseller');
}

function initAboutTeaser() {
  const el = document.getElementById('aboutTeaserVisual');
  if (el) el.innerHTML = bottleSVG('#D4A537', '#D4AF37', 'round');
}

/* Testimonial slider (autoplay) */
function initTestimonialSlider() {
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  if (!track) return;
  const list = NAC_DATA.testimonials;
  track.innerHTML = list.map(t => `
    <div class="testi-slide">
      <div class="stars">${NACUI.renderStars(t.rating)}</div>
      <p>&ldquo;${t.comment}&rdquo;</p>
      <div class="testi-who">
        <div class="testi-avatar">${t.name.charAt(0)}</div>
        <strong>${t.name}</strong><span style="color:var(--fumee-dark); font-size:var(--fs-xs);">${t.city}</span>
      </div>
    </div>`).join('');
  dotsWrap.innerHTML = list.map((_, i) => `<button data-i="${i}" class="${i === 0 ? 'active' : ''}" aria-label="Slide ${i + 1}"></button>`).join('');

  let idx = 0;
  const dots = dotsWrap.querySelectorAll('button');
  function go(i) {
    idx = (i + list.length) % list.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[idx].classList.add('active');
  }
  document.querySelector('.testi-nav.prev')?.addEventListener('click', () => go(idx - 1));
  document.querySelector('.testi-nav.next')?.addEventListener('click', () => go(idx + 1));
  dots.forEach(d => d.addEventListener('click', () => go(Number(d.dataset.i))));
  setInterval(() => go(idx + 1), 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroVisual();
  initMarquee();
  initFlashSale();
  initCountdown();
  initProductTabs();
  initAboutTeaser();
  initTestimonialSlider();
});