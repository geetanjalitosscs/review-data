// Service Worker to handle API requests and return proper JSON
// This makes the API work properly in Postman and other HTTP clients

const CACHE_NAME = 'review-api-v1';

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Only handle API requests
    if (url.pathname.startsWith('/api/') || url.pathname.includes('/api/')) {
        event.respondWith(handleAPIRequest(event.request));
    }
});

async function handleAPIRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    try {
        // Load reviews data
        const reviewsResponse = await fetch('/reviews.json');
        const reviewsData = await reviewsResponse.json();
        const reviews = reviewsData.reviews;
        
        // Handle /api/reviews
        if (path.includes('/api/reviews.html') || path.endsWith('/api/reviews')) {
            return handleReviewsEndpoint(reviews, url.searchParams);
        }
        
        // Handle /api/reviews/:id
        const idMatch = path.match(/\/api\/reviews\/(\d+)/);
        if (idMatch) {
            const id = parseInt(idMatch[1]);
            const review = reviews.find(r => r.id === id);
            
            if (!review) {
                return new Response(JSON.stringify({
                    error: true,
                    status: 404,
                    message: `Review with ID ${id} not found`
                }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            return new Response(JSON.stringify({
                success: true,
                status: 200,
                data: review
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Handle /api/stats
        if (path.includes('/api/stats.html') || path.endsWith('/api/stats')) {
            return handleStatsEndpoint(reviews);
        }
        
        // Handle /api/products
        if (path.includes('/api/products.html') || path.endsWith('/api/products')) {
            return handleProductsEndpoint(reviews);
        }
        
        // 404
        return new Response(JSON.stringify({
            error: true,
            status: 404,
            message: 'Endpoint not found',
            path: path
        }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            error: true,
            status: 500,
            message: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

function handleReviewsEndpoint(reviews, params) {
    let filtered = [...reviews];
    
    // Apply filters
    if (params.get('rating')) {
        filtered = filtered.filter(r => r.rating === parseInt(params.get('rating')));
    }
    if (params.get('product')) {
        filtered = filtered.filter(r => 
            r.product.toLowerCase().includes(params.get('product').toLowerCase())
        );
    }
    if (params.get('name')) {
        filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(params.get('name').toLowerCase())
        );
    }
    if (params.get('dateFrom')) {
        filtered = filtered.filter(r => r.date >= params.get('dateFrom'));
    }
    if (params.get('dateTo')) {
        filtered = filtered.filter(r => r.date <= params.get('dateTo'));
    }
    
    // Sort
    if (params.get('sort')) {
        const sort = params.get('sort');
        const order = params.get('order') || 'asc';
        const multiplier = order === 'desc' ? -1 : 1;
        filtered.sort((a, b) => {
            if (a[sort] < b[sort]) return -1 * multiplier;
            if (a[sort] > b[sort]) return 1 * multiplier;
            return 0;
        });
    }
    
    // Pagination
    const page = parseInt(params.get('page')) || 1;
    const limit = parseInt(params.get('limit')) || filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const result = {
        success: true,
        status: 200,
        data: filtered.slice(start, end),
        pagination: {
            page: page,
            limit: limit,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / limit)
        }
    };
    
    return new Response(JSON.stringify(result, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

function handleStatsEndpoint(reviews) {
    const total = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
    
    const ratingDistribution = {};
    reviews.forEach(r => {
        ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
    });
    
    const productCount = {};
    reviews.forEach(r => {
        productCount[r.product] = (productCount[r.product] || 0) + 1;
    });
    
    const result = {
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
    
    return new Response(JSON.stringify(result, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

function handleProductsEndpoint(reviews) {
    const products = [...new Set(reviews.map(r => r.product))];
    
    const result = {
        success: true,
        status: 200,
        data: products.sort()
    };
    
    return new Response(JSON.stringify(result, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

