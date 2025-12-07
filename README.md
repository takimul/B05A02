# Vehicle Rental Management System – Backend (Express + PostgreSQL)

A complete backend API for managing a vehicle rental business, including authentication, user roles, vehicle management, and booking logic with automated availability updates.

🔗 **Live API URL:** https://b05-a02.vercel.app/
📦 **Tech Stack:** Node.js, Express.js, PostgreSQL, JWT, TypeScript

---

## ✨ Features

### 🔐 **Authentication & Authorization**

- JWT-based secure login & registration.
- Role-based access control (**Admin**, **Customer**).
- Global type-safe `req.user` via TypeScript declaration merging.

### 👥 **User Management**

- Admin can fetch all users.
- Users can update their own profile.
- Admin can delete users (with safety checks).
- Middleware-protected routes.

### 🚘 **Vehicle Management**

- Create, update, delete vehicles (**Admin only**).
- Automatic availability status updates.
- Fetch vehicle list (public).

### 📅 **Booking System**

- Customers can book vehicles for valid date ranges.
- Admin can create bookings for any user.
- Pricing auto-calculated based on day difference.
- Prevent double-booking of vehicles.
- Booking cancellation rules:
  - Customers can cancel before start date.
  - Admin can cancel anytime.
- Admin can mark vehicles as returned.
- Auto-update: expired bookings automatically return vehicles.

---

## 🏗️ Technology Stack

| Category   | Tech                     |
| ---------- | ------------------------ |
| Runtime    | Node.js                  |
| Framework  | Express.js               |
| Language   | TypeScript               |
| Database   | PostgreSQL               |
| ORM/Query  | pg                       |
| Auth       | JWT, bcrypt              |
| Middleware | Logger, Auth, Role Guard |
| Validation | Custom business rules    |

---

## ⚙️ Setup & Installation

### **1. Clone the repository**

```bash
git clone https://github.com/takimul/B05A02.git
cd B05A02
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Configure environment variables**

Create `.env`:

```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/vehiclerental
JWT_SECRET=your_jwt_secret
```

### **4. Run database migrations (SQL schema)**

Run your SQL files to create tables.

### **5. Start the server**

```bash
npm run dev
```

---

## 🚀 Usage

### **Start development server**

```bash
npm run dev
```

### **Start production build**

```bash
npm run build
npm start
```

---

## 🛡️ Security

- Passwords hashed using bcrypt.
- JWT tokens securely validated.
- Route-level role validation.
- Prevents unauthorized booking actions.
- Automatic cleanup of expired bookings.

---
