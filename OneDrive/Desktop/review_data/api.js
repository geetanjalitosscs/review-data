// API Router for Review Data
// This simulates REST API endpoints using JavaScript

let reviewsCache = null;

// Initialize API by loading reviews data
async function initAPI() {
    if (!reviewsCache) {
        try {
            const response = await fetch('reviews.json');
            const data = await response.json();
            reviewsCache = data.reviews;
        } catch (error) {
            console.error('Failed to load reviews:', error);
            reviewsCache = [];
        }
    }
    return reviewsCache;
}

// API Router - handles different endpoints
async function apiRouter(path, queryParams = {}) {
    await initAPI();
    
    // Parse the path
    const pathParts = path.split('/').filter(p => p);
    
    // Route: /api/reviews
    if (pathParts.length === 2 && pathParts[0] === 'api' && pathParts[1] === 'reviews') {
        return handleGetReviews(queryParams);
    }
    
    // Route: /api/reviews/:id
    if (pathParts.length === 3 && pathParts[0] === 'api' && pathParts[1] === 'reviews') {
        const id = parseInt(pathParts[2]);
        return handleGetReviewById(id);
    }
    
    // Route: /api/stats
    if (pathParts.length === 2 && pathParts[0] === 'api' && pathParts[1] === 'stats') {
        return handleGetStats();
    }
    
    // Route: /api/products
    if (pathParts.length === 2 && pathParts[0] === 'api' && pathParts[1] === 'products') {
        return handleGetProducts();
    }
    
    // 404 - Route not found
    return {
        error: true,
        status: 404,
        message: 'Endpoint not found',
        path: path
    };
}

// GET /api/reviews - Get all reviews with optional filters
function handleGetReviews(queryParams) {
    let reviews = [...reviewsCache];
    
    // Filter by rating
    if (queryParams.rating) {
        const rating = parseInt(queryParams.rating);
        reviews = reviews.filter(r => r.rating === rating);
    }
    
    // Filter by product
    if (queryParams.product) {
        reviews = reviews.filter(r => 
            r.product.toLowerCase().includes(queryParams.product.toLowerCase())
        );
    }
    
    // Filter by name
    if (queryParams.name) {
        reviews = reviews.filter(r => 
            r.name.toLowerCase().includes(queryParams.name.toLowerCase())
        );
    }
    
    // Filter by date range
    if (queryParams.dateFrom) {
        reviews = reviews.filter(r => r.date >= queryParams.dateFrom);
    }
    if (queryParams.dateTo) {
        reviews = reviews.filter(r => r.date <= queryParams.dateTo);
    }
    
    // Sort
    if (queryParams.sort) {
        const sortField = queryParams.sort;
        const order = queryParams.order === 'desc' ? -1 : 1;
        reviews.sort((a, b) => {
            if (a[sortField] < b[sortField]) return -1 * order;
            if (a[sortField] > b[sortField]) return 1 * order;
            return 0;
        });
    }
    
    // Pagination
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || reviews.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedReviews = reviews.slice(start, end);
    
    return {
        success: true,
        status: 200,
        data: paginatedReviews,
        pagination: {
            page: page,
            limit: limit,
            total: reviews.length,
            totalPages: Math.ceil(reviews.length / limit)
        },
        filters: queryParams
    };
}

// GET /api/reviews/:id - Get review by ID
function handleGetReviewById(id) {
    const review = reviewsCache.find(r => r.id === id);
    
    if (!review) {
        return {
            error: true,
            status: 404,
            message: `Review with ID ${id} not found`
        };
    }
    
    return {
        success: true,
        status: 200,
        data: review
    };
}

// GET /api/stats - Get statistics
function handleGetStats() {
    const total = reviewsCache.length;
    const avgRating = reviewsCache.reduce((sum, r) => sum + r.rating, 0) / total;
    
    const ratingDistribution = {};
    reviewsCache.forEach(r => {
        ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
    });
    
    const productCount = {};
    reviewsCache.forEach(r => {
        productCount[r.product] = (productCount[r.product] || 0) + 1;
    });
    
    return {
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
    };
}

// GET /api/products - Get all unique products
function handleGetProducts() {
    const products = [...new Set(reviewsCache.map(r => r.product))];
    
    return {
        success: true,
        status: 200,
        data: products.sort()
    };
}

// Helper function to parse query string
function parseQueryString(queryString) {
    const params = {};
    if (!queryString) return params;
    
    queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
            params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
    });
    
    return params;
}

// Main API function - call this to access the API
async function callAPI(endpoint, options = {}) {
    const [path, queryString] = endpoint.split('?');
    const queryParams = parseQueryString(queryString);
    
    const result = await apiRouter(path, queryParams);
    
    // Simulate network delay for realism
    if (options.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay));
    }
    
    return result;
}

// Export API functions for use in HTML
window.ReviewAPI = {
    call: callAPI,
    router: apiRouter,
    init: initAPI,
    
    // Convenience methods
    getAllReviews: async (filters = {}) => {
        const queryString = new URLSearchParams(filters).toString();
        const endpoint = `api/reviews${queryString ? '?' + queryString : ''}`;
        return await callAPI(endpoint);
    },
    
    getReviewById: async (id) => {
        return await callAPI(`api/reviews/${id}`);
    },
    
    getStats: async () => {
        return await callAPI('api/stats');
    },
    
    getProducts: async () => {
        return await callAPI('api/products');
    },
    
    getReviewsByRating: async (rating) => {
        return await callAPI(`api/reviews?rating=${rating}`);
    },
    
    getReviewsByProduct: async (product) => {
        return await callAPI(`api/reviews?product=${encodeURIComponent(product)}`);
    }
};

