import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatRoom = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="chat-room">
      <div className="user-info">
        <img src={user.photoURL} alt={user.displayName} width="50" height="50" />
        <span>{user.displayName}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h1>Chat Room</h1>
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatRoom;