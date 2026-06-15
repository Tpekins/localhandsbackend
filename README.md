# Local Hands — Backend

> NestJS-based API server for the LocalHands marketplace platform.

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Getting Started](#3-getting-started)
4. [Architecture](#4-architecture)
   - 4.1 [Application Bootstrap](#41-application-bootstrap)
   - 4.2 [Module System](#42-module-system)
   - 4.3 [Request Lifecycle](#43-request-lifecycle)
   - 4.4 [Database Layer](#44-database-layer)
   - 4.5 [Authentication & Authorization](#45-authentication--authorization)
   - 4.6 [API Controllers](#46-api-controllers)
   - 4.7 [Services](#47-services)
   - 4.8 [Middleware](#48-middleware)
   - 4.9 [Logging & Observability](#49-logging--observability)
   - 4.10 [Payment Integration](#410-payment-integration)
   - 4.11 [Configuration Management](#411-configuration-management)
   - 4.12 [Exception Handling](#412-exception-handling)
   - 4.13 [Swagger API Documentation](#413-swagger-api-documentation)
   - 4.14 [Health Checks](#414-health-checks)
5. [Database Schema](#5-database-schema)
6. [Build & Deployment](#6-build--deployment)
7. [Environment Variables](#7-environment-variables)
8. [Development Guidelines](#8-development-guidelines)
9. [Security Audit Summary](#9-security-audit-summary)

---

## 1. Project Overview

The LocalHands backend is a RESTful API built with NestJS. It serves the React frontend and manages all business logic, data persistence, authentication, and third-party integrations. The backend follows a modular architecture with feature-based modules.

**Core capabilities:**
- User registration and authentication with JWT and role-based access control
- Service listing, discovery, and management
- Booking and appointment scheduling
- Service ordering and proposal submission
- Contract management with escrow payment support
- In-platform messaging
- Review and rating system
- Payment processing via Fapshi integration
- Administrative operations for platform management

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | NestJS 11 | Server-side application framework with dependency injection |
| Language | TypeScript 6.x | Type-safe programming with compile-time checks |
| ORM | Prisma 7.x | Database schema management and query builder |
| Database | PostgreSQL | Relational data storage |
| Adapter | @prisma/adapter-pg | Direct PostgreSQL connection pooling |
| Authentication | Passport.js + JWT | Token-based authentication |
| Validation | class-validator + class-transformer | DTO validation and transformation |
| Documentation | Swagger UI + @nestjs/swagger | Interactive API documentation |
| Logging | Custom LoggerService | JSON-structured file-based logging |
| Compression | compression | HTTP response compression |
| Container | Docker | Application containerization |

---

## 3. Getting Started

```bash
# Navigate to the backend directory
cd localhandsbackend

# Install dependencies
npm install
# or
yarn install

# Create environment file
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev
# or
yarn start:dev
```

The development server runs on `http://localhost:3000` by default.

**Swagger API docs** are available at `http://localhost:3000/api/docs`.

---

## 4. Architecture

### 4.1 Application Bootstrap

The backend is bootstrapped in `src/main.ts` following this strict sequence:

```
NestFactory.create(AppModule)
  ├── Retrieve ConfigService
  ├── Configure CORS (whitelist-based)
  ├── Register Global ValidationPipe
  ├── Register Global ExceptionFilter
  ├── Register Global LoggingInterceptor
  ├── Enable Compression
  ├── Set Global API Prefix (/api)
  ├── Setup Swagger Documentation
  └── Start HTTP Listener (PORT env var)
```

**Bootstrap Details:**
- **CORS**: Allowed origins are driven by `CORS_ORIGIN` env var with a fallback whitelist of known domains and local development ports.
- **ValidationPipe**: Configured with `whitelist: true`, `transform: true`, `forbidNonWhitelisted: true`. Strips unknown properties, transforms data to DTO types, and rejects unexpected fields.
- **ExceptionFilter**: Catches all unhandled exceptions and formats them into consistent JSON error responses.
- **LoggingInterceptor**: Logs every request and response with sanitized bodies (sensitive fields redacted).
- **Compression**: Uses `compression` middleware to gzip HTTP responses.
- **Global Prefix**: All routes prefixed with `/api` except `/` (redirects to docs) and `/health`.

### 4.2 Module System

The backend is organized using NestJS modules. Each module encapsulates a domain feature.

**Root Module Imports (`AppModule`):**

```
AppModule
├── ConfigModule (global, loads PaymentConfig + ServerConfig)
├── PrismaModule (global)
├── CommonModule
├── HealthModule
├── AuthModule
├── UserModule
├── ProviderModule
├── ServiceModule
├── ServicepackageModule
├── ServiceassetModule
├── ServiceorderModule
├── CategoryModule
├── BookingModule
├── AvailabilityModule
├── ContractModule
├── ProposalModule
├── ReviewModule
├── PaymentModule
├── MessagesModule
├── NotificationsModule
├── ProfileModule
├── ClientModule
└── SettingsModule
```

### 4.3 Request Lifecycle

```
Client Request
  └── HTTP Server
       ├── CORS Middleware
       ├── Compression Middleware
       ├── Global ValidationPipe
       ├── Route Guards (JwtAuthGuard)
       ├── Controller Method
       ├── Service Method
       ├── Prisma ORM
       └── PostgreSQL
            └── Response back through the same chain
```

### 4.4 Database Layer

The database layer is managed through Prisma ORM. The `PrismaModule` is declared as `@Global()`, making `PrismaService` available throughout the application.

```
Service Layer → PrismaService → @prisma/adapter-pg → PostgreSQL Pool → PostgreSQL
```

The `PrismaService` extends `PrismaClient` and implements `OnModuleInit` / `OnModuleDestroy` lifecycle hooks. It connects on startup and disconnects on shutdown. The connection uses the `@prisma/adapter-pg` driver with SSL (`rejectUnauthorized: false`) for Neon PostgreSQL compatibility.

### 4.5 Authentication & Authorization

**Login Flow:**
```
POST /api/auth/login
  └── AuthController.login()
       └── AuthService.validateUser()
            ├── UserService.findByEmail() / findByPhoneNumber()
            └── bcrypt.compare(password, hash)
                 ├── Valid → Generate JWT token → Return { access_token, user }
                 └── Invalid → ForbiddenException
```

**Authenticated Request Flow:**
```
Request with Authorization: Bearer <token>
  └── JwtAuthGuard
       └── JwtStrategy.validate()
            └── Attach user to Request object
                 └── Controller accesses req.user
```

**Token Structure:**
The JWT payload contains `email`, `phoneNumber`, `sub` (user ID), `name`, and `role`. Tokens are signed with `JWT_SECRET` and expire after 1 hour.

**Role-Based Access Control:**
- `JwtAuthGuard`: Ensures valid JWT token
- `RoleGuard`: Checks `@Roles()` decorator against user's role
- `Roles` decorator: Specifies required roles (e.g., `ADMIN`)

### 4.6 API Controllers

| Controller | Route | Primary Operations |
|-----------|-------|-------------------|
| `AuthController` | `/api/auth` | Register, login, profile, change password |
| `UserController` | `/api/user` | CRUD for users |
| `ProviderController` | `/api/provider` | Provider profiles |
| `ServiceController` | `/api/services` | Service CRUD, status, views |
| `ServicepackageController` | `/api/servicepackage` | Service packages |
| `ServiceassetController` | `/api/serviceasset` | Service assets |
| `CategoryController` | `/api/category` | Categories |
| `BookingController` | `/api/booking` | Booking CRUD |
| `AvailabilityController` | `/api/availability` | Provider schedules |
| `ServiceorderController` | `/api/serviceorder` | Service orders |
| `ProposalController` | `/api/proposal` | Proposals |
| `ContractController` | `/api/contract` | Contracts |
| `PaymentController` | `/api/payments` | Payment links, direct pay, status |
| `MessagesController` | `/api/messages` | Messaging |
| `ReviewController` | `/api/review` | Reviews |
| `ProfileController` | `/api/profile` | Profiles |
| `NotificationsController` | `/api/notifications` | Notifications |
| `ClientController` | `/api/client` | Client ops |
| `SettingsController` | `/api/settings` | System settings (admin) |
| `HealthController` | `/health` | Health check |
| `AppController` | `/` | Redirect to Swagger docs |

### 4.7 Services

Services contain the business logic. Each service is injectable and interacts with the database through `PrismaService`. They are responsible for:
- Validating business rules
- Transforming data between DTOs and database models
- Throwing appropriate HTTP exceptions when constraints are violated

### 4.8 Middleware

The `common/middleware` directory contains middleware stubs. Several are currently placeholders (`// TODO`) and need implementation:

| Middleware | Purpose | Status |
|-----------|---------|--------|
| `auth.middleware.ts` | Authentication validation | Placeholder |
| `booking.middleware.ts` | Booking validation | Placeholder |
| `cache.middleware.ts` | Response caching | Placeholder |
| `contract.middleware.ts` | Contract validation | Placeholder |
| `error.middleware.ts` | Error handling | Placeholder |
| `file-upload.middleware.ts` | File uploads | Placeholder |
| `message.middleware.ts` | Message validation | Placeholder |
| `notification.middleware.ts` | Notification processing | Placeholder |
| `pagination.middleware.ts` | Pagination support | Placeholder |
| `payment.middleware.ts` | Payment validation | Placeholder |
| `proposal.middleware.ts` | Proposal validation | Placeholder |
| `rate-limit.middleware.ts` | Rate limiting | **TODO — needs @nestjs/throttler** |
| `request-logger.middleware.ts` | Request logging | Placeholder |
| `security.middleware.ts` | Security headers | **TODO — needs helmet** |
| `validation.middleware.ts` | Request validation | Placeholder |

### 4.9 Logging & Observability

The `LoggerService` provides structured JSON logging across multiple categories:

**Log Categories:**
- `error` — Application errors
- `activity` — General user activity
- `payment` — Payment events
- `booking` — Booking operations
- `authentication` — Login/logout
- `proposal` — Proposal lifecycle
- `contract` — Contract operations
- `notification` — Notification dispatch
- `message` — Messaging events
- `availability` — Availability changes
- `review` — Review submissions
- `service` — Service operations
- `transaction` — Transaction records
- `system` — System events
- `security` — Security events

**Log Format:**
```json
{
  "timestamp": "2026-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Incoming POST /api/auth/login",
  "data": { "method": "POST", "url": "/api/auth/login", "userId": null }
}
```

**Sanitization:** The `LoggingInterceptor` automatically redacts `password`, `token`, and `creditCard` from request bodies and responses before logging.

### 4.10 Payment Integration

The payment system integrates with the **Fapshi** payment gateway.

```
Client → PaymentController → PaymentService → FapshiService → Fapshi API → Mobile Money Provider
```

**Payment Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/fapshi/payment-link` | Generate payment link |
| POST | `/api/payments/fapshi/direct-pay` | Initiate direct payment |
| POST | `/api/payments/initialize` | Initialize payment for contract (body) |
| POST | `/api/payments/fapshi/payment-link/:contractId` | Initialize payment for contract (URL param) |
| GET | `/api/payments` | List all payments (admin) |
| PATCH | `/api/payments/:id/status` | Update payment status |

**Payment Environment Variables:**
```
PAYMENT_API_USER      — Fapshi API user ID
PAYMENT_API_KEY       — Fapshi API key
PAYMENT_LIVE_BASE_URL — Production endpoint (default: https://api.fapshi.com)
PAYMENT_SANDBOX_BASE_URL — Sandbox endpoint (default: https://sandbox.fapshi.com)
```

### 4.11 Configuration Management

Typed configuration is loaded globally via `@nestjs/config`:

**ServerConfig** (`src/config/server.config.ts`):
- `nodeEnv`: Environment mode (default: `development`)
- `port`: Server port (default: `5000`)
- `corsOrigin`: Allowed CORS origins (default: `*`)

**PaymentConfig** (`src/config/payment.config.ts`):
- `apiUser`: Payment gateway user ID
- `apiKey`: Payment gateway API key
- `liveBaseUrl`: Production payment endpoint
- `sandboxBaseUrl`: Sandbox payment endpoint

### 4.12 Exception Handling

The global exception filter (`AllExceptionsFilter`) catches all unhandled exceptions and formats them consistently.

**Error Response Format:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "constraints": { "isEmail": "email must be an email" } }
  ]
}
```

### 4.13 Swagger API Documentation

Swagger is served at `/api/docs` and includes:
- Bearer token authentication
- Grouped endpoints by domain
- Request/response DTO schemas with validation rules
- Operation summaries and descriptions

### 4.14 Health Checks

The `/health` endpoint returns `{ status: 'ok' }`. It is excluded from the global `/api` prefix and is accessible at the root level for load balancer and monitoring checks.

---

## 5. Database Schema

The database schema is defined in `prisma/schema.prisma` and uses PostgreSQL.

**Key Models:**
- `User` — Accounts with roles (CLIENT, PROVIDER, ADMIN)
- `Profile` — Extended user profiles (bio, verification, payment details)
- `Service` — Listed services with pricing and status
- `ServiceOrder` — Client requests for services
- `Contract` — Agreements between client and provider with escrow
- `Payment` — Payment records linked to contracts
- `Booking` — Scheduled appointments
- `Proposal` — Provider bids on service orders
- `Review` — Ratings and feedback on contracts
- `Message` — Direct messaging between users
- `Category` — Service categories
- `Notification` — Platform notifications
- `Provider` — Provider-specific data and availability
- `ServicePackage` — Bundled service offerings
- `ServiceAsset` — Images and area descriptions for services
- `SystemSettings` — Platform-wide configuration

**Important Schema Notes:**
- The `User` model has dual message relations: `sentMessages` and `receivedMessages`.
- The `Service` model has both a `provider` (User) relation and a `providerModel` (Provider) relation.
- The `PaymentMethod` enum currently only contains `MTN_MOBILE_MONEY`.

For the full Prisma schema, see `prisma/schema.prisma`.

---

## 6. Build & Deployment

```bash
# Development
npm run start:dev

# Production build
npm run build

# Run compiled code
npm run start

# Production mode
npm run start:prod
```

**Deployment Target:**
- **Render** (recommended for Node.js)
- **Docker** (multi-stage Dockerfile provided)

**Docker Build:**
```bash
docker build -t localhands-backend:latest .
docker run -p 3000:3000 -e DATABASE_URL=... -e JWT_SECRET=... localhands-backend:latest
```

---

## 7. Environment Variables

Create a `.env` file in the `localhandsbackend` directory:

```bash
# Application
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your-secure-random-secret
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=https://your-frontend-url.com

# Payment Gateway (Fapshi)
PAYMENT_API_USER=your-fapshi-user
PAYMENT_API_KEY=your-fapshi-key
PAYMENT_LIVE_BASE_URL=https://api.fapshi.com
PAYMENT_SANDBOX_BASE_URL=https://sandbox.fapshi.com

# Logging
LOG_LEVELS=query,error,warn
```

---

## 8. Development Guidelines

1. **Module Structure**: Each feature has its own module containing `controller`, `service`, `dto`, `entities`, and `module` files.
2. **DTO Validation**: All incoming data must be validated using `class-validator` decorators in DTOs.
3. **Password Handling**: Never return `passwordHash` in API responses. Use `omit` in Prisma queries.
4. **Error Handling**: Use NestJS built-in exceptions (`NotFoundException`, `ConflictException`, `BadRequestException`, `ForbiddenException`). Do not return plain JSON objects for errors.
5. **Logging**: Use the `LoggerService` for all structured logging. Categorize logs appropriately.
6. **Database Queries**: Use Prisma's type-safe queries. Avoid raw SQL unless necessary.
7. **Authentication**: Always use `@UseGuards(JwtAuthGuard)` and `@ApiBearerAuth()` for protected routes.
8. **Swagger**: Document all controller methods with `@ApiOperation`, `@ApiResponse`, and `@ApiTags`.

---

## 9. Security Audit Summary

A comprehensive audit documented in `BACKEND_AUDIT.md` identified the following critical items requiring attention before production:

1. **Secrets Exposure**: Ensure `.env` is never committed to version control.
2. **Prisma Schema**: Add `url = env("DATABASE_URL")` to the datasource block.
3. **Security Middleware**: Implement `helmet` and `@nestjs/throttler`.
4. **JWT Fallback**: Remove hardcoded `'localhands-secret'` fallback; use `getOrThrow`.
5. **CORS Wildcard**: Restrict CORS origin in production.
6. **Type Safety**: Enable `strict: true` in `tsconfig.json`.
7. **Schema Redundancy**: Clean up implicit relations (`Message.users`, `Service.providerModel`, `Contract.users`).
8. **PaymentMethod Enum**: Synchronize with database migration values.
9. **Webhook Handling**: Implement database updates and replay protection.
10. **Business Logic**: Add booking conflict checks, status transition guards, and review validation.

---

*This README is maintained alongside the codebase. For frontend documentation, see `../localhandsfrontend/README.md`.*
