# 🎤 RapBots AI - Voice-Controlled Blockchain Gaming

**Built for the AI Agents on Arc with USDC Hackathon**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://rap-bots-illaiservices.replit.app/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Arc L1](https://img.shields.io/badge/Powered_by-Circle_Arc_L1-purple)](https://arc.network/)

The world's first voice-controlled blockchain gaming experience. Speak naturally to control USDC, battle AI opponents, and compete in tournaments on Circle's Arc L1.

---

## 🚀 What is RapBots AI?

RapBots AI revolutionizes blockchain gaming by combining:
- 🗣️ **Voice-powered gameplay** - Speak or type your rap verses
- 🤖 **AI agents** - Autonomous execution of USDC transactions
- ⛓️ **Arc L1 blockchain** - Sub-second USDC settlement
- 🎮 **Skill-based competition** - Battle AI or real players
- 💰 **USDC prizes** - Wager battles and tournaments

### Why It Matters

Traditional blockchain gaming requires complex wallet setup, gas fee calculations, and technical knowledge. **RapBots AI removes all barriers** - just speak naturally and AI agents handle the rest.

> "Bet 5 dollars on this battle" → AI executes USDC wager  
> "Create tournament with 50 dollar prize" → Sets up prize pool  
> "Show my balance" → Queries blockchain wallet  

**Zero technical knowledge required.**

---

## ✨ Key Features

### 🎮 Gaming
- **Voice or text input** for rap battles
- **AI opponent generation** with adjustable difficulty
- **Real-time scoring** (rhyme density, flow quality, creativity)
- **Premium audio** via ElevenLabs Turbo TTS
- **Character selection** with unique voices

### ⛓️ Blockchain (Arc L1)
- **USDC wallet** creation and management
- **Wager battles** ($0.50 - $100 range)
- **Prize tournaments** (Small $10, Medium $50, Large $250)
- **Transaction history** with blockchain verification
- **Sub-second finality** on Arc L1

### 🤖 AI Innovation
- **Natural language payment control** via voice
- **Autonomous USDC execution** by AI agents
- **Intent extraction** from conversational speech
- **Voice command rewards** ($0.01 USDC per command)

### 🛡️ Safety & Compliance
- **Age verification** (18+ for wager battles)
- **Spending limits** and transaction confirmations
- **Jurisdiction restrictions**
- **Responsible gaming** resources
- **Self-exclusion** options

---

## 🏗️ Technology Stack

### Frontend
- **React** + **TypeScript** - Modern UI framework
- **Vite** - Fast build tooling
- **Tailwind CSS** - Responsive styling
- **Framer Motion** - Smooth animations
- **TanStack Query** - Data fetching and caching
- **Wouter** - Lightweight routing

### Backend
- **Node.js** + **Express** - RESTful API server
- **TypeScript** - Type-safe development
- **PostgreSQL** - Persistent data storage
- **Drizzle ORM** - Type-safe database queries

### AI & Voice
- **Groq AI** - Llama 70B (rap generation), Whisper (speech-to-text), PlayAI (TTS)
- **ElevenLabs** - Premium voice synthesis with Turbo models
- **OpenAI** - GPT-4o-mini-tts (fallback)
- **Custom scoring algorithms** - Phonetic rhyme analysis

### Blockchain
- **Circle Arc L1** - USDC native blockchain
- **EVM compatibility** - Standard Ethereum tooling
- **Sub-second finality** - Instant transaction confirmation

---

## 🎯 Hackathon Innovation Tracks

### ✅ On-chain Actions with AI
AI agents autonomously execute blockchain transactions through natural language:
- Voice command → Intent extraction → USDC transaction
- No manual wallet interaction required
- Complete DeFi automation via speech

### ✅ Payments for Authentic Content
Creators earn USDC through skill-based competition:
- Tournament prize distribution
- Player-to-player wagers
- Performance-based rewards

### 🎯 ElevenLabs Special Award Candidate
Advanced voice synthesis integration:
- Turbo models for sub-second generation
- Speed control and breath patterns
- Pronunciation dictionaries for rap terminology

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL** database
- **API keys** (optional for full features):
  - Groq API key
  - ElevenLabs API key (for premium voice)
  - Circle API credentials (for production Arc transactions)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/rapbots-ai.git
cd rapbots-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file
DATABASE_URL=postgresql://user:password@localhost:5432/rapbots
GROQ_API_KEY=your_groq_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Optional for production Arc blockchain
CIRCLE_API_KEY=your_circle_key
CIRCLE_ENTITY_SECRET=your_circle_secret
```

4. **Initialize database**
```bash
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

6. **Open browser**
```
http://localhost:5000
```

---

## 📁 Project Structure

```
rapbots-ai/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Backend Express app
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Database interface
│   ├── arcBlockchain.ts   # Arc L1 integration
│   ├── services/          # Business logic
│   │   ├── ai-payment-agent.ts
│   │   ├── groq-api.ts
│   │   ├── scoring.ts
│   │   └── tts-router.ts
│   └── index.ts           # Server entry point
├── shared/
│   └── schema.ts          # Shared types and DB schema
└── package.json
```

---

## 🎮 How to Play

### Practice Mode (Free)
1. Click "New Battle" or "Practice Mode"
2. Choose your character and difficulty
3. Type or record your rap verse
4. Watch AI generate response with score
5. Listen to AI's verse via TTS
6. Battle through 3 rounds

### Wager Battle (USDC)
1. Ensure you have USDC in your Arc wallet
2. Create wager battle with amount ($0.50 - $100)
3. Battle proceeds as normal
4. Winner receives pot minus 5% platform fee
5. Instant payout via Arc L1

### Tournaments (USDC Prizes)
1. Join or create tournament
2. Select prize pool size
3. Battle through brackets
4. Win prizes: 1st place (50%), 2nd (30%), 3rd (20%)

---

## 🗣️ Voice Commands

The AI Payment Agent understands natural language:

| Command | Result |
|---------|--------|
| "Show my balance" | Displays USDC wallet balance |
| "Bet 5 dollars" | Creates $5 wager battle |
| "Create tournament with 50 dollar prize" | Sets up $50 prize pool |
| "Send 10 USDC to winner" | Processes payment to winner |

**Voice Command Rewards:** Earn $0.01 USDC for each voice command used!

---

## 🔧 Configuration

### TTS Provider Selection
Choose between Groq (fast, free) or ElevenLabs (premium quality):

1. Navigate to Settings
2. Select "TTS Provider"
3. Choose Groq or ElevenLabs
4. Add API key if using personal key

### Battle Settings
- **Difficulty:** Easy, Medium, Hard, Expert
- **Rounds:** 1-5 rounds per battle
- **Character:** Select AI opponent personality

### Safety Settings
- **Spending limits:** Daily/weekly caps
- **Age verification:** Required for wagers
- **Self-exclusion:** Responsible gaming tools

---

## 🌐 Deployment

### Production Build
```bash
npm run build
```

Outputs:
- `dist/index.js` - Backend bundle
- `dist/public/` - Frontend static files

### Start Production Server
```bash
npm start
```

### Environment Variables (Production)
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
GROQ_API_KEY=...
ELEVENLABS_API_KEY=...
CIRCLE_API_KEY=...
CIRCLE_ENTITY_SECRET=...
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Follow existing code style

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Acknowledgments

Built for the **AI Agents on Arc with USDC Hackathon** by:
- **Circle** - Arc L1 blockchain infrastructure
- **Groq** - Lightning-fast AI inference
- **ElevenLabs** - Premium voice synthesis
- **Replit** - Development and hosting platform

---

## 📞 Contact & Support

- **Live Demo:** https://rap-bots-illaiservices.replit.app/
- **GitHub Issues:** [Report bugs or request features](https://github.com/YOUR_USERNAME/rapbots-ai/issues)
- **Email:** your-email@example.com

---

## 🎯 Roadmap

### Q4 2025 - Launch
- [x] Core gameplay implementation
- [x] Arc L1 integration
- [x] AI payment agent
- [ ] Public beta release
- [ ] User acquisition campaign

### Q1 2026 - Scale
- [ ] Mobile apps (iOS/Android)
- [ ] Celebrity AI opponents
- [ ] Sponsored tournaments
- [ ] Multi-language support

### Q2 2026 - Platform
- [ ] Voice Payment SDK
- [ ] White-label licensing
- [ ] Enterprise integrations
- [ ] API marketplace

---

## 📊 Stats

- **14,000+** lines of production code
- **Sub-second** Arc L1 transaction finality
- **50ms** average transcription latency
- **3 rounds** per battle (customizable)
- **$0.50 - $100** wager range
- **8 players** max tournament size

---

## ⭐ Star History

If you find this project interesting, please consider giving it a star! ⭐

---

**Built with ❤️ for the future of voice-controlled blockchain gaming**

🎤 Speak. Battle. Win. 🏆
