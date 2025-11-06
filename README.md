# 🎤 RapBots AI - Voice-Controlled Blockchain Gaming

**Built for the AI Agents on Arc with USDC Hackathon**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://rapbotsarc.replit.app/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Arc L1](https://img.shields.io/badge/Powered_by-Circle_Arc_L1-purple)](https://arc.network/)

The world's first voice-controlled blockchain gaming experience. Speak naturally to control USDC, battle AI opponents, and compete in tournaments on Circle's Arc L1.

**🎮 Live Demo:** https://rapbotsarc.replit.app/

---

## 🚀 What is RapBots AI?

RapBots AI revolutionizes blockchain gaming by combining:
- 🗣️ **Voice-powered gameplay** - Speak or type your rap verses
- 🤖 **AI agents** - Autonomous execution of USDC transactions
- ⛓️ **Arc L1 blockchain** - Sub-second USDC settlement
- 🎮 **Skill-based competition** - Battle AI or real players
- 💰 **USDC rewards** - Earn real cryptocurrency through gameplay
- 🎓 **Training program** - 24 lessons across 6 categories

### Why It Matters

Traditional blockchain gaming requires complex wallet setup, gas fee calculations, and technical knowledge. **RapBots AI removes all barriers** - just speak naturally and AI agents handle the rest.

> "Stake 5 dollars on this battle" → AI executes USDC competitive stake  
> "Create tournament with 50 dollar prize" → Sets up prize pool  
> "Show my balance" → Queries blockchain wallet  

**Zero technical knowledge required.**

---

## ✨ Key Features

### 🎮 Gaming
- **Voice or text input** for rap battles
- **AI opponent generation** with adjustable difficulty
- **Real-time scoring** (rhyme density, flow quality, creativity)
- **Premium audio** via ElevenLabs Turbo TTS, OpenAI gpt-4o-mini-tts, or Groq PlayAI
- **Character selection** with unique voices and lip-sync animation
- **24 training lessons** across 6 categories (Basics, Rhyme Schemes, Flow, Wordplay, Battle Tactics, Advanced)
- **ELO matchmaking** for fair player-vs-player competition
- **100-level XP system** with progression tracking

### ⛓️ Blockchain (Arc L1)
- **USDC wallet** creation and management
- **Competitive stake battles** ($0.50 - $100 range) - skill-based, not gambling
- **Prize tournaments** (Small $10, Medium $50, Large $250)
- **Transaction history** with blockchain verification
- **Sub-second finality** on Arc L1
- **Automatic USDC rewards** ($0.10 per battle win)
- **Withdrawable earnings** anytime, no restrictions

### 💰 Three-Tier Currency System
1. **Store Credits** - Virtual currency ($1,000 free) for cosmetics (like V-Bucks)
2. **Battle XP & Currency** - Earned through gameplay (500 XP per win)
3. **USDC Cryptocurrency** - Real money on Arc blockchain, fully withdrawable

### 🤖 AI Innovation
- **Natural language payment control** via voice
- **Autonomous USDC execution** by AI agents
- **Intent extraction** from conversational speech
- **Advanced phonetic rhyme analysis** with CMU dictionary
- **Content moderation** via Llama Guard 4
- **ARTalk lip-sync** for photorealistic avatar animation

### 🛡️ Safety & Compliance
- **Legal Classification:** Skill-based competitive gaming (like esports), NOT gambling
- **Age verification** (18+ for competitive stakes)
- **Spending limits** and transaction confirmations
- **Jurisdiction restrictions**
- **Responsible gaming** resources
- **Self-exclusion** options
- **ELO matchmaking** ensures fair competition

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
- **PostgreSQL** (Neon) - Persistent data storage
- **Drizzle ORM** - Type-safe database queries
- **Session management** - Secure authentication

### AI & Voice
- **Groq AI** - Llama 70B (rap generation), Whisper (speech-to-text), PlayAI (TTS)
- **ElevenLabs** - Premium voice synthesis with Turbo models, breath patterns, speed control
- **OpenAI** - GPT-4o-mini-tts (2025) with steerability features
- **ARTalk** - Speech-driven 3D head animation and lip-sync
- **Typecast.ai** - System fallback TTS
- **Custom scoring algorithms** - Phonetic rhyme analysis with CMU dictionary

### Blockchain
- **Circle Arc L1** - USDC native blockchain
- **EVM compatibility** - Standard Ethereum tooling
- **Sub-second finality** - Instant transaction confirmation
- **Testnet integration** - Safe development and testing

---

## 🎯 Hackathon Innovation Tracks

### ✅ On-chain Actions with AI
AI agents autonomously execute blockchain transactions through natural language:
- Voice command → Intent extraction → USDC transaction
- No manual wallet interaction required
- Complete DeFi automation via speech
- **AI Payment Agent** processes competitive stakes, tournament prizes, and withdrawals

### ✅ Payments for Authentic Content
Creators earn USDC through skill-based competition:
- Tournament prize distribution ($5-$250 pools)
- Competitive stake battles (winner takes all)
- Performance-based rewards ($0.10 USDC per win)
- Training completion bonuses

### 🎯 ElevenLabs Special Award Candidate
Advanced voice synthesis integration:
- Turbo models for sub-second generation
- Native speed control and breath patterns
- Pronunciation dictionaries for rap terminology
- Sound effects (crowd reactions, bells, victory sounds)
- Multi-provider TTS routing (ElevenLabs, OpenAI, Groq)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+ and npm
- **PostgreSQL** database (Neon recommended)
- **API keys** (optional for full features):
  - Groq API key
  - ElevenLabs API key (for premium voice)
  - OpenAI API key (for gpt-4o-mini-tts)
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
OPENAI_API_KEY=your_openai_key_here

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
│   │   │   ├── Landing.tsx      # Public landing page
│   │   │   ├── battle-arena.tsx # Battle interface
│   │   │   ├── Training.tsx     # 24-lesson program
│   │   │   ├── wallet.tsx       # USDC management
│   │   │   └── tournaments.tsx  # Tournament system
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Backend Express app
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Database interface
│   ├── arcBlockchain.ts   # Arc L1 integration
│   ├── services/          # Business logic
│   │   ├── ai-payment-agent.ts    # Natural language USDC control
│   │   ├── groq-api.ts            # Rap generation & STT
│   │   ├── scoring.ts             # Phonetic rhyme analyzer
│   │   ├── tts-router.ts          # Multi-provider TTS routing
│   │   └── elevenlabs-sfx.ts      # Sound effects service
│   └── index.ts           # Server entry point
├── shared/
│   └── schema.ts          # Shared types and DB schema
└── package.json
```

---

## 🎮 How to Play

### Free Practice Mode
1. Click "New Battle" or "Practice Mode"
2. Choose your character and difficulty
3. Type or record your rap verse
4. Watch AI generate response with score
5. Listen to AI's verse via TTS with lip-sync
6. Battle through 3 rounds
7. Earn XP and virtual currency

### Training Program (24 Lessons)
1. Navigate to "Training" from any page
2. Browse 6 categories: Basics, Rhyme Schemes, Flow, Wordplay, Battle Tactics, Advanced
3. Complete lessons to earn 100 XP each
4. Practice battles included in each lesson
5. Track your progress across categories

### Competitive Stake Battle (USDC)
1. Ensure you have USDC in your Arc wallet
2. Create competitive stake battle with amount ($0.50 - $100)
3. Battle proceeds as normal (skill-based scoring)
4. Winner receives pot minus 5% platform fee
5. Instant payout via Arc L1
6. **Legal Note:** Skill-based competition (like Chess.com), not gambling

### Tournaments (USDC Prizes)
1. Join or create tournament
2. Select prize pool size ($10, $50, or $250)
3. Battle through brackets with ELO matchmaking
4. Win prizes: 1st place (50%), 2nd (30%), 3rd (20%)

---

## 🗣️ Voice Commands

The AI Payment Agent understands natural language:

| Command | Result |
|---------|--------|
| "Show my balance" | Displays USDC wallet balance |
| "Stake 5 dollars" | Creates $5 competitive stake battle |
| "Create tournament with 50 dollar prize" | Sets up $50 prize pool |
| "Send 10 USDC to winner" | Processes payment to winner |
| "Withdraw 20 USDC" | Initiates withdrawal to external wallet |

---

## 🔧 Configuration

### TTS Provider Selection
Choose between multiple providers (Settings page):

1. **ElevenLabs** - Premium quality, Turbo models, speed control, breath patterns
2. **OpenAI gpt-4o-mini-tts** - Steerability features (2025 model)
3. **Groq PlayAI** - Fast, free, good quality

**User-Managed API Keys:** Store your personal API keys securely for better rates

### Battle Settings
- **Difficulty:** Easy, Medium, Hard, Expert
- **Rounds:** 1-5 rounds per battle
- **Character:** Select AI opponent personality
- **Audio:** Choose TTS provider and voice

### Safety Settings
- **Spending limits:** Daily/weekly caps
- **Age verification:** Required for competitive stakes
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
OPENAI_API_KEY=...
CIRCLE_API_KEY=...
CIRCLE_ENTITY_SECRET=...
```

### Deployment Platform
Currently deployed on **Replit** with:
- Automatic HTTPS
- PostgreSQL (Neon) integration
- Environment variable management
- One-click deployment
- CDN via Google Frontend

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
- Use semantic commit messages

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Acknowledgments

Built for the **AI Agents on Arc with USDC Hackathon** by:
- **Circle** - Arc L1 blockchain infrastructure
- **Groq** - Lightning-fast AI inference
- **ElevenLabs** - Premium voice synthesis
- **OpenAI** - gpt-4o-mini-tts with steerability
- **Replit** - Development and hosting platform
- **Neon** - Serverless PostgreSQL database

Special thanks to the open-source community for:
- **CMU Pronouncing Dictionary** - Phonetic rhyme analysis
- **ARTalk** - Speech-driven 3D animation
- **React** + **TypeScript** ecosystem

---

## 📞 Contact & Support

- **Live Demo:** https://rapbotsarc.replit.app/
- **GitHub Issues:** [Report bugs or request features](https://github.com/YOUR_USERNAME/rapbots-ai/issues)

---

## 🎯 Roadmap

### ✅ Completed (November 2025)
- [x] Core gameplay implementation
- [x] Arc L1 integration (testnet)
- [x] AI payment agent with natural language control
- [x] Multi-provider TTS system (ElevenLabs, OpenAI, Groq)
- [x] 24-lesson training program across 6 categories
- [x] Three-tier currency system (Store Credits, XP, USDC)
- [x] ELO-based matchmaking for PvP
- [x] ARTalk lip-sync integration
- [x] Legal compliance: Competitive stakes terminology
- [x] Production deployment on Replit
- [x] Public landing page with feature showcase

### Q4 2025 - Polish & Launch
- [ ] Public beta release
- [ ] User acquisition campaign
- [ ] Mobile-responsive optimizations
- [ ] Additional AI opponents with unique personalities
- [ ] Leaderboard and ranking system

### Q1 2026 - Scale
- [ ] Mobile apps (iOS/Android)
- [ ] Celebrity AI opponents
- [ ] Sponsored tournaments
- [ ] Multi-language support
- [ ] Social features (friends, challenges)

### Q2 2026 - Platform
- [ ] Voice Payment SDK for developers
- [ ] White-label licensing
- [ ] Enterprise integrations
- [ ] API marketplace
- [ ] Creator marketplace for custom AI opponents

---

## 📊 Stats

- **15,000+** lines of production code
- **Sub-second** Arc L1 transaction finality
- **500ms** average transcription latency (Groq Whisper)
- **24 training lessons** across 6 categories
- **3 rounds** per battle (customizable)
- **$0.50 - $100** competitive stake range
- **8 players** max tournament size
- **100 XP levels** progression system
- **3 TTS providers** with intelligent routing
- **ELO matchmaking** for fair competition

---

## 🌟 Feature Highlights

### Landing Page
Visit **https://rapbotsarc.replit.app/** to see:
- Hero section with demo video link
- "Play to Earn Real Money Through Skill" explanation
- Three-tier currency system breakdown
- Pricing tiers (Free, Premium, Pro)
- Training program showcase
- Legal classification notice (skill-based gaming)
- Replit referral link for new users

### User Journey
1. **Visitor** → Landing page (no barriers)
2. **Sign Up** → Create account (email/password or Replit Auth)
3. **Training** → Complete 24 lessons to build skills
4. **Practice** → Battle AI with no stakes
5. **Compete** → Join tournaments or stake battles
6. **Earn** → Win USDC rewards
7. **Withdraw** → Cash out anytime

---

## ⭐ Star History

If you find this project interesting, please consider giving it a star! ⭐

---

## 🔒 Security & Privacy

- **Encrypted API keys** - User API keys stored with AES-256 encryption
- **Secure sessions** - HttpOnly cookies with SameSite protection
- **HTTPS only** - All production traffic encrypted
- **Content moderation** - Llama Guard 4 filters inappropriate content
- **Age verification** - Required for USDC competitive stakes
- **Responsible gaming** - Spending limits and self-exclusion tools

---

**Built with ❤️ for the future of voice-controlled blockchain gaming**

🎤 Speak. Battle. Win. Earn. 🏆

**Try it now:** https://rapbotsarc.replit.app/
