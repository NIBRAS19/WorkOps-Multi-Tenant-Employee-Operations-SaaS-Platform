# WorkOps Backend

Production-style MERN backend for the WorkOps Employee Operations SaaS.

## Stack

- Node.js + TypeScript
- Express 5
- MongoDB + Mongoose
- JWT access/refresh authentication
- HttpOnly refresh cookie
- RBAC + organization membership
- Zod validation
- Helmet, CORS and rate limiting
- Local document storage for development
- Pino request logging
- Seed script

## Run

1. Copy `.env.example` to `.env`.
2. Start MongoDB.
3. Install dependencies:

```bash
npm install
```

4. Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:4000`.

Seed a development workspace:

```bash
npm run seed
```

Seed credentials:

- Email: `admin@workops.local`
- Password: `Admin@12345`

## API

Base URL:

`/api/v1`

Health:

`GET /health`

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

Most application endpoints require a bearer access token.

For organization switching, an authenticated user can send:

`X-Organization-Id: <organizationId>`

The server verifies membership before changing tenant context.

## Security

All tenant-owned resources are scoped by `organizationId`.

The server checks:

1. authenticated user
2. active organization membership
3. role permissions
4. resource ownership/team scope where required

Never trust `organizationId` from request bodies.

## Documents

Development uploads use local disk:

`storage/uploads`

For production, replace the storage service with S3/R2/GCS or another private object store and keep access authorization in the API.

## Frontend integration

Set:

```env
VITE_API_URL=http://localhost:4000/api/v1
```

The frontend can use:

- `Authorization: Bearer <accessToken>`
- credentials included for refresh/logout cookie flows

