import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatRoom = () => {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

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

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [user]);

  const handleSendMessage = useCallback(async (messageText) => {
    if (!user || !user.token) return;

    try {
      const response = await fetch('http://localhost:5000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ userId: user.id, text: messageText })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newMessage = await response.json();
      setMessages(prevMessages => [...prevMessages, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="chat-room">
      <div className="user-info">
        <span>{user.username}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h1>Chat Room</h1>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;