# Signup Process Setup Guide

This guide explains how to set up and use the signup functionality with Google OAuth integration.

## Features

- ✅ Regular email/password signup
- ✅ Google OAuth signup using **Google Identity Services** (modern, non-deprecated)
- ✅ User data stored in `./backend/data/users.json` as a JSON array
- ✅ Password hashing with bcrypt
- ✅ Form validation
- ✅ Error handling
- ✅ No deprecated `gapi.auth2` usage - fully migrated to Identity Services

## Backend Setup

### 1. Install Dependencies

The backend dependencies are already installed. If you need to reinstall:

```bash
cd backend
npm install
```

### 2. Start the Backend Server

```bash
cd backend
npm start
```

The server will run on `http://localhost:5000` by default.

### 3. Data Storage

User data is automatically stored in `./backend/data/users.json` as a JSON array. The file structure looks like:

```json
[
  {
    "id": "unique-id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "hashed-password",
    "authProvider": "email",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "unique-id",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "googleId": "google-user-id",
    "profilePicture": "https://...",
    "authProvider": "google",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Frontend Setup

### 1. Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 2. Google OAuth Setup

To enable Google Sign-In, you need to:

**Important:** Google Identity Services is a JavaScript library that doesn't require enabling any API in Google Cloud Console. You only need OAuth 2.0 credentials.

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Configure OAuth Consent Screen (if not already done):**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" (unless you have a Google Workspace)
   - Fill in the required information (App name, User support email, etc.)
   - Add your email to test users if needed
   - Save and continue

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application" as the application type
   - Give it a name (e.g., "Job Seeker Web Client")
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain (for production, e.g., `https://yourdomain.com`)
   - **Note:** For Google Identity Services, you typically don't need redirect URIs, but if prompted, you can add:
     - `http://localhost:3000` (for development)
     - Your production domain (for production)
   - Click "Create"
   - Copy the Client ID (it will look like: `123456789-abc.apps.googleusercontent.com`)

4. **Add Client ID to .env:**
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

**Note:** You do NOT need to enable any "Google Identity Services API" - it's just a JavaScript library loaded from Google's CDN. The script tag in `index.html` handles loading it automatically.

### 3. Google Identity Services Implementation

**✅ This implementation uses the modern Google Identity Services library** (not the deprecated Platform Library or `gapi.auth2`).

**Key Implementation Details:**

- **Script Loading:** The GIS library is loaded in `frontend/public/index.html`:
  ```html
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  ```

- **Initialization:** Uses the modern JavaScript API:
  ```javascript
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: handleGoogleSignIn,
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  ```

- **Button Rendering:** Renders the button using Identity Services:
  ```javascript
  window.google.accounts.id.renderButton(buttonRef, {
    theme: 'outline',
    size: 'large',
    text: 'signup_with',
    type: 'standard',
  });
  ```

- **Migration from Deprecated APIs:**
  - ✅ Uses `window.google.accounts.id` (Identity Services)
  - ❌ Does NOT use deprecated `gapi.auth2`
  - ❌ Does NOT use deprecated Platform Library
  - ✅ Modern callback-based authentication
  - ✅ Better security and user experience

**For more information on migrating from deprecated APIs, see:**
- [Google Identity Services Migration Guide](https://developers.google.com/identity/gsi/web/guides/migration)
- [Identity Services Overview](https://developers.google.com/identity/gsi/web/guides/overview)

### 4. Start the Frontend

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` by default.

## API Endpoints

### POST `/api/signup`

Regular email/password signup.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "unique-id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "authProvider": "email",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message here"
}
```

### POST `/api/signup/google`

Google OAuth signup.

**Request Body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "googleId": "google-user-id",
  "profilePicture": "https://..." // optional
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "unique-id",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "googleId": "google-user-id",
    "profilePicture": "https://...",
    "authProvider": "google",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "isExisting": false
}
```

## Usage

1. **Regular Signup:**
   - Fill in the form with full name, email, and password
   - Confirm password
   - Click "Sign Up"
   - On success, you'll be redirected to the dashboard

2. **Google Signup:**
   - Click "Sign up with Google"
   - Select your Google account
   - Grant permissions
   - On success, you'll be redirected to the dashboard

## Notes

- Passwords are hashed using bcrypt before storage
- Email addresses are stored in lowercase
- User IDs are auto-generated
- The `users.json` file is automatically created if it doesn't exist
- User data is stored in localStorage after successful signup
- Google OAuth requires a valid Client ID to work

## Troubleshooting

### Google Sign-In not working:
- **Check that `REACT_APP_GOOGLE_CLIENT_ID` is set in your `.env` file** (most common issue)
- Verify the Google Client ID is correct and matches your OAuth 2.0 credentials
- Check browser console for errors (F12 > Console tab)
- Ensure authorized JavaScript origins are configured correctly in Google Cloud Console:
  - Must include `http://localhost:3000` for development
  - Must include your production domain for production
- **Note:** You do NOT need to enable any "Google Identity Services API" - it's just a JavaScript library
- Verify that the Google Identity Services script is loading: 
  - Open browser DevTools (F12) > Network tab
  - Refresh the page
  - Look for `https://accounts.google.com/gsi/client` - it should load successfully
- If you see "The given origin is not allowed" error:
  - Check that your current URL (e.g., `http://localhost:3000`) is in the authorized JavaScript origins
  - Make sure there are no trailing slashes or protocol mismatches
- **Note:** This implementation uses Google Identity Services (not deprecated `gapi.auth2`). If you see errors about `gapi.auth2`, ensure you're using the latest code

### Backend connection errors:
- Ensure the backend server is running on port 5000
- Check that `REACT_APP_API_URL` matches your backend URL
- Verify CORS is enabled on the backend

### User data not saving:
- Check that the `./backend/data` folder exists
- Verify file permissions for writing to `users.json`
- Check backend console for errors

