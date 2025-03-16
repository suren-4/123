import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import './Login.css';
import ArrowButton from '../common/ArrowButton';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const testCredentials = {
      admin: { email: 'admin@heritage.org', password: 'admin123' },
      curator: { email: 'curator@museum.org', password: 'curator123' },
      user1: { email: 'society@heritage.org', password: 'user123' }
    };

    const matchingTestUser = Object.values(testCredentials).find(
      cred => cred.email === formData.email
    );

    if (matchingTestUser) {
      if (matchingTestUser.password === formData.password) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', formData.email);
        navigate('/dashboard');
      } else {
        setError('Invalid password');
      }
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      if (data?.user) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', data.user.email);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during login');
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        { redirectTo: `${window.location.origin}/reset-password` }
      );
      if (resetError) throw resetError;
      alert('Password reset instructions have been sent to your email');
    } catch (error) {
      setError(error.message || 'Failed to send reset password email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ArrowButton onClick={() => navigate('/')} />
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="heritage-icon">
              <i className="fas fa-landmark"></i>
            </div>
            <h1>Kalanjiyam</h1>
            <p className="tagline">Preserving Our Legacy</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="admin@heritage.org"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="forgot-password">
              <a href="#forgot" onClick={handleForgotPassword}>forgot password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>enter portal</button>
          </form>

          {error && (
            <p className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
