import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ChatRoom from './components/ChatRoom';
import Login from './components/Login';
import Register from './components/Register';


function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Routes>
     <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

      <Route 
        path="/" 
        element={user ? <ChatRoom /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="bg-light min-vh-100">

        <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;