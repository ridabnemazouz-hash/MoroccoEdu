# Morocco Higher Education API 🎓

A professional full-stack system providing a comprehensive database of Moroccan universities and higher education institutions (ENSA, EST, FST, FSJES, ESEF, etc.). Ready for integration with students' web applications.

## 🚀 Key Features

- **100+ Institutions**: Curated list including codes (e.g., ENSA-C), cities, and types.
- **Advanced Search**: Case-insensitive search across name, short name, city, and code.
- **Scalable Backend**: Built with Node.js, Express, and PostgreSQL.
- **Clean Data**: No duplicates, normalized city names, and official French naming.
- **Environment Driven**: Fully configurable via `.env`.
- **Bonus**: Pagination support and easy-to-use seeding script.

## 📁 Project Structure

```text
├── config/             # Database connection logic
├── controllers/        # API request handling
├── data/               # Static JSON dataset (100+ items)
├── database/           # SQL schema definitions
├── models/             # Database queries (School model)
├── routes/             # API endpoint routing
├── scripts/            # Database seeding utilities
├── .env.example        # Environment variable template
├── app.js              # Server entry point
└── package.json        # Dependencies
```

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v14+)
- PostgreSQL installed and running

### 2. Installation
```bash
npm install
```

### 3. Database Configuration
1. Create a database in PostgreSQL:
   ```sql
   CREATE DATABASE morocco_schools;
   ```
2. Create the table using the schema:
   ```bash
   psql -U your_user -d morocco_schools -f database/schema.sql
   ```
3. Copy `.env.example` to `.env` and update your credentials:
   ```bash
   cp .env.example .env
   ```

### 4. Seed Data
Populate your database with the curated list:
```bash
node scripts/seed.js
```

### 5. Start Server
```bash
npm start
```
The server will be available at `http://localhost:5000`.

## 📡 API Endpoints

### 1. Get All Schools
`GET /schools`
- **Query Params**: `limit`, `offset` (for pagination)
- **Example**: `GET http://localhost:5000/schools?limit=10&offset=0`

### 2. Search Schools
`GET /schools/search?q=...`
- **Query Params**: `q` (search term), `limit`, `offset`
- **Example Search**: 
  - `q=ENSA` (All ENSA schools)
  - `q=Casablanca` (All schools in Casablanca)
  - `q=ESEF-J` (Specific school by code)

## 📊 Database Schema

```sql
CREATE TABLE schools (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  code TEXT UNIQUE,
  city TEXT,
  type TEXT,
  is_public BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---
Developed with ❤️ for Moroccan Students.
