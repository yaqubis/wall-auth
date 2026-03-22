# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

**Build:**
```
./gradlew build
```

**Run:**
```
./gradlew bootRun
```

**Run tests:**
```
./gradlew test
```

**Run a single test class:**
```
./gradlew test --tests "br.com.wallauth.WallAuthApplicationTests"
```

**Clean build:**
```
./gradlew clean build
```

## Required Environment Variables

The application will not start without these:

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Base64-encoded HMAC-SHA256 signing key (minimum 256 bits / 32 bytes) |
| `DB_USR` | PostgreSQL username |
| `DB_PWD` | PostgreSQL password |

The app connects to PostgreSQL at `localhost:5432`, database `int-health-db`. Hibernate DDL is set to `update`, so the schema is managed automatically.

## Architecture

**Spring Boot 4.0.3** authentication microservice running on port `8081` with context path `/wall-auth`.

**Layer structure:**
- `controller/` → `service/` (interfaces) → `service/impl/` → `repository/`
- `model/` holds the JPA entity (`User`), enums (`Role`), Java records for DTOs, and custom exceptions
- `config/` holds Spring Security and encoder beans
- `handler/ExceptionController` is a `@RestControllerAdvice` that maps domain exceptions to HTTP responses

**Request flow for registration:**
`POST /register` → `AuthController` → `UserServiceImpl.createUser()` → validates uniqueness via `UserRepository` → hashes password with Argon2 → persists → returns `UserDto`

**JWT:** `JwtServiceImpl` signs tokens with HS256 using the `JWT_SECRET`. Token expiration defaults to 900000 ms (15 minutes). The `POST /login` endpoint exists in the controller but is currently a stub (returns empty string).

**Security config (`Security.java`):** CSRF is disabled and all requests are currently permitted (`anyRequest().permitAll()`). JWT filter integration has not yet been wired into the filter chain.

**Password hashing:** Argon2 (`Argon2PasswordEncoder`) via BouncyCastle. Password constraints are enforced both via Bean Validation on `RegisterDto` and at the JPA column level on `User`: min 8 chars, must contain uppercase, lowercase, digit, and special character (`@#$%^&+=`).

**Roles:** `ADMIN`, `DOC`, `NUR` (stored as strings in the DB). `User` implements `UserDetails` and returns a single `SimpleGrantedAuthority` from `role`.

**DTO conventions:** All DTOs are Java records. `RegisterDto` and `UserDto` include static `fromEntity()` factory methods and a `fromDto()` conversion method.
