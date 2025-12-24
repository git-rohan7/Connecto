import React, { useContext, useEffect, useRef, useState } from 'react';
import './ChatBox.css';
import assets from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';

function ChatBox() {
  const { userData, messagesId, chatUser, messages, setMessages } = useContext(AppContext);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!messagesId) return;
    const unsub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
      const msgs = res?.data()?.messages ?? [];
      setMessages([...msgs].reverse());
    }, (err) => {
      console.error('messages onSnapshot error:', err);
      toast.error('Failed to listen for messages');
    });

    return () => unsub();
  }, [messagesId, setMessages]);

  const convertTimeStamp = (timestamp) => {
    if (!timestamp) return '';
    const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
    let hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;
    const minStr = minute < 10 ? `0${minute}` : `${minute}`;
    return `${hour}:${minStr} ${ampm}`;
  };

  const updateChatMetadataForUsers = async (lastMessageText) => {
    if (!messagesId) return;
    const userIDs = [chatUser?.rId, userData?.id].filter(Boolean);
    await Promise.all(userIDs.map(async (id) => {
      try {
        const userChatsRef = doc(db, 'chats', id);
        const userChatsSnapshot = await getDoc(userChatsRef);
        if (!userChatsSnapshot.exists()) return;

        const userChatData = userChatsSnapshot.data();
        const chatIndex = (userChatData.chatData || []).findIndex((c) => c.messageId === messagesId);
        if (chatIndex === -1) return;

        userChatData.chatData[chatIndex].lastMessage = (lastMessageText ?? '').slice(0, 30);
        userChatData.chatData[chatIndex].updatedAt = Date.now();

        if (userChatData.chatData[chatIndex].rId === userData.id) {
          userChatData.chatData[chatIndex].messageSeen = false;
        }

        await updateDoc(userChatsRef, { chatData: userChatData.chatData });
      } catch (err) {
        console.error('updateChatMetadataForUsers error for id', id, err);
      }
    }));
  };

  const sendMessage = async () => {
    const trimmed = (input || '').trim();
    if (!trimmed || !messagesId) {
      setInput('');
      return;
    }

    try {
      await updateDoc(doc(db, 'messages', messagesId), {
        messages: arrayUnion({
          sId: userData.id,
          text: trimmed,
          createdAt: new Date(),
        }),
      });

      await updateChatMetadataForUsers(trimmed);
    } catch (error) {
      console.error('sendMessage error:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setInput('');
    }
  };

  const sendImage = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file || !messagesId) return;

    try {
      const fileUrl = await upload(file);
      if (fileUrl && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl, 
            createdAt: new Date(),
          }),
        });

        await updateChatMetadataForUsers('Image');
      }
    } catch (error) {
      console.error('sendImage error:', error);
      toast.error(error.message || 'Failed to send image');
    } finally {
      e.target.value = '';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!chatUser) {
    return (
      <div className="chat-welcome">
        <img src={assets.logo} alt="logo" />
        <p>Chat Anyone, Anytime, Anywhere</p>
      </div>
    );
  }
  const isOnline = (Date.now() - (chatUser.userData?.lastSeen ?? 0)) <= 70000;
  return (
    <div className="chat-box">
      <div className="chat-user">
        <img src={chatUser.userData?.avatar || assets.profile} alt="profile-pic" />
        <p>
          {chatUser.userData?.name || 'Unknown'}
            {isOnline ? (
            <img src={assets.green_dot} alt="green-dot" className="dot" />
          ) : null}
        </p>
        <img src={assets.help_icon} alt="help" className="help" />
      </div>

      <div className="chat-msg">
        {(messages || []).map((msg, index) => {
          const key = `${msg?.createdAt?.toString?.() || index}-${index}`;
          const isSender = msg.sId === userData.id;
          return (
            <div key={key} className={isSender ? 's-msg' : 'r-msg'}>
              {msg.image ? (
                <img src={msg.image} alt="picture" className="msg-img" />
              ) : (
                <p className="msg">{msg.text}</p>
              )}

              <div>
                <img src={isSender ? (userData.avatar || assets.profile) : (chatUser.userData?.avatar || assets.profile)} alt="profile-image" />
                <p>{convertTimeStamp(msg.createdAt)}</p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a message.."
          onKeyDown={handleKeyDown}
        />

        <input onChange={sendImage} type="file" id="image" accept="image/png, image/jpg, image/jpeg" hidden />
        <label htmlFor="image">
          <img src={assets.img} alt="gallery-icon" />
        </label>

        <img onClick={sendMessage} src={assets.send} alt="send-button" style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
}

export default ChatBox;
