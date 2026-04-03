

---

# 🚀 Cloud Storage System

A **Full Stack Cloud Storage System** inspired by **AWS S3 / Google Drive** that allows users to securely upload, manage, and monitor files with **usage-based billing**, **user authentication**, and **storage management**.

---

Live Link : https://async-document-system.vercel.app](https://cloud-storage-system-8zhq.vercel.app/)

# 📌 Project Overview

This project simulates a **Cloud Object Storage System** where users can:

* Upload files
* Download files
* Delete files
* Track storage usage
* Monitor billing
* Manage user profile
* Authenticate securely

The system is designed to mimic **real-world cloud storage architecture** like **AWS S3 / Google Cloud Storage**.

---

# 🏗️ System Architecture

```id="8gj0yt"
Frontend (React + Tailwind)
        ↓
Backend (Node.js + Express)
        ↓
PostgreSQL Database
        ↓
Local Storage (S3 Simulation)
```

---

# ✨ Features

## 🔐 Authentication System

* User Signup
* User Login
* JWT Authentication
* Protected Routes
* Secure Password Hashing (bcrypt)

---

## 📁 File Management

* Upload files
* Download files
* Delete files
* User-specific file storage
* File size tracking
* Storage quota management

---

## 💳 Billing System

* Usage-based billing
* Upload cost calculation
* Delete cost calculation
* List request cost tracking
* Total cost calculation
* Usage breakdown dashboard

---

## 👤 User Profile

* View user name
* View user email
* Storage quota
* Plan details (Basic / Pro)
* Account details

---

## 📊 Dashboard

* Storage usage overview
* File statistics
* Billing insights
* User activity tracking

---

# 🧠 Key Concepts Implemented

* REST API Architecture
* JWT Authentication
* Middleware Authorization
* File Upload Handling
* Usage Based Billing
* Storage Quota System
* PostgreSQL Database Design
* Modular Backend Architecture

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

---

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt
* Multer (File Upload)

---

## Database

* PostgreSQL

---

## Storage

* Local Storage (S3 Simulation)

---

# 📂 Project Structure

```
Cloud-Storage-System
│
├── Backend
│   ├── Controllers
│   ├── Routes
│   ├── Middleware
│   ├── Models
│   └── server.js
│
├── Frontend
│   ├── components
│   ├── pages
│   ├── api
│   └── App.jsx
│
└── README.md
```

---

# 🚀 Installation Guide

## Clone Repository

```
git clone https://github.com/Inzamamkhan786/Cloud-Storage-System.git
```

---

## Backend Setup

```
cd Backend
npm install
```

Create `.env` file

```
PORT=5000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
```

Run Backend

```
npm start
```

---

## Frontend Setup

```
cd Frontend
npm install
npm run dev
```

---

# 📊 Database Schema

## Users Table

* id (UUID)
* name
* email
* password_hash
* storage_quota_bytes
* created_at

---

## Files Table

* id
* user_id
* file_name
* file_size
* created_at

---

## Usage Logs

* user_id
* operation
* cost
* timestamp

---

# 💡 Future Improvements

* Dark Mode
* File Sharing
* Folder System
* Drag and Drop Upload
* Cloud Deployment
* AWS S3 Integration
* Real-time usage tracking

---

# 🎯 Use Case

This project demonstrates:

* Cloud Storage System Design
* Backend Architecture
* Authentication System
* Billing System
* File Management System

Suitable for:

* Internship Projects
* College Projects
* Resume Projects
* Cloud Storage Learning

---

# 👨‍💻 Author

**Mohd Inzamamul Haque**

* B.Tech CSE (HCI & Gaming Technology)
* IIIT Nagpur

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub.

---

# 📜 License

This project is licensed under MIT License.

---

# 🔥 Project Status

✅ Active Development
✅ Internship Project
✅ Production Ready Architecture

---


