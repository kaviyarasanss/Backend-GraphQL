# GraphQL API Project

A robust GraphQL API built with NestJS, PostgreSQL, and Apollo Server for managing users, albums, and posts.

## Table of Contents
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [GraphQL Playground](#graphql-playground)
- [Example Queries and Mutations](#example-queries-and-mutations)
- [Testing](#testing)
- [Libraries Used](#libraries-used)
- [Project Structure](#project-structure)

## Getting Started

### Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/kaviyarasanss/Backend-GraphQL.git
```

Navigate to the project directory:

```bash
cd Backend-GraphQL
```

## Installation

Install all project dependencies:

```bash
npm install
```

## Database Setup

### 1. Configure Environment Variables

**Create a `.env` file at the root of your project directory.**

If a `.env` file already exists:
- Open the existing `.env` file and update the database credentials with your own values

If no `.env` file exists:
- Create a new file named `.env` in the root folder
- Copy and paste the template below
- Replace the placeholder values with your actual database credentials

**Environment Variables Template:**

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name

# Application Configuration
PORT=3000

# Environment
NODE_ENV=development
```

**Example with actual values:**

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=mySecurePassword123
DB_NAME=graphql_api_db

# Application Configuration
PORT=3000

# Environment
NODE_ENV=development
```

**For cloud databases (e.g., Supabase, AWS RDS):**
- Replace `DB_HOST` with your cloud database URL
- Update `DB_PORT` if using a custom port
- Use the credentials provided by your cloud database service

### 2. Database Initialization

**If using a cloud database (e.g., Supabase):**
- No need to run migrations or seed files
- Ensure your cloud database is already set up and populated
- Update the `.env` file with your cloud database credentials

**If using a local PostgreSQL database:**

You need to run migrations and seed files to set up and populate your database.

#### Run Migrations

Create and run database migrations to set up the tables:

```bash
# Create a new migration file
npm run migrate:make {migrationName}

# Run a specific migration file
npm run migrate:up:single -- {filename}
```

**Note:** Migration files are provided in the `migrations/` folder in the repository. Run them in order to create the necessary database schema.

#### Run Seed Files

Populate the database with initial data using seed files:

```bash
# Create a new seed file
npm run seed:make {filename}

# Run a specific seed file
npm run seed:run {filename}
```

**Note:** Seed files are provided in the `seed/` folder in the repository. Use these to populate your database with sample data.

## Running the Application

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Verify your `.env` file** is properly configured with your database credentials.

3. **Start the Application** in development mode:
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

#### Query: Fetch All Users (Paginated)

**With Variables:**
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
        content
        caption
      }
      albums {
        id
        name
        description
        genre
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
  "page": 2,
  "pageSize": 2
}
```

**Direct Example (Copy & Paste to Playground):**
```graphql
query GetUsers {
  users(page: 2, pageSize: 2) {
    data {
      id
      name
      username
      email
      posts {
        id
        title
        content
        caption
      }
      albums {
        id
        name
        description
        genre
      }
    }
    total
    page
    pageSize
  }
}
```

---

#### Query: Fetch Single User by ID

**With Variables:**
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
      caption
    }
    albums {
      id
      name
      description
      genre
    }
  }
}
```

**Query Variables:**
```json
{
  "id": "8eecea99-eacc-47ff-adb1-1e532e03ceee"
}
```

**Direct Example (Copy & Paste to Playground):**
```graphql
query GetUser {
  user(id: "8eecea99-eacc-47ff-adb1-1e532e03ceee") {
    id
    name
    username
    email
    posts {
      id
      title
      content
      caption
    }
    albums {
      id
      name
      genre
      description
    }
  }
}
```

---

#### Mutation: Create User

**With Variables:**
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

**Direct Example (Copy & Paste to Playground):**
```graphql
mutation CreateUser {
  createUser(input: {
    name: "New name",
    username: "user",
    email: "not@gmail.com"
  }) {
    id
    name
    username
    email
  }
}
```

---

### Posts Module

#### Query: Fetch All Posts of a Specific User

**With Variables:**
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

**Query Variables:**
```json
{
  "userId": "8eecea99-eacc-47ff-adb1-1e532e03ceee",
  "page": 2,
  "pageSize": 1
}
```

**Direct Example (Copy & Paste to Playground):**
```graphql
query GetPosts {
  posts(userId: "8eecea99-eacc-47ff-adb1-1e532e03ceee", page: 2, pageSize: 1) {
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

---

#### Query: Fetch All Posts (All Users)

**With Variables:**
```graphql
query GetPosts($page: Int, $pageSize: Int) {
  posts(page: $page, pageSize: $pageSize) {
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

**Query Variables:**
```json
{
  "page": 2,
  "pageSize": 10
}
```

**Direct Example (Copy & Paste to Playground):**
```graphql
query GetPosts {
  posts(page: 2, pageSize: 10) {
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

---

#### Mutation: Create Post for a User

**With Variables:**
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
    "userId": "8eecea99-eacc-47ff-adb1-1e532e03ceee",
    "title": "My First Post",
    "content": "This is the content of my first post",
    "caption": "An exciting new beginning"
  }
}
```

**Direct Example (Copy & Paste to Playground):**
```graphql
mutation CreatePost {
  createPost(input: {
    userId: "8eecea99-eacc-47ff-adb1-1e532e03ceee",
    title: "post",
    content: "content",
    caption: "123"
  }) {
    id
    userId
    title
    content
    caption
  }
}
```

---

### Albums Module

#### Query: Fetch Albums of a Specific User

**With Variables:**
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

**Query Variables:**
```json
{
  "userId": "8eecea99-eacc-47ff-adb1-1e532e03ceee",
  "page": 1,
  "pageSize": 10
}
```

**Direct Example (Copy & Paste to Playground):**
```graphql
query GetAlbums {
  albums(userId: "8eecea99-eacc-47ff-adb1-1e532e03ceee", page: 1) {
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

---

#### Query: Fetch All Albums (All Users)

**With Variables:**
```graphql
query GetAlbums($page: Int, $pageSize: Int) {
  albums(page: $page, pageSize: $pageSize) {
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

**Query Variables:**
```json
{
  "page": 1,
  "pageSize": 10
}
```

**Direct Example (Copy & Paste to Playground):**
```graphql
query GetAlbums {
  albums(page: 1) {
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

---

#### Mutation: Create Album for a User

**With Variables:**
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
    "userId": "8eecea99-eacc-47ff-adb1-1e532e03ceee",
    "name": "Summer Vibes",
    "description": "A collection of summer hits",
    "genre": "Pop"
  }
}
```

**Direct Example (Copy & Paste to Playground):**
```graphql
mutation CreateAlbum {
  createAlbum(input: {
    userId: "8eecea99-eacc-47ff-adb1-1e532e03ceee",
    name: "aaa",
    genre: "aaa",
    description: "aaa"
  }) {
    id
    userId
    name
    description
    genre
  }
}
```

---

#### Mutation: Update Album

**With Variables:**
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
    "id": "e05e42cd-db71-47d3-a994-7c541bbfc8b3",
    "genre": "ddd"
  }
}
```

**Direct Example (Copy & Paste to Playground):**
```graphql
mutation UpdateAlbum {
  updateAlbum(input: {
    id: "e05e42cd-db71-47d3-a994-7c541bbfc8b3",
    genre: "ddd"
  }) {
    id
    userId
    name
    description
    genre
  }
}
```

---

#### Mutation: Delete Album

**With Variables:**
```graphql
mutation DeleteAlbum($userId: String!, $albumId: String!) {
  deleteAlbum(userId: $userId, albumId: $albumId)
}
```

**Query Variables:**
```json
{
  "userId": "8eecea99-eacc-47ff-adb1-1e532e03ceee",
  "albumId": "9c2e1975-f315-421d-88d2-69a5af3025d3"
}
```

**Direct Example (Copy & Paste to Playground):**
```graphql
mutation DeleteAlbum {
  deleteAlbum(
    userId: "8eecea99-eacc-47ff-adb1-1e532e03ceee",
    albumId: "9c2e1975-f315-421d-88d2-69a5af3025d3"
  )
}
```

---

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
├── node_modules/
├── src/
│   ├── albums/
│   ├── db/
│   ├── graphql/
│   ├── posts/
│   ├── users/
│   ├── app.module.ts
│   ├── main.ts
│   └── schema.gql
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── Readme.md
└── tsconfig.json
```

---
