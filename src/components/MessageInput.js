import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    if (!user) {
      console.log('User not authenticated');
      return;
    }

    await addDoc(collection(db, 'messages'), {
      text: message,
      createdAt: serverTimestamp(),
      userId: user.uid,
      userName: user.displayName,
      userPhotoURL: user.photoURL
    });

    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit" disabled={!user}>Send</button>
    </form>
  );
};

export default MessageInput;