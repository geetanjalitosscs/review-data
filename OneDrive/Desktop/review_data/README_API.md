# Review Data REST API

A Node.js REST API server that serves 50 review data entries with filtering, sorting, and pagination capabilities. This can be hosted on platforms like Heroku, Vercel, Railway, or any Node.js hosting service.

## Features

- ✅ RESTful API endpoints
- ✅ 50 review data entries
- ✅ Filtering by rating, product, name, date range
- ✅ Sorting and pagination
- ✅ Statistics endpoint
- ✅ CORS enabled
- ✅ Error handling
- ✅ Ready for GitHub deployment

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

### 3. Test the API

Open `client.html` in your browser or use:

```bash
curl http://localhost:3000/api/reviews
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews` | Get all reviews (with filters) |
| GET | `/api/reviews/:id` | Get review by ID |
| GET | `/api/stats` | Get statistics |
| GET | `/api/products` | Get all products |
| GET | `/` | API information |

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for detailed documentation.

## Example Usage

### Get All Reviews
```bash
GET http://localhost:3000/api/reviews
```

### Get 5-Star Reviews
```bash
GET http://localhost:3000/api/reviews?rating=5
```

### Get Review by ID
```bash
GET http://localhost:3000/api/reviews/1
```

### Get Statistics
```bash
GET http://localhost:3000/api/stats
```

## Frontend Client

Open `client.html` in your browser to use the interactive API client. You can:
- Fetch all reviews
- Get reviews by ID
- View statistics
- Filter reviews
- Test all endpoints

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

### GitHub Pages (Frontend Only)

The `client.html` can be hosted on GitHub Pages, but you'll need to update the API URL to point to your deployed backend.

## Project Structure

```
review_data/
├── server.js              # Node.js Express server
├── package.json           # Dependencies
├── reviews.json           # Review data (50 entries)
├── client.html            # Frontend client
├── API_ENDPOINTS.md       # Detailed API documentation
└── README_API.md          # This file
```

## Dependencies

- **express**: Web framework for Node.js
- **cors**: Enable CORS for cross-origin requests

## Development

For development with auto-reload:

```bash
npm run dev
```

(Requires `nodemon` - install with `npm install --save-dev nodemon`)

## License

MIT

