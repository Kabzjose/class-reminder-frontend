Class Reminder App (MERN Stack)
Overview

A full-stack Class Reminder Application built using the MERN stack.
It allows users to register, log in, and manage their class schedules with reminders and a structured timetable view.

🚀 Features
🔐 Authentication
User registration & login
Password hashing using bcrypt
JWT-based authentication
Protected routes (user-specific data access)
📅 Class Management
Create, update, delete classes
View all classes in a timetable
Classes sorted by day and time
User-specific class isolation
🎨 Frontend
Built with Vite + React
Tailwind CSS styling
Responsive UI
Form validation
⚙️ Backend
Node.js + Express API
MongoDB database (Atlas)
Mongoose ODM
RESTful API design
🏗️ Tech Stack
Frontend
React (Vite)
Tailwind CSS
Fetch API
Backend
Node.js
Express.js
MongoDB Atlas
Mongoose
JWT (Authentication)
bcryptjs (Password hashing)
📁 Project Structure
class-reminder/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   ├── pages/
│   │   └── App.jsx
│   └── .env
