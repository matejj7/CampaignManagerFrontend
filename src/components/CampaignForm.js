import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CampaignForm({ userId, onCampaignCreated, campaign }) {
  const [campaignName, setCampaignName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [campaignFund, setCampaignFund] = useState('');
  const [status, setStatus] = useState(false);
  const [town, setTown] = useState('');
  const [radius, setRadius] = useState('');
  const [message, setMessage] = useState('');
  const [predefinedKeywords, setPredefinedKeywords] = useState([]);
  const [predefinedTowns, setPredefinedTowns] = useState([]);
  const [userBalance, setUserBalance] = useState(0);

  const apiUrl = "https://campaign-manager-backend-24fb5ef8834e.herokuapp.com";


  // Fetch predefined keywords, towns, and user balance
  useEffect(() => {
    axios.get(`${apiUrl}/api/keywords`)
      .then(response => {
        setPredefinedKeywords(response.data);
      })
      .catch(error => console.error('Error fetching keywords:', error));

    axios.get(`${apiUrl}/api/towns`)
      .then(response => {
        setPredefinedTowns(response.data);
      })
      .catch(error => console.error('Error fetching towns:', error));

    if (userId) {
      axios.get(`${apiUrl}/api/users/${userId}`)
        .then(response => {
          setUserBalance(response.data.emeraldFunds);
        })
        .catch(error => console.error('Error fetching user balance:', error));
    }
  }, [userId, apiUrl]);

  // Gdy kampania zostanie wybrana do edycji, wypełnij formularz danymi kampanii
  useEffect(() => {
    if (campaign) {
      setCampaignName(campaign.campaignName);
      setKeywords(campaign.keywords);
      setBidAmount(campaign.bidAmount);
      setCampaignFund(campaign.campaignFund);
      setStatus(campaign.status);
      setTown(campaign.town);
      setRadius(campaign.radius);
    }
  }, [campaign]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (parseFloat(campaignFund) > userBalance) {
      setMessage('Insufficient funds to create or edit this campaign.');
      return;
    }

    const campaignData = {
      campaignName,
      keywords,
      bidAmount: parseFloat(bidAmount),
      campaignFund: parseFloat(campaignFund),
      status,
      town,
      radius: parseFloat(radius),
    };

    if (campaign) {
      // Edytuj istniejącą kampanię
      axios.put(`${apiUrl}/api/campaigns/${campaign.id}`, campaignData)
        .then(response => {
          setMessage('Campaign updated successfully!');
          onCampaignCreated();
          updateUserBalance(campaignFund); // Zaktualizuj saldo
        })
        .catch(error => {
          setMessage('Error updating campaign');
          console.error('There was an error!', error);
        });
    } else {
      // Utwórz nową kampanię
      axios.post(`${apiUrl}/api/campaigns/${userId}`, campaignData)
        .then(response => {
          setMessage('Campaign added successfully!');
          onCampaignCreated();
          updateUserBalance(campaignFund); // Zaktualizuj saldo
        })
        .catch(error => {
          setMessage('Error adding campaign');
          console.error('There was an error!', error);
        });
    }
  };

  const updateUserBalance = (fundAmount) => {
    const newBalance = userBalance - parseFloat(fundAmount);
    setUserBalance(newBalance); // Aktualizuj saldo w interfejsie użytkownika

    axios.put(`${apiUrl}/api/users/${userId}/update-balance`, {
      emeraldFunds: newBalance
    }).catch(error => console.error('Error updating user balance:', error));
  };

  return (
    <div>
      <h2>{campaign ? 'Edit Campaign' : 'Create a New Campaign'}</h2>
      <p><strong>Current Balance:</strong> ${userBalance.toFixed(2)}</p>
      <form onSubmit={handleSubmit}>
        {/* Reszta formularza */}
      </form>
      {message && <p>{message}</p>}
      <p><strong>New Balance:</strong> ${userBalance.toFixed(2)}</p>
    </div>
  );
}

export default CampaignForm;
