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

Modern React 19 architecture

🛠️ Tech Stack
Layer	Technology
Frontend	React 19 + Vite
Routing	React Router DOM
Backend	Firebase
Database	Firestore
Auth	Firebase Authentication
Notifications	React Toastify
Linting	ESLint
📁 Project Structure
src/
│
├── components/      # Reusable UI components
├── pages/           # Application pages (Login, Chat, Profile etc.)
├── config/          # Firebase configuration
├── context/         # React Context (AppContext)
├── lib/             # Helper functions (uploads, utilities)
├── assets/          # Images and static assets
│
├── App.jsx
├── main.jsx
└── index.css

⚙️ Installation
1️⃣ Clone the repository
git clone https://github.com/your-username/connecto.git
cd connecto

2️⃣ Install dependencies
npm install

3️⃣ Configure Firebase

Create a .env file in the root:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id


Update src/config/firebase.js to use environment variables.

▶️ Running the Project
npm run dev


Open: http://localhost:5173

🏗️ Build for Production
npm run build


Preview build:

npm run preview

🔐 Security

Firestore security rules should restrict reads/writes to authenticated users only.

Do not expose Firebase credentials in public repositories.

Use .env for secrets.

📦 Dependencies

Main dependencies:

react

firebase

react-router-dom

react-toastify

🧩 Future Improvements

Group chats

Typing indicators

Read receipts

Media/file sharing

Message reactions

User blocking/reporting

🧑‍💻 Author

Rohan Kumar
B.Tech CSE (Data Science) — UEM Kolkata

📜 License

This project is licensed under the MIT License.

✔️ Notes

Built with scalability and modularity in mind.

Optimized for modern browsers.

Uses React Context for state management.
