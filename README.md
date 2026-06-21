<<<<<<< HEAD
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🌉 ByteBridge AI

### *Intelligent Universal Device Bridge & Goonlinetools Developer Utility Suite*

[![React Version](https://img.shields.io/badge/react-19.0.0-blue?style=flat-square&logo=react)](https://react.dev)
[![Vite Version](https://img.shields.io/badge/vite-6.2.3-purple?style=flat-square&logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/gemini-3.5%20flash-red?style=flat-square&logo=google-gemini)](https://ai.google.dev)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/docker-ready-blue?style=flat-square&logo=docker)](https://www.docker.com)

</div>

---

**ByteBridge AI** is a real-time, end-to-end local network sharing bridge combined with a versatile developer toolkit. It enables secure, chunked file sharing and clipboard syncing across multiple devices via dynamic 6-digit room codes. To overcome restrictive corporate network constraints (e.g., ports blocks, USB bans, and isolated LAN subnets), it utilizes an **AI Transfer Optimizer** powered by Google Gemini 3.5 Flash.

Additionally, the app features the **Goonlinetools Developer Utility Suite**, which provides tools for everyday coding tasks like encoding/decoding, text analysis, document converters, and randomized generators.

---

## 🌟 Core Features

### 1. 🌉 Universal Device Bridge
* **Dynamic 6-Digit Pairings:** Create secure, transient rooms on-the-fly to connect and synchronize devices instantly.
* **Chunked File Transfer:** Slices large payloads into optimized chunks before transmission, rebuilding them dynamically inside the receiver’s browser for download.
* **Simulated Device Workspace:** Virtualize a multi-device local network hub. Test connections representing different platforms (e.g., MacBook, Android Phone, Windows PC, iPhone, Smart TV) with custom battery levels and network statuses.
* **Real-time Collaboration Clipboard:** Share logs, text snippets, and configuration variables instantly across all paired devices.

### 2. 🧠 AI Transfer Optimizer (Gemini 3.5 Flash)
* Select a source platform, destination platform, file type/size, and current network limitations (e.g., restricted corporate proxies).
* The Gemini 3.5 Flash API parses these metrics to output a tailor-made optimization profile in real-time, specifying:
  * **Method selection** (e.g., *Restricted Environment Mode*, *WebRTC direct channel*, *Clipboard Relay*)
  * **Ideal chunk size** (e.g., *512KB*, *2MB*)
  * **Encryption strength** (e.g., *AES-256-GCM client-side*)
  * **Compression configuration** (e.g., *Gzip Level 5*, *LZMA*)
  * **Routing layout & explanation** explaining why that particular pathway bypasses MDM policies or firewalls.

### 3. 🛠️ Goonlinetools Developer Suite
* **Audiobook & Playback Speed Calculator:** Calculate exact adjusted listening times and time saved when using speed multipliers.
* **Encoder / Decoder Suite:** Switch payloads instantly between **Base64, Base32, URL Encode, HTML Entities, Binary, Hex**, and basic Caesar cipher rotation.
* **Number Converter:** Seamless conversions across **Binary, Octal, Decimal, and Hex** formats.
* **Text Analysis & Casing:** Count words/characters/lines, format sentences, swap letter casing (uppercase, lowercase, titlecase), reverse text, and prune break spaces.
* **Document Converter & Formatter:** Format, validate, and minify **JSON** files; convert **JSON to CSV** or **CSV to JSON**; parse **Markdown into static HTML** preview blocks; and clean HTML tags.
* **Random Utilities Generator:** Generate **UUIDv4 tokens, cryptographically secure passwords**, emoji vectors, Yes/No coins, placeholder object names, Zalgo/cursed text, and invisible characters for payload testing.

---

## 📐 System Architecture

Below is a system data-flow model illustrating how devices pair, upload chunks, query the AI engine, and rebuild files.

```mermaid
flowchart TD
    subgraph Client [Vite + React Frontend]
        SD[Sender Device]
        RD[Receiver Device]
        AI_Opt[AI Optimizer Panel]
    end

    subgraph Server [Express + Node Backend]
        API[Express REST Endpoints]
        RM[In-Memory Room Manager]
        Gemini[Gemini SDK Client]
    end

    subgraph Storage [Persistence Layer]
        PG[(PostgreSQL DB)]
        Prisma[Prisma ORM]
    end

    SD -->|1. Request pairing room| API
    API -->|2. Create room & return 6-digit code| SD
    RD -->|3. Join room via code| API
    
    SD -->|4. Input constraints| AI_Opt
    AI_Opt -->|5. Post parameters| API
    API -->|6. Request recommendations| Gemini
    Gemini -->|7. Return recommendation JSON| API
    API -->|8. Apply chunk size & route settings| AI_Opt

    SD -->|9. Slice & upload file chunks| API
    API -->|10. Store temporary memory buffer| RM
    RD -->|11. Poll file status & download chunks| API
    RD -->|12. Assemble & trigger local download| RD
    
    Prisma --> PG
```

---

## 🛠️ Tech Stack & Dependencies

* **Core Framework:** React 19, TypeScript, Vite 6
* **Styling & UI:** TailwindCSS v4, Framer Motion (smooth animations), Lucide React (vector icons)
* **Backend:** Express API, Node.js (`tsx` execution tool for developer environments)
* **AI Model Integration:** `@google/genai` (Official Google GenAI SDK integration pointing to `gemini-3.5-flash`)
* **Database & Migration:** PostgreSQL database ready with Prisma ORM integrations

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have the following installed:
* **Node.js** (v22.0.0 or higher recommended)
* **Docker** & **Docker Compose** (optional, for localized production database staging)

---

### 💻 Running Locally

#### 1. Clone the project and install dependencies
```bash
npm install
```

#### 2. Configure Environment Variables
Create a `.env` file in the root directory (you can copy `.env.example` as a baseline):
```bash
# Set your Google Gemini API Key to enable the AI Optimizer
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Server Port (Default is 3000)
PORT=3000

# PostgreSQL Database Connection URL (Optional, fallback to memory storage)
DATABASE_URL="postgresql://bytebridge_user:secure_bridge_pass@localhost:5412/bytebridge_db?schema=public"
```

#### 3. Run in Development Mode
Start the Vite frontend development server alongside the Express backend API in a unified runtime:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

#### 4. Build and Compile for Production
To bundle client assets and compile the TypeScript Express backend into a single distribution format:
```bash
npm run build
npm start
```

---

### 🐳 Deploying via Docker Compose

We include a multi-stage `Dockerfile` and a `docker-compose.yml` file to run the entire stack (Express API server + PostgreSQL database container) isolated.

#### 1. Spin up the containers
```bash
docker-compose up --build -d
```
* **Vite + Express App:** Accessible on `http://localhost:3000`
* **PostgreSQL Instance:** Binds internally to port `5412`

#### 2. Run Database Setup (Optional)
If scaling out persistence features:
```bash
npx prisma db push
```

---

## 📂 Project Structure

```text
├── prisma/
│   └── schema.prisma        # Database schema definitions for rooms, devices, & audit logs
├── src/
│   ├── components/
│   │   ├── AIOptimizerPanel.tsx   # React element handling inputs, API hooks, & AI UI
│   │   ├── DeveloperToolkit.tsx   # Front-end dashboard containing all Goonlinetools
│   │   ├── DeviceSimulator.tsx    # Workspace widget mimicking connected physical hosts
│   │   └── OnlineClipboard.tsx    # Live synced network clipboard editor
│   ├── App.tsx              # Main React core controller & navigation layout
│   ├── index.css            # Base stylesheet containing custom CSS styling rules
│   ├── main.tsx             # Application initialization entry-point
│   └── types.ts             # Global TypeScript type definitions
├── server.ts                # Express backend logic, REST routing, & Gemini API integration
├── Dockerfile               # Multi-stage image build manifest for Docker
├── docker-compose.yml       # Docker orchestrator configuration
├── vite.config.ts           # Vite build pipeline setup
├── package.json             # App dependencies & run scripts
└── README.md                # Project documentation
```

---

## 📄 License
This project is private and proprietary. All rights reserved.
=======

>>>>>>> 10b7ae2ae327e82771ba5274e4645aa27e44ce7f
