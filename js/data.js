
const API_BASE_URL = 'http://localhost:5001/api';
const API_SERVER_URL = 'http://localhost:5001';


/* =========================================================================
   BOTTLE SVG
   =========================================================================
   Fallback visual jika halaman tertentu masih menggunakan bottleSVG().
   Tidak bergantung pada gambar database.
   ========================================================================= */

function bottleSVG(
  liquid = '#3D2817',
  cap = '#D4AF37',
  shape = 'classic'
) {

  const shapes = {

    classic: `
      <rect
        x="26"
        y="58"
        width="68"
        height="118"
        rx="10"
        fill="url(#glass)"
        stroke="${cap}"
        stroke-width="1"
      />
    `,

    round: `
      <path
        d="M30 90
           Q30 58 60 58
           Q90 58 90 90
           L90 150
           Q90 176 60 176
           Q30 176 30 150
           Z"
        fill="url(#glass)"
        stroke="${cap}"
        stroke-width="1"
      />
    `,

    facet: `
      <polygon
        points="60,55 92,75 92,160 60,178 28,160 28,75"
        fill="url(#glass)"
        stroke="${cap}"
        stroke-width="1"
      />
    `
  };


  const liquidShapes = {

    classic: `
      <rect
        x="29"
        y="88"
        width="62"
        height="85"
        rx="7"
        fill="${liquid}"
        opacity="0.78"
      />
    `,

    round: `
      <path
        d="M33 100
           Q33 96 60 96
           Q87 96 87 100
           L87 148
           Q87 172 60 172
           Q33 172 33 148
           Z"
        fill="${liquid}"
        opacity="0.78"
      />
    `,

    facet: `
      <polygon
        points="60,80 88,96 88,158 60,174 32,158 32,96"
        fill="${liquid}"
        opacity="0.78"
      />
    `
  };


  const selectedShape =
    shapes[shape] || shapes.classic;

  const selectedLiquid =
    liquidShapes[shape] || liquidShapes.classic;


  return `
    <svg
      viewBox="0 0 120 210"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Botol parfum NAC"
    >

      <defs>

        <linearGradient
          id="glass"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="#ffffff"
            stop-opacity="0.35"
          />

          <stop
            offset="45%"
            stop-color="#ffffff"
            stop-opacity="0.06"
          />

          <stop
            offset="100%"
            stop-color="#000000"
            stop-opacity="0.12"
          />
        </linearGradient>

      </defs>


      <ellipse
        cx="60"
        cy="200"
        rx="34"
        ry="6"
        fill="#000"
        opacity="0.15"
      />

      ${selectedShape}

      ${selectedLiquid}


      <rect
        x="48"
        y="30"
        width="24"
        height="30"
        fill="url(#glass)"
        stroke="${cap}"
        stroke-width="1"
      />


      <rect
        x="40"
        y="10"
        width="40"
        height="24"
        rx="5"
        fill="${cap}"
      />


      <rect
        x="40"
        y="10"
        width="40"
        height="6"
        rx="3"
        fill="#00000022"
      />


      <text
        x="60"
        y="145"
        text-anchor="middle"
        font-family="Playfair Display, serif"
        font-size="9"
        fill="${cap}"
        opacity="0.9"
        font-style="italic"
      >
        NAC
      </text>


      <rect
        x="33"
        y="70"
        width="6"
        height="95"
        fill="#fff"
        opacity="0.18"
      />

    </svg>
  `;
}


/* =========================================================================
   NAC DATA
   =========================================================================
   products sengaja kosong.
   Produk akan diisi oleh loadProductsFromAPI().
   ========================================================================= */

