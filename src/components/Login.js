import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Attempting login with:', email, password);
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      console.log('Response:', response);
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message || 'Login failed. Please check your credentials.');
    }
      // const response = await fetch('http://localhost:5000/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.error || 'Login failed');
      // }

      // const data = await response.json();
      
      // // Use the login function from AuthContext if available
      // if (login) {
      //   await login(data.token, data.user);
      // } else {
      //   localStorage.setItem('token', data.token);
      // }

      // navigate('/');
  //  } catch (error) {
  //     console.error('Login error:', error.message);
  //     setError(error.message || 'Login failed. Please check your credentials.');
  //   }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
      <h1 className="mb-4">Login</h1>
      <Form onSubmit={handleSubmit} className="w-100">
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">Login</Button>
      </Form>
    </Container>
  );
};

export default Login;