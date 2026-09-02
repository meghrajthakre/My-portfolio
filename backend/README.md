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
```

Multiple frontend URLs can be comma-separated in `CLIENT_URL`.

## API

- `GET /` - welcome message
- `GET /api/health` - backend and database health
- `POST /api/messages` - save a contact message

Example request body:

```json
{
  "name": "Visitor Name",
  "phone": "+91 9876543210",
  "email": "visitor@example.com",
  "message": "Hello from your portfolio!"
}
```
