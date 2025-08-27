# 📺 YouTube Clone - MERN Stack  

## 📌 Overview  
This is a **YouTube Clone Application** built using the **MERN Stack (MongoDB, Express, React, Node.js)**.  
The project replicates core functionalities of YouTube, such as browsing videos, viewing channels, user authentication, video management, and comments.  

It is designed as a **full-stack capstone project** to demonstrate real-world application development skills.  

---

## 🎯 Objectives  
- Build a **full-stack video platform** where users can view, upload, and interact with videos.  
- Implement **JWT authentication** for secure user login and registration.  
- Use **MongoDB** to store users, videos, channels, and comments.  
- Create a **responsive UI** with React and manage state using Redux.  

---

## 🚀 Features  

### 🔹 Frontend (React + Redux + Vite)
- YouTube-style **Home Page** with header, sidebar, filters, and video grid.  
- **User Authentication**: Register/Login using JWT.  
- **Search & Filter**: Search videos by title, filter by category.  
- **Video Player Page**: Video player, like/dislike, comments (Add, Edit, Delete).  
- **Channel Page**: Create channel (after login), manage videos.  
- **Responsive Design**: Works on desktop, tablet, and mobile.  

### 🔹 Backend (Node.js + Express + MongoDB)
- **User APIs**: Register, Login, JWT Auth.  
- **Channel APIs**: Create & fetch channel details.  
- **Video APIs**: Upload, fetch, update, delete videos.  
- **Comment APIs**: Add, fetch, update, delete comments.

  
---
google link https://drive.google.com/file/d/1b3jS1Wwiu2ugtqAYFUS9IKt9kHytKJnP/view?usp=sharing


---
## 📂 Project Folder Structure  

```bash
youtube-clone-internshala/
│
├── frontend/                         # React (Vite) Frontend
│   ├── package.json                  # Dependencies info
│   ├── vite.config.js                # Vite config
│   ├── public/                       # Public assets
│   │   └── vite.svg
│   ├── src/                          # Main source code
│   │   ├── App.jsx                   # Root component
│   │   ├── App.css                   # Global CSS
│   │   ├── main.jsx                  # Entry point
│   │   ├── components/               # Reusable Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── ChannelInfo.jsx
│   │   │   ├── CommentBox.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Footer.jsx
│   │   ├── hooks/                    # Custom React Hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useDebounce.js
│   │   │   └── useFetch.js
│   │   ├── pages/                    # Page-level Components
│   │   │   ├── Feed.jsx
│   │   │   ├── Watch.jsx
│   │   │   ├── Channel.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── redux/                    # Redux Toolkit State Management
│   │   │   ├── store.js
│   │   │   ├── authSlice.js
│   │   │   ├── channelSlice.js
│   │   │   ├── videoSlice.js
│   │   │   └── isAuthenticated.js
│   │   ├── utils/                    # Helper functions
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   └── supabaseconfig/           # Supabase Config
│   │       └── client.jsx
│
├── youtubeBackend/                   # Node.js + Express Backend
│   ├── .env                          # Environment variables
│   ├── package.json
│   ├── server.js                     # Entry point
│   ├── docs.md                       # API Documentation
│   ├── dbConnection/                 # MongoDB connection
│   │   └── Connect.js
│   ├── middleware/                   # Middlewares
│   │   └── auth.js
│   ├── controllers/                  # Controllers (Business Logic)
│   │   ├── AuthController.js
│   │   └── PostController.js
│   ├── models/                       # MongoDB Models
│   │   ├── UserModel.js
│   │   └── PostModel.js
│   └── routes/                       # Express Routes
│       ├── authRoutes.js
│       └── postRoutes.js
│
└── README.md                         # Documentation


---


🛠️ Technologies Used

Frontend: React.js (Vite), React Router, Redux Toolkit, Axios, Tailwind/CSS, Supabase (optional).
Backend: Node.js, Express.js, MongoDB (Mongoose), JWT, dotenv.

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/parshotamlal/youtube-clone-internshala.git
cd youtube-clone-internshala

2️⃣ Setup Backend
cd youtubeBackend
npm install


---
Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Run backend:

npm start

3️⃣ Setup Frontend
cd ../frontend
npm install
npm run dev

  http://localhost:5173/
🔑 Create a .env file in frontend/ and add:

---
# 🌍 Backend API Base URL
VITE_BASE_URL="https://youtube-clone-mern-1-f4oj.onrender.com/"

# 🔑 Supabase Configuration
VITE_SUPABASE_URL="https://uaqybsttddfdnvqgyape.supabase.co"
VITE_SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcXlic3R0ZGRmZG52cWd5YXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwODMyMjcsImV4cCI6MjA3MTY1OTIyN30._h6r5ZGKcazFriujhGJFnoxqDjTluZIhFIqxo5OUbyk"


Run frontend:

npm run dev

📦 Tech Stack

Frontend: React, React Router, Redux, Axios, TailwindCSS

Backend: Node.js, Express.js, MongoDB, JWT

Database: MongoDB Atlas

Storage: Supabase

Version Control: Git + GitHub

Deployment: , Render (Backend)

🌍 Deployment

Backend: Render / Railway / Vercel (serverless).

Frontend: local  http://localhost:5173/


