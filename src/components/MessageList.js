import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !user.token) return;

      try {
        const response = await fetch('http://localhost:5000/messages', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const messagesData = await response.json();
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
        // You might want to show an error message to the user here
      }
    };

    fetchMessages();

    // Set up polling to fetch messages periodically
    const intervalId = setInterval(fetchMessages, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [user]);

  return (
    <div className="message-list">
      {messages.map(msg => (
        <div key={msg.id} className="message">
          {msg.userPhotoURL && (
            <img src={msg.userPhotoURL} alt={msg.userName} width="30" height="30" />
          )}
          <span>{msg.userName}: </span>
          <span>{msg.text}</span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;