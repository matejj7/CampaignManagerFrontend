import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);

  const apiUrl = "https://campaign-manager-backend-24fb5ef8834e.herokuapp.com";

  useEffect(() => {
    axios.get(`${apiUrl}/api/campaigns`)
      .then(response => {
        setCampaigns(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the campaigns!', error);
      });
  }, [apiUrl]);

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
