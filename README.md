## Frontend Documentation - Campaign Manager

### Overview
The Campaign Manager frontend is built with **React** and uses **Axios** for API communication. It allows users to manage campaigns and track their balance.

### Features
- User registration and balance management.
- Campaign creation, editing, and deletion.
- Campaigns are tied to individual users.

### Key Components

1. **App Component**:
   - Manages overall state: `userId`, `campaigns`, `selectedCampaign`, and `userBalance`.
   - Handles user creation, campaign management, and logout.

2. **CampaignForm Component**:
   - Form for creating or editing a campaign.
   - Fetches predefined keywords, towns, and updates user balance upon campaign creation.

3. **UserForm Component**:
   - Registers new users and sets initial balances.

### API
- **Backend URL**: Fetched via `process.env.REACT_APP_BACKEND_URL`.
- Axios requests to `/api/users` and `/api/campaigns`.

