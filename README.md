# Smart Email Assistant

An AI-powered email reply generator that works in three ways — a React web app, a REST API, and a Chrome extension that plugs directly into Gmail.

## How It Works

1. User provides the original email content and selects a tone (professional / casual / friendly).
2. The **Spring Boot backend** sends the context + tone to the **Gemini API** and returns a generated reply.
3. The reply is surfaced via a **React web UI** or directly inside **Gmail** through a Chrome extension.

## Architecture
```bash
email-writer/          → Spring Boot REST API (Java)
email-writer-react/    → React frontend (deployed on Vercel)
email-writer.ext/      → Chrome extension (content script injected into Gmail DOM)
```

## Tech Stack

| Layer | Tools |
|---|---|
| Backend | Java, Spring Boot, REST API |
| AI | Google Gemini API |
| Frontend | React, JavaScript, CSS |
| Browser Extension | Chrome Extension (Manifest V3, content.js) |
| Deployment | Docker, Vercel |

## Getting Started

**1. Clone the repo**
```bash
git clone https://github.com/aryantiwari-1640/Smart-Email-Assistant.git
```

**2. Run the backend**
```bash
cd email-writer
# Add your Gemini API key to application.properties
./mvnw spring-boot:run
```

Or with Docker:
```bash
docker build -t smart-email-assistant .
docker run -p 8080:8080 smart-email-assistant
```

**3. Run the React frontend**
```bash
cd email-writer-react
npm install && npm run dev
```

**4. Load the Chrome extension**
- Open `chrome://extensions/`
- Enable Developer Mode
- Click "Load unpacked" → select the `email-writer.ext` folder
- Open Gmail, click Reply on any email → use the AI Reply button

## Live Demo

[🔗 smart-email-assistant-psi.vercel.app](https://smart-email-assistant-psi.vercel.app)
