/* =========================================================================
   NAC PERFUME — MOCK DATA LAYER
   Meniru response REST API backend (lihat /backend). Saat backend & MySQL
   sudah live, cukup ganti NAC_DATA.products dkk dengan fetch() ke
   `${API_BASE_URL}/api/products` — struktur field sudah disamakan dengan
   skema tabel `products` di database/schema.sql agar mulus.
   ========================================================================= */

const API_BASE_URL = 'http://localhost:5000/api';

/* Helper: bikin bottle SVG generatif (menghindari aset foto berhak cipta,
   sekaligus jadi signature visual NAC — lihat catatan desain di README) */
function bottleSVG(liquid, cap = '#D4AF37', shape = 'classic') {
  const shapes = {
    classic: `<rect x="26" y="58" width="68" height="118" rx="10" fill="url(#glass)" stroke="${cap}" stroke-width="1"/>`,
    round:   `<path d="M30 90 Q30 58 60 58 Q90 58 90 90 L90 150 Q90 176 60 176 Q30 176 30 150 Z" fill="url(#glass)" stroke="${cap}" stroke-width="1"/>`,
    facet:   `<polygon points="60,55 92,75 92,160 60,178 28,160 28,75" fill="url(#glass)" stroke="${cap}" stroke-width="1"/>`
  };
  const liquidShapes = {
    classic: `<rect x="29" y="88" width="62" height="85" rx="7" fill="${liquid}" opacity="0.78"/>`,
    round:   `<path d="M33 100 Q33 96 60 96 Q87 96 87 100 L87 148 Q87 172 60 172 Q33 172 33 148 Z" fill="${liquid}" opacity="0.78"/>`,
    facet:   `<polygon points="60,80 88,96 88,158 60,174 32,158 32,96" fill="${liquid}" opacity="0.78"/>`
  };
  return `
  <svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Botol parfum NAC">
    <defs>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
        <stop offset="45%" stop-color="#ffffff" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.12"/>
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="200" rx="34" ry="6" fill="#000" opacity="0.15"/>
    ${shapes[shape]}
    ${liquidShapes[shape]}
    <rect x="48" y="30" width="24" height="30" fill="url(#glass)" stroke="${cap}" stroke-width="1"/>
    <rect x="40" y="10" width="40" height="24" rx="5" fill="${cap}"/>
    <rect x="40" y="10" width="40" height="6" rx="3" fill="#00000022"/>
    <text x="60" y="145" text-anchor="middle" font-family="Playfair Display, serif" font-size="9" fill="${cap}" opacity="0.9" font-style="italic">NAC</text>
    <rect x="33" y="70" width="6" height="95" fill="#fff" opacity="0.18"/>
  </svg>`;
}

