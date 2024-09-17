import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/campaigns')
      .then(response => {
        setCampaigns(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the campaigns!', error);
      });
  }, []);

  return (
    <div>
      <h2>Campaign List</h2>
      <ul>
        {campaigns.map(campaign => (
          <li key={campaign.id}>
            {campaign.campaignName} - {campaign.town} - {campaign.bidAmount} - {campaign.status ? 'Active' : 'Inactive'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CampaignList;
