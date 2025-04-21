# RSS Reader App

A simple RSS reader built with React Native and Expo, designed for iOS.

## Features

- Add, edit and manage RSS feeds
- View articles from all feeds sorted by publication date
- View articles from single RSS feed
- Add articles to favorites or "read later" list
- Search articles by title
- Filter articles by "Unread only" status

## Technology Stack

- **Frontend**: TypeScript, React Native with Expo
- **State Management**: Zustand
- **Navigation**: expo-router
- **RSS Parsing**: react-native-rss-parser
- **Storage**: AsyncStorage
- **Animations**: react-native-reanimated

## Getting Started
### Prerequisites
- Node.js (v16 or newer)
- npm or yarn
- iOS device with [Expo Go](https://apps.apple.com/app/expo-go/id982107779) installed
- [Expo CLI](https://docs.expo.dev/get-started/installation/#expo-cli)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/rss-reader-app.git
cd rss-reader-app
```

2. Install dependencies:
```bash
npm install
# or if you use yarn
yarn install
```

### Running the App
1. Start the development server:
```bash
npx expo start
```

2. Running on iOS with Expo Go:
   - Make sure your iOS device is connected to the same network as your computer
   - Open Expo Go on your iOS device
   - Scan the QR code shown in the terminal with your iPhone's camera
   - The app will open automatically in Expo Go

Alternatively, you can press:
- `i` in the terminal to open in iOS simulator (requires Xcode)
- `w` to open in web browser

### Development
To run the development environment:

```bash
# Start the development server
npm run start
# or
yarn start

# Run ESLint
npm run lint
# or
yarn lint

# Format code with Prettier
npm run format
# or
yarn format
```

### Troubleshooting
If you encounter any issues:

1. Clear Expo cache:
```bash
npx expo start -c
```

2. Reset Metro bundler:
   - Press `r` in the terminal while the development server is running

3. Make sure your iOS device and computer are on the same network

4. If the app doesn't connect:
   - Close Expo Go completely
   - Restart the development server
   - Try scanning the QR code again

