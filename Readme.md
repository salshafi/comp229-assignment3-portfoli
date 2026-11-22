@'
# COMP229 Assignment 3: MERN Portfolio

Full-stack portfolio app (MongoDB, Express, React, Node) with JWT authentication and role-based CRUD.

## Features
- Sign up and sign in (JWT, bcrypt password hashing)
- Roles: admin can create, edit and delete; user can only view
- Education, Project and Contact pages connected to the API
- Admin account stored in MongoDB (created by a seed script)

## Setup
1. Create a `.env` file in the project root with these variables (use your own values):
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
2. Install and seed: