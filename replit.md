# Voice-Enabled Rap Battle Game

## Overview
This project is a real-time, voice-enabled rap battle application designed for immersive battles against AI opponents. It leverages advanced AI for speech recognition, rap generation, and text-to-speech, aiming to create an authentic and dynamic battle rap experience. The application includes a sophisticated scoring system, character selection with distinct voices, email/password authentication, and monetization features, positioning it as a unique entertainment platform in the voice AI gaming market. The ambition is to provide a highly engaging and technically advanced rap battle simulation.

## User Preferences
- Focus on functional implementation over extensive documentation
- Prioritize working features and error-free operation
- Use TypeScript for better type safety
- Implement responsive design for mobile and desktop
- Use authentic data from real API calls, no mock/placeholder data
- Include user's Replit referral link for new users signing up to Replit

## System Architecture
The application is built with a clear separation between frontend and backend services. The UI/UX features a modern single-page application (SPA) design with React and Vite, styled responsively using Tailwind CSS, and enhanced with Framer Motion for smooth animations. Key technical implementations include real-time voice recording with instant transcription, AI-powered rap generation with adjustable difficulty and complexity levels, profanity filtering, and a comprehensive battle scoring system that evaluates rhyme density, flow quality, and creativity. Character avatars are AI-generated and feature advanced lip-sync using ARTalk for photorealistic animations. The system also includes a robust monetization model with subscription tiers and secure payment processing via Stripe, managed with Replit Auth and a PostgreSQL database.

The architecture supports a 100-level XP progression system, a seasonal Battle Pass, and a cosmetic shop. A rap training program offers structured lessons with practice battles. Platform wallet management includes a rewards pool, company profit wallet, and transaction tracking with balance alerts. The authentication system supports both Replit OAuth and local email/password login with bcrypt hashing.

Recent architectural additions include Circle Arc L1 blockchain integration for USDC-based tournament rewards and competitive stake battles, user Arc wallet creation, and transaction tracking. An AI payment agent allows natural language control for USDC operations. A multiplayer PvP system supports real player battles, random matchmaking with an ELO skill rating system, and multiplayer tournaments with USDC prizes.

Technical Implementations:
- **Backend**: Express.js with TypeScript, PostgreSQL, and a dedicated scoring service.
- **Frontend**: React + Vite, Tailwind CSS, TanStack Query, Wouter, Framer Motion.
- **Rap Generation**: Utilizes Groq's Llama model with advanced prompting.
- **Scoring System**: Analyzes rhyme density, flow quality, and creativity.
- **Audio & Voice**: Instant transcription (500ms), user-managed API keys for OpenAI gpt-4o-mini-tts (2025), Groq PlayAI TTS, ElevenLabs TTS (native speed control, breath patterns, Turbo models, pronunciation dictionaries), intelligent TTS routing with system fallbacks (Bark TTS + Typecast), and ARTalk for speech-driven 3D head animation and lip sync. FFmpeg for audio processing.
- **User API Management**: Secure storage of personal API keys, preference-based TTS selection, and automatic fallback.
- **Arc Blockchain Integration**: Circle's Arc L1 blockchain for USDC rewards and competitive stake battles.
- **Monetization**: Replit Auth, PostgreSQL, Stripe for subscriptions, Arc blockchain for USDC rewards.
- **Security**: Robust input validation, enhanced error handling, content moderation (Llama Guard 4), encrypted API key storage, secure audio file handling, and authenticated Arc wallet operations.

## External Dependencies
- **Groq API**: For instant speech-to-text (Whisper), AI rap generation (Llama), and PlayAI TTS models.
- **OpenAI API**: For gpt-4o-mini-tts (2025) with steerability features.
- **ElevenLabs API**: Premium TTS with advanced features including native speed control, breath patterns, Turbo models, and pronunciation dictionaries. Also powers all sound effects (crowd reactions, bells, victory sounds).
- **Circle Arc L1 Blockchain**: For USDC-based tournament rewards and competitive stake battles.
- **Typecast.ai**: For text-to-speech generation (system fallback).
- **ARTalk**: For advanced speech-driven 3D head animation and lip-sync.
- **Stripe**: For secure payment processing and subscription management.
- **Replit Auth**: For user authentication and management.
- **PostgreSQL**: Database for user, session, battle data, encrypted API key storage, Arc wallet addresses, and USDC transaction history.
- **FFmpeg**: For audio and video processing capabilities.

