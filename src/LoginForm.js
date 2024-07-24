import React, { useState } from 'react';
import { toast } from 'react-toastify';

const LoginForm = ({ onLoginSuccess, onOpenRegisterModal }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('http://localhost:4001/api/accounts/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      // Format the user's full name
      const fullName = `${capitalizeFirstLetter(data.user.firstName)}`;

      toast.success(`${fullName} logged in successfully!`);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (onLoginSuccess) onLoginSuccess();

      // Refresh the page
      window.location.reload();

    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message);
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='borders'>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-grid my-2">
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Logging In...' : 'Login'}
        </button>
      </div>
      <p className="text-center">
        Don't have an account? <a href="#signup" onClick={onOpenRegisterModal}>Register</a>
      </p>
      <div className="d-flex justify-content-center">
        <button className="btn btn-outline-primary" type="button">Sign In with Google</button>
      </div>
    </form>
  );
};

export default LoginForm;
