import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CampaignForm from './components/CampaignForm';
import UserForm from './components/UserForm';

function App() {
  const [userId, setUserId] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  
  // Use environment variable for backend URL
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch campaigns from the server
  useEffect(() => {
    if (userId) {
      fetchCampaigns();
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

  const handleUserCreated = (newUserId) => {
    setUserId(newUserId); // Set the user ID once the user is created
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

  return (
    <div>
      <h1>Campaign Manager</h1>
      
      {/* If user is not created, show UserForm */}
      {!userId && <UserForm onUserCreated={handleUserCreated} />}
      
      {/* After user is created, show CampaignForm */}
      {userId && (
        <>
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
                {/* Edit Button */}
                <button onClick={() => handleEdit(campaign)}>Edit</button>
                {/* Delete Button */}
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
