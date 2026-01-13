# Review Data API

A simple REST API-like interface using HTML and JavaScript that serves 50 review data entries from a JSON file. This can be hosted on GitHub Pages.

## Features

- 📊 50 review entries with ratings, comments, dates, and product information
- 🔄 Multiple REST API endpoints for accessing review data
- 🔍 Filtering and querying capabilities (by rating, product, name, date)
- 📱 Responsive design with modern UI
- 📄 JSON data view toggle
- 📈 Statistics dashboard (total reviews, average rating, 5-star count)
- 🧪 Built-in API testing interface
- 🌐 GitHub Pages compatible

## How to Use

### Local Development

1. Clone or download this repository
2. Open `index.html` in a web browser
3. The page will automatically fetch and display the reviews

### GitHub Pages Hosting

1. Push this repository to GitHub
2. Go to your repository settings
3. Navigate to "Pages" section
4. Select the branch (usually `main` or `master`)
5. Save the settings
6. Your site will be available at: `https://yourusername.github.io/repository-name/`

## API Endpoints

The API provides multiple HTTP-accessible endpoints that work in Postman, curl, and any HTTP client.

### HTTP Endpoints (Postman Ready)

All endpoints are accessible via HTTP GET requests. After hosting on GitHub Pages, use the full URL:

**Base URL:** `https://yourusername.github.io/repository-name/`

#### 1. **GET** `api/reviews.html`
Get all reviews with optional filters.

**Query Parameters:**
- `rating` - Filter by rating (1-5)
- `product` - Filter by product name (partial match)
- `name` - Filter by reviewer name (partial match)
- `dateFrom` - Filter reviews from this date (YYYY-MM-DD)
- `dateTo` - Filter reviews until this date (YYYY-MM-DD)
- `sort` - Sort by field (id, name, rating, date, product)
- `order` - Sort order (asc or desc)
- `page` - Page number for pagination
- `limit` - Number of results per page

**HTTP Examples (Postman/curl):**

```bash
# Get all reviews
GET https://yourusername.github.io/repo-name/api/reviews.html

# Get 5-star reviews only
GET https://yourusername.github.io/repo-name/api/reviews.html?rating=5

# Get reviews for a specific product
GET https://yourusername.github.io/repo-name/api/reviews.html?product=Product%20A

# Get reviews sorted by date (newest first)
GET https://yourusername.github.io/repo-name/api/reviews.html?sort=date&order=desc

# Paginated results
GET https://yourusername.github.io/repo-name/api/reviews.html?page=1&limit=10

# Using curl
curl "https://yourusername.github.io/repo-name/api/reviews.html?rating=5"
```

**JavaScript Examples:**
```javascript
// Get all reviews
const result = await ReviewAPI.call('api/reviews.html');

// Get 5-star reviews only
const result = await ReviewAPI.call('api/reviews.html?rating=5');
```

**Response:**
```json
{
  "success": true,
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "John Smith",
      "rating": 5,
      "comment": "Excellent product!",
      "date": "2024-01-15",
      "product": "Product A"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### 2. **GET** `api/reviews/:id`
Get a specific review by ID.

**HTTP Examples:**
```bash
# Get review with ID 1
GET https://yourusername.github.io/repo-name/api/reviews/1

# Using curl
curl "https://yourusername.github.io/repo-name/api/reviews/1"
```

**JavaScript Example:**
```javascript
const result = await ReviewAPI.call('api/reviews/1');
```

**Response:**
```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": 1,
    "name": "John Smith",
    "rating": 5,
    "comment": "Excellent product!",
    "date": "2024-01-15",
    "product": "Product A"
  }
}
```

#### 3. **GET** `api/stats.html`
Get statistics about all reviews.

**HTTP Examples:**
```bash
GET https://yourusername.github.io/repo-name/api/stats.html

# Using curl
curl "https://yourusername.github.io/repo-name/api/stats.html"
```

**JavaScript Example:**
```javascript
const result = await ReviewAPI.call('api/stats.html');
```

**Response:**
```json
{
  "success": true,
  "status": 200,
  "data": {
    "totalReviews": 50,
    "averageRating": 4.2,
    "ratingDistribution": {
      "1": 2,
      "2": 3,
      "3": 8,
      "4": 15,
      "5": 22
    },
    "productCount": {
      "Product A": 10,
      "Product B": 8
    },
    "fiveStarReviews": 22,
    "oneStarReviews": 2
  }
}
```

#### 4. **GET** `api/products.html`
Get list of all unique products.

**HTTP Examples:**
```bash
GET https://yourusername.github.io/repo-name/api/products.html

