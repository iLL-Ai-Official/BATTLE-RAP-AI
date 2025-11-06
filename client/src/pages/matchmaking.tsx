import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Users, Swords, Trophy, Clock, Target, Zap, Crown, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Navigation } from '@/components/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchmakingStatus {
  inQueue: boolean;
  queueTime: number;
  estimatedWait: number;
  matchFound: boolean;
  matchId?: string;
  opponentId?: string;
  opponentName?: string;
  opponentELO?: number;
}

interface PlayerStats {
  eloRating: number;
  rank: string;
  totalBattles: number;
  wins: number;
  losses: number;
  winRate: number;
}

export default function MatchmakingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [queueTime, setQueueTime] = useState(0);
  const [difficulty, setDifficulty] = useState<'any' | 'easy' | 'normal' | 'hard'>('any');

  // Fetch matchmaking status
  const { data: status } = useQuery<MatchmakingStatus>({
    queryKey: ['/api/matchmaking/status'],
    refetchInterval: 2000, // Poll every 2 seconds
  });

  // Fetch player stats
  const { data: stats } = useQuery<PlayerStats>({
    queryKey: ['/api/matchmaking/stats'],
  });

  // Join queue
  const joinQueue = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/matchmaking/queue', { difficulty });
    },
    onSuccess: () => {
      toast({
        title: "Joined Queue!",
        description: "Searching for opponent...",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/matchmaking/status'] });
    },
  });

  // Leave queue
  const leaveQueue = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/matchmaking/leave', {});
    },
    onSuccess: () => {
      toast({
        title: "Left Queue",
        description: "You've left the matchmaking queue.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/matchmaking/status'] });
      setQueueTime(0);
    },
  });

  // Accept match
  const acceptMatch = useMutation({
    mutationFn: async (matchId: string) => {
      return apiRequest('POST', `/api/matchmaking/accept/${matchId}`, {});
    },
    onSuccess: (data: any) => {
      setLocation(`/battle/${data.battleId}`);
    },
  });

  // Queue timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status?.inQueue) {
      interval = setInterval(() => {
        setQueueTime(prev => prev + 1);
      }, 1000);
    } else {
      setQueueTime(0);
    }
    return () => clearInterval(interval);
  }, [status?.inQueue]);

  // Auto-accept match when found
  useEffect(() => {
    if (status?.matchFound && status.matchId) {
      toast({
        title: "Match Found!",
        description: `Opponent: ${status.opponentName} (ELO: ${status.opponentELO})`,
      });
      acceptMatch.mutate(status.matchId);
    }
  }, [status?.matchFound, status?.matchId]);

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Grand Master': return 'from-purple-500 to-pink-500';
      case 'Master': return 'from-blue-500 to-purple-500';
      case 'Diamond': return 'from-blue-400 to-cyan-400';
      case 'Platinum': return 'from-cyan-500 to-blue-500';
      case 'Gold': return 'from-yellow-500 to-orange-500';
      case 'Silver': return 'from-gray-400 to-gray-500';
      default: return 'from-orange-700 to-orange-900';
    }
  };

  const getRankIcon = (rank: string) => {
    if (rank.includes('Master')) return <Crown className="text-purple-400" size={24} />;
    if (rank === 'Diamond') return <Trophy className="text-cyan-400" size={24} />;
    return <Target className="text-orange-400" size={24} />;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-purple-900 text-white p-4">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-20">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-orbitron font-bold mb-2 bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
            <Swords size={48} />
            Player vs Player
          </h1>
          <p className="text-gray-400">Compete against real players in ranked battles</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="glass-panel neon-border-cyan hover-lift rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                {getRankIcon(stats?.rank || 'Bronze')}
                <h3 className="text-white font-orbitron text-lg">Your Rank</h3>
              </div>
              <div className={`text-center p-6 rounded-lg bg-gradient-to-r ${getRankColor(stats?.rank || 'Bronze')}`}>
                <div className="text-3xl font-orbitron font-bold text-white mb-2">{stats?.rank || 'Unranked'}</div>
                <div className="stat-badge text-white/90">ELO: {stats?.eloRating || 1000}</div>
              </div>
            </div>

            <div className="glass-panel neon-border-cyan hover-lift rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-prism-cyan" />
                <h3 className="text-white font-orbitron text-lg">Statistics</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Battles</span>
                  <span className="stat-badge text-white font-bold">{stats?.totalBattles || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Wins</span>
                  <span className="stat-badge gradient-card-bg text-green-400 font-bold">{stats?.wins || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Losses</span>
                  <span className="stat-badge text-red-400 font-bold">{stats?.losses || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="stat-badge text-neon-magenta font-bold">
                    {stats?.winRate ? `${Math.round(stats.winRate)}%` : '0%'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center Column - Matchmaking */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className={`glass-card ${status?.inQueue ? 'neon-border-magenta glow-pulse-magenta' : 'neon-border-cyan'} p-6 rounded-2xl`}>
              <div className="mb-6">
                <h2 className="text-2xl text-white font-orbitron flex items-center gap-2 mb-2">
                  <Users size={28} className="text-prism-cyan" />
                  Matchmaking
                </h2>
                <p className="text-gray-400 text-sm">
                  Find and battle against players with similar skill level
                </p>
              </div>
              
              <AnimatePresence mode="wait">
                {status?.inQueue ? (
                  <motion.div
                    key="queue"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Queue Status */}
                    <div className="gradient-card-bg rounded-xl p-8 text-center">
                      <div className="inline-block relative mb-6">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-75"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-8 glow-pulse-cyan">
                          <Users className="text-white" size={48} />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <motion.div 
                          className="text-2xl font-orbitron font-bold text-white mb-4 flex items-center justify-center gap-2"
                          animate={{ opacity: [1, 0.7, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          Searching for Opponent
                          <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
                          >
                            .
                          </motion.span>
                          <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1], delay: 0.2 }}
                          >
                            .
                          </motion.span>
                          <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1], delay: 0.4 }}
                          >
                            .
                          </motion.span>
                        </motion.div>
                        
                        <div className="stat-badge inline-block text-neon-magenta font-orbitron text-xl mb-2">
                          {formatTime(queueTime)}
                        </div>
                        
                        <div className="text-sm text-gray-400 mt-2">
                          Estimated wait: {Math.max(10, status.estimatedWait || 30)}s
                        </div>
                      </div>
                    </div>

                    {/* Queue Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400 font-orbitron">
                        <span>Finding match...</span>
                        <span className="text-neon-magenta">{Math.min(100, Math.round((queueTime / 30) * 100))}%</span>
                      </div>
                      <div className="glass-panel rounded-full h-3 overflow-hidden">
                        <motion.div 
                          className="gradient-primary-bg h-full rounded-full glow-pulse-magenta"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (queueTime / 30) * 100)}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => leaveQueue.mutate()}
                        variant="outline"
                        className="w-full border-red-500 text-red-500 hover:bg-red-500/20 glass-panel h-12 font-orbitron"
                      >
                        Leave Queue
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Difficulty Selection */}
                    <div>
                      <label className="text-gray-400 text-sm mb-3 block font-orbitron">Select Difficulty Preference</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['any', 'easy', 'normal', 'hard'].map((diff) => (
                          <motion.button
                            key={diff}
                            onClick={() => setDifficulty(diff as any)}
                            className={`glass-panel hover-lift p-3 rounded-lg font-orbitron text-sm transition-all ${
                              difficulty === diff ? 'neon-border-magenta gradient-card-bg' : 'border border-gray-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {diff.charAt(0).toUpperCase() + diff.slice(1)}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Queue Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => joinQueue.mutate()}
                        disabled={joinQueue.isPending}
                        className="w-full h-16 text-lg gradient-primary-bg hover:opacity-90 font-orbitron glow-pulse-magenta"
                      >
                        <Users className="mr-2" size={24} />
                        {joinQueue.isPending ? 'Joining...' : 'Find Match'}
                      </Button>
                    </motion.div>

                    {/* Info */}
                    <div className="glass-panel border border-blue-500/30 rounded-xl p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="text-prism-cyan flex-shrink-0" size={20} />
                        <div className="text-sm text-gray-300">
                          <p className="font-orbitron font-semibold mb-1 text-white">ELO Matchmaking</p>
                          <p>You'll be matched with players within ±200 ELO of your rating ({stats?.eloRating || 1000}).</p>
                        </div>
                      </div>
                    </div>

                    {/* How It Works */}
                    <div className="space-y-3">
                      <h3 className="font-orbitron font-semibold text-white">How PvP Works</h3>
                      <div className="space-y-2 text-sm text-gray-400">
                        {[
                          'Join the queue and wait for a match',
                          'Battle against a real player in turn-based combat',
                          'Win to gain ELO rating and climb the ranks'
                        ].map((text, i) => (
                          <motion.div
                            key={i}
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                          >
                            <div className="gradient-primary-bg rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 font-orbitron">
                              {i + 1}
                            </div>
                            <p>{text}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
