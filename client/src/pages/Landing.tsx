import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Mic, Zap, Star, Sparkles } from "lucide-react";
import { SEO, generateWebPageStructuredData } from "@/components/SEO";
import { motion } from "framer-motion";

export default function Landing() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Battle Rap AI",
    "description": "Epic voice-powered rap battles against advanced AI opponents with real-time transcription and professional scoring",
    "url": "https://rapbots.online/",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Real-time voice recognition",
      "AI opponents with distinct personalities",
      "Professional battle scoring",
      "Text-to-speech synthesis",
      "Tournament system",
      "Battle history tracking",
      "Clone yourself system",
      "Fine-tuning AI models"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247",
      "bestRating": "5"
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SEO
        title="Battle Rap AI - Epic Voice-Powered Rap Battles Against AI"
        description="Experience the ultimate voice-powered freestyle battles against advanced AI opponents with real-time rap scoring. Master your flow, perfect your rhymes, and climb the leaderboard in this revolutionary battle rap game online."
        keywords={['rap battle AI', 'voice battle game', 'freestyle rap game', 'AI rap opponent', 'battle rap online', 'voice recognition rap', 'hip hop battle game', 'rap scoring AI', 'freestyle battle simulator']}
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-32 text-center relative overflow-hidden" aria-labelledby="hero-title">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf640_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf640_1px,transparent_1px)] bg-[size:64px_64px] animate-slow-pulse"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-prism-cyan rounded-full blur-3xl opacity-10 animate-slow-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-magenta rounded-full blur-3xl opacity-10 animate-slow-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <motion.div 
          className="mb-16 relative glass-card neon-border-magenta p-16 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 id="hero-title" className="text-7xl font-orbitron font-bold text-white mb-8 leading-tight">
                Battle Rap AI: Face Off Against the Future of <span className="text-neon-magenta">Flow</span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Experience the ultimate <span className="text-prism-cyan font-semibold">voice-powered freestyle battles</span> against advanced AI opponents with real-time rap scoring. 
              Master your flow, perfect your rhymes, and climb the leaderboard in this revolutionary battle rap game online.
            </motion.p>
            
            {/* Demo Video Link */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href="https://www.youtube.com/watch?v=0RspT9qVNpY"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all hover-lift"
              >
                <Sparkles className="w-5 h-5" />
                Watch Demo on YouTube
              </a>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-primary-bg hover-lift text-white px-12 py-6 text-xl font-bold rounded-xl border-2 border-neon-magenta glow-pulse-magenta"
                onClick={() => window.location.href = '/api/login'}
              >
                <Mic className="mr-3 h-6 w-6" />
                Start Battling
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-prism-cyan text-prism-cyan hover:bg-prism-cyan hover:text-black px-12 py-6 text-xl font-bold rounded-xl hover-lift transition-all"
                onClick={() => window.location.href = '/tournaments'}
              >
                View Leaderboard
              </Button>
            </motion.div>

            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="stat-badge">
                <Sparkles className="inline w-4 h-4 mr-2 text-green-400" />
                <span className="text-green-400 font-bold">Earn Real USDC</span>
              </div>
              <div className="stat-badge">
                <Star className="inline w-4 h-4 mr-2 text-blue-400" />
                <span className="text-blue-400 font-bold">24 Training Lessons</span>
              </div>
              <div className="stat-badge">
                <Zap className="inline w-4 h-4 mr-2 text-neon-magenta" />
                <span className="text-neon-magenta font-bold">Skill-Based Tournaments</span>
              </div>
              <div className="stat-badge">
                <Crown className="inline w-4 h-4 mr-2 text-prism-cyan" />
                <span className="text-prism-cyan font-bold">Arc Blockchain</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-24 mb-24">
        <motion.h2 
          className="text-5xl font-orbitron font-bold text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How AI Rap Battles <span className="text-neon-magenta">Work</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: <Mic className="w-10 h-10" />,
              title: "1. Voice-Powered Input",
              description: "Speak your bars directly into the mic with real-time voice recognition. Our advanced AI transcription captures every word, flow, and rhythm instantly.",
              color: "text-prism-cyan",
              borderColor: "neon-border-cyan",
              delay: 0
            },
            {
              icon: <Zap className="w-10 h-10" />,
              title: "2. AI Battle Response",
              description: "Watch as our AI opponent analyzes your verse and fires back with devastating counter-attacks. Each AI has unique personalities and battle styles to keep you on your toes.",
              color: "text-neon-magenta",
              borderColor: "neon-border-magenta",
              delay: 0.2
            },
            {
              icon: <Star className="w-10 h-10" />,
              title: "3. Professional Scoring",
              description: "Get instant feedback with our professional battle rap scoring system. Track rhyme density, flow quality, wordplay complexity, and crowd-pleasing punchlines.",
              color: "text-prism-cyan",
              borderColor: "neon-border-cyan",
              delay: 0.4
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`glass-panel ${item.borderColor} p-8 rounded-2xl hover-lift text-center`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: item.delay }}
            >
              <div className={`w-20 h-20 ${item.color} bg-gradient-primary-bg rounded-full flex items-center justify-center mx-auto mb-6 glow-pulse-cyan`}>
                {item.icon}
              </div>
              <h3 className={`text-2xl font-orbitron font-semibold ${item.color} mb-4`}>{item.title}</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why RapBots Section */}
      <section className="container mx-auto px-4 py-24 mb-24">
        <motion.h2 
          className="text-5xl font-orbitron font-bold text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Play to Earn <span className="text-neon-magenta">Real Money</span> Through Skill
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <motion.div 
            className="glass-panel neon-border-cyan p-10 rounded-2xl hover-lift"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-3xl font-orbitron font-bold text-prism-cyan mb-6 flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              Earn USDC Cryptocurrency
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed mb-6">
              RapBots is the first skill-based rap battle game where you earn <strong className="text-green-400">real USDC cryptocurrency</strong> on Circle's Arc L1 blockchain. Win battles, place in tournaments, and withdraw your earnings anytime - no middleman, no restrictions.
            </p>
            <div className="space-y-3">
              <div className="stat-badge">
                <span className="text-neon-magenta font-bold">Free Rewards:</span> <span className="text-white">Earn $0.10 USDC per win</span>
              </div>
              <div className="stat-badge">
                <span className="text-neon-magenta font-bold">Tournaments:</span> <span className="text-white">$5-$250 USDC prize pools</span>
              </div>
              <div className="stat-badge">
                <span className="text-neon-magenta font-bold">Competitive Stakes:</span> <span className="text-white">Winner takes all (skill-based)</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel neon-border-magenta p-10 rounded-2xl hover-lift"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-3xl font-orbitron font-bold text-neon-magenta mb-6 flex items-center gap-3">
              <Star className="w-8 h-8" />
              Master Your Craft
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed mb-6">
              Level up with our <strong className="text-prism-cyan">24-lesson training program</strong> covering everything from basic flow to advanced wordplay. Each lesson includes practice battles and rewards XP + currency.
            </p>
            <div className="space-y-3">
              <div className="stat-badge">
                <span className="text-prism-cyan font-bold">6 Categories:</span> <span className="text-white">Basics • Flow • Wordplay • Tactics</span>
              </div>
              <div className="stat-badge">
                <span className="text-prism-cyan font-bold">ELO Matchmaking:</span> <span className="text-white">Fair, skill-based competition</span>
              </div>
              <div className="stat-badge">
                <span className="text-prism-cyan font-bold">Progress Tracking:</span> <span className="text-white">Unlock new lessons & rewards</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Currency System Section */}
      <section className="container mx-auto px-4 py-24 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-orbitron font-bold text-white text-center mb-6">
            Three Ways to Earn & <span className="text-neon-magenta">Progress</span>
          </h2>
          <p className="text-center text-gray-300 text-xl mb-16 max-w-3xl mx-auto">
            RapBots features a transparent three-tier reward system. Earn through gameplay, compete for prizes, and withdraw real cryptocurrency.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <Card className="glass-panel neon-border-cyan text-white h-full hover-lift">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-prism-cyan text-2xl font-orbitron">
                  <Star className="h-7 w-7" />
                  Store Credits
                </CardTitle>
                <CardDescription className="text-gray-300 text-base">Virtual Currency for Cosmetics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-200 text-lg">Start with <strong className="text-green-400">$1,000 free credits</strong></p>
                <div className="space-y-2 text-gray-300">
                  <p>• Buy avatar items & effects</p>
                  <p>• Earn from promotions & referrals</p>
                  <p>• Cannot be withdrawn (like V-Bucks)</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-panel neon-border-magenta text-white h-full hover-lift">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-neon-magenta text-2xl font-orbitron">
                  <Zap className="h-7 w-7" />
                  Battle XP & Currency
                </CardTitle>
                <CardDescription className="text-gray-300 text-base">Earned Through Gameplay</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-gray-200 text-lg">
                  <p>• Win battles → <strong className="text-yellow-400">500 XP</strong></p>
                  <p>• Training lessons → <strong className="text-yellow-400">100 XP</strong></p>
                  <p>• Daily challenges → <strong className="text-yellow-400">200 XP</strong></p>
                  <p>• Level up & unlock content</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-card gradient-card-bg border-2 border-green-500 text-white h-full hover-lift glow-pulse-cyan transform scale-105">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-green-400 text-2xl font-orbitron flex-wrap">
                  <Crown className="h-7 w-7" />
                  USDC Cryptocurrency
                  <Badge className="bg-green-600 text-white text-sm font-bold">REAL MONEY</Badge>
                </CardTitle>
                <CardDescription className="text-green-200 text-base font-semibold">Arc Blockchain Rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-gray-100 text-lg">
                  <p>• Win battles → <strong className="text-green-300">$0.10 USDC</strong></p>
                  <p>• Tournaments → <strong className="text-green-300">$5-$250 USDC</strong></p>
                  <p>• Competitive stakes → <strong className="text-green-300">Winner takes all</strong></p>
                  <p className="font-bold text-white">✓ Fully withdrawable anytime</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          className="mt-12 text-center glass-panel p-8 rounded-2xl max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-base text-gray-300">
            <strong className="text-prism-cyan font-orbitron">Legal Classification:</strong> RapBots operates as a skill-based competitive gaming platform (like esports tournaments), not gambling. 
            Outcomes are determined by rap quality scored by our AI algorithm, with ELO matchmaking ensuring fair competition.
          </p>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-24 mb-24">
        <motion.h2 
          className="text-5xl font-orbitron font-bold text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Choose Your <span className="text-neon-magenta">Battle Plan</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <Card className="glass-panel border-2 border-slate-600 text-white h-full hover-lift">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-orbitron">
                  <Mic className="h-6 w-6 text-gray-400" />
                  Free
                </CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  Perfect for getting started
                </CardDescription>
                <div className="text-4xl font-orbitron font-bold mt-4">$0<span className="text-lg text-gray-400">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-base mb-8">
                  <li className="flex items-center gap-2">✓ 3 battles per day</li>
                  <li className="flex items-center gap-2">✓ Basic AI opponents</li>
                  <li className="flex items-center gap-2">✓ Standard voices</li>
                  <li className="flex items-center gap-2">✓ Battle history</li>
                  <li className="text-gray-500 flex items-center gap-2">✗ Advanced analysis</li>
                  <li className="text-gray-500 flex items-center gap-2">✗ Premium voices</li>
                </ul>
                <Button 
                  className="w-full py-6 bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg hover-lift"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Start Free
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Premium Tier */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-card gradient-card-bg neon-border-magenta text-white h-full transform scale-105 glow-pulse-magenta">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-orbitron flex-wrap">
                  <Zap className="h-6 w-6 text-neon-magenta" />
                  Premium
                  <Badge className="bg-yellow-500 text-black text-sm font-bold">POPULAR</Badge>
                </CardTitle>
                <CardDescription className="text-gray-200 text-base font-semibold">
                  For serious battle rappers
                </CardDescription>
                <div className="text-4xl font-orbitron font-bold mt-4 text-neon-magenta">$9.99<span className="text-lg text-gray-300">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-base mb-8">
                  <li className="flex items-center gap-2">✓ 25 battles per day</li>
                  <li className="flex items-center gap-2">✓ Advanced AI opponents</li>
                  <li className="flex items-center gap-2">✓ Premium voices</li>
                  <li className="flex items-center gap-2">✓ Battle analysis</li>
                  <li className="flex items-center gap-2">✓ No ads</li>
                  <li className="flex items-center gap-2">✓ Monthly tournaments</li>
                </ul>
                <Button 
                  className="w-full py-6 bg-gradient-primary-bg border-2 border-neon-magenta hover:scale-105 text-white font-bold text-lg transition-transform"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-panel neon-border-cyan text-white h-full hover-lift glow-pulse-cyan">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-orbitron">
                  <Crown className="h-6 w-6 text-prism-cyan" />
                  Pro
                </CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  For championship contenders
                </CardDescription>
                <div className="text-4xl font-orbitron font-bold mt-4 text-prism-cyan">$19.99<span className="text-lg text-gray-400">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-base mb-8">
                  <li className="flex items-center gap-2">✓ Unlimited battles</li>
                  <li className="flex items-center gap-2">✓ All AI opponents</li>
                  <li className="flex items-center gap-2">✓ Custom voices</li>
                  <li className="flex items-center gap-2">✓ Advanced analytics</li>
                  <li className="flex items-center gap-2">✓ Priority support</li>
                  <li className="flex items-center gap-2">✓ Tournament mode</li>
                </ul>
                <Button 
                  className="w-full py-6 bg-prism-cyan hover:bg-prism-cyan/80 text-black font-bold text-lg hover-lift"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Go Pro
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24 mb-24">
        <motion.h2 
          className="text-5xl font-orbitron font-bold text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Battle <span className="text-neon-magenta">Features</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: <Mic className="h-10 w-10" />,
              title: "Voice Recording",
              description: "Record your verses with studio-quality audio",
              color: "text-prism-cyan",
              delay: 0
            },
            {
              icon: <Zap className="h-10 w-10" />,
              title: "AI Opponents",
              description: "Battle against intelligent AI with unique personalities",
              color: "text-neon-magenta",
              delay: 0.1
            },
            {
              icon: <Star className="h-10 w-10" />,
              title: "Real-time Analysis",
              description: "Get instant feedback on rhyme schemes and flow",
              color: "text-prism-cyan",
              delay: 0.2
            },
            {
              icon: <Crown className="h-10 w-10" />,
              title: "Tournaments",
              description: "Compete in ranked battles and climb the leaderboard",
              color: "text-neon-magenta",
              delay: 0.3,
              link: "/tournaments"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="glass-panel neon-border-cyan p-8 rounded-2xl text-center hover-lift"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
            >
              <div className={`${feature.color} bg-gradient-primary-bg w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-pulse-cyan`}>
                {feature.icon}
              </div>
              <h3 className={`${feature.color} font-orbitron font-semibold text-xl mb-3`}>{feature.title}</h3>
              {feature.link ? (
                <p className="text-gray-300 text-base">
                  <a href={feature.link} className="text-prism-cyan hover:text-neon-magenta underline transition-colors">
                    {feature.description}
                  </a>
                </p>
              ) : (
                <p className="text-gray-300 text-base">{feature.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-16 mt-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-400 text-lg mb-8">
              &copy; 2025 <span className="text-neon-magenta font-orbitron font-bold">Battle Rap AI</span>. Level up your battle skills.
            </p>
            <div className="glass-panel p-8 rounded-2xl border-2 border-prism-cyan max-w-lg mx-auto">
              <p className="text-base text-gray-300 mb-4 font-semibold">New to Replit? Get started with hosting!</p>
              <a 
                href="https://replit.com/~" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-prism-cyan hover:text-neon-magenta text-base font-bold underline transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Sign up to Replit with my referral link
              </a>
            </div>
          </motion.div>
        </div>
      </footer>
    </main>
  );
}