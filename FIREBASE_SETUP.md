# Firebase Integration - Quick Start

## What Changed

Your Study Materials Hub now uses **Firebase** for persistent file storage instead of browser localStorage. This means:

✅ Files are stored permanently in the cloud
✅ Files accessible from any device
✅ Files shared across all users
✅ No more 5MB file size limit (Firebase free tier: 5GB total)

## Next Steps

### 1. Create Firebase Project

Follow the detailed guide in `firebase_setup_guide.md` or:

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Firebase Storage
4. Enable Firestore Database
5. Get your Firebase configuration

### 2. Add Firebase Credentials

1. Create a file named `.env.local` in your project root
2. Copy the template from `.env.local.example`
3. Replace with your actual Firebase credentials

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Test Locally

```bash
npm run dev
```

Try uploading a file - it should now be stored in Firebase!

### 4. Deploy

Before deploying, update `src/config/firebase.js` with your actual Firebase config (since GitHub Pages can't access `.env.local`).

Then:
```bash
git add .
git commit -m "Add Firebase integration"
git push
npm run deploy
```

## Files Modified

- `src/config/firebase.js` - Firebase initialization
- `src/services/storageService.js` - Now uses Firebase Storage & Firestore
- `src/components/UploadModal.jsx` - Added upload progress bar
- `src/pages/Dashboard.jsx` - Handles async Firebase operations
- `.env.local.example` - Environment variables template

## Need Help?

See `firebase_setup_guide.md` for detailed step-by-step instructions.
