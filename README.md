# Advanced Backend

![Node Version](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)

A Node.js/Express backend API for user management, authentication, and subscription workflows.

## Features

- User registration, authentication (JWT), and management
- Subscription CRUD, cancellation, and renewal tracking
- Email notifications (via workflow)
- MongoDB (Mongoose) integration
- Modular structure with controllers, models, routes, and middlewares

## Getting Started

## Quick Start Example

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/sign-up -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/sign-in -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'

# Get all users (requires Bearer token)
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/v1/users/
```

## Authentication

This API uses JWT for authentication. After logging in, include the token in the `Authorization` header:

```
Authorization: Bearer <your_token_here>
```

Some endpoints require authentication (see API tables above).

## Error Handling

All errors are returned in JSON format:

```
{
	"success": false,
	"message": "Error message here",
	"error": "Optional error details"
}
```

Common status codes: 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)

## Environment Variables Reference

| Variable               | Description                      |
| ---------------------- | -------------------------------- |
| PORT                   | Server port                      |
| DB_URI                 | MongoDB connection string        |
| JWT_SECRET             | JWT signing secret               |
| JWT_EXPIRES_IN         | JWT expiration (e.g. 1d, 7d)     |
| SERVER_URL             | Base URL for server              |
| EMAIL_PASSWORD         | Password for email notifications |
| ARCJET_KEY, ARCJET_ENV | Arcjet configuration             |
| QSTASH\_\*             | Upstash/queue configuration      |

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.development.local` file in the root with:

```
PORT=3000
DB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SERVER_URL=http://localhost:3000
EMAIL_PASSWORD=your_email_password
```

### Running the Server

```bash
npm run dev
```

## Project Structure

Folders:

- `config/` — Configuration files
- `controllers/` — Route handlers
- `database/` — Database connection logic
- `middlewares/` — Express middlewares
- `models/` — Mongoose models
- `routes/` — Express routes
- `utils/` — Utility functions

Main files:

- `app.js` — Main app entry
- `package.json` — Project metadata and dependencies
- `README.md` — Project documentation

Example structure:

```
advanced-backend/
├── app.js
├── config/
│   ├── arcjet.js
│   ├── env.js
│   ├── nodemailer.js
│   └── upstash.js
├── controllers/
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   ├── user.controller.js
│   └── workflow.controller.js
├── database/
│   └── mongodb.js
├── middlewares/
│   ├── arcjet.middleware.js
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/
│   ├── subscription.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   ├── user.routes.js
│   └── workflow.routes.js
├── utils/
│   ├── email-template.js
│   └── send-email.js
├── package.json
├── README.md
├── TEMP.README.md
└── ... (other config and env files)
```

## API Overview

### Base URL

```
http://localhost:{PORT}
```

---

### API Endpoints

#### Root

| Method | Endpoint | Description                       |
| ------ | -------- | --------------------------------- |
| GET    | `/`      | Welcome message - "Hello, World!" |

---

#### Authentication Routes

**Base Path:** `/api/v1/auth`

| Method | Endpoint                | Description         | Auth Required |
| ------ | ----------------------- | ------------------- | ------------- |
| POST   | `/api/v1/auth/sign-up`  | Register a new user | No            |
| POST   | `/api/v1/auth/sign-in`  | Login user          | No            |
| POST   | `/api/v1/auth/sign-out` | Logout user         | No            |

---

#### User Routes

**Base Path:** `/api/v1/users`

| Method | Endpoint            | Description               | Auth Required |
| ------ | ------------------- | ------------------------- | ------------- |
| GET    | `/api/v1/users/`    | Get all users             | Yes           |
| GET    | `/api/v1/users/:id` | Get a specific user by ID | Yes           |
| POST   | `/api/v1/users/`    | Create new user           | No            |
| PUT    | `/api/v1/users/:id` | Update user by ID         | No            |
| DELETE | `/api/v1/users/:id` | Delete user by ID         | No            |

---

#### Subscription Routes

**Base Path:** `/api/v1/subscriptions`

| Method | Endpoint                                  | Description                           | Auth Required |
| ------ | ----------------------------------------- | ------------------------------------- | ------------- |
| GET    | `/api/v1/subscriptions/`                  | Get all subscriptions                 | No            |
| GET    | `/api/v1/subscriptions/:id`               | Get subscription details by ID        | No            |
| POST   | `/api/v1/subscriptions/`                  | Create a new subscription             | Yes           |
| PUT    | `/api/v1/subscriptions/:id`               | Update subscription by ID             | No            |
| DELETE | `/api/v1/subscriptions/:id`               | Delete subscription by ID             | No            |
| GET    | `/api/v1/subscriptions/user/:id`          | Get subscriptions for a specific user | Yes           |
| GET    | `/api/v1/subscriptions/:id/cancel`        | Cancel a subscription                 | No            |
| GET    | `/api/v1/subscriptions/upcoming-renewals` | Get upcoming subscription renewals    | No            |

---

#### Workflow Routes

**Base Path:** `/api/v1/workflows`

| Method | Endpoint                                  | Description                       | Auth Required |
| ------ | ----------------------------------------- | --------------------------------- | ------------- |
| POST   | `/api/v1/workflows/subscription/reminder` | Send subscription reminder emails | No            |

---

### Endpoints Summary

| #   | Method | Full Endpoint                             | Description              |
| --- | ------ | ----------------------------------------- | ------------------------ |
| 1   | GET    | `/`                                       | Root - Welcome message   |
| 2   | POST   | `/api/v1/auth/sign-up`                    | Register a new user      |
| 3   | POST   | `/api/v1/auth/sign-in`                    | Login user               |
| 4   | POST   | `/api/v1/auth/sign-out`                   | Logout user              |
| 5   | GET    | `/api/v1/users/`                          | Get all users            |
| 6   | GET    | `/api/v1/users/:id`                       | Get user by ID           |
| 7   | POST   | `/api/v1/users/`                          | Create new user          |
| 8   | PUT    | `/api/v1/users/:id`                       | Update user              |
| 9   | DELETE | `/api/v1/users/:id`                       | Delete user              |
| 10  | GET    | `/api/v1/subscriptions/`                  | Get all subscriptions    |
| 11  | GET    | `/api/v1/subscriptions/:id`               | Get subscription by ID   |
| 12  | POST   | `/api/v1/subscriptions/`                  | Create subscription      |
| 13  | PUT    | `/api/v1/subscriptions/:id`               | Update subscription      |
| 14  | DELETE | `/api/v1/subscriptions/:id`               | Delete subscription      |
| 15  | GET    | `/api/v1/subscriptions/user/:id`          | Get user's subscriptions |
| 16  | GET    | `/api/v1/subscriptions/:id/cancel`        | Cancel subscription      |
| 17  | GET    | `/api/v1/subscriptions/upcoming-renewals` | Get upcoming renewals    |
| 18  | POST   | `/api/v1/workflows/subscription/reminder` | Send reminder emails     |

**Total Endpoints: 18**
