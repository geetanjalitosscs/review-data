const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load reviews data
let reviewsData = null;

async function loadReviews() {
    if (!reviewsData) {
        try {
            const data = await fs.readFile(path.join(__dirname, '..', 'reviews.json'), 'utf8');
            reviewsData = JSON.parse(data).reviews;
            console.log(`Loaded ${reviewsData.length} reviews`);
        } catch (error) {
            console.error('Error loading reviews:', error);
            reviewsData = [];
        }
    }
    return reviewsData;
}

// Initialize reviews on first load
loadReviews();

// GET /api/reviews - Get all reviews with optional filters
app.get('/api/reviews', async (req, res) => {
    await loadReviews();
    let reviews = [...reviewsData];
    
    // Filter by rating
    if (req.query.rating) {
        const rating = parseInt(req.query.rating);
        reviews = reviews.filter(r => r.rating === rating);
    }
    
    // Filter by product
    if (req.query.product) {
        reviews = reviews.filter(r => 
            r.product.toLowerCase().includes(req.query.product.toLowerCase())
        );
    }
    
    // Filter by name
    if (req.query.name) {
        reviews = reviews.filter(r => 
            r.name.toLowerCase().includes(req.query.name.toLowerCase())
        );
    }
    
    // Filter by date range
    if (req.query.dateFrom) {
        reviews = reviews.filter(r => r.date >= req.query.dateFrom);
    }
    if (req.query.dateTo) {
        reviews = reviews.filter(r => r.date <= req.query.dateTo);
    }
    
    // Sort
    if (req.query.sort) {
        const sortField = req.query.sort;
        const order = req.query.order === 'desc' ? -1 : 1;
        reviews.sort((a, b) => {
            if (a[sortField] < b[sortField]) return -1 * order;
            if (a[sortField] > b[sortField]) return 1 * order;
            return 0;
        });
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || reviews.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedReviews = reviews.slice(start, end);
    
    res.json({
        success: true,
        status: 200,
        data: paginatedReviews,
        pagination: {
            page: page,
            limit: limit,
            total: reviews.length,
            totalPages: Math.ceil(reviews.length / limit)
        },
        filters: req.query
    });
});

// GET /api/reviews/:id - Get review by ID
app.get('/api/reviews/:id', async (req, res) => {
    await loadReviews();
    const id = parseInt(req.params.id);
    const review = reviewsData.find(r => r.id === id);
    
    if (!review) {
        return res.status(404).json({
            success: false,
            status: 404,
            error: true,
            message: `Review with ID ${id} not found`
        });
    }
    
    res.json({
        success: true,
        status: 200,
        data: review
    });
});

// GET /api/stats - Get statistics
app.get('/api/stats', async (req, res) => {
    await loadReviews();
    const total = reviewsData.length;
    const avgRating = reviewsData.reduce((sum, r) => sum + r.rating, 0) / total;
    
    const ratingDistribution = {};
    reviewsData.forEach(r => {
        ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
    });
    
    const productCount = {};
    reviewsData.forEach(r => {
        productCount[r.product] = (productCount[r.product] || 0) + 1;
    });
    
    res.json({
        success: true,
        status: 200,
        data: {
            totalReviews: total,
            averageRating: parseFloat(avgRating.toFixed(2)),
            ratingDistribution: ratingDistribution,
            productCount: productCount,
            fiveStarReviews: ratingDistribution[5] || 0,
            oneStarReviews: ratingDistribution[1] || 0
        }
    });
});

// GET /api/products - Get all unique products
app.get('/api/products', async (req, res) => {
    await loadReviews();
    const products = [...new Set(reviewsData.map(r => r.product))];
    
    res.json({
        success: true,
        status: 200,
        data: products.sort()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Review Data API',
        version: '1.0.0',
        endpoints: {
            'GET /api/reviews': 'Get all reviews with optional filters',
            'GET /api/reviews/:id': 'Get review by ID',
            'GET /api/stats': 'Get statistics about reviews',
            'GET /api/products': 'Get all unique products'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        status: 404,
        error: true,
        message: 'Endpoint not found',
        path: req.path
    });
});

// Export the Express app as a serverless function
module.exports = app;