const NAC_DATA = {

  /* -----------------------------------------------------------------------
     CATEGORIES
     ----------------------------------------------------------------------- */

  categories: [

    {
      id: 'men',
      label: 'Men',
      icon: 'fa-mars'
    },

    {
      id: 'women',
      label: 'Women',
      icon: 'fa-venus'
    },

    {
      id: 'unisex',
      label: 'Unisex',
      icon: 'fa-infinity'
    }

  ],


  /* -----------------------------------------------------------------------
     PRODUCTS
     -----------------------------------------------------------------------
     Jangan isi manual.
     Data diambil dari MySQL melalui API.
     ----------------------------------------------------------------------- */

  products: [],


  /* -----------------------------------------------------------------------
     REVIEWS
     ----------------------------------------------------------------------- */

  reviews: {

    1: [
      {
        name: 'Rizky Pratama',
        rating: 5,
        date: '2026-06-12',
        comment:
          'Wangi maskulin banget, tahan dari pagi sampai malam. Kemasannya juga mewah, pantas jadi hadiah.'
      },

      {
        name: 'Andra Wijaya',
        rating: 5,
        date: '2026-05-28',
        comment:
          'Baru pertama coba niche lokal seenak ini. Sillage-nya pas, ga norak tapi berkarakter.'
      },

      {
        name: 'Fajar Nugroho',
        rating: 4,
        date: '2026-05-02',
        comment:
          'Enak, cuma agak kuat kalau dipakai indoor/AC kecil. Semprot 1-2 kali cukup.'
      }
    ],


    6: [
      {
        name: 'Amanda Putri',
        rating: 5,
        date: '2026-06-20',
        comment:
          'Rose-nya elegan, ga bikin pusing kayak parfum mawar lain. Jadi signature scent aku sekarang.'
      },

      {
        name: 'Sarah Wijaya',
        rating: 5,
        date: '2026-06-01',
        comment:
          'Packaging mewah, botolnya aja udah kayak barang display. Wanginya tahan lama juga.'
      }
    ],


    11: [
      {
        name: 'Clara Amelia',
        rating: 5,
        date: '2026-06-15',
        comment:
          'Unisex favorit! Suami juga suka pakai punyaku. Worth every penny.'
      },

      {
        name: 'Budi Santoso',
        rating: 5,
        date: '2026-05-19',
        comment:
          'Amber-nya hangat tapi ga eneg. Cocok dipakai kerja maupun dinner.'
      }
    ]

  },


  /* -----------------------------------------------------------------------
     TESTIMONIALS
     ----------------------------------------------------------------------- */

  testimonials: [

    {
      name: 'Amanda Putri',
      city: 'Pekanbaru',
      rating: 5,
      comment:
        'NAC Perfume mengubah cara aku melihat parfum lokal. Kualitasnya setara brand internasional, harganya jauh lebih masuk akal.'
    },

    {
      name: 'Rizky Pratama',
      city: 'Surabaya',
      rating: 5,
      comment:
        'Dari kemasan sampai wangi, semua terasa premium. Pengiriman juga cepat dan botolnya dibungkus rapi sekali.'
    },

    {
      name: 'Sarah Wijaya',
      city: 'Bandung',
      rating: 5,
      comment:
        'Sudah repeat order 3 kali. Or Céleste jadi wangi andalan untuk acara malam.'
    },

    {
      name: 'Budi Santoso',
      city: 'Medan',
      rating: 4,
      comment:
        'Pelayanan customer service-nya ramah, bantu pilihkan wangi yang cocok untuk kulit aku.'
    },

    {
      name: 'Clara Amelia',
      city: 'Denpasar',
      rating: 5,
      comment:
        'Ambre Mystique tuh juara, cocok buat cuaca panas tapi tetap elegan sepanjang hari.'
    },

    {
      name: 'Fajar Nugroho',
      city: 'Yogyakarta',
      rating: 5,
      comment:
        'Baru sadar parfum lokal bisa semewah ini. Noir Absolu bikin pede tiap ketemu klien.'
    }

  ],


  /* -----------------------------------------------------------------------
     ARTICLES
     ----------------------------------------------------------------------- */

  articles: [

    {
      id: 1,
      slug: 'cara-memilih-parfum-sesuai-kepribadian',
      category: 'Panduan',
      title:
        'Cara Memilih Parfum yang Tepat Sesuai Kepribadian',
      excerpt:
        'Parfum adalah identitas tanpa kata. Berikut cara menemukan aroma yang benar-benar mencerminkan dirimu.',
      date: '15 Juli 2026',
      readTime: '5 menit',
      icon: 'fa-compass',

      content: [

        'Memilih parfum bukan sekadar soal wangi yang enak dicium, tapi tentang menemukan aroma yang terasa seperti "kamu". Setiap orang memiliki kimia kulit yang berbeda, sehingga parfum yang sama bisa tercium berbeda di dua orang.',

        'Langkah pertama adalah mengenali keluarga aroma yang kamu sukai: floral untuk kesan lembut dan feminin, woody untuk kesan hangat dan membumi, oriental untuk kesan mewah dan berani, atau fresh/aquatic untuk kesan bersih dan energik.',

        'Pertimbangkan juga kepribadianmu. Jika kamu cenderung tenang dan minimalis, aroma musky atau woody yang subtle biasanya lebih cocok. Jika kamu ekspresif dan suka jadi pusat perhatian, oriental atau floral yang kuat bisa jadi signature scent yang pas.',

        'Terakhir, selalu uji parfum di kulit, bukan hanya di kertas tester. Biarkan aroma berkembang selama 15-30 menit sebelum memutuskan, karena top notes akan menguap dan menyisakan karakter asli parfum di middle hingga base notes.'

      ]
    },


    {
      id: 2,
      slug: 'tips-memakai-parfum-agar-tahan-lama',
      category: 'Tips',
      title:
        '5 Tips Memakai Parfum Agar Aroma Tahan Lebih Lama',
      excerpt:
        'Sudah pakai parfum mahal tapi wangi cepat hilang? Ini titik dan teknik aplikasi yang tepat.',
      date: '8 Juli 2026',
      readTime: '4 menit',
      icon: 'fa-hourglass-half',

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
      id: 3,
      slug: 'aroma-terbaik-untuk-setiap-musim-di-indonesia',
      category: 'Rekomendasi',
      title:
        'Aroma Terbaik untuk Setiap Musim di Indonesia',
      excerpt:
        'Indonesia hanya punya dua musim, tapi karakter aroma tetap bisa disesuaikan dengan cuaca dan suasana.',
      date: '29 Juni 2026',
      readTime: '6 menit',
      icon: 'fa-sun',

      content: [

        'Meski Indonesia beriklim tropis sepanjang tahun, cuaca panas-lembap dan musim hujan tetap memengaruhi bagaimana parfum tercium dan bertahan di kulit.',

        'Untuk musim kemarau yang panas, pilih aroma fresh dan aquatic seperti Azure Homme atau Neroli Infini. Sillage yang ringan mencegah aroma terasa berat saat berkeringat, sekaligus memberi kesan segar sepanjang hari.',

        'Saat musim hujan dengan udara lebih sejuk, ini saat yang tepat untuk aroma woody dan oriental yang lebih hangat seperti Noir Absolu atau Or Céleste — kelembapan udara justru membantu sillage aroma-aroma ini terasa lebih nyaman dan tidak menyengat.',

        'Untuk pemakaian kantor atau ruang ber-AC sepanjang hari, aroma unisex yang lembut seperti Musc Éternel atau Santal Blanc adalah pilihan aman yang tidak mengganggu rekan kerja namun tetap berkarakter.'

      ]
    },


    {
      id: 4,
      slug: 'cara-merawat-dan-menyimpan-parfum',
      category: 'Perawatan',
      title:
        'Cara Merawat dan Menyimpan Parfum agar Tetap Awet',
      excerpt:
        'Parfum premium sekalipun bisa rusak jika disimpan sembarangan. Ini cara menjaga kualitasnya.',
      date: '20 Juni 2026',
      readTime: '4 menit',
      icon: 'fa-box-archive',

      content: [

        'Parfum adalah campuran senyawa yang sensitif terhadap cahaya, suhu, dan udara. Penyimpanan yang salah bisa mengubah warna, aroma, bahkan mempercepat kerusakan formulanya.',

        'Simpan parfum di tempat sejuk, kering, dan jauh dari sinar matahari langsung — laci kamar atau lemari tertutup jauh lebih baik daripada meja rias dekat jendela.',

        'Hindari kamar mandi sebagai tempat penyimpanan meski praktis, karena kelembapan dan perubahan suhu akibat air panas dapat merusak molekul aroma lebih cepat.',

        'Selalu tutup rapat botol setelah pemakaian untuk meminimalkan oksidasi akibat kontak dengan udara, dan hindari mengocok botol parfum karena dapat memasukkan gelembung udara yang mempercepat oksidasi.',

        'Dengan penyimpanan yang tepat, parfum premium umumnya tetap dalam kondisi optimal selama 3-5 tahun sejak pertama kali dibuka.'

      ]
    },


    {
      id: 5,
      slug: 'mengenal-top-middle-base-notes',
      category: 'Panduan',
      title:
        'Mengenal Tingkatan Aroma: Top, Middle, dan Base Notes',
      excerpt:
        'Kenapa wangi parfum berubah dari jam ke jam? Jawabannya ada di struktur piramida aroma.',
      date: '10 Juni 2026',
      readTime: '5 menit',
      icon: 'fa-layer-group',

      content: [

        'Setiap parfum berkualitas dibangun dari tiga lapisan aroma yang disebut piramida notes — top, middle, dan base — yang muncul dan menghilang secara bertahap seiring waktu pemakaian.',

        'Top notes adalah kesan pertama yang tercium 5-15 menit pertama, biasanya berupa citrus atau herbal yang ringan dan menguap cepat, berfungsi menarik perhatian di awal.',

        'Middle notes, atau "heart notes", muncul setelah top notes memudar dan bertahan 20 menit hingga beberapa jam. Notes ini adalah karakter utama parfum, umumnya floral atau spicy.',

        'Base notes adalah fondasi yang muncul paling lama, biasanya woody, musky, atau amber, dan bisa bertahan hingga 6-10 jam bahkan lebih. Base notes inilah yang menentukan kesan akhir dan daya tahan sebuah parfum di kulit Anda.'

      ]
    },


    {
      id: 6,
      slug: 'parfum-pria-wanita-unisex-apa-bedanya',
      category: 'Panduan',
      title:
        'Parfum Pria vs Wanita vs Unisex: Apa Bedanya?',
      excerpt:
        'Label gender pada parfum sebenarnya soal konvensi pemasaran, bukan aturan baku. Ini penjelasannya.',
      date: '2 Juni 2026',
      readTime: '4 menit',
      icon: 'fa-people-arrows',

      content: [

        'Secara kimiawi, tidak ada molekul aroma yang secara inheren "milik" pria atau wanita. Label gender pada parfum lebih banyak dibentuk oleh konvensi pemasaran dan asosiasi budaya selama puluhan tahun.',

        'Parfum "maskulin" umumnya diformulasikan dengan basis woody, spicy, atau aquatic yang tegas, sementara parfum "feminin" cenderung mengandalkan floral dan fruity yang lembut. Namun ini bukan aturan mutlak.',

        'Parfum unisex dirancang dengan keseimbangan notes yang netral — sering berbasis musk, amber, atau woody lembut — sehingga nyaman dipakai siapa saja tanpa terasa terlalu maskulin atau feminin.',

        'Pada akhirnya, pilihan terbaik adalah aroma yang membuatmu nyaman dan percaya diri, terlepas dari label kategori di kemasannya.'

      ]
    }

  ]

};


/* =========================================================================
   QUERY HELPERS
   ========================================================================= */

NAC_DATA.getProduct = (id) => {

  return NAC_DATA.products.find(
    p => p.id === Number(id)
  );

};


NAC_DATA.getProductBySlug = (slug) => {

  return NAC_DATA.products.find(
    p => p.slug === slug
  );

};


NAC_DATA.getArticle = (slug) => {

  return NAC_DATA.articles.find(
    article => article.slug === slug
  );

};


NAC_DATA.getRelated = (
  product,
  limit = 4
) => {

  if (!product) {
    return [];
  }

  return NAC_DATA.products
    .filter(
      p =>
        p.category === product.category &&
        p.id !== product.id
    )
    .slice(0, limit);

};


/* =========================================================================
   PRICE FORMATTER
   ========================================================================= */

NAC_DATA.formatIDR = (value) => {

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 'Rp 0';
  }

  return 'Rp ' + number.toLocaleString('id-ID');

};


/* =========================================================================
   API PRODUCT MAPPER
   ========================================================================= */

function mapApiProduct(p) {

  /* -----------------------------------------------------------------------
     CATEGORY
     ----------------------------------------------------------------------- */

  let category = 'unisex';

  switch (Number(p.category_id)) {

    case 1:
      category = 'men';
      break;

    case 2:
      category = 'women';
      break;

    case 3:
      category = 'unisex';
      break;

  }


  /* -----------------------------------------------------------------------
     PRICE
     ----------------------------------------------------------------------- */

  const originalPrice = Number(p.price || 0);

  const hasDiscount =
    p.discount_price !== null &&
    p.discount_price !== undefined &&
    p.discount_price !== '';

  const discountPrice =
    hasDiscount
      ? Number(p.discount_price)
      : null;

  const finalPrice =
    discountPrice !== null
      ? discountPrice
      : originalPrice;


  /* -----------------------------------------------------------------------
     IMAGE
     ----------------------------------------------------------------------- */

  let image = p.main_image || '';

  if (
    image &&
    !image.startsWith('http://') &&
    !image.startsWith('https://')
  ) {

    image =
      API_SERVER_URL +
      '/' +
      image.replace(/^\/+/, '');

  }


  /* -----------------------------------------------------------------------
     PRODUCT OBJECT
     ----------------------------------------------------------------------- */

  return {

    id: Number(p.id),

    slug: p.slug || '',

    name:
      p.name ||
      'Unnamed Product',

    category,

    price: finalPrice,

    oldPrice:
      discountPrice !== null
        ? originalPrice
        : null,

    rating:
      Number(p.rating || 0),

    reviewCount:
      Number(p.review_count || 0),

    stock:
      Number(p.stock || 0),

    volume_ml:
      Number(p.volume_ml || 50),


    /* Visual fallback */

    color:
      p.color ||
      '#3D2817',

    cap:
      p.cap ||
      '#D4AF37',

    shape:
      p.shape ||
      'classic',


    /* Flags */

    isFlashSale:
      Boolean(Number(p.is_flash_sale)),

    isNew:
      Boolean(Number(p.is_new)),

    isBestSeller:
      Boolean(Number(p.is_best_seller)),

    isActive:
      Boolean(Number(p.is_active)),


    /* Descriptions */

    shortDesc:
      p.short_description ||
      '',

    fullDesc:
      p.description ||
      '',


    /* Product performance */

    longevity:
      p.longevity ||
      '',

    sillage:
      p.sillage ||
      '',


    /* Volume */

    volumes: [

      {
        ml:
          Number(p.volume_ml || 50),

        price:
          finalPrice
      }

    ],


    /* Image */

    image,

    /*
     * Alias untuk kompatibilitas dengan halaman
     * yang mungkin menggunakan mainImage.
     */

    mainImage: image

  };

}


