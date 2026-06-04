# Hobbyblog
# HobbyLog

A full-stack hobby blog with authentication, built with **TypeScript**, **Node.js**, **Express**, and **Neo4j AuraDB**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | Neo4j AuraDB (Graph DB) |
| Auth | JWT + bcryptjs |
| Frontend | Vanilla HTML/CSS/JS |

---

## Features

- User signup and login with hashed passwords (bcrypt)
- JWT-based session management
- Create, view, and delete hobby blog posts
- Posts categorised by hobby type
- Posts stored as graph nodes connected to users via `WROTE` relationships in Neo4j
- Responsive login/signup page (split panel on desktop, stacked on mobile)
- Protected API routes via middleware
- Auto-redirect on login/logout

---

## Project Structure

```
auth-app/
├── src/
│   ├── db/
│   │   └── neo4j.ts          # Neo4j driver setup
│   ├── models/
│   │   ├── user.ts           # User Cypher queries
│   │   └── post.ts           # Post Cypher queries
│   ├── routes/
│   │   ├── auth.ts           # /api/auth/signup & /login
│   │   └── posts.ts          # /api/posts CRUD
│   ├── middleware/
│   │   └── auth.ts           # JWT protect middleware
│   └── index.ts              # App entry point
├── frontend/
│   ├── index.html            # Login / Signup page
│   └── dashboard.html        # Blog dashboard
├── .env                      # Environment variables (never commit)
├── .gitignore
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A [Neo4j AuraDB](https://neo4j.com/cloud/aura/) free instance (or Neo4j Desktop)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/hobbylog.git
cd hobbylog

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
NEO4J_URI=neo4j+s://xxxxxxxx.databases.neo4j.io
NEO4J_USERNAME=your_username
NEO4J_PASSWORD=your_password
NEO4J_DATABASE=your_database_name
JWT_SECRET=your_super_secret_key
PORT=3000
```

> **Never commit your `.env` file.** Add it to `.gitignore`.

### Run in Development

```bash
npm run dev
```

Server starts at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

---

## API Reference

### Auth

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |

**Signup body:**
```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "Secret123"
}
```

**Login body:**
```json
{
  "email": "ada@example.com",
  "password": "Secret123"
}
```

**Response (both):**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "name": "Ada Lovelace",
    "email": "ada@example.com"
  }
}
```

---

### Posts

All post routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts for logged-in user |
| POST | `/api/posts` | Create a new post |
| DELETE | `/api/posts/:id` | Delete a post by ID |

**Create post body:**
```json
{
  "title": "Golden hour at the lake",
  "content": "Woke up at 5am to catch the light...",
  "category": "Photography"
}
```

---

## Neo4j Graph Model

```
(:User)-[:WROTE]->(:Post)
```

**User node properties:**
```
id, name, email, password, createdAt
```

**Post node properties:**
```
id, title, content, category, createdAt
```

**Useful Cypher queries:**

```cypher
-- View all users
MATCH (u:User) RETURN u

-- View all posts with their authors
MATCH (u:User)-[:WROTE]->(p:Post)
RETURN u.name, p.title, p.category, p.createdAt

-- Delete a specific user and all their posts
MATCH (u:User {email: "ada@example.com"})
DETACH DELETE u
```

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start with nodemon + ts-node |
| Build | `npm run build` | Compile TypeScript to `/dist` |
| Start | `npm start` | Run compiled output |

---

## Dependencies

```json
"dependencies": {
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0",
  "express": "^4.18.0",
  "jsonwebtoken": "^9.0.0",
  "neo4j-driver": "^5.0.0"
},
"devDependencies": {
  "@types/bcryptjs": "^2.4.2",
  "@types/cors": "^2.8.13",
  "@types/express": "^4.17.17",
  "@types/jsonwebtoken": "^9.0.0",
  "@types/node": "^20.0.0",
  "nodemon": "^3.0.0",
  "ts-node": "^10.9.0",
  "typescript": "^5.0.0"
}
```

---

## Security Notes

- Passwords are hashed with bcrypt (12 salt rounds)
- JWTs expire after 7 days
- All post routes are protected with JWT middleware
- Users can only delete their own posts (matched by `userId` in Cypher)
- Never expose your `.env` or commit secrets to version control

---

## Roadmap

- [ ] Edit existing posts
- [ ] Post likes / reactions
- [ ] User profile page
- [ ] Image uploads per post
- [ ] Google OAuth login
- [ ] Public blog view per user
- [ ] Search and filter posts

---

## License

MIT