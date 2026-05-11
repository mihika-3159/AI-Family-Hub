# 🏠 AI Family Hub
### *The Emotionally Intelligent Operating System for Modern Households*

[![Hackathon Project](https://img.shields.io/badge/Hackathon-Production--Quality-blueviolet)](#)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20Gemini-blue)](#)

AI Family Hub is a privacy-focused, intelligent assistance platform designed to unify family routines, emotional wellbeing, caregiving, and memories into a single, beautiful experience.

---

## ✨ Key Experience Modules

### 🗓️ Family Organizer
Stay perfectly synced. Manage shared calendars, recurring chores, and grocery lists. 
*   **AI Feature**: Smart chore distribution based on family member workload.

### 💖 Family Care & Wellbeing
A heartbeat for your household. Log moods, track health habits, and set medication reminders.
*   **AI Feature**: Emotional pattern detection and personalized wellness insights.

### 📸 Memory Vault
Your family legacy, preserved. A cinematic timeline of photos and voice notes.
*   **AI Feature**: Automated storytelling—turns photos into narrative family journals.

### 🧩 Bonding & Activities
Break the routine. Get personalized activity suggestions based on your family's current mood and budget.
*   **AI Feature**: Mood-aware activity generator.

### 🛡️ Digital Safety Center
Stay safe in the digital age. Interactive education on SCAMS, cyber-hygiene, and password health.
*   **AI Feature**: Digital safety assistant chatbot.

### 👴 Senior Mode
Accessibility at its core. Simplified UI and **Voice-Guided Onboarding** to ensure technology never feels like a barrier for elders.

---

## 🎨 Design Philosophy

Inspired by **Apple** and **Notion**, the UI utilizes:
- **Glassmorphism**: Soft, translucent cards for a modern, airy feel.
- **Warm Palette**: A curated selection of "Peach", "Mint", and "Warm Gray" to evoke comfort.
- **Fluid Motion**: Purposeful animations powered by Framer Motion.
- **Dark Mode**: A premium, OLED-optimized dark experience.

---

## 🛠️ Architecture

### **Frontend**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Custom Design System)
- **Visuals**: Lucide Icons, Recharts (Analytics)
- **State**: Custom Hooks (`useAuth`, `useTheme`)

### **Backend**
- **API**: FastAPI (Asynchronous Python)
- **Auth**: JWT with Role-Based Access Control (RBAC)
- **Intelligence**: Google Gemini Pro (Module-specific prompt engineering)
- **Database**: SQLite (Production-ready SQLAlchemy models)

---

## 🚀 Quick Start

### 1. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_key_here
SECRET_KEY=generate_a_random_string
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### 2. Run with Docker (Recommended)
```bash
docker-compose up --build
```

### 3. Manual Installation

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🏗️ Future Roadmap
- [ ] Native Mobile Apps (React Native)
- [ ] Shared Shopping List (Real-time Sync)
- [ ] Smart Home Integration (IoT)
- [ ] Photo OCR for automatic memory tagging

---

*Built with ❤️*
