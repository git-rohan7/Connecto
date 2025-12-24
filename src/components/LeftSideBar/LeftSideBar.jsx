import React, { useContext, useState } from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

function LeftSideBar() {
  const navigate = useNavigate();
  const {
    userData,
    chatData = [],
    chatUser,
    setChatUser,
    setMessagesId,
    messagesId,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);

  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value?.trim();
      if (!input) {
        setShowSearch(false);
        setUser(null);
        return;
      }

      setShowSearch(true);

      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", input.toLowerCase()));
      const querySnap = await getDocs(q);

      if (querySnap.empty) {
        setUser(null);
        return;
      }

      const foundDoc = querySnap.docs[0];
      const foundData = foundDoc.data();
      const foundId = foundData.id ?? foundDoc.id;
      if (!userData || foundId === userData.id) {
        setUser(null);
        return;
      }

      const userExistsInChat =
        Array.isArray(chatData) && chatData.some((c) => c.rId === foundId);
      if (!userExistsInChat) {
        setUser({ ...foundData, id: foundId });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Search user error:", error);
      toast.error(error.message || "Failed to search user");
    }
  };

  const addChat = async () => {
    if (!user || !user.id || !userData?.id) {
      toast.error("Invalid user data. Cannot create chat.");
      return;
    }

    const chatsRef = collection(db, "chats");
    const myChatDocRef = doc(chatsRef, userData.id);
    const otherChatDocRef = doc(chatsRef, user.id);

    try {
      const mySnap = await getDoc(myChatDocRef);
      if (mySnap.exists()) {
        const myChatData = mySnap.data().chatData || [];
        const existing = myChatData.find((c) => c.rId === user.id);
        if (existing) {
          setUser(null);
          setShowSearch(false);
          setMessagesId(existing.messageId);
          setChatUser(existing);
          toast.info("Opened existing chat");
          return;
        }
      }
      const messagesRef = collection(db, "messages");
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const now = Date.now();

      const payloadForOther = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: userData.id,
        updatedAt: now,
        messageSeen: false,
        userData: {
          id: userData.id,
          name: userData.name,
          avatar: userData.avatar,
        },
      };

      const payloadForMe = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: now,
        messageSeen: true,
        userData: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
      };

      await updateDoc(otherChatDocRef, {
        chatData: arrayUnion(payloadForOther),
      }).catch(async () => {
        await setDoc(otherChatDocRef, { chatData: [payloadForOther] });
      });

      await updateDoc(myChatDocRef, {
        chatData: arrayUnion(payloadForMe),
      }).catch(async () => {
        await setDoc(myChatDocRef, { chatData: [payloadForMe] });
      });

      setUser(null);
      setShowSearch(false);
      setMessagesId(newMessageRef.id);
      setChatUser(payloadForMe);
      toast.success("Chat created");
    } catch (error) {
      console.error("Add chat error:", error);
      toast.error(error.message || "Failed to create chat");
    }
  };

  const setChat = async (item) => {
    if (!item?.messageId) return;
    setMessagesId(item.messageId);
    setChatUser(item);

    try {
      if (!userData?.id) return;

      if (item.messageSeen === false) {
        const chatsRef = collection(db, "chats");
        const myChatDocRef = doc(chatsRef, userData.id);

        const snap = await getDoc(myChatDocRef);
        if (!snap.exists()) return;

        const docData = snap.data();
        const existingChatData = Array.isArray(docData.chatData)
          ? docData.chatData
          : [];

        const updatedChatData = existingChatData.map((c) =>
          c.messageId === item.messageId ? { ...c, messageSeen: true } : c
        );

        await updateDoc(myChatDocRef, { chatData: updatedChatData });
      }
      setChatVisible(true);
    } catch (error) {
      console.error("Failed to mark chat as seen:", error);
    }
  };

  return (
    <div className={'ls ${chatVisible ? "hidden" : ""}'}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="logo" />
          <div className="menu">
            <img src={assets.menu} alt="menu" height="50" width="50" />
            <div className="sub">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search} alt="search icon" height="16" width="16" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here..."
          />
        </div>
      </div>

      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} alt="user-profilepic" />
            <p>{user.name}</p>
          </div>
        ) : (
          (Array.isArray(chatData) ? chatData : []).map((item, index) => {
            const isActive = item.messageId === messagesId;

            const unread = item.messageSeen === false;

            const classNames = `friends ${isActive ? "active" : ""} ${
              unread && !isActive ? "unread" : ""
            }`;

            return (
              <div
                onClick={() => setChat(item)}
                key={index}
                className={classNames}
              >
                <img src={item.userData?.avatar} alt="profile-pic" />
                <div>
                  <p>{item.userData?.name}</p>
                  <span>{item.lastMessage}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default LeftSideBar;
