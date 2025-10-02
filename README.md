# Crisp

**AI-Powered Full-Stack Interview Simulator**

Crisp is a cutting-edge platform to simulate technical interviews for **React / Node.js developer** roles. It offers end-to-end functionality — from resume parsing to AI question generation, timed responses, and in-depth performance analytics.

---

## 🌐 Live Demo & Repo

* **Live Deployment**: [Crisp on Vercel](https://interview-forge-ten.vercel.app/)
* **Source Code**: [GitHub Repository](https://github.com/Chiraggarg3475/interview-forge)

---

## 🚀 Features

### Dual Interfaces

* **Interviewee View** – Upload resume, answer AI-generated questions, receive instant scoring.
* **Interviewer Dashboard** – Secure login, browse candidate data, and perform detailed reviews.

### Resume Upload & Parsing

* Drag-and-drop support for **PDF / DOCX**
* Auto-extraction of **name, email, phone number**
* All candidate data is stored locally (no server backend needed)

### AI-Driven Interview Flow

* Generates **6 questions** (2 Easy, 2 Medium, 2 Hard) focused on React / Node.js
* **Timed answers** (20s / 60s / 120s)
* Automatic **scoring (0–10)** of responses

### Session Persistence

* Resume interrupted interviews
* Persistent session data via local storage
* Welcome modal for returning users

### Performance Reporting

* Overall color-coded score
* Question-wise breakdown
* AI-generated performance summary

### Security & Access Control

* Interviewer dashboard protected with login
* Demo credentials: `admin / admin`
* Only client-side storage; **no external data transmission**

---

## 🛠 Tech Stack

* **Frontend**: React 18.3 + Vite 5
* **State Management**: Redux Toolkit + Redux Persist
* **UI**: Ant Design 5.x
* **AI Services**: Google Gemini API
* **Document Processing**: PDF.js + Mammoth
* **Storage**: LocalForage

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ChatInterface.jsx
│   ├── ResumeUpload.jsx
│   ├── Timer.jsx
│   ├── WelcomeModal.jsx
│   ├── LandingPage.jsx
│   ├── CandidateInfoForm.jsx
│   └── LoginPage.jsx
├── pages/
│   ├── IntervieweePage.jsx
│   └── InterviewerPage.jsx
├── redux/
│   ├── slices/
│   │   ├── candidatesSlice.js
│   │   └── sessionSlice.js
│   └── store.js
├── services/
│   ├── aiService.js
│   └── resumeService.js
├── utils/
│   └── helpers.js
├── App.jsx
└── main.jsx
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repo

```bash
git clone https://github.com/Chiraggarg3475/interview-forge.git
cd interview-forge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Key

Create a `.env` in project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Dev Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

---

## 🔐 Authentication

* Access the interviewer dashboard via login
* Demo credentials:

  ```
  Username: admin  
  Password: admin
  ```

---

## 📝 Example Flow

1. Candidate uploads resume → fills in personal info → starts interview
2. AI generates and asks questions → user answers via chat
3. Responses are timed and scored automatically
4. Candidate sees performance summary
5. Interviewer logs in → views candidate history & breakdown

---

## ✨ Enhancements Made

* Structured **Candidate Info Form** with validation and UI feedback
* Stylish, responsive **Landing Page** with routing
* Secured **login flow** for interviewer dashboard
* Fixed **pagination bugs** in candidate tables
* UI/UX polished using Ant Design components

---

## 📱 Responsive Design

* Fully optimized for both **desktop and mobile**
* Clean, intuitive layout and flow

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

* React & Vite
* Ant Design
* Google Gemini API
* PDF.js & Mammoth
