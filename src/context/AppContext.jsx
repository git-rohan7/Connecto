import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { auth, db } from "../config/firebase";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);

  const lastSeenIntervalRef = useRef(null);

  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  const [chatVisible, setChatVisible] = useState(false);

  const clearLastSeenInterval = () => {
    if (lastSeenIntervalRef.current) {
      clearInterval(lastSeenIntervalRef.current);
      lastSeenIntervalRef.current = null;
    }
  };

  const loadUserData = useCallback(async (uid) => {
    if (!uid) return;

    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User document does not exist");
        return;
      }

      const data = { ...userSnap.data(), id: userSnap.id };
      setUserData(data);

      await updateDoc(userRef, { lastSeen: serverTimestamp() });

      clearLastSeenInterval();

      lastSeenIntervalRef.current = setInterval(async () => {
        try {
          const current = auth.currentUser;
          if (current && current.uid === uid) {
            await updateDoc(userRef, { lastSeen: serverTimestamp() });
          } else {
            clearLastSeenInterval();
          }
        } catch (err) {
          console.error("Error updating lastSeen:", err);
        }
      }, 60_000);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  });

  useEffect(() => {
    return () => {
      clearLastSeenInterval();
    };
  }, []);

  useEffect(() => {
    if (!userData) return;

    const uidForChat = userData.id || userData.uid;
    if (!uidForChat) {
      console.warn("No id available on userData for chat subscription");
      return;
    }

    const chatRef = doc(db, "chats", uidForChat);

    const unSub = onSnapshot(
      chatRef,
      async (snapshot) => {
        if (!snapshot.exists()) {
          setChatData([]);
          return;
        }

        const chatItems = snapshot.data()?.chatData || [];

        // resolve user data for each chat item
        const tempData = await Promise.all(
          chatItems.map(async (item) => {
            try {
              const userRef = doc(db, "users", item.rId);
              const userSnap = await getDoc(userRef);
              return {
                ...item,
                userData: userSnap.exists()
                  ? { ...userSnap.data(), id: userSnap.id }
                  : null,
              };
            } catch (err) {
              console.error("Error fetching chat item user:", err);
              return { ...item, userData: null };
            }
          })
        );

        // guard against missing updatedAt fields and different types
        tempData.sort((a, b) => {
          const aTs = a.updatedAt?.toMillis
            ? a.updatedAt.toMillis()
            : a.updatedAt || 0;
          const bTs = b.updatedAt?.toMillis
            ? b.updatedAt.toMillis()
            : b.updatedAt || 0;
          return bTs - aTs;
        });

        setChatData(tempData);
      },
      (error) => {
        console.error("Chat onSnapshot error:", error);
      }
    );

    return () => {
      unSub();
    };
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,
    setMessages,
    messagesId,
    setMessagesId,
    chatUser,
    setChatUser,
    chatVisible,
    setChatVisible,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
