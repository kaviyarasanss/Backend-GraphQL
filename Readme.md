# GraphQL API Project

A robust GraphQL API built with NestJS, PostgreSQL, and Apollo Server for managing users, albums, and posts.

## Table of Contents
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [GraphQL Playground](#graphql-playground)
- [Example Queries and Mutations](#example-queries-and-mutations)
- [Libraries Used](#libraries-used)

## Installation

Install all project dependencies:

```bash
npm install
```

## Database Setup

### 1. Configure Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name

# Application Configuration
PORT=3000
```

### 2. Run Migrations

Create and run database migrations to set up the tables:

```bash
# Create a new migration file
npx knex --knexfile knexfile.ts migrate:make {filename}

# Run all pending migrations
npx knex --knexfile knexfile.ts migrate:up {filename}
```

**Note:** Migration files are provided in the `migrations/` folder in the repository. Run them in order to create the necessary database schema.

### 3. Run Seed Files

Populate the database with initial data using seed files:

```bash
# Create a new seed file
npx knex --knexfile knexfile.ts seed:make {filename}

# Run a specific seed file
npx knex --knexfile knexfile.ts seed:run --specific={filename}
```

**Note:** Seed files are provided in the `seed/` folder in the repository. Use these to populate your database with sample data.

## Running the Application

Start the application in development mode:

```bash
npm run start:dev
```

The server will start on the port specified in your `.env` file (default: 3000).

## GraphQL Playground

Once the application is running, access the GraphQL Playground UI at:

```
http://localhost:{PORT}/graphql
```

Example: `http://localhost:3000/graphql`

The GraphQL Playground provides an interactive interface for testing queries and mutations with auto-completion and documentation.

## Example Queries and Mutations

### User Module

#### Query: Fetch Paginated Users
```graphql
query GetUsers($page: Int, $pageSize: Int) {
  users(page: $page, pageSize: $pageSize) {
    data {
      id
      name
      username
      email
      posts {
        id
        title
      }
      albums {
        id
        name
      }
    }
    total
    page
    pageSize
  }
}
```

**Query Variables:**
```json
{
  "page": 1,
  "pageSize": 10
}
```

#### Query: Fetch Single User by ID
```graphql
query GetUser($id: String!) {
  user(id: $id) {
    id
    name
    username
    email
    posts {
      id
      title
      content
    }
    albums {
      id
      name
      description
    }
  }
}
```

**Query Variables:**
```json
{
  "id": "1"
}
```

#### Mutation: Create User
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    username
    email
  }
}
```

**Input Type:**
```graphql
input CreateUserInput {
  name: String!
  username: String!
  email: String!
}
```

**Query Variables:**
```json
{
  "input": {
    "name": "John Doe",
    "username": "johndoe",
    "email": "john.doe@example.com"
  }
}
```

### Posts Module

#### Query: Fetch Paginated Posts
```graphql
query GetPosts($userId: String, $page: Int, $pageSize: Int) {
  posts(userId: $userId, page: $page, pageSize: $pageSize) {
    data {
      id
      userId
      title
      content
      caption
    }
    total
    page
    pageSize
  }
}
```

**Query Variables (All Posts):**
```json
{
  "page": 1,
  "pageSize": 10
}
```

**Query Variables (Posts by User):**
```json
{
  "userId": "1",
  "page": 1,
  "pageSize": 10
}
```

#### Mutation: Create Post
```graphql
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    userId
    title
    content
    caption
  }
}
```

**Input Type:**
```graphql
input CreatePostInput {
  userId: String!
  title: String!
  content: String!
  caption: String
}
```

**Query Variables:**
```json
{
  "input": {
    "userId": "1",
    "title": "My First Post",
    "content": "This is the content of my first post",
    "caption": "An exciting new beginning"
  }
}
```

### Albums Module

#### Query: Fetch Paginated Albums
```graphql
query GetAlbums($userId: String, $page: Int, $pageSize: Int) {
  albums(userId: $userId, page: $page, pageSize: $pageSize) {
    data {
      id
      userId
      name
      description
      genre
    }
    total
    page
    pageSize
  }
}
```

**Query Variables (All Albums):**
```json
{
  "page": 1,
  "pageSize": 10
}
```

**Query Variables (Albums by User):**
```json
{
  "userId": "1",
  "page": 1,
  "pageSize": 10
}
```

#### Mutation: Create Album
```graphql
mutation CreateAlbum($input: CreateAlbumInput!) {
  createAlbum(input: $input) {
    id
    userId
    name
    description
    genre
  }
}
```

**Input Type:**
```graphql
input CreateAlbumInput {
  userId: String!
  name: String!
  description: String
  genre: String
}
```

**Query Variables:**
```json
{
  "input": {
    "userId": "1",
    "name": "Summer Vibes",
    "description": "A collection of summer hits",
    "genre": "Pop"
  }
}
```

#### Mutation: Update Album
```graphql
mutation UpdateAlbum($input: UpdateAlbumInput!) {
  updateAlbum(input: $input) {
    id
    userId
    name
    description
    genre
  }
}
```

**Query Variables:**
```json
{
  "input": {
    "id": "1",
    "name": "Summer Vibes 2024",
    "description": "Updated collection of summer hits",
    "genre": "Pop"
  }
}
```

#### Mutation: Delete Album
```graphql
mutation DeleteAlbum($userId: String!, $albumId: String!) {
  deleteAlbum(userId: $userId, albumId: $albumId)
}
```

**Query Variables:**
```json
{
  "userId": "<uuid>",
  "albumId": "<uuid>"
}
```

## Libraries Used

### Core Framework
- **NestJS** - A progressive Node.js framework for building efficient and scalable server-side applications. Provides excellent TypeScript support, modular architecture, and built-in dependency injection, making it ideal for enterprise-grade GraphQL APIs.

### Database
- **PostgreSQL** - A powerful, open-source relational database system known for its reliability, data integrity, and support for complex queries. Chosen for its ACID compliance and robust handling of relational data models.

- **Knex.js** - A flexible SQL query builder for Node.js that supports multiple database engines. Provides a clean API for database migrations, schema management, and query construction, ensuring database version control and consistency across environments.

- **Objection.js** - An elegant ORM built on top of Knex.js that provides a powerful and intuitive way to work with relational databases. Offers advanced features like eager loading, relations, validation, and lifecycle hooks while maintaining the flexibility of raw SQL when needed.

### GraphQL
- **Apollo Server** - Industry-standard GraphQL server that integrates seamlessly with NestJS. Provides a robust implementation of the GraphQL specification with built-in features like schema stitching, subscriptions, caching, and an interactive GraphQL Playground for development and testing.

### Additional Dependencies
- **class-validator** - Decorator-based validation library for ensuring data integrity
- **class-transformer** - Transforms plain objects to class instances with type safety
- **dotenv** - Manages environment variables securely

## Project Structure

```
graphql-task/
├── dist/
├── migrations/
├── node_modules/
├── seeds/
├── src/
│   ├── albums/
│   ├── db/
│   ├── graphql/
│   ├── posts/
│   ├── users/
│   ├── app.module.ts
│   ├── main.ts
│   └── schema.gql
├── test/
├── .env
├── .gitignore
├── knexfile.ts
├── package-lock.json
├── package.json
├── Readme.md
└── tsconfig.json
```
## Testing

Run the test suite:

```bash
npm test
```

### Test Results

The project includes comprehensive test coverage for all modules:

```
Test Suites: 6 passed, 6 total
Tests:       34 passed, 34 total
Snapshots:   0 total
Time:        5.442 s, estimated 9 s
```

**Test Files:**
- ✅ `src/albums/albums.service.spec.ts`
- ✅ `src/albums/albums.resolver.spec.ts`
- ✅ `src/users/users.resolver.spec.ts`
- ✅ `src/posts/posts.resolver.spec.ts`
- ✅ `src/posts/posts.service.spec.ts`
- ✅ `src/users/users.service.spec.ts`

All tests pass successfully, ensuring the reliability and correctness of the API endpoints and business logic.

---
