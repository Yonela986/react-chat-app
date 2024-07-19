import React, { useState } from 'react';
// import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Form } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    // eslint-disable-next-line no-undef
    e.preventDefault()
    const success = await login(email, password);
    if(success){
      navigate('/');
    }else{
      alert('Login failed. Please check your credentials.')
    }
  };

  // // If user is already logged in, redirect to chat room
  // if (user) {
  //   navigate('/');
  //   return null;
  // }

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
    <h1 className="mb-4">Login</h1>
    <Form variant="primary" onSubmit={handleSubmit} className="w-100">
    <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </Form>
  </Container>
  );
};

export default Login;