# RouteMate Backend

## Setup

1.  **Install Dependencies**
    ```bash
    cd server
    npm install
    ```

2.  **Environment Variables**
    Ensure `.env` exists in `server/` with your local PostgreSQL credentials.

3.  **Initialize Database Schema**
    ```bash
    npx prisma db push
    ```

4.  **Run Server**
    ```bash
    npm run dev
    ```

## Verification
To check if the server is running correctly:

1.  **Health Check Endpoint**:
    Open [http://localhost:5000/health](http://localhost:5000/health) in your browser.
    You should see: `{"status":"ok","uptime":...}`

2.  **API Status**:
    The API is listening on `http://localhost:5000/api`.

## Structure
- `src/config`: Configuration
- `src/controllers`: Request handlers
- `src/middleware`: Middleware (Auth, Error)
- `src/models`: Prisma schema
- `src/routes`: API definitions
- `src/services`: Business logic