/* =========================================================================
   LOAD PRODUCTS FROM API
   ========================================================================= */

let productsLoading = false;
let productsLoaded = false;


async function loadProductsFromAPI() {

  /* -----------------------------------------------------------------------
     Jangan request dua kali bersamaan
     ----------------------------------------------------------------------- */

  if (productsLoading) {

    console.warn(
      '⚠️ Products API sedang dimuat. Request kedua dilewati.'
    );

    return NAC_DATA.products;

  }


  /* -----------------------------------------------------------------------
     Jangan load ulang jika sudah berhasil
     ----------------------------------------------------------------------- */

  if (productsLoaded) {

    console.log(
      'ℹ️ Produk sudah pernah dimuat dari API.'
    );

    return NAC_DATA.products;

  }


  productsLoading = true;


  try {

    console.log(
      '🔄 Mengambil produk dari:',
      `${API_BASE_URL}/products`
    );


    /* ---------------------------------------------------------------------
       FETCH
       --------------------------------------------------------------------- */

    const response =
      await fetch(
        `${API_BASE_URL}/products`,
        {
          method: 'GET',

          headers: {
            'Accept': 'application/json'
          },

          cache: 'no-store'
        }
      );


    /* ---------------------------------------------------------------------
       HTTP ERROR
       --------------------------------------------------------------------- */

    if (!response.ok) {

      throw new Error(
        `API Error ${response.status}: ${response.statusText}`
      );

    }


    /* ---------------------------------------------------------------------
       JSON
       --------------------------------------------------------------------- */

    const result =
      await response.json();


    console.log(
      '📦 Response API:',
      result
    );


    /* ---------------------------------------------------------------------
       VALIDATION
       --------------------------------------------------------------------- */

    if (
      !result ||
      result.success !== true ||
      !Array.isArray(result.data)
    ) {

      throw new Error(
        'Format response API tidak valid. Response harus memiliki success:true dan data[].'
      );

    }


    /* ---------------------------------------------------------------------
       MAP PRODUCTS
       --------------------------------------------------------------------- */

    NAC_DATA.products =
      result.data.map(
        mapApiProduct
      );


    productsLoaded = true;


    /* ---------------------------------------------------------------------
       LOG
       --------------------------------------------------------------------- */

    console.log(
      `✅ ${NAC_DATA.products.length} produk berhasil dimuat dari database.`
    );


    console.table(

      NAC_DATA.products.map(
        product => ({

          id:
            product.id,

          name:
            product.name,

          category:
            product.category,

          price:
            product.price,

          oldPrice:
            product.oldPrice,

          stock:
            product.stock

        })
      )

    );


    /* ---------------------------------------------------------------------
       EVENT
       --------------------------------------------------------------------- */

    document.dispatchEvent(
      new CustomEvent(
        'productsLoaded',
        {
          detail: {
            products:
              NAC_DATA.products
          }
        }
      )
    );


    return NAC_DATA.products;


  } catch (error) {

    console.error(
      '❌ Gagal mengambil produk dari API:',
      error
    );


    /*
     * Produk tetap berupa [].
     *
     * Karena sekarang kita sudah memakai database sebagai sumber utama,
     * kita TIDAK menghidupkan kembali mock product lama.
     */

    NAC_DATA.products = [];


    document.dispatchEvent(
      new CustomEvent(
        'productsLoaded',
        {
          detail: {
            products: []
          }
        }
      )
    );


    return [];


  } finally {

    productsLoading = false;

  }

}


/* =========================================================================
   START API LOAD
   ========================================================================= */

window.NAC_PRODUCTS_READY = loadProductsFromAPI();