const NAC_DATA = {

  categories: [
    { id: 'men', label: 'Men', icon: 'fa-mars' },
    { id: 'women', label: 'Women', icon: 'fa-venus' },
    { id: 'unisex', label: 'Unisex', icon: 'fa-infinity' }
  ],

  products: [
    {
      id: 1, slug: 'noir-absolu', name: 'Noir Absolu', category: 'men',
      price: 1450000, oldPrice: 1750000, rating: 4.8, reviewCount: 132,
      color: '#3D2817', cap: '#D4AF37', shape: 'classic',
      isNew: false, isBestSeller: true, isFlashSale: true, stock: 24,
      shortDesc: 'Oriental woody yang gelap dan memikat, dengan jejak oud dan amber yang membekas lama.',
      fullDesc: 'Noir Absolu adalah pernyataan maskulinitas yang tenang namun berkuasa. Dibuka dengan kilau bergamot dan lada hitam, jantung aromanya mengalir ke leather dan incense yang dalam, sebelum mengendap pada oud, amber, dan sandalwood yang hangat. Diciptakan untuk pria yang memasuki ruangan tanpa suara namun selalu diingat.',
      notes: { top: ['Bergamot', 'Lada Hitam'], middle: ['Leather', 'Incense'], base: ['Oud', 'Amber', 'Sandalwood'] },
      longevity: 8, sillage: 'Kuat', volumes: [{ ml: 30, price: 750000 }, { ml: 50, price: 1100000 }, { ml: 100, price: 1450000 }]
    },
    {
      id: 2, slug: 'azure-homme', name: 'Azure Homme', category: 'men',
      price: 980000, oldPrice: null, rating: 4.6, reviewCount: 98,
      color: '#4A90A4', cap: '#C9CDD3', shape: 'facet',
      isNew: false, isBestSeller: true, isFlashSale: false, stock: 40,
      shortDesc: 'Aquatic segar dengan sentuhan garam laut dan jeruk, cocok untuk aktivitas siang hari.',
      fullDesc: 'Azure Homme membawa udara laut ke dalam sebotol kaca. Top notes garam laut, lemon, dan grapefruit membuka kesegaran instan, dilanjutkan lavender dan marine accord di tengah, lalu mengendap lembut pada musk dan driftwood. Aroma yang tepat untuk pertemuan pagi hingga sore.',
      notes: { top: ['Sea Salt', 'Lemon', 'Grapefruit'], middle: ['Lavender', 'Marine Accord'], base: ['Musk', 'Driftwood'] },
      longevity: 6, sillage: 'Sedang', volumes: [{ ml: 30, price: 550000 }, { ml: 50, price: 750000 }, { ml: 100, price: 980000 }]
    },
    {
      id: 3, slug: 'oud-imperial', name: 'Oud Impérial', category: 'men',
      price: 2100000, oldPrice: null, rating: 4.9, reviewCount: 76,
      color: '#6B2C3E', cap: '#D4AF37', shape: 'classic',
      isNew: false, isBestSeller: false, isFlashSale: false, stock: 12,
      shortDesc: 'Oud premium bergaya Timur Tengah dengan saffron dan rose, mewah dan berkarakter kuat.',
      fullDesc: 'Terinspirasi dari kekayaan rempah dan oud tanah Arab, Oud Impérial membuka dengan saffron dan cardamom yang eksotis, jantung rose dan oud yang dalam, ditutup base amber, leather, dan vanilla. Sebuah karya untuk momen istimewa yang layak dikenang.',
      notes: { top: ['Saffron', 'Cardamom'], middle: ['Rose', 'Oud'], base: ['Amber', 'Leather', 'Vanilla'] },
      longevity: 10, sillage: 'Sangat Kuat', volumes: [{ ml: 30, price: 1100000 }, { ml: 50, price: 1600000 }, { ml: 100, price: 2100000 }]
    },
    {
      id: 4, slug: 'cedre-musc', name: 'Cèdre & Musc', category: 'men',
      price: 890000, oldPrice: 1050000, rating: 4.5, reviewCount: 61,
      color: '#6B5637', cap: '#B8942C', shape: 'facet',
      isNew: false, isBestSeller: false, isFlashSale: true, stock: 33,
      shortDesc: 'Woody musk yang bersih dan hangat, aroma harian yang elegan tanpa berlebihan.',
      fullDesc: 'Cèdre & Musc dirancang untuk penggunaan setiap hari — cukup berkarakter untuk diingat, cukup lembut untuk ruang kerja. Bergamot dan pink pepper di awal, cedarwood serta violet leaf di tengah, ditutup white musk dan vetiver yang bersih.',
      notes: { top: ['Bergamot', 'Pink Pepper'], middle: ['Cedarwood', 'Violet Leaf'], base: ['White Musk', 'Vetiver'] },
      longevity: 6, sillage: 'Sedang', volumes: [{ ml: 30, price: 480000 }, { ml: 50, price: 650000 }, { ml: 100, price: 890000 }]
    },
    {
      id: 5, slug: 'vetiver-intense', name: 'Vetiver Intense', category: 'men',
      price: 1150000, oldPrice: null, rating: 4.7, reviewCount: 54,
      color: '#3E5C3A', cap: '#8C9A6E', shape: 'classic',
      isNew: true, isBestSeller: false, isFlashSale: false, stock: 28,
      shortDesc: 'Green woody klasik dengan vetiver dan patchouli, karakter earthy yang maskulin.',
      fullDesc: 'Vetiver Intense menghidupkan kembali kehangatan akar vetiver yang earthy, dipadu grapefruit dan mint yang segar di awal, geranium di tengah, lalu oakmoss dan patchouli sebagai fondasi yang kokoh dan membumi.',
      notes: { top: ['Grapefruit', 'Mint'], middle: ['Vetiver', 'Geranium'], base: ['Oakmoss', 'Patchouli'] },
      longevity: 7, sillage: 'Sedang', volumes: [{ ml: 30, price: 600000 }, { ml: 50, price: 850000 }, { ml: 100, price: 1150000 }]
    },
    {
      id: 6, slug: 'rose-imperiale', name: 'Rose Impériale', category: 'women',
      price: 1350000, oldPrice: null, rating: 4.9, reviewCount: 145,
      color: '#D46A8F', cap: '#D4AF37', shape: 'round',
      isNew: false, isBestSeller: true, isFlashSale: false, stock: 30,
      shortDesc: 'Floral rose yang anggun dan feminin, dengan sentuhan buah beri segar.',
      fullDesc: 'Rose Impériale merayakan keanggunan mawar Bulgaria dalam balutan raspberry dan litchi yang manis, jantung peony yang lembut, dan dasar musk serta cedarwood yang menenangkan. Aroma untuk perempuan yang percaya diri dengan lembutnya.',
      notes: { top: ['Raspberry', 'Litchi'], middle: ['Bulgarian Rose', 'Peony'], base: ['Musk', 'Cedarwood'] },
      longevity: 7, sillage: 'Sedang', volumes: [{ ml: 30, price: 680000 }, { ml: 50, price: 950000 }, { ml: 100, price: 1350000 }]
    },
    {
      id: 7, slug: 'or-celeste', name: 'Or Céleste', category: 'women',
      price: 1650000, oldPrice: 1950000, rating: 4.8, reviewCount: 110,
      color: '#D4A537', cap: '#D4AF37', shape: 'classic',
      isNew: false, isBestSeller: true, isFlashSale: true, stock: 18,
      shortDesc: 'Oriental vanilla yang hangat dan mewah, aroma malam yang memesona.',
      fullDesc: 'Or Céleste adalah cahaya keemasan dalam bentuk aroma — mandarin dan bergamot yang cerah, jasmine dan orchid yang sensual di tengah, lalu vanilla, amber, dan tonka bean yang hangat memeluk kulit. Sempurna untuk malam-malam istimewa.',
      notes: { top: ['Mandarin', 'Bergamot'], middle: ['Jasmine', 'Orchid'], base: ['Vanilla', 'Amber', 'Tonka Bean'] },
      longevity: 9, sillage: 'Kuat', volumes: [{ ml: 30, price: 820000 }, { ml: 50, price: 1200000 }, { ml: 100, price: 1650000 }]
    },
    {
      id: 8, slug: 'fleur-de-lumiere', name: 'Fleur de Lumière', category: 'women',
      price: 990000, oldPrice: null, rating: 4.6, reviewCount: 88,
      color: '#E8B4BC', cap: '#D4AF37', shape: 'round',
      isNew: true, isBestSeller: false, isFlashSale: false, stock: 45,
      shortDesc: 'White floral yang lembut dan bersih, secerah cahaya pagi.',
      fullDesc: 'Fleur de Lumière membuka hari dengan pear dan neroli yang segar, jasmine sambac dan lily of the valley yang lembut di tengah, ditutup white musk serta cashmere wood yang halus di kulit.',
      notes: { top: ['Pear', 'Neroli'], middle: ['Jasmine Sambac', 'Lily of the Valley'], base: ['White Musk', 'Cashmere Wood'] },
      longevity: 6, sillage: 'Lembut', volumes: [{ ml: 30, price: 560000 }, { ml: 50, price: 780000 }, { ml: 100, price: 990000 }]
    },
    {
      id: 9, slug: 'velours-rouge', name: 'Velours Rouge', category: 'women',
      price: 1250000, oldPrice: null, rating: 4.7, reviewCount: 72,
      color: '#A6293D', cap: '#D4AF37', shape: 'facet',
      isNew: false, isBestSeller: false, isFlashSale: false, stock: 22,
      shortDesc: 'Fruity floral manis dengan praline dan vanilla, hangat seperti beludru.',
      fullDesc: 'Velours Rouge dibuka dengan blackcurrant dan blood orange yang menggoda, jantung peony dan red fruits yang ceria, lalu turun ke praline, vanilla, dan musk yang hangat seperti selimut beludru merah.',
      notes: { top: ['Blackcurrant', 'Blood Orange'], middle: ['Peony', 'Red Fruits'], base: ['Praline', 'Vanilla', 'Musk'] },
      longevity: 7, sillage: 'Sedang', volumes: [{ ml: 30, price: 640000 }, { ml: 50, price: 880000 }, { ml: 100, price: 1250000 }]
    },
    {
      id: 10, slug: 'iris-noir', name: 'Iris Noir', category: 'women',
      price: 1550000, oldPrice: 1800000, rating: 4.8, reviewCount: 49,
      color: '#7B6B8F', cap: '#B8942C', shape: 'classic',
      isNew: false, isBestSeller: false, isFlashSale: true, stock: 15,
      shortDesc: 'Powdery iris yang misterius dan elegan, untuk jiwa yang tenang namun dalam.',
      fullDesc: 'Iris Noir menghadirkan sisi gelap dari bunga iris — bergamot dan coriander di pembukaan, iris serta violet yang powdery di tengah, lalu suede, sandalwood, dan amber sebagai penutup yang intim dan misterius.',
      notes: { top: ['Bergamot', 'Coriander'], middle: ['Iris', 'Violet'], base: ['Suede', 'Sandalwood', 'Amber'] },
      longevity: 8, sillage: 'Sedang', volumes: [{ ml: 30, price: 780000 }, { ml: 50, price: 1120000 }, { ml: 100, price: 1550000 }]
    },
    {
      id: 11, slug: 'ambre-mystique', name: 'Ambre Mystique', category: 'unisex',
      price: 1400000, oldPrice: null, rating: 4.9, reviewCount: 121,
      color: '#C77D3A', cap: '#D4AF37', shape: 'classic',
      isNew: false, isBestSeller: true, isFlashSale: false, stock: 26,
      shortDesc: 'Amber woody yang hangat dan netral gender, favorit sepanjang musim.',
      fullDesc: 'Ambre Mystique adalah jembatan antara maskulin dan feminin — cardamom dan orange blossom yang cerah, labdanum serta benzoin yang resinous di tengah, lalu amber, vanilla, dan musk yang hangat dan memeluk siapapun yang memakainya.',
      notes: { top: ['Cardamom', 'Orange Blossom'], middle: ['Labdanum', 'Benzoin'], base: ['Amber', 'Vanilla', 'Musk'] },
      longevity: 8, sillage: 'Kuat', volumes: [{ ml: 30, price: 720000 }, { ml: 50, price: 1020000 }, { ml: 100, price: 1400000 }]
    },
    {
      id: 12, slug: 'santal-blanc', name: 'Santal Blanc', category: 'unisex',
      price: 1200000, oldPrice: null, rating: 4.7, reviewCount: 67,
      color: '#B08968', cap: '#D4AF37', shape: 'round',
      isNew: true, isBestSeller: false, isFlashSale: false, stock: 38,
      shortDesc: 'Sandalwood krimi yang lembut dan hangat, creamy dan menenangkan.',
      fullDesc: 'Santal Blanc merayakan kelembutan sandalwood — bergamot dan cardamom di awal, sandalwood serta rose yang creamy di tengah, ditutup musk, amber, dan vanilla yang menenangkan seperti kayu hangat di senja hari.',
      notes: { top: ['Bergamot', 'Cardamom'], middle: ['Sandalwood', 'Rose'], base: ['Musk', 'Amber', 'Vanilla'] },
      longevity: 7, sillage: 'Sedang', volumes: [{ ml: 30, price: 620000 }, { ml: 50, price: 880000 }, { ml: 100, price: 1200000 }]
    },
    {
      id: 13, slug: 'neroli-infini', name: 'Neroli Infini', category: 'unisex',
      price: 950000, oldPrice: 1100000, rating: 4.5, reviewCount: 58,
      color: '#A8B84A', cap: '#C9CDD3', shape: 'facet',
      isNew: false, isBestSeller: false, isFlashSale: true, stock: 41,
      shortDesc: 'Citrus neroli yang cerah dan energik, sempurna untuk cuaca tropis.',
      fullDesc: 'Neroli Infini adalah kesegaran tanpa akhir — neroli, lemon, dan petitgrain yang cerah, orange blossom serta jasmine di tengah, lalu white musk dan cedar yang ringan. Cocok untuk iklim tropis Indonesia sepanjang tahun.',
      notes: { top: ['Neroli', 'Lemon', 'Petitgrain'], middle: ['Orange Blossom', 'Jasmine'], base: ['White Musk', 'Cedar'] },
      longevity: 5, sillage: 'Lembut', volumes: [{ ml: 30, price: 520000 }, { ml: 50, price: 720000 }, { ml: 100, price: 950000 }]
    },
    {
      id: 14, slug: 'musc-eternel', name: 'Musc Éternel', category: 'unisex',
      price: 1300000, oldPrice: null, rating: 4.8, reviewCount: 94,
      color: '#9B8AA0', cap: '#D4AF37', shape: 'classic',
      isNew: true, isBestSeller: true, isFlashSale: false, stock: 20,
      shortDesc: 'Musk lembut dan skin-like, aroma personal yang menyatu dengan kulit.',
      fullDesc: 'Musc Éternel dirancang untuk terasa seperti bagian dari kulit Anda — pink pepper dan mandarin yang ringan, iris serta white musk di tengah, ditutup ambrette, sandalwood, dan vanilla yang lembut dan intim.',
      notes: { top: ['Pink Pepper', 'Mandarin'], middle: ['Iris', 'White Musk'], base: ['Ambrette', 'Sandalwood', 'Vanilla'] },
      longevity: 7, sillage: 'Lembut', volumes: [{ ml: 30, price: 670000 }, { ml: 50, price: 950000 }, { ml: 100, price: 1300000 }]
    }
  ],

  reviews: {
    1: [
      { name: 'Rizky Pratama', rating: 5, date: '2026-06-12', comment: 'Wangi maskulin banget, tahan dari pagi sampai malam. Kemasannya juga mewah, pantas jadi hadiah.' },
      { name: 'Andra Wijaya', rating: 5, date: '2026-05-28', comment: 'Baru pertama coba niche lokal seenak ini. Sillage-nya pas, ga norak tapi berkarakter.' },
      { name: 'Fajar Nugroho', rating: 4, date: '2026-05-02', comment: 'Enak, cuma agak kuat kalau dipakai indoor/AC kecil. Semprot 1-2 kali cukup.' }
    ],
    6: [
      { name: 'Amanda Putri', rating: 5, date: '2026-06-20', comment: 'Rose-nya elegan, ga bikin pusing kayak parfum mawar lain. Jadi signature scent aku sekarang.' },
      { name: 'Sarah Wijaya', rating: 5, date: '2026-06-01', comment: 'Packaging mewah, botolnya aja udah kayak barang display. Wanginya tahan lama juga.' }
    ],
    11: [
      { name: 'Clara Amelia', rating: 5, date: '2026-06-15', comment: 'Unisex favorit! Suami juga suka pakai punyaku. Worth every penny.' },
      { name: 'Budi Santoso', rating: 5, date: '2026-05-19', comment: 'Amber-nya hangat tapi ga eneg. Cocok dipakai kerja maupun dinner.' }
    ]
  },

  testimonials: [
    { name: 'Amanda Putri', city: 'Pekanbaru', rating: 5, comment: 'NAC Perfume mengubah cara aku melihat parfum lokal. Kualitasnya setara brand internasional, harganya jauh lebih masuk akal.' },
    { name: 'Rizky Pratama', city: 'Surabaya', rating: 5, comment: 'Dari kemasan sampai wangi, semua terasa premium. Pengiriman juga cepat dan botolnya dibungkus rapi sekali.' },
    { name: 'Sarah Wijaya', city: 'Bandung', rating: 5, comment: 'Sudah repeat order 3 kali. Or Céleste jadi wangi andalan untuk acara malam.' },
    { name: 'Budi Santoso', city: 'Medan', rating: 4, comment: 'Pelayanan customer service-nya ramah, bantu pilihkan wangi yang cocok untuk kulit aku.' },
    { name: 'Clara Amelia', city: 'Denpasar', rating: 5, comment: 'Ambre Mystique tuh juara, cocok buat cuaca panas tapi tetap elegan sepanjang hari.' },
    { name: 'Fajar Nugroho', city: 'Yogyakarta', rating: 5, comment: 'Baru sadar parfum lokal bisa semewah ini. Noir Absolu bikin pede tiap ketemu klien.' }
  ],

  articles: [
    {
      id: 1, slug: 'cara-memilih-parfum-sesuai-kepribadian', category: 'Panduan',
      title: 'Cara Memilih Parfum yang Tepat Sesuai Kepribadian',
      excerpt: 'Parfum adalah identitas tanpa kata. Berikut cara menemukan aroma yang benar-benar mencerminkan dirimu.',
      date: '15 Juli 2026', readTime: '5 menit', icon: 'fa-compass',
      content: [
        'Memilih parfum bukan sekadar soal wangi yang enak dicium, tapi tentang menemukan aroma yang terasa seperti "kamu". Setiap orang memiliki kimia kulit yang berbeda, sehingga parfum yang sama bisa tercium berbeda di dua orang.',
        'Langkah pertama adalah mengenali keluarga aroma yang kamu sukai: floral untuk kesan lembut dan feminin, woody untuk kesan hangat dan membumi, oriental untuk kesan mewah dan berani, atau fresh/aquatic untuk kesan bersih dan energik.',
        'Pertimbangkan juga kepribadianmu. Jika kamu cenderung tenang dan minimalis, aroma musky atau woody yang subtle biasanya lebih cocok. Jika kamu ekspresif dan suka jadi pusat perhatian, oriental atau floral yang kuat bisa jadi signature scent yang pas.',
        'Terakhir, selalu uji parfum di kulit, bukan hanya di kertas tester. Biarkan aroma berkembang selama 15-30 menit sebelum memutuskan, karena top notes akan menguap dan menyisakan karakter asli parfum di middle hingga base notes.'
      ]
    },
    {
      id: 2, slug: 'tips-memakai-parfum-agar-tahan-lama',
      category: 'Tips', title: '5 Tips Memakai Parfum Agar Aroma Tahan Lebih Lama',
      excerpt: 'Sudah pakai parfum mahal tapi wangi cepat hilang? Ini titik dan teknik aplikasi yang tepat.',
      date: '8 Juli 2026', readTime: '4 menit', icon: 'fa-hourglass-half',
      content: [
        'Banyak orang mengeluh parfum favoritnya cepat hilang wanginya, padahal seringkali masalahnya ada di teknik aplikasi, bukan kualitas parfumnya.',
        '1. Semprotkan di titik nadi — pergelangan tangan, leher, dan belakang telinga adalah area dengan suhu tubuh lebih hangat yang membantu parfum menyebar dan bertahan lebih lama.',
        '2. Aplikasikan setelah mandi, saat pori-pori kulit masih terbuka dan lembap, sehingga parfum lebih mudah menyerap.',
        '3. Jangan digosok. Menggosok pergelangan tangan setelah menyemprot parfum justru memecah molekul aroma dan mempercepat top notes menguap.',
        '4. Gunakan body lotion tanpa wangi sebagai dasar (layering) sebelum menyemprot parfum, agar kulit lebih lembap dan aroma lebih "menempel".',
        '5. Simpan parfum dengan benar — jauhkan dari sinar matahari langsung dan suhu panas agar formulanya tidak rusak sebelum sempat kamu pakai.'
      ]
    },
    {
      id: 3, slug: 'aroma-terbaik-untuk-setiap-musim-di-indonesia',
      category: 'Rekomendasi', title: 'Aroma Terbaik untuk Setiap Musim di Indonesia',
      excerpt: 'Indonesia hanya punya dua musim, tapi karakter aroma tetap bisa disesuaikan dengan cuaca dan suasana.',
      date: '29 Juni 2026', readTime: '6 menit', icon: 'fa-sun',
      content: [
        'Meski Indonesia beriklim tropis sepanjang tahun, cuaca panas-lembap dan musim hujan tetap memengaruhi bagaimana parfum tercium dan bertahan di kulit.',
        'Untuk musim kemarau yang panas, pilih aroma fresh dan aquatic seperti Azure Homme atau Neroli Infini. Sillage yang ringan mencegah aroma terasa berat saat berkeringat, sekaligus memberi kesan segar sepanjang hari.',
        'Saat musim hujan dengan udara lebih sejuk, ini saat yang tepat untuk aroma woody dan oriental yang lebih hangat seperti Noir Absolu atau Or Céleste — kelembapan udara justru membantu sillage aroma-aroma ini terasa lebih nyaman dan tidak menyengat.',
        'Untuk pemakaian kantor atau ruang ber-AC sepanjang hari, aroma unisex yang lembut seperti Musc Éternel atau Santal Blanc adalah pilihan aman yang tidak mengganggu rekan kerja namun tetap berkarakter.'
      ]
    },
    {
      id: 4, slug: 'cara-merawat-dan-menyimpan-parfum',
      category: 'Perawatan', title: 'Cara Merawat dan Menyimpan Parfum agar Tetap Awet',
      excerpt: 'Parfum premium sekalipun bisa rusak jika disimpan sembarangan. Ini cara menjaga kualitasnya.',
      date: '20 Juni 2026', readTime: '4 menit', icon: 'fa-box-archive',
      content: [
        'Parfum adalah campuran senyawa yang sensitif terhadap cahaya, suhu, dan udara. Penyimpanan yang salah bisa mengubah warna, aroma, bahkan mempercepat kerusakan formulanya.',
        'Simpan parfum di tempat sejuk, kering, dan jauh dari sinar matahari langsung — laci kamar atau lemari tertutup jauh lebih baik daripada meja rias dekat jendela.',
        'Hindari kamar mandi sebagai tempat penyimpanan meski praktis, karena kelembapan dan perubahan suhu akibat air panas dapat merusak molekul aroma lebih cepat.',
        'Selalu tutup rapat botol setelah pemakaian untuk meminimalkan oksidasi akibat kontak dengan udara, dan hindari mengocok botol parfum karena dapat memasukkan gelembung udara yang mempercepat oksidasi.',
        'Dengan penyimpanan yang tepat, parfum premium umumnya tetap dalam kondisi optimal selama 3-5 tahun sejak pertama kali dibuka.'
      ]
    },
    {
      id: 5, slug: 'mengenal-top-middle-base-notes',
      category: 'Panduan', title: 'Mengenal Tingkatan Aroma: Top, Middle, dan Base Notes',
      excerpt: 'Kenapa wangi parfum berubah dari jam ke jam? Jawabannya ada di struktur piramida aroma.',
      date: '10 Juni 2026', readTime: '5 menit', icon: 'fa-layer-group',
      content: [
        'Setiap parfum berkualitas dibangun dari tiga lapisan aroma yang disebut piramida notes — top, middle, dan base — yang muncul dan menghilang secara bertahap seiring waktu pemakaian.',
        'Top notes adalah kesan pertama yang tercium 5-15 menit pertama, biasanya berupa citrus atau herbal yang ringan dan menguap cepat, berfungsi menarik perhatian di awal.',
        'Middle notes, atau "heart notes", muncul setelah top notes memudar dan bertahan 20 menit hingga beberapa jam. Notes ini adalah karakter utama parfum, umumnya floral atau spicy.',
        'Base notes adalah fondasi yang muncul paling lama, biasanya woody, musky, atau amber, dan bisa bertahan hingga 6-10 jam bahkan lebih. Base notes inilah yang menentukan kesan akhir dan daya tahan sebuah parfum di kulit Anda.'
      ]
    },
    {
      id: 6, slug: 'parfum-pria-wanita-unisex-apa-bedanya',
      category: 'Panduan', title: 'Parfum Pria vs Wanita vs Unisex: Apa Bedanya?',
      excerpt: 'Label gender pada parfum sebenarnya soal konvensi pemasaran, bukan aturan baku. Ini penjelasannya.',
      date: '2 Juni 2026', readTime: '4 menit', icon: 'fa-people-arrows',
      content: [
        'Secara kimiawi, tidak ada molekul aroma yang secara inheren "milik" pria atau wanita. Label gender pada parfum lebih banyak dibentuk oleh konvensi pemasaran dan asosiasi budaya selama puluhan tahun.',
        'Parfum "maskulin" umumnya diformulasikan dengan basis woody, spicy, atau aquatic yang tegas, sementara parfum "feminin" cenderung mengandalkan floral dan fruity yang lembut. Namun ini bukan aturan mutlak.',
        'Parfum unisex dirancang dengan keseimbangan notes yang netral — sering berbasis musk, amber, atau woody lembut — sehingga nyaman dipakai siapa saja tanpa terasa terlalu maskulin atau feminin.',
        'Pada akhirnya, pilihan terbaik adalah aroma yang membuatmu nyaman dan percaya diri, terlepas dari label kategori di kemasannya.'
      ]
    }
  ]
};

/* ---- Query helpers (dipakai di seluruh halaman) ---- */
NAC_DATA.getProduct = (id) => NAC_DATA.products.find(p => p.id === Number(id));
NAC_DATA.getProductBySlug = (slug) => NAC_DATA.products.find(p => p.slug === slug);
NAC_DATA.getArticle = (slug) => NAC_DATA.articles.find(a => a.slug === slug);
NAC_DATA.getRelated = (product, limit = 4) =>
  NAC_DATA.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, limit);
NAC_DATA.formatIDR = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');