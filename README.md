# Connecto — Real‑Time Chat Application

Make real‑time conversations delightful. Connecto is a modern, lightweight chat app built with React + Vite and powered by Firebase for auth and realtime data. It includes authentication, one‑to‑one messaging, online presence, and a responsive UI so you can focus on features — not plumbing.

[![Built with React](https://img.shields.io/badge/react-19-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-fast-brightgreen?logo=vite)]
[![Firebase](https://img.shields.io/badge/firebase-realtime-yellow?logo=firebase)]
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

Table of contents
- [Highlights](#highlights)
- [Demo](#demo)
- [Quick start](#quick-start)
- [Firebase configuration](#firebase-configuration)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Security](#security)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## Highlights

- Fast, modern frontend: React 19 + Vite
- Auth with Firebase Authentication (email / social providers)
- Real‑time messaging using Firestore
- Online / offline presence indicators
- One‑to‑one conversations with timestamps & delivery status
- Protected routes and toast notifications (React Toastify)
- Responsive, mobile-first UI and modular architecture

---

## Demo

Add a short GIF or screenshot here to show the chat experience:

![Connecto demo placeholder](docs/demo.gif)

Live demo (if available): https://your-demo-url.example

---

## Quick start

Requirements
- Node.js (recommended >= 18)
- npm or yarn
- A Firebase project

Clone and install
```bash
git clone https://github.com/git-rohan7/Connecto.git
cd Connecto
npm install
```

Run (development)
```bash
npm run dev
# open http://localhost:5173
```

Build and preview
```bash
npm run build
npm run preview
```

Test
```bash
npm test
# or
npm run lint
```

---

## Firebase configuration

Create a Firebase project and enable Firestore + Authentication.

Create a `.env` file in the project root with the following keys (Vite prefix `VITE_` required):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Update `src/config/firebase.js` (or `.ts`) to read these environment variables. Example:
```js
// src/config/firebase.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
```

Firestore security: use rules to restrict reads/writes to authenticated users and to enforce per‑room/per‑conversation access.

---

## Project structure

src/
├── assets/          # images and static assets  
├── components/      # reusable UI components (Message, Avatar, Input, etc.)  
├── pages/           # app pages (Login, Chat, Profile)  
├── config/          # firebase config and environment helpers  
├── context/         # React Context (AppContext, AuthContext)  
├── lib/             # utilities (uploads, helpers)  
├── hooks/           # custom hooks (useAuth, useMessages)  
├── styles/          # global and component styles  
├── App.jsx  
├── main.jsx  

(Adjust if you use TypeScript — e.g. `.tsx` / `.ts` files.)

---

## Tech stack

- Frontend: React 19 + Vite  
- Routing: react-router-dom  
- Backend / Realtime: Firebase (Firestore)  
- Auth: Firebase Authentication  
- Notifications: react-toastify  
- Linting: ESLint  
- (Optional) Storage: Firebase Storage for media

---

## Security

- Keep Firebase keys in `.env` — never commit secrets.
- Configure Firestore security rules to validate authenticated access and enforce ownership.
- Sanitize user inputs where appropriate (file uploads, display names).
- Use Firebase rules/Cloud Functions to prevent unauthorized reads/writes.

---

## Roadmap (planned features)

- Group chat / channels
- Typing indicators & read receipts
- Media / file sharing with previews
- Message reactions & threads
- User blocking / reporting and moderation tools
- End‑to‑end encryption option (advanced)

Have a feature request? Open an issue or start a discussion.

---

## Contributing

Contributions welcome! A suggested workflow:
1. Fork the repo and create a branch: `feature/your-idea`
2. Run tests and linters locally
3. Open a PR with a clear description and screenshots if UI changes

See CONTRIBUTING.md for contribution guidelines and code of conduct.

---

## Author

Rohan Kumar  
GitHub: [git-rohan7](https://github.com/git-rohan7)

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

Notes
- Built with modularity and scalability in mind.
- Optimized for modern browsers and mobile form factors.
- Uses React Context for lightweight state management; swap in Redux / Zustand if needed.
