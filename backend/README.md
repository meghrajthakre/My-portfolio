# MT Portfolio Backend

Express API for saving portfolio contact messages in MongoDB.

## Setup

1. Install packages:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env`.
3. Put your MongoDB connection string in `MONGODB_URI`.
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
CLIENT_URL=http://localhost:5173
ANALYTICS_ADMIN_KEY=replace_with_a_long_random_secret
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_CONTRIBUTIONS_API_URL=https://github-contributions-api.jogruber.de/v4
```

Multiple frontend URLs can be comma-separated in `CLIENT_URL`.

## API

- `GET /` - welcome message
- `GET /api/health` - backend and database health
- `POST /api/messages` - save a contact message
- `GET /api/github/:username/contributions` - fetch and cache GitHub contribution activity
- `POST /api/visits/start` - start a visit or record another path for its session
- `POST /api/visits/end` - record visit end time and duration
- `GET /api/visits/summary` - public total visits and unique visitors for the portfolio UI
- `GET /api/visits/stats` - analytics totals; requires the `x-admin-key` header

Example request body:

```json
{
  "name": "Visitor Name",
  "phone": "+91 9876543210",
  "email": "visitor@example.com",
  "message": "Hello from your portfolio!"
}
```
