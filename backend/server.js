const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'nac_perfume',
    port: 3306
});

// TEST SERVER
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'NAC Perfume API aktif'
    });
});

// GET PRODUCTS
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                id,
                category_id,
                name,
                slug,
                short_description,
                description,
                price,
                discount_price,
                stock,
                volume_ml,
                rating,
                review_count,
                longevity,
                is_flash_sale,
                is_new,
                is_best_seller,
                is_active,
                main_image
            FROM products
            WHERE is_active = 1
            ORDER BY id ASC
        `);

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Gagal mengambil produk',
            error: error.message
        });
    }
});

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`🚀 NAC Perfume API berjalan di http://localhost:${PORT}`);
});