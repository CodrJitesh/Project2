# Spatial Finance Dashboard

A modern, spatial-themed React fintech dashboard for managing income and expenses with Firebase integration, AI-powered insights, and advanced visualizations.

## Features

### Core Functionality
- Firebase Authentication (Email/Password)
- Real-time transaction tracking in Indian Rupees (₹)
- Firestore cloud database for data storage
- AI-powered financial analysis using Gemini API
- Radar/Spider web graph visualization
- Advanced chart visualizations (Area, Pie)
- Dark/Light theme with proper desaturated colors
- Real-time search and filtering
- Fully responsive design
- CSV export functionality

### Data Storage
All transaction data is stored in **Firebase Firestore** (cloud database):
- Each user's data is isolated by their user ID
- Real-time synchronization across devices
- Automatic backups and security
- Scalable cloud infrastructure

### AI Features
- **Gemini AI Integration**: Get personalized financial insights
- Analyzes spending patterns and trends
- Provides actionable recommendations
- Financial health assessment
- Category-wise spending analysis

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Add security rules (see below)
   - Copy your config and update `src/firebase.js`

3. Configure Gemini AI (Optional):
   - Get API key from https://makersuite.google.com/app/apikey
   - Create `src/config/gemini.js` and add your key:
   ```javascript
   export const GEMINI_API_KEY = 'your-api-key-here';
   export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
   ```

4. Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{transaction} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

5. Run development server:
```bash
npm run dev
```

## Technologies

- React 18 with Hooks
- React Router v6
- Firebase (Auth + Firestore)
- Google Gemini AI API
- Recharts (Chart visualizations)
- Vite (Build tool)
- CSS Modules (Scoped styling)
- Manrope Font
- Material Symbols Icons

## Project Structure

```
src/
├── components/
│   ├── AdvancedChart.jsx       # Area & Pie charts
│   ├── RadarWeb.jsx            # Spider/Radar web graph
│   ├── AIInsights.jsx          # Gemini AI analysis
│   ├── Navbar.jsx              # Navigation with theme toggle
│   ├── QuickStats.jsx          # Quick statistics cards
│   ├── SummaryCards.jsx        # Main balance/income/expense cards
│   ├── TransactionList.jsx     # Grid/table transaction view
│   ├── TransactionModal.jsx    # Add/edit transaction form
│   ├── SpendingInsights.jsx    # Smart spending analysis
│   └── PrivateRoute.jsx        # Route protection
├── context/
│   ├── AuthContext.jsx         # Authentication state
│   └── ThemeContext.jsx        # Theme management
├── services/
│   └── geminiService.js        # AI analysis service
├── config/
│   └── gemini.js               # Gemini API configuration
├── pages/
│   ├── Dashboard.jsx           # Main dashboard
│   └── Login.jsx               # Login/signup page
├── firebase.js                 # Firebase configuration
└── main.jsx                    # App entry point
```

## AI Insights Feature

The AI Insights component uses Google's Gemini API to provide:
1. Financial health assessment
2. Spending pattern analysis
3. Actionable recommendations
4. Category-wise insights
5. Personalized advice in Indian Rupee context

To use:
1. Add your Gemini API key in `src/config/gemini.js`
2. Click "Analyze with AI" button on the dashboard
3. Get instant personalized financial insights

## Color Palette

### Light Mode
- Background: #f6f8f8
- Surface: #eef2f2
- Card: #ffffff
- Text Primary: #1a2828
- Text Secondary: #5a6868
- Border: #d4dada
- Primary: #13ecec

### Dark Mode
- Background: #102222
- Surface: #152a2a
- Card: #1a3333
- Text Primary: #e8f0f0
- Text Secondary: #8a9a9a
- Border: #234848
- Primary: #13ecec

## Key Features

1. **Radar Web Graph**: Interactive spider chart showing spending distribution across categories
2. **AI Analysis**: Gemini-powered financial insights and recommendations
3. **No Emojis**: Professional icon system using Material Symbols and SVG
4. **Proper Dark Mode**: Desaturated colors following color theory principles
5. **Indian Rupee Support**: Proper ₹ formatting with locale support
6. **Export Data**: CSV download functionality
7. **Smart Insights**: Pattern analysis with personalized messages
8. **Dual View Modes**: Switch between grid cards and table view
9. **Cloud Storage**: All data stored securely in Firebase Firestore
10. **Real-time Sync**: Changes reflect instantly across all devices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

---

Built with attention to design principles, modern web standards, and AI-powered insights.
