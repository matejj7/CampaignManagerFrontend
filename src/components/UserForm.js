import React, { useState } from 'react';
import axios from 'axios';

function UserForm({ onUserCreated }) {
  const [userName, setUserName] = useState('');  
  const [emeraldFunds, setEmeraldFunds] = useState('');
  const [message, setMessage] = useState('');

  // Używamy zmiennej środowiskowej dla adresu backendu
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const user = {
      userName: userName, 
      emeraldFunds: parseFloat(emeraldFunds),
    };
  
    console.log('User data being sent:', user); 
  
    axios.post(`${apiUrl}/api/users`, user)
    .then(response => {
      console.log('Response from server:', response.data);  
      setMessage('User added successfully!');
      onUserCreated(response.data.id); 
    })
    .catch(error => {
      setMessage('Error adding user');
      console.error('There was an error!', error);  
    });
  };
  

  return (
    <div>
      <h2>Create a New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User Name:</label>
          <input
            type="text"
            value={userName}  
            onChange={(e) => setUserName(e.target.value)} 
            required
          />
        </div>
        <div>
          <label>Emerald Funds:</label>
          <input
            type="number"
            value={emeraldFunds}
            onChange={(e) => setEmeraldFunds(e.target.value)}
            min="1.00"
            step="0.01"
            required
          />
        </div>
        <button type="submit">Create User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UserForm;
