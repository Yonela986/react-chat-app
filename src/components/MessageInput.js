import React, { useState } from 'react';
// import { db } from '../firebase';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const MessageInput = ( { onSendMessage }) => {
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    if (!user || !user.token) {
      console.log('User not authenticated');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          text: message,
          userId: user.id,
          userName: user.username
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Clear the input field after successfully sending the message
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show an error message to the user here
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (message.trim() === '') return;

  //   if (!user) {
  //     console.log('User not authenticated');
  //     return;
  //   }

  //   await addDoc(collection(db, 'messages'), {
  //     text: message,
  //     createdAt: serverTimestamp(),
  //     userId: user.uid,
  //     userName: user.displayName,
  //     userPhotoURL: user.photoURL
  //   });

  //   setMessage('');
  // };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit" >Send</button>
    </form>
  );
};

export default MessageInput;