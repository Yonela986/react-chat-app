import React from 'react';
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Button } from 'react-bootstrap';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
      
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  // If user is already logged in, redirect to chat room
  if (user) {
    navigate('/');
    return null;
  }

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
    <h1 className="mb-4">Login</h1>
    <Button variant="primary" onClick={handleGoogleLogin} className="w-100">
      Sign in with Google
    </Button>
  </Container>
  );
};

export default Login;