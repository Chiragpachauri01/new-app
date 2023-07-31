import React, { useState } from 'react';
import { auth } from './firebase';
import './styles.css';

const Login = ({ toggleSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-12 col-sm-8 col-md-6">
          <h2>Login</h2>
          {error && <div className="text-danger mb-3">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary mr-2">
              Login
            </button>
            <button type="button" className="btn btn-link" onClick={toggleSignup}>
              Sign Up Instead
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
