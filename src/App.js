import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CampaignForm from './components/CampaignForm';
import UserForm from './components/UserForm';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId')); // Sprawdza, czy istnieje userId w localStorage
  const [userBalance, setUserBalance] = useState(Number(localStorage.getItem('userBalance')) || 0); // Upewniamy się, że userBalance jest liczbą
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const apiUrl = "https://campaign-manager-backend-24fb5ef8834e.herokuapp.com";

  // Fetch campaigns from the server
  useEffect(() => {
    if (userId) {
      fetchCampaigns();
      fetchUserBalance(); // Pobieranie balansu użytkownika
    }
  }, [userId]);

  const fetchCampaigns = () => {
    axios.get(`${apiUrl}/api/campaigns`)
      .then(response => {
        setCampaigns(response.data);
      })
      .catch(error => {
        console.error('Error fetching campaigns', error);
      });
  };

  const fetchUserBalance = () => {
    axios.get(`${apiUrl}/api/users/${userId}`)
      .then(response => {
        const balance = response.data.emeraldFunds;
        setUserBalance(balance);
        localStorage.setItem('userBalance', balance); // Zapisywanie balansu w localStorage
      })
      .catch(error => {
        console.error('Error fetching user balance', error);
      });
  };

  const handleUserCreated = (newUserId) => {
    setUserId(newUserId); // Set the user ID once the user is created
    localStorage.setItem('userId', newUserId); // Zapisujemy userId w localStorage
    setCampaigns([]); // Clear the campaign list when a new user is created or logged in
    setSelectedCampaign(null); // Reset the selected campaign
  };

  const handleCampaignCreated = () => {
    fetchCampaigns(); // Refresh the campaigns list after creating a new campaign
    setSelectedCampaign(null); // Reset the selected campaign after creation
  };

  const handleEdit = (campaign) => {
    setSelectedCampaign(campaign); // Set the selected campaign for editing
  };

  const handleDelete = (campaignId) => {
    axios.delete(`${apiUrl}/api/campaigns/${campaignId}`)
      .then(() => {
        fetchCampaigns(); // Refresh the campaign list after deletion
      })
      .catch(error => {
        console.error('Error deleting campaign', error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Usuwamy userId z localStorage
    localStorage.removeItem('userBalance'); // Usuwamy balans z localStorage
    setUserId(null); // Resetujemy stan użytkownika
    setUserBalance(0); // Resetujemy balans
  };

  return (
    <div>
      <h1>Campaign Manager</h1>
      
      {!userId && <UserForm onUserCreated={handleUserCreated} />}
      
      {userId && (
        <>
          <p><strong>User Balance:</strong> ${Number(userBalance).toFixed(2)}</p> {/* Konwertujemy userBalance na liczbę */}
          <button onClick={handleLogout}>Logout</button> {/* Przycisk do wylogowania */}
          
          <CampaignForm 
            userId={userId} 
            onCampaignCreated={handleCampaignCreated} 
            campaign={selectedCampaign} // Pass the selected campaign for editing
          />

          <h2>Campaign List</h2>
          <ul>
            {campaigns.map(campaign => (
              <li key={campaign.id}>
                <p><strong>Campaign Name:</strong> {campaign.campaignName}</p>
                <p><strong>Keywords:</strong> {campaign.keywords}</p>
                <p><strong>Bid Amount:</strong> {campaign.bidAmount}</p>
                <p><strong>Campaign Fund:</strong> {campaign.campaignFund}</p>
                <p><strong>Status:</strong> {campaign.status ? "On" : "Off"}</p>
                <p><strong>Town:</strong> {campaign.town}</p>
                <p><strong>Radius:</strong> {campaign.radius} km</p>
                <button onClick={() => handleEdit(campaign)}>Edit</button>
                <button onClick={() => handleDelete(campaign.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
