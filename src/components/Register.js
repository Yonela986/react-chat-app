import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');

      }

      // Registration successful
      console.log('Registration successful:', data);

      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
      <h1 className="mb-4">Register</h1>
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
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
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
        <Button variant="primary" type="submit">Register</Button>
      </Form>
    </Container>
  );
};

export default Register;