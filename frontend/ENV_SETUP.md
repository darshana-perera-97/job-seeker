# Environment Variables Setup

## Quick Setup

1. **Create a `.env` file** in the `frontend` directory (same folder as `package.json`)

2. **Add the following content:**

```env
# API Configuration
# IMPORTANT: Do NOT include /api in the URL - the code adds it automatically
REACT_APP_API_URL=http://localhost:5000

# Google OAuth Configuration
# Get your Client ID from: https://console.cloud.google.com/apis/credentials
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

**⚠️ Common Mistake:** Do NOT set `REACT_APP_API_URL=http://localhost:5000/api` - this will cause double `/api/api/` in URLs!

3. **Replace `your-google-client-id-here.apps.googleusercontent.com`** with your actual Google Client ID

4. **Restart your React development server** after creating/updating the `.env` file

## Getting Your Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Go to **"APIs & Services" > "Credentials"**
4. Click **"Create Credentials" > "OAuth client ID"**
5. Choose **"Web application"**
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
7. Click **"Create"**
8. Copy the **Client ID** (it looks like: `123456789-abc.apps.googleusercontent.com`)

## Important Notes

- The `.env` file must be in the `frontend` directory
- Variable names must start with `REACT_APP_` to be accessible in React
- You must restart the development server after changing `.env` file
- Never commit `.env` to git (it's already in `.gitignore`)

## File Location

```
job-seeker/
  frontend/
    .env          ← Create this file here
    package.json
    src/
    ...
```

## After Setup

1. Save the `.env` file
2. Stop your React server (Ctrl+C)
3. Start it again: `npm start`
4. The Google Sign-In button should now work!