## Recent Changes (November 6, 2025)

### 🎨 Navigation & UI Accessibility Improvements
- **Added Navigation to Profile Page**: Users can now easily access Wallet, Battle Arena, Tournaments, Training, and all features from Profile page
- **Added Navigation to Battle Arena**: Full navigation menu now available during battles for quick access to Profile, Wallet, and other pages
- **Consistent UI**: Navigation component now appears across all major pages (Home, Profile, Wallet, Battle Arena, Tournaments, Training)
- **Mobile-Responsive**: Compact icon-based navigation optimized for all screen sizes

### 🐛 Critical Profile Page Fix
- **Owner Feature Visibility**: Fixed critical bug where navigating to `/profile` (without userId) incorrectly identified the page as viewing another user's profile
- **Root Cause**: `isOwnProfile` check only matched when userId param was present, hiding all owner-only features when accessing via direct navigation
- **Solution**: Changed ownership check to `!params?.userId || params?.userId === currentUser?.id` to default to true for own profile
- **Restored Features**: Store credit display ($1000 balance), Edit Profile button, Image Upload, and Character Card Generation now visible on `/profile`
- **Loading Optimization**: Added `authLoading` check to prevent profile fetch before authentication completes
- **Architect Approved**: Critical fix verified - all owner features now accessible

### 🐛 Critical Audio Playback Fix  
- **Duplicate TTS Issue Resolved**: Fixed critical bug where AI voice was playing 5 times simultaneously during battles
- **Root Cause**: Multiple audio components (SimpleAudioPlayer in BattleAvatar + AudioControls) were both playing the same TTS audio
- **Solution**: Removed SimpleAudioPlayer from BattleAvatar, keeping only AudioControls as the single audio playback source
- **Lip-Sync Preserved**: AdvancedLipSync continues to work in visual-only mode (disableAudioPlayback=true) for realistic mouth animations
- **User Experience**: Clean, single-stream audio playback with proper playback controls
- **Architect Approved**: PASS verdict - no functionality broken, duplicate audio eliminated

### 🔊 Audio Architecture Clarification
- **TTS Audio Playback**: AudioControls component handles all TTS audio from Groq, OpenAI, or ElevenLabs (user choice via Settings)
- **Sound Effects (SFX)**: ElevenLabs SFX Service ALWAYS handles sound effects (crowd reactions, bells, victory sounds) regardless of TTS provider
- **Independence**: SFX system is completely independent from TTS provider selection - users can use Groq for TTS while still getting ElevenLabs-powered sound effects
- **Fallback System**: If ElevenLabs API is unavailable, programmatic Web Audio API generates fallback sounds
- **Clean Architecture**: Clear separation between TTS audio playback, lip-sync animation, and sound effects - no redundancy

### 🎓 Training Program Full Implementation
- **Navigation Added to Training Page**: Training page now has consistent Navigation component matching Profile, Wallet, and Battle Arena
- **24 Training Lessons Seeded**: Database populated with comprehensive curriculum across 6 categories (Basics, Rhyme Schemes, Flow, Wordplay, Battle Tactics, Advanced)
- **Complete Lesson System**: Users can view lessons, start practice battles, earn XP rewards, and track progress across all categories
- **Ready for Demo**: All training features fully functional - lesson viewing, practice challenges, XP/currency rewards, and progress tracking
- **Protected Route**: Training page requires authentication for secure access to personalized progress and lesson completion data

### ⚖️ Legal Compliance: Terminology Update (Skill-Based Gaming)
- **Renamed "Wagering" to "Competitive Stakes"**: Updated all terminology throughout codebase for legal compliance
- **What Changed**: All instances of "wager/wagering/bet" → "stake/competitive stake/skill-based challenge"
- **Why**: Positions the game as **skill-based competitive gaming** (like esports tournaments), not gambling
- **Files Updated**: Schema config (WAGER_LIMITS → COMPETITIVE_STAKES_LIMITS), AI payment agent (voice commands), server routes, client UI text, database transaction types (wager_deposit → stake_deposit)
- **User-Facing Impact**: Players now "stake USDC on their skill" in competitive battles, emphasizing the skill-based nature
- **Legal Classification**: Competitive esports tournament model with skill-based outcomes, not chance-based gambling