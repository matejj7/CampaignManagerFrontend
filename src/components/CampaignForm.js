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

  // Fetch predefined keywords, towns, and user balance
  useEffect(() => {
    axios.get('http://localhost:8080/api/keywords')
      .then(response => {
        setPredefinedKeywords(response.data);
      })
      .catch(error => console.error('Error fetching keywords:', error));

    axios.get('http://localhost:8080/api/towns')
      .then(response => {
        setPredefinedTowns(response.data);
      })
      .catch(error => console.error('Error fetching towns:', error));

    if (userId) {
      axios.get(`http://localhost:8080/api/users/${userId}`)
        .then(response => {
          setUserBalance(response.data.emeraldFunds);
        })
        .catch(error => console.error('Error fetching user balance:', error));
    }
  }, [userId]);

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
      axios.put(`http://localhost:8080/api/campaigns/${campaign.id}`, campaignData)
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
      axios.post(`http://localhost:8080/api/campaigns/${userId}`, campaignData)
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

  // Funkcja aktualizująca saldo użytkownika po dodaniu kampanii
  const updateUserBalance = (fundAmount) => {
    const newBalance = userBalance - parseFloat(fundAmount);
    setUserBalance(newBalance); // Aktualizuj saldo w interfejsie użytkownika

    // Opcjonalnie, zaktualizuj saldo użytkownika w backendzie
    axios.put(`http://localhost:8080/api/users/${userId}/update-balance`, {
      emeraldFunds: newBalance
    }).catch(error => console.error('Error updating user balance:', error));
  };

  return (
    <div>
      <h2>{campaign ? 'Edit Campaign' : 'Create a New Campaign'}</h2>
      <p><strong>Current Balance:</strong> ${userBalance.toFixed(2)}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Campaign Name:</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Keywords (pre-populated):</label>
          <input
            type="text"
            list="keyword-options"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required
          />
          <datalist id="keyword-options">
            {predefinedKeywords.map((keyword, index) => (
              <option key={index} value={keyword} />
            ))}
          </datalist>
        </div>
        <div>
          <label>Bid Amount (min 1.00):</label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            min="1.00"
            step="0.01"
            required
          />
        </div>
        <div>
          <label>Campaign Fund (must be positive):</label>
          <input
            type="number"
            value={campaignFund}
            onChange={(e) => setCampaignFund(e.target.value)}
            min="0.01"
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value === 'true')} required>
            <option value="false">Off</option>
            <option value="true">On</option>
          </select>
        </div>
        <div>
          <label>Town (pre-populated):</label>
          <select
            value={town}
            onChange={(e) => setTown(e.target.value)}
            required
          >
            <option value="">Select a town</option>
            {predefinedTowns.map((town, index) => (
              <option key={index} value={town}>
                {town}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Radius (in kilometers):</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            required
          />
        </div>
        <button type="submit">{campaign ? 'Update Campaign' : 'Create Campaign'}</button>
      </form>
      {message && <p>{message}</p>}
      <p><strong>New Balance:</strong> ${userBalance.toFixed(2)}</p>
    </div>
  );
}

export default CampaignForm;
