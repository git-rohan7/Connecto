Connecto — Real-Time Chat Application

Connecto is a modern real-time chat application built using React, Vite, and Firebase.
It provides user authentication, real-time messaging, online presence indicators, and a responsive UI.

🚀 Features

User authentication (Firebase Auth)

Real-time chat using Firestore

Online/offline status tracking

One-to-one messaging

Message timestamps and delivery

Responsive UI

Toast notifications

Protected routes

🛠️ Tech Stack
Layer	Technology
Frontend	React 19 + Vite
Routing	React Router DOM
Backend	Firebase
Database	Firestore
Auth	Firebase Authentication
Notifications	React Toastify
⚙️ Installation
git clone https://github.com/your-username/connecto.git
cd connecto
npm install


Create .env:

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

▶️ Running Locally
npm run dev


Open: http://localhost:5173

🌍 Deploy to GitHub Pages
1️⃣ Install gh-pages
npm install gh-pages --save-dev

2️⃣ Update vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/connecto/'
})

3️⃣ Update package.json
"homepage": "https://your-username.github.io/connecto",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

4️⃣ Deploy
npm run deploy


Your app will be live at:

https://your-username.github.io/connecto

🔐 Security

Restrict Firestore reads/writes to authenticated users

Never commit .env files

🧩 Future Improvements

Group chats

Typing indicators

Read receipts

Media sharing

🧑‍💻 Author

Rohan Kumar
B.Tech CSE (Data Science) — UEM Kolkata

📜 License

MIT License
