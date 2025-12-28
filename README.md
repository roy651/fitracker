# ⛷️ Ski Prep Pro

**Your ultimate companion for getting slope-ready this season.**

Ski Prep Pro is a Progressive Web App (PWA) designed to guide you through high-intensity interval training (HIIT) workouts specifically tailored for skiing and snowboarding. Whether you're at home or in the gym, get the leg strength and endurance you need to shred all day.

![Ski Prep Pro Banner](public/icon-512.png)

## ✨ Features

- **📱 Installable PWA:** Works offline and installs on your home screen (iOS & Android).
- **🗣️ Voice Coaching:** Text-to-speech announces exercises and instructions so you don't have to look at the screen.
- **🔊 Audio Cues:** Sound effects for work/rest transitions and countdowns.
- **⚡ Wake Lock:** Keeps your screen awake during workouts (no more unlocking with sweaty hands!).
- **🎯 Sport-Specific Programming:** Workouts designed to build quad stamina, core stability, and explosive power.

## 🌐 Live App (Easiest Way)

You don't need to be a developer to use Ski Prep Pro! The app is available online and can be installed directly from our website:

👉 **[Launch Ski Prep Pro](https://roy651.github.io/fitracker/)** 👈

1. Visit the link above on your phone.
2. Follow the "Add to Home Screen" prompt (or see instructions below).
3. Going forward, the app works **100% offline**!

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/roy651/fitracker.git
   cd fitracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   - Unit Tests: `npm run test:unit`
   - E2E Tests: `npm run test:e2e`

## 📱 Mobile Installation

Ski Prep Pro is designed to be installed on your phone for an app-like experience.

### Testing Locally
If you are running the project locally (`npm run dev`), make sure your phone and computer are on the **same Wi-Fi network**.
1. Look at your terminal output for the **Network** URL (e.g., `http://192.168.1.5:5173`).
2. Type that exact URL into your phone's browser.

### iOS (Safari)
1. Open the app in **Safari**.
2. Tap the **Share** button (rectangle with an arrow pointing up).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add** in the top-right corner.

### Android (Chrome)
1. Open the app in **Chrome**.
2. Tap the **menu icon** (three dots) in the top-right corner or tap "Install" in the banner if it appears.
3. Tap **"Install App"** or **"Add to Home screen"**.
4. Follow the prompt to install.

## �📖 Usage Guide

1. **Open the app** in your browser (or install it to your home screen).
2. **Select your workout** from the weekly schedule on the dashboard.
3. **Tap "Start Block"** to begin your session.
4. **Follow the cues:** The app will guide you through work and rest intervals.
5. **Listen up:** Voice commands will tell you what exercise is next and how to perform it.

## 🛠️ Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Testing:** Vitest (Unit) + Playwright (E2E)
- **Deployment:** GitHub Pages / Vercel (PWA)
- **Browser APIs:** Web Speech API, Screen Wake Lock API

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

*Ready to hit the slopes? Start training today!*