# Using curl
curl "https://yourusername.github.io/repo-name/api/products.html"
```

**JavaScript Example:**
```javascript
const result = await ReviewAPI.call('api/products.html');
```

**Response:**
```json
{
  "success": true,
  "status": 200,
  "data": ["Product A", "Product B", "Product C", ...]
}
```

## Using the API in Postman

1. **Set up your request:**
   - Method: `GET`
   - URL: `https://yourusername.github.io/repo-name/api/reviews.html`
   
2. **Add query parameters (optional):**
   - Go to "Params" tab
   - Add parameters like `rating=5`, `sort=date`, `order=desc`, etc.

3. **Send the request:**
   - Click "Send"
   - The response will be JSON (may be wrapped in HTML tags, but JSON is extractable)

4. **Example Postman requests:**
   - `GET /api/reviews.html` - All reviews
   - `GET /api/reviews.html?rating=5` - 5-star reviews only
   - `GET /api/reviews/1` - Review with ID 1
   - `GET /api/stats.html` - Statistics
   - `GET /api/products.html` - All products

## Usage Examples

### Using the ReviewAPI Object (JavaScript)

The easiest way to use the API in JavaScript is through the `ReviewAPI` object:

```javascript
// Get all reviews
const result = await ReviewAPI.getAllReviews();
console.log(result.data);

// Get review by ID
const review = await ReviewAPI.getReviewById(1);
console.log(review.data);

// Get statistics
const stats = await ReviewAPI.getStats();
console.log(stats.data);

// Get all products
const products = await ReviewAPI.getProducts();
console.log(products.data);

// Get reviews by rating
const fiveStar = await ReviewAPI.getReviewsByRating(5);
console.log(fiveStar.data);

// Get reviews by product
const productReviews = await ReviewAPI.getReviewsByProduct('Product A');
console.log(productReviews.data);
```

### Using the Generic API Call Method

For more control, use the `call` method:

```javascript
// Get all reviews with filters
const result = await ReviewAPI.call('api/reviews?rating=5&sort=date&order=desc');

// Get specific review
const review = await ReviewAPI.call('api/reviews/1');

// Get statistics
const stats = await ReviewAPI.call('api/stats');
```

### Using from Browser Console

Open the browser console and use:

```javascript
// Initialize API (loads data)
await ReviewAPI.init();

// Then use any endpoint
const reviews = await ReviewAPI.getAllReviews();
console.log(reviews);
```

### Direct JSON Access (Legacy)

You can still access the raw JSON file directly:

```javascript
fetch('reviews.json')
  .then(response => response.json())
  .then(data => {
    console.log(data.reviews);
  });
```

## File Structure

```
review_data/
├── index.html          # Main HTML page with API interface
├── api.js              # API router and endpoint handlers (JavaScript)
├── sw.js               # Service worker for proper JSON responses
├── 404.html            # Handles dynamic routes like /api/reviews/:id
├── reviews.json        # JSON data file with 50 reviews
├── api/
│   ├── reviews.html    # HTTP endpoint for all reviews
│   ├── stats.html      # HTTP endpoint for statistics
│   └── products.html   # HTTP endpoint for products list
└── README.md           # This file
```

## Notes

- This is a static site solution that works on GitHub Pages
- Endpoints return JSON (may be wrapped in HTML for browser display, but JSON is accessible)
- The service worker (`sw.js`) intercepts API requests and returns proper JSON with correct headers
- All data is client-side only (no server required)
- CORS is handled automatically by GitHub Pages
- The API is available globally through the `ReviewAPI` object when the page is loaded
- For Postman: The endpoints work via HTTP GET requests. Response may contain HTML tags, but the JSON data is present and extractable
- For production use with proper JSON responses, consider using a service like Netlify or Vercel that supports serverless functions

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- Fetch API
- CSS Grid and Flexbox

