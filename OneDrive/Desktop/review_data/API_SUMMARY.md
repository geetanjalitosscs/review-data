# Review Data API - Quick Reference

## 🚀 API Endpoints Summary

**Base URL:** `http://localhost:3000` (or your deployed URL)

### 1. Get All Reviews
```
GET /api/reviews
```
**Query Parameters:**
- `rating` - Filter by rating (1-5)
- `product` - Filter by product name
- `name` - Filter by reviewer name
- `dateFrom` - Filter from date (YYYY-MM-DD)
- `dateTo` - Filter to date (YYYY-MM-DD)
- `sort` - Sort field (id, name, rating, date, product)
- `order` - Sort order (asc, desc)
- `page` - Page number
- `limit` - Results per page

**Examples:**
- `GET /api/reviews`
- `GET /api/reviews?rating=5`
- `GET /api/reviews?product=Product%20A`
- `GET /api/reviews?sort=date&order=desc`
- `GET /api/reviews?page=1&limit=10`

---

### 2. Get Review by ID
```
GET /api/reviews/:id
```
**Example:**
- `GET /api/reviews/1`

---

### 3. Get Statistics
```
GET /api/stats
```
Returns: total reviews, average rating, rating distribution, product count

---

### 4. Get All Products
```
GET /api/products
```
Returns: Array of unique product names

---

### 5. API Information
```
GET /
```
Returns: API version and available endpoints

---

## 📝 Response Format

**Success Response:**
```json
{
  "success": true,
  "status": 200,
  "data": [...]
}
```

**Error Response:**
```json
{
  "success": false,
  "status": 404,
  "error": true,
  "message": "Error message"
}
```

---

## 🔧 Setup Commands

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode (with auto-reload)
npm run dev
```

---

## 🌐 Testing

### Using Browser
Open `client.html` in your browser

### Using cURL
```bash
curl http://localhost:3000/api/reviews
curl http://localhost:3000/api/reviews/1
curl http://localhost:3000/api/stats
```

### Using JavaScript
```javascript
fetch('http://localhost:3000/api/reviews')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 📦 Deployment

- **Heroku:** Push to Heroku (Procfile included)
- **Vercel:** `vercel` command
- **Railway:** Connect GitHub repo
- **Any Node.js host:** Deploy `server.js`

---

## 📚 Full Documentation

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for complete documentation.

