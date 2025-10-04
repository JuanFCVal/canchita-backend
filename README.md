# Canchita Backend

A NestJS backend application with TypeORM and PostgreSQL (Supabase) integration.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository with TypeORM integration for PostgreSQL database using Supabase.

## Prerequisites

- Node.js (v16 or higher)
- npm
- PostgreSQL database (Supabase recommended)

## Installation

```bash
$ npm install
```

## Environment Setup

1. Copy the `.env.example` file to `.env`:

```bash
$ cp .env.example .env
```

2. Update the `.env` file with your Supabase PostgreSQL connection URL:

```
DATABASE_URL=postgresql://postgres:your-password@your-project.supabase.co:5432/postgres?sslmode=require
PORT=3000
NODE_ENV=development
```

### Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Go to Settings > Database
3. Copy the connection string from the "Connection string" section:
   - Look for the "URI" format: `postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with your actual database password
   - **Important**: If your password contains special characters (`@`, `#`, `%`, `&`, etc.), you need to URL-encode them:
     - `@` becomes `%40`
     - `#` becomes `%23`
     - `%` becomes `%25`
     - `&` becomes `%26`
     - Space becomes `%20`
   - Add `?sslmode=require` at the end for SSL connection
   - Use this complete URL as your `DATABASE_URL`

### Example

If your password is `myPass@123#`, your DATABASE_URL should be:

```
DATABASE_URL=postgresql://postgres:myPass%40123%23@your-project.supabase.co:5432/postgres?sslmode=require
```

## Database Operations

```bash
# Generate a new migration
$ npm run migration:generate -- src/migrations/MigrationName

# Run migrations
$ npm run migration:run

# Revert last migration
$ npm run migration:revert
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Structure

```
src/
├── entities/          # TypeORM entities
├── migrations/        # Database migrations
├── app.controller.ts  # Main controller
├── app.module.ts      # Main module with TypeORM configuration
├── app.service.ts     # Main service
├── database.config.ts # Database configuration
├── data-source.ts     # TypeORM data source for migrations
└── main.ts           # Application entry point
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
