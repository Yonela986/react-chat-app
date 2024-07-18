import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="message-list">
      {messages.map(msg => (
        <div key={msg.id} className="message">
          <img src={msg.userPhotoURL} alt={msg.userName} width="30" height="30" />
          <span>{msg.userName}: </span>
          <span>{msg.text}</span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;