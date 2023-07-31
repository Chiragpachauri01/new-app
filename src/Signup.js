import React, { useState } from 'react';
import { auth } from './firebase';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const Signup = ({ toggleSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={8} md={6}>
          <h2>Sign Up</h2>
          {error && <div className="text-danger mb-3">{error}</div>}
          <Form onSubmit={handleSignup}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mr-2">
              Sign Up
            </Button>
            <Button variant="link" onClick={toggleSignup}>
              Login Instead
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
