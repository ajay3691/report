import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/changePassword`, {
        employeeId: localStorage.getItem('employeeId'),       
        oldPassword,
        newPassword,
      });

      if (response.data.status === 'Success') {
        setSuccess('Password has been changed successfully');
        setError('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(response.data.message); // Display specific error messages from backend
        setSuccess('');
      }
    } catch (err) {
      // Handle different error responses
      if (err.response && err.response.data) {
        setError(err.response.data.message); // Display the error message from backend
      } else {
        setError('An error occurred while changing the password');
      }
      setSuccess('');
    }
  };

  // Updated styles
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    backgroundColor: '#f4f4f9',
    padding: '20px',
  };

  const cardStyle = {
    maxWidth: '400px',
    width: '100%',
    background: '#fff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s ease',
  };

  const headingStyle = {
    color: '#333',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  const formControlStyle = {
    borderRadius: '6px',
    border: '1px solid #dcdfe6',
    padding: '12px 15px',
    fontSize: '1rem',
    marginBottom: '15px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.3s',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    border: 'none',
    padding: '12px 20px',
    fontSize: '1rem',
    borderRadius: '6px',
    width: '100%',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
    boxShadow: '0 4px 10px rgba(0, 91, 187, 0.3)',
  };

  const alertStyle = {
    fontSize: '0.9rem',
    borderRadius: '8px',
    marginBottom: '20px',
    padding: '12px',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Change Password</h2>
        {error && (
          <div style={{ ...alertStyle, backgroundColor: '#f8d7da', color: '#721c24' }}>{error}</div>
        )}
        {success && (
          <div style={{ ...alertStyle, backgroundColor: '#d4edda', color: '#155724' }}>{success}</div>
        )}
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            required
            style={formControlStyle}
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            style={formControlStyle}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            style={formControlStyle}
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor;
              e.currentTarget.style.boxShadow = buttonHoverStyle.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
