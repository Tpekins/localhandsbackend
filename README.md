# Local Hands — Backend

> NestJS-based API server for the LocalHands marketplace platform.

**Maintained by Tiani Perkins Ibica** 🇨🇲  
*Cameroon — CM Tiani Perkins Ibica CM*

---

## Table of Contents

1. [System Architecture Diagram](#1-system-architecture-diagram)
2. [Technology Stack](#2-technology-stack)
3. [Getting Started](#3-getting-started)
4. [Architecture](#4-architecture)
   - 4.1 [Application Bootstrap](#41-application-bootstrap)
   - 4.2 [Module System](#42-module-system)
   - 4.3 [Request Lifecycle](#43-request-lifecycle)
   - 4.4 [Database Layer](#44-database-layer)
   - 4.5 [Authentication & Authorization](#45-authentication--authorization)
   - 4.6 [API Controllers](#46-api-controllers)
   - 4.7 [Middleware Pipeline](#47-middleware-pipeline)
   - 4.8 [Logging & Observability](#48-logging--observability)
   - 4.9 [Payment Integration](#49-payment-integration)
   - 4.10 [Configuration Management](#410-configuration-management)
   - 4.11 [Exception Handling](#411-exception-handling)
   - 4.12 [Swagger API Documentation](#412-swagger-api-documentation)
   - 4.13 [Health Checks](#413-health-checks)
5. [Database Schema](#5-database-schema)
6. [Build & Deployment](#6-build--deployment)
7. [Environment Variables](#7-environment-variables)
8. [Development Guidelines](#8-development-guidelines)
9. [Security Audit Summary](#9-security-audit-summary)

---

## 1. System Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["🖥️ Client Layer"]
        A["React Frontend"]
    end

    subgraph Server["⚙️ Server Layer"]
        B["NestJS Backend"]
        C["Prisma ORM"]
    end

    subgraph Database["🗄️ Database Layer"]
        D["PostgreSQL"]
    end

    subgraph External["🌐 External Services"]
        E["Fapshi Payment Gateway"]
        F["Google OAuth"]
    end

    A -->|"HTTPS / REST API"| B
    B -->|"SQL Queries"| C
    C -->|"Connection Pool"| D
    B -->|"HTTP API"| E
    A -->|"OAuth 2.0"| F

    style Client fill:#e1f5fe
    style Server fill:#e8f5e9
    style Database fill:#fff3e0
    style External fill:#fce4ec
```

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

```mermaid
flowchart LR
    A["NestFactory.create(AppModule)"] --> B["Retrieve ConfigService"]
    B --> C["Configure CORS"]
    C --> D["Register Global ValidationPipe"]
    D --> E["Register Global ExceptionFilter"]
    E --> F["Register Global LoggingInterceptor"]
    F --> G["Enable Compression"]
    G --> H["Set Global API Prefix<br/>/api"]
    H --> I["Setup Swagger Docs"]
    I --> J["Start HTTP Listener"]

    style A fill:#c8e6c9
    style J fill:#c8e6c9
```

**Bootstrap Details:**
- **CORS**: Allowed origins are driven by `CORS_ORIGIN` env var with a fallback whitelist of known domains and local development ports.
- **ValidationPipe**: Configured with `whitelist: true`, `transform: true`, `forbidNonWhitelisted: true`. Strips unknown properties, transforms data to DTO types, and rejects unexpected fields.
- **ExceptionFilter**: Catches all unhandled exceptions and formats them into consistent JSON error responses.
- **LoggingInterceptor**: Logs every request and response with sanitized bodies (sensitive fields redacted).
- **Compression**: Uses `compression` middleware to gzip HTTP responses.
- **Global Prefix**: All routes prefixed with `/api` except `/` (redirects to docs) and `/health`.

### 4.2 Module System

```mermaid
flowchart TB
    AppModule["AppModule (Root)"]
    
    AppModule --> ConfigModule["⚙️ ConfigModule"]
    AppModule --> PrismaModule["🗄️ PrismaModule"]
    AppModule --> CommonModule["📦 CommonModule"]
    AppModule --> HealthModule["❤️ HealthModule"]
    
    AppModule --> AuthModule["🔐 AuthModule"]
    AppModule --> UserModule["👤 UserModule"]
    AppModule --> ProviderModule["👨‍🔧 ProviderModule"]
    AppModule --> ServiceModule["🛠️ ServiceModule"]
    AppModule --> ServicepackageModule["📦 ServicepackageModule"]
    AppModule --> ServiceassetModule["🖼️ ServiceassetModule"]
    AppModule --> ServiceorderModule["📋 ServiceorderModule"]
    AppModule --> CategoryModule["🏷️ CategoryModule"]
    AppModule --> BookingModule["📅 BookingModule"]
    AppModule --> AvailabilityModule["⏰ AvailabilityModule"]
    AppModule --> ContractModule["📄 ContractModule"]
    AppModule --> ProposalModule["💼 ProposalModule"]
    AppModule --> ReviewModule["⭐ ReviewModule"]
    AppModule --> PaymentModule["💳 PaymentModule"]
    AppModule --> MessagesModule["💬 MessagesModule"]
    AppModule --> NotificationsModule["🔔 NotificationsModule"]
    AppModule --> ProfileModule["📝 ProfileModule"]
    AppModule --> ClientModule["🧑‍💼 ClientModule"]
    AppModule --> SettingsModule["⚡ SettingsModule"]

    style AppModule fill:#fff9c4
    style ConfigModule fill:#e1f5fe
    style PrismaModule fill:#e1f5fe
    style CommonModule fill:#e1f5fe
    style HealthModule fill:#e1f5fe
```

### 4.3 Request Lifecycle

```mermaid
flowchart TB
    A["📤 Client Request"] --> B["HTTP Server"]
    B --> C["🌍 CORS Middleware"]
    C --> D["📦 Compression Middleware"]
    D --> E["✅ Global ValidationPipe"]
    E --> F["🔒 Route Guards<br/>JwtAuthGuard"]
    F --> G["🎮 Controller Method"]
    G --> H["⚙️ Service Method"]
    H --> I["📊 Prisma ORM"]
    I --> J["🗄️ PostgreSQL"]
    J --> I
    I --> H
    H --> G
    G --> K["📝 LoggingInterceptor"]
    K --> L["❌ ExceptionFilter"]
    L --> M["📥 HTTP Response"]

    style A fill:#ffccbc
    style M fill:#c8e6c9
```

### 4.4 Database Layer

```mermaid
flowchart LR
    A["⚙️ Service Layer"] --> B["📊 PrismaService"]
    B --> C["🔌 @prisma/adapter-pg"]
    C --> D["🗄️ PostgreSQL Pool"]
    D --> E["🗄️ PostgreSQL Database"]

    style B fill:#fff9c4
    style E fill:#fff3e0
```

The `PrismaService` extends `PrismaClient` and implements `OnModuleInit` / `OnModuleDestroy` lifecycle hooks. It connects on startup and disconnects on shutdown. The connection uses the `@prisma/adapter-pg` driver with SSL (`rejectUnauthorized: false`) for Neon PostgreSQL compatibility.

### 4.5 Authentication & Authorization

**Login Flow:**

```mermaid
flowchart TD
    A["POST /api/auth/login"] --> B["AuthController.login()"]
    B --> C["AuthService.validateUser()"]
    C --> D["UserService.findByEmail() /<br/>findByPhoneNumber()"]
    D --> E["bcrypt.compare(password, hash)"]
    E --> F{"Password Valid?"}
    F -->|Yes| G["Generate JWT Token"]
    G --> H["Return { access_token, user }"]
    F -->|No| I["🚫 ForbiddenException"]

    style G fill:#c8e6c9
    style I fill:#ffccbc
```

**Authenticated Request Flow:**

```mermaid
flowchart LR
    A["📤 Request<br/>Authorization: Bearer <token>"] --> B["🔒 JwtAuthGuard"]
    B --> C["JwtStrategy.validate()"]
    C --> D["Attach user to<br/>Request object"]
    D --> E["🎮 Controller<br/>accesses req.user"]

    style B fill:#e1f5fe
    style D fill:#c8e6c9
```

**Token Structure:**
The JWT payload contains `email`, `phoneNumber`, `sub` (user ID), `name`, and `role`. Tokens are signed with `JWT_SECRET` and expire after 1 hour.

**Role-Based Access Control:**
- `JwtAuthGuard`: Ensures valid JWT token
- `RoleGuard`: Checks `@Roles()` decorator against user's role
- `Roles` decorator: Specifies required roles (e.g., `ADMIN`)

### 4.6 API Controllers

```
┌─────────────────────────────────────────────────────────────┐
│                    API Endpoint Hierarchy                    │
├─────────────────────────────────────────────────────────────┤
│  🔐 /api/auth           → Register, Login, Profile, Password│
│  👤 /api/user           → CRUD for Users                    │
│  👨‍🔧 /api/provider      → Provider Profiles                 │
│  🛠️ /api/services      → Service CRUD, Status, Views      │
│  📦 /api/servicepackage → Service Packages                 │
│  🖼️ /api/serviceasset   → Service Assets                    │
│  🏷️ /api/category       → Categories                        │
│  📅 /api/booking        → Booking CRUD                     │
│  ⏰ /api/availability   → Provider Schedules               │
│  📋 /api/serviceorder   → Service Orders                   │
│  💼 /api/proposal       → Proposals                        │
│  📄 /api/contract       → Contracts                        │
│  💳 /api/payments       → Payment Links, Direct Pay, Status│
│  💬 /api/messages       → Messaging                        │
│  ⭐ /api/review         → Reviews                          │
│  📝 /api/profile        → Profiles                         │
│  🔔 /api/notifications  → Notifications                    │
│  🧑‍💼 /api/client         → Client Operations               │
│  ⚡ /api/settings       → System Settings (Admin)          │
│  ❤️ /health             → Health Check (No Prefix)       │
│  🏠 /                   → Redirect to /api/docs            │
└─────────────────────────────────────────────────────────────┘
```

### 4.7 Middleware Pipeline

```mermaid
flowchart LR
    A["📤 Request"] --> B["auth.middleware"]
    B --> C["security.middleware"]
    C --> D["rate-limit.middleware"]
    D --> E["validation.middleware"]
    E --> F["🎮 Controller"]

    style B fill:#fff3e0
    style C fill:#fff3e0
    style D fill:#fff3e0
    style E fill:#fff3e0
```

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

### 4.8 Logging & Observability

```mermaid
flowchart LR
    A["📤 Request"] --> B["LoggingInterceptor"]
    B --> C["LoggerService"]
    C --> D["📁 logs/activity.log"]
    C --> E["📁 logs/error.log"]
    C --> F["📁 logs/payment.log"]
    C --> G["📁 logs/security.log"]

    style B fill:#fff9c4
    style C fill:#fff9c4
```

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

### 4.9 Payment Integration

```mermaid
flowchart LR
    A["📤 Client"] --> B["💳 PaymentController"]
    B --> C["⚙️ PaymentService"]
    C --> D["🔌 FapshiService"]
    D --> E["🌐 Fapshi API"]
    E --> F["📱 Mobile Money Provider"]

    style D fill:#fff9c4
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

### 4.10 Configuration Management

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

### 4.11 Exception Handling

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

### 4.12 Swagger API Documentation

Swagger is served at `/api/docs` and includes:
- Bearer token authentication
- Grouped endpoints by domain
- Request/response DTO schemas with validation rules
- Operation summaries and descriptions

### 4.13 Health Checks

The `/health` endpoint returns `{ status: 'ok' }`. It is excluded from the global `/api` prefix and is accessible at the root level for load balancer and monitoring checks.

---

## 5. Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o| PROFILE : has
    USER ||--o{ SERVICE : provides
    USER ||--o{ SERVICEORDER : places
    USER ||--o{ BOOKING : makes
    USER ||--o{ REVIEW : writes
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ PROPOSAL : submits
    USER ||--o{ MESSAGE : sends
    USER ||--o{ MESSAGE : receives
    USER ||--o{ SERVICEPACKAGE : creates
    USER ||--o| PROVIDER : is

    SERVICE ||--o{ SERVICEORDER : has
    SERVICE ||--o{ BOOKING : booked_as
    SERVICE ||--o{ PROPOSAL : receives
    SERVICE ||--o{ SERVICEPACKAGE : belongs_to
    SERVICE ||--o{ SERVICEASSET : has
    SERVICE }o--o| CATEGORY : belongs_to

    SERVICEORDER ||--o| CONTRACT : generates
    SERVICEORDER ||--o{ PROPOSAL : receives

    CONTRACT ||--o{ PAYMENT : includes
    CONTRACT ||--o{ REVIEW : receives
    CONTRACT ||--o| PROPOSAL : accepts

    PROVIDER ||--o{ SERVICE : offers
    PROVIDER ||--o{ AVAILABILITY : has

    USER {
        int id PK
        string name
        enum role
        string phoneNumber UK
        string email UK
        string passwordHash
        datetime createdAt
        datetime lastLogin
    }

    PROFILE {
        int id PK
        int userId FK
        string bio
        string mobileMoneyNumber
        string bankAccountNumber
        string nationalIdUrl
        enum verificationStatus
        string location
        datetime createdAt
    }

    SERVICE {
        int id PK
        string title
        string description
        int categoryId FK
        float price
        string status
        boolean featured
        int providerId FK
        int views
        datetime createdAt
    }

    SERVICEORDER {
        int id PK
        int serviceId FK
        int clientId FK
        string description
        float budget
        enum status
        datetime createdAt
    }

    CONTRACT {
        int id PK
        int serviceOrderId FK
        float escrowAmount
        enum status
        datetime createdAt
    }

    PAYMENT {
        int id PK
        int contractId FK
        float amount
        enum paymentMethod
        string transactionId
        enum status
        datetime createdAt
    }

    BOOKING {
        int id PK
        int serviceId FK
        int clientId FK
        datetime startTime
        datetime endTime
        string location
        enum status
        datetime createdAt
    }

    PROPOSAL {
        int id PK
        int providerId FK
        int serviceId FK
        string coverLetter
        float bidAmount
        enum status
        int contractId FK
        datetime createdAt
    }

    REVIEW {
        int id PK
        int contractId FK
        int reviewerId FK
        int rating
        string comment
        datetime createdAt
    }

    MESSAGE {
        int id PK
        int senderId FK
        int receiverId FK
        string content
        datetime timestamp
    }

    CATEGORY {
        int id PK
        string name
        string description
    }

    NOTIFICATION {
        int id PK
        int userId FK
        string message
        string type
        boolean read
        datetime createdAt
    }

    PROVIDER {
        int id PK
        int userId FK
        datetime createdAt
    }

    AVAILABILITY {
        int id PK
        int providerId FK
        int dayOfWeek
        datetime startTime
        datetime endTime
    }

    SERVICEPACKAGE {
        int id PK
        int providerId FK
        string title
        string description
        float price
        datetime createdAt
    }

    SERVICEASSET {
        int id PK
        int serviceId FK
        enum type
        string imageUrl
        string caption
        string areaName
        datetime createdAt
    }

    SYSTEMSETTINGS {
        int id PK
        boolean maintenance_mode
        boolean allow_registration
        boolean review_auto_approve
        string payment_gateway
        boolean email_notifications
        int max_file_size
        string currency
        string currency_symbol
        string supportEmail
        datetime createdAt
        datetime updatedAt
    }
```

### Key Models

| Model | Description |
|-------|-------------|
| `User` | Accounts with roles (CLIENT, PROVIDER, ADMIN) |
| `Profile` | Extended user profiles (bio, verification, payment details) |
| `Service` | Listed services with pricing and status |
| `ServiceOrder` | Client requests for services |
| `Contract` | Agreements between client and provider with escrow |
| `Payment` | Payment records linked to contracts |
| `Booking` | Scheduled appointments |
| `Proposal` | Provider bids on service orders |
| `Review` | Ratings and feedback on contracts |
| `Message` | Direct messaging between users |
| `Category` | Service categories |
| `Notification` | Platform notifications |
| `Provider` | Provider-specific data and availability |
| `ServicePackage` | Bundled service offerings |
| `ServiceAsset` | Images and area descriptions for services |
| `SystemSettings` | Platform-wide configuration |

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

```mermaid
flowchart LR
    A["🔒 Security Audit"] --> B["Secrets Exposure"]
    A --> C["Prisma Schema"]
    A --> D["Security Middleware"]
    A --> E["JWT Fallback"]
    A --> F["CORS Wildcard"]
    A --> G["Type Safety"]
    A --> H["Schema Redundancy"]
    A --> I["PaymentMethod Enum"]
    A --> J["Webhook Handling"]
    A --> K["Business Logic"]

    style A fill:#fff9c4
    style B fill:#ffccbc
    style D fill:#ffccbc
    style E fill:#ffccbc
    style F fill:#ffccbc
```

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

**Maintained by Tiani Perkins Ibica** 🇨🇲  
*Cameroon — CM Tiani Perkins Ibica CM*

*This README is maintained alongside the codebase. For frontend documentation, see `../localhandsfrontend/README.md`.*
