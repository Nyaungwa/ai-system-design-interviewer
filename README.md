# AI System Design Interviewer
<<<<<<< HEAD

=======
>>>>>>> c57acb4ce5880ac795d3b96b0cb5ffe513a4a697
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-Sonnet--4-D97706?logo=anthropic&logoColor=white)
![DynamoDB](https://img.shields.io/badge/AWS-DynamoDB-FF9900?logo=amazondynamodb&logoColor=white)


> Practice Amazon & Google-style system design interviews with an AI that asks real follow-up questions, builds a live architecture diagram, and scores your performance.

**Live Demo:** https://ai-system-design-interviewer-self.vercel.app

---

## Features

- **8 preset systems**: Twitter, Netflix, Uber, WhatsApp, URL Shortener, YouTube, Amazon, Chat App
- **Custom system input**: design anything you can name
- **Streaming AI interviewer**: real follow-up questions powered by Claude Sonnet
- **Live architecture diagram**: React Flow canvas that auto-populates as you mention components
- **Draggable nodes**: reposition components freely during the interview
- **Comprehensive scoring**: overall + 5 category scores with strengths, gaps, and a model answer
- **Session history**: past sessions stored in DynamoDB and shown on the landing page

---

## Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Frontend    | React 18, Vite 5, Tailwind CSS 3       |
| AI          | Anthropic Claude Sonnet (streaming)    |
| Diagram     | React Flow 11                          |
| Database    | AWS DynamoDB (SDK v3)                  |
| Routing     | React Router v6                        |
| Deployment  | Vercel                                 |
| CI/CD       | GitHub Actions                         |

---

## Running Locally

### 1. Clone and install

```bash
git clone https://github.com/your-username/ai-system-design-interviewer.git
cd ai-system-design-interviewer
npm install
```

### 2. Set environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```env
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_AWS_ACCESS_KEY_ID=AKIA...
VITE_AWS_SECRET_ACCESS_KEY=...
VITE_AWS_REGION=eu-west-2
```

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## AWS DynamoDB Setup

1. Open the [AWS Console](https://console.aws.amazon.com/dynamodb) in your target region (`eu-west-2` for London).
2. Create a table named **`interview-sessions`**.
3. Set **Partition key** to `sessionId` (String).
4. Leave all other settings as default (on-demand billing recommended).
5. Create an IAM user with `AmazonDynamoDBFullAccess` and copy its access key + secret into your `.env`.

Table schema:

| Field           | Type   | Description                  |
|-----------------|--------|------------------------------|
| sessionId       | String | UUID partition key           |
| timestamp       | String | ISO 8601 date-time           |
| systemDesigned  | String | E.g. "Design Twitter"        |
| overallScore    | Number | 0–100                        |
| duration        | Number | Interview length in seconds  |
| summary         | String | First 300 chars of model answer |

---

## Architecture

```
Browser
  └── React SPA (Vite)
        ├── Landing Page  --> DynamoDB (recent sessions)
        ├── Interview Page
        │     ├── ChatInterface (streaming)--> Claude API (Sonnet)
        │     └── DiagramCanvas --> React Flow
        └── Results Page  --> DynamoDB (save session)
```

The AI streams responses token-by-token. The frontend scans each chunk for `COMPONENT:` lines to add diagram nodes in real time and for `INTERVIEW_COMPLETE` followed by a JSON block to trigger the results page.

---

## CI/CD Pipeline

On every push to `main`, GitHub Actions:

1. Checks out the code
2. Sets up Node 18 with npm cache
3. Installs dependencies (`npm ci`)
4. Runs ESLint
5. Builds with Vite (injecting env vars from GitHub Secrets)
6. Deploys to Vercel via `vercel --prod`

Required GitHub Secrets:

| Secret                  | Description                  |
|-------------------------|------------------------------|
| `VERCEL_TOKEN`          | Vercel personal access token |
| `VERCEL_ORG_ID`         | Vercel org/team ID           |
| `VERCEL_PROJECT_ID`     | Vercel project ID            |
| `ANTHROPIC_API_KEY`     | Anthropic API key            |
| `AWS_ACCESS_KEY_ID`     | AWS IAM access key           |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret               |

---

## Project Structure

```
src/
├── components/
│   ├── ChatInterface.jsx   # Streaming chat UI with typing indicator
│   ├── DiagramCanvas.jsx   # React Flow canvas with custom node types
│   ├── ScoreCard.jsx       # Circular score + breakdown bars
│   ├── SystemCard.jsx      # Clickable preset card
│   └── Timer.jsx           # Interview elapsed timer
├── pages/
│   ├── Landing.jsx         # System picker + recent sessions
│   ├── Interview.jsx       # Split-screen interview view
│   └── Results.jsx         # Score display + DynamoDB save
├── services/
│   ├── claudeService.js    # Anthropic streaming, parsing helpers
│   └── dynamoService.js    # DynamoDB put/scan wrappers
├── hooks/
│   ├── useInterview.js     # Chat state + streaming logic
│   └── useDiagram.js       # Component detection + node management
├── App.jsx
├── main.jsx
└── index.css
.github/workflows/deploy.yml
```
