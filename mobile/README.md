# SkinPilot Mobile (Expo)

Quick scaffold for the SkinPilot mobile app using Expo and Firebase.

Setup

1. Install dependencies:

```bash
cd example/mobile
npm install
```

2. Replace `firebaseConfig.js` values with your Firebase project's values.

3. Configure Google sign-in client IDs in `screens/AuthScreen.js`.

4. Run the app:

```bash
npm start
```

Notes
- Phone OTP via Firebase requires native setup (`react-native-firebase`) or a backend/Twilio fallback. Ask me and I will add the phone OTP flow next.
