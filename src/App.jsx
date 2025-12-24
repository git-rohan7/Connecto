import React, { useContext, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Chat from './pages/Chat/Chat';
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate';
import { ToastContainer } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { AppContext } from './context/AppContext';

export const App = () => {
  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user.uid);
        // only redirect to /chat if currently at the public login route
        if (location.pathname === '/') {
          navigate('/chat', { replace: true });
        }
      } else {
        // if not authenticated and not already on login, send to login
        if (location.pathname !== '/') {
          navigate('/', { replace: true });
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, loadUserData, location.pathname]); // <-- include location.pathname

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
      </Routes>
    </>
  );
};

export default App;
