# 🚴‍♂️ Bike Manager

Bike Manager is a web application for managing a bicycle inventory.  
It uses **Node.js, TypeScript, Express, MongoDB, EJS**, and includes **authentication, sessions, and role-based access control**.

---

## ⭐ Features

### 🔐 Authentication & Roles
- Login, logout, and registration pages  
- Passwords securely hashed with **bcrypt**
- Session-based authentication using **express-session**
- User roles:
  - **ADMIN** → can edit products
  - **USER** → view-only mode
- Redirect logic:
  - Logged-in users cannot access `/login`
  - Non-logged users cannot access the dashboard (`/`)
  - Only ADMIN can access `/edit/:id`

### 👥 Default Users (Auto-created)
| Username | Password | Role   |
|----------|----------|--------|
| admin    | admin    | admin  |
| user     | user     | user   |

---

## 🗄 Database (MongoDB)

Collections:
- **products**
- **bikeTypes**
- **users**

At application startup:
- If products or bike types collections are empty, data is fetched from the external API and inserted.
- Default `admin` and `user` accounts are created automatically.

---

## 🏠 Dashboard

Displays all bikes from MongoDB with:
- Search bar (filters by name)
- Sorting (name, category, price, availability)
- Links to product details
- Edit button (ADMIN-only)

---

## ✏️ Edit Page (ADMIN Only)

Admin users can update:
- Name  
- Category  
- Price  
- Description  
- Availability  

---

## 📂 Project Structure
- /auth
- /database.ts
- /server.ts
- /views
- /public/css
- /types

---

## ⚙️ Technologies Used

- Node.js  
- TypeScript  
- Express  
- MongoDB  
- bcrypt  
- express-session  
- cookie-parser  
- EJS Templates  
- CSS  

---

## 🚀 Setup

### 1️⃣ Install dependencies
- npm install express express-session cookie-parser bcrypt mongodb dotenv ejs
- npm install --save-dev typescript ts-node nodemon @types/express @types/express-session @types/cookie-parser @types/bcrypt @types/node

### 2️⃣ Create `.env` file: 
- MONGO_URI="your_mongo_connection_string"
- SESSION_SECRET="your_secret_here"
  
---

## ✔️ Assignment Completed

This project includes:
- MongoDB data load  
- Data displayed from database  
- Authentication system  
- Role-based permissions  
- Edit functionality  
- Login, Register, Logout  
- Secure password hashing  
- Dashboard protection  

---
