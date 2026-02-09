# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Backend API for "Importadora MB" - a client debt management system. Built with Spring Boot 3.2.5 and Java 21, using PostgreSQL (Supabase) as the database. Deployed via Docker on Render.

## Build & Run Commands

```powershell
# Build (skip tests)
mvn clean package -DskipTests

# Run locally (requires DB env vars)
mvn spring-boot:run

# Run tests
mvn test

# Run a single test class
mvn test -Dtest=ClienteMbServiceTest

# Run a single test method
mvn test -Dtest=ClienteMbServiceTest#testMethodName
```

## Required Environment Variables

```
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:<port>/<db>
SPRING_DATASOURCE_USERNAME=<user>
SPRING_DATASOURCE_PASSWORD=<password>
```

## Architecture

Three-layer architecture under `com.importadora.mb`:

```
web/        → REST controllers, DTOs, request records
service/    → Business logic, transaction management
domain/     → JPA entities, Spring Data repositories
config/     → CORS, security headers
```

### Key Components

- **ClienteMb** (`domain/`): JPA entity mapped to `clientes_mb` table. Tracks client info, debt, payments, discount status.
- **ClienteMbService** (`service/`): Core business logic including `recalculateFinancials()` which computes `totalAmount` (debt - payment, with optional 10% discount) and sets status (ACTIVE/CANCELLED).
- **ClienteMbController** (`web/`): REST API at `/api/clients` with CRUD + `/charges` and `/payments` sub-resources.

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/clients | List all clients |
| GET | /api/clients/{id} | Get single client |
| POST | /api/clients | Create client |
| PUT | /api/clients/{id} | Update client |
| DELETE | /api/clients/{id} | Delete client |
| POST | /api/clients/{id}/charges | Add charge to debt |
| POST | /api/clients/{id}/payments | Register payment |

### Financial Logic

In `ClienteMbService.recalculateFinancials()`:
- `totalAmount = debt - payment` (clamped to 0 minimum)
- If `discount=true`, apply 10% off: `totalAmount *= 0.9`
- Status becomes `CANCELLED` when `totalAmount <= 0`, otherwise `ACTIVE`

## Database

- Schema managed externally (Supabase) - `ddl-auto=none`
- Single table: `clientes_mb` with columns: id, first_name, last_name, city, registration_date, debt, payment, total_amount, discount, status

## Health Endpoints

- `/healthz` - Simple health check (returns "OK")
- `/actuator/health` - Spring Actuator health (Kubernetes probes enabled)
