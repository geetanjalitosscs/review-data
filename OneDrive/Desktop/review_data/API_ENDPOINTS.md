# Review Data API - Endpoints Documentation

A Node.js REST API server that serves 50 review data entries with filtering, sorting, and pagination capabilities.

## Base URL

- **Local Development:** `http://localhost:3000`
- **Production:** `https://your-api-domain.com` (e.g., Heroku, Vercel, Railway)

## API Endpoints

### 1. GET `/api/reviews`

Get all reviews with optional filters, sorting, and pagination.

**Query Parameters:**
- `rating` (integer, 1-5) - Filter by rating
- `product` (string) - Filter by product name (partial match, case-insensitive)
- `name` (string) - Filter by reviewer name (partial match, case-insensitive)
- `dateFrom` (string, YYYY-MM-DD) - Filter reviews from this date
- `dateTo` (string, YYYY-MM-DD) - Filter reviews until this date
- `sort` (string) - Sort by field: `id`, `name`, `rating`, `date`, `product`
- `order` (string) - Sort order: `asc` or `desc` (default: `asc`)
- `page` (integer) - Page number for pagination (default: 1)
- `limit` (integer) - Number of results per page (default: all)

**Example Requests:**

```bash
# Get all reviews
GET http://localhost:3000/api/reviews

# Get 5-star reviews only
GET http://localhost:3000/api/reviews?rating=5

# Get reviews for a specific product
GET http://localhost:3000/api/reviews?product=Product%20A

# Get reviews sorted by date (newest first)
GET http://localhost:3000/api/reviews?sort=date&order=desc

# Paginated results (10 per page, page 2)
GET http://localhost:3000/api/reviews?page=2&limit=10

# Multiple filters
GET http://localhost:3000/api/reviews?rating=5&product=Product%20A&sort=date&order=desc
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
      "comment": "Excellent product! Highly recommend it to everyone.",
      "date": "2024-01-15",
      "product": "Product A"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "filters": {
    "rating": "5"
  }
}
```

---

### 2. GET `/api/reviews/:id`

Get a specific review by ID.

**Path Parameters:**
- `id` (integer) - Review ID (1-50)

**Example Request:**

```bash
GET http://localhost:3000/api/reviews/1
```

**Response (Success):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": 1,
    "name": "John Smith",
    "rating": 5,
    "comment": "Excellent product! Highly recommend it to everyone.",
    "date": "2024-01-15",
    "product": "Product A"
  }
}
```

**Response (Error - Not Found):**

```json
{
  "success": false,
  "status": 404,
  "error": true,
  "message": "Review with ID 999 not found"
}
```

---

### 3. GET `/api/stats`

Get statistics about all reviews.

**Example Request:**

```bash
GET http://localhost:3000/api/stats
```

**Response:**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "totalReviews": 50,
    "averageRating": 4.12,
    "ratingDistribution": {
      "1": 0,
      "2": 3,
      "3": 8,
      "4": 15,
      "5": 24
    },
    "productCount": {
      "Product A": 4,
      "Product B": 3,
      "Product C": 3
    },
    "fiveStarReviews": 24,
    "oneStarReviews": 0
  }
}
```

---

### 4. GET `/api/products`

Get all unique products.

**Example Request:**

```bash
GET http://localhost:3000/api/products
```

**Response:**

```json
{
  "success": true,
  "status": 200,
  "data": [
    "Product A",
    "Product B",
    "Product C"
  ]
}
```

---

### 5. GET `/`

Root endpoint that returns API information.

**Example Request:**

```bash
GET http://localhost:3000/
```

**Response:**

```json
{
  "success": true,
  "message": "Review Data API",
  "version": "1.0.0",
  "endpoints": {
    "GET /api/reviews": "Get all reviews with optional filters",
    "GET /api/reviews/:id": "Get review by ID",
    "GET /api/stats": "Get statistics about reviews",
    "GET /api/products": "Get all unique products"
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "status": 404,
  "error": true,
  "message": "Error message here",
  "path": "/api/invalid"
}
```

**HTTP Status Codes:**
- `200` - Success
- `404` - Not Found
- `500` - Server Error

---

## Usage Examples

### Using cURL

```bash
# Get all reviews
curl http://localhost:3000/api/reviews

# Get 5-star reviews
curl "http://localhost:3000/api/reviews?rating=5"

# Get review by ID
curl http://localhost:3000/api/reviews/1

# Get statistics
curl http://localhost:3000/api/stats
```

### Using JavaScript (Fetch API)

```javascript
// Get all reviews
const response = await fetch('http://localhost:3000/api/reviews');
const data = await response.json();
console.log(data);

// Get review by ID
const review = await fetch('http://localhost:3000/api/reviews/1');
const reviewData = await review.json();
console.log(reviewData);

// Get filtered reviews
const filtered = await fetch('http://localhost:3000/api/reviews?rating=5&sort=date&order=desc');
const filteredData = await filtered.json();
console.log(filteredData);
```

### Using Postman

1. Create a new GET request
2. Enter the endpoint URL: `http://localhost:3000/api/reviews`
3. Add query parameters in the "Params" tab if needed
4. Send the request

---

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Development mode (with auto-reload):**
   ```bash
   npm run dev
   ```

4. **Server will run on:** `http://localhost:3000`

---

## Deployment

### Heroku

1. Create a `Procfile`:
   ```
   web: node server.js
   ```

2. Deploy:
   ```bash
   git push heroku main
   ```

### Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Railway

1. Connect your GitHub repository
2. Railway will auto-detect Node.js and deploy

---

## CORS

CORS is enabled for all origins, allowing the API to be accessed from any domain.

---

## Data Structure

Each review object contains:

```json
{
  "id": 1,
  "name": "John Smith",
  "rating": 5,
  "comment": "Excellent product!",
  "date": "2024-01-15",
  "product": "Product A"
}
```

- `id`: Unique identifier (1-50)
- `name`: Reviewer's name
- `rating`: Rating from 1 to 5
- `comment`: Review comment
- `date`: Review date (YYYY-MM-DD format)
- `product`: Product name

