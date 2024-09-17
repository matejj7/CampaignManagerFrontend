import React, { useState } from 'react';
import axios from 'axios';

function UserForm({ onUserCreated }) {
  const [userName, setUserName] = useState('');  // Zmieniamy tutaj na userName, a nie name
  const [emeraldFunds, setEmeraldFunds] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const user = {
      userName: userName, // Pasuje do pola w backendzie
      emeraldFunds: parseFloat(emeraldFunds),
    };
  
    console.log('User data being sent:', user); // Sprawdzenie danych przed wysłaniem
  
    axios.post('http://localhost:8080/api/users', user)
    .then(response => {
      console.log('Response from server:', response.data);  // Logowanie odpowiedzi serwera
      setMessage('User added successfully!');
      onUserCreated(response.data.id); // Pass userId back to parent component
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
            value={userName}  // Używamy tutaj userName, a nie name
            onChange={(e) => setUserName(e.target.value)} // Poprawiona zmienna
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
