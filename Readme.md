# COMP229 Assignment 3: MERN Portfolio

Full-stack portfolio app (MongoDB, Express, React, Node) with JWT authentication and role-based CRUD.

## Features
- Sign up and sign in (JWT, bcrypt password hashing)
- Roles: admin can create, edit and delete; user can only view
- Education, Project and Contact pages connected to the API
- Admin account stored in MongoDB (created by a seed script)

## Setup
1. Copy `.env.example` to `.env` and fill in your own values (MONGODB_URI, JWT_SECRET, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD).
2. Install and create the admin user:

        npm install
        node scripts/seedAdmin.js

3. Start the server (port 3000):

        node server.js

4. Start the client (port 5173):

        cd client
        npm install
        npx vite

## API tests
See `api-tests.http` (VS Code REST Client).

Author: Salman Shafi, COMP229 Fall 2026