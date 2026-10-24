/* =========================================================================
   NAC PERFUME — BLOG LISTING LOGIC
   ========================================================================= */

let blogCategory = 'all';
let blogQuery = '';

function articleCardHTML(a) {
  return `
  <a href="blog-detail.html?slug=${a.slug}" class="blog-card">
    <div class="blog-card-media"><i class="fa-solid ${a.icon}"></i></div>
    <span class="tag tag-outline">${a.category}</span>
    <h3>${a.title}</h3>
    <p style="font-size:var(--fs-sm);">${a.excerpt}</p>
    <div class="blog-meta"><span><i class="fa-regular fa-calendar"></i> ${a.date}</span><span><i class="fa-regular fa-clock"></i> ${a.readTime}</span></div>
  </a>`;
}

function renderBlogCats() {
  const cats = ['all', ...new Set(NAC_DATA.articles.map(a => a.category))];
  document.getElementById('blogCats').innerHTML = cats.map(c =>
    `<button class="${c === blogCategory ? 'active' : ''}" data-cat="${c}">${c === 'all' ? 'Semua' : c}</button>`).join('');
  document.querySelectorAll('#blogCats button').forEach(b => b.addEventListener('click', () => {
    blogCategory = b.dataset.cat;
    renderBlogCats(); renderBlogGrid();
  }));
}

function renderBlogGrid() {
  let list = [...NAC_DATA.articles];
  if (blogCategory !== 'all') list = list.filter(a => a.category === blogCategory);
  if (blogQuery) { const q = blogQuery.toLowerCase(); list = list.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)); }

  const grid = document.getElementById('blogGrid');
  const empty = document.getElementById('blogEmpty');
  if (!list.length) { grid.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  grid.innerHTML = list.map(articleCardHTML).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderBlogCats();
  renderBlogGrid();
  document.getElementById('blogSearch').addEventListener('input', (e) => { blogQuery = e.target.value; renderBlogGrid(); });
});