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
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
            <Swords size={48} />
            Player vs Player
          </h1>
          <p className="text-gray-400">Compete against real players in ranked battles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  {getRankIcon(stats?.rank || 'Bronze')}
                  Your Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-center p-6 rounded-lg bg-gradient-to-r ${getRankColor(stats?.rank || 'Bronze')}`}>
                  <div className="text-3xl font-bold text-white mb-2">{stats?.rank || 'Unranked'}</div>
                  <div className="text-white/90">ELO: {stats?.eloRating || 1000}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 border-blue-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp size={20} />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Battles</span>
                  <span className="text-white font-bold">{stats?.totalBattles || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Wins</span>
                  <span className="text-green-400 font-bold">{stats?.wins || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Losses</span>
                  <span className="text-red-400 font-bold">{stats?.losses || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-purple-400 font-bold">
                    {stats?.winRate ? `${Math.round(stats.winRate)}%` : '0%'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Matchmaking */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Users size={28} />
                  Matchmaking
                </CardTitle>
                <CardDescription>
                  Find and battle against players with similar skill level
                </CardDescription>
              </CardHeader>
              <CardContent>
                {status?.inQueue ? (
                  <div className="space-y-6">
                    {/* Queue Status */}
                    <div className="text-center py-8">
                      <div className="inline-block relative">
                        <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75" />
                        <div className="relative bg-purple-600 rounded-full p-8">
                          <Users className="text-white" size={48} />
                        </div>
                      </div>
                      <div className="mt-6">
                        <div className="text-2xl font-bold text-white mb-2">Searching for Opponent...</div>
                        <div className="text-gray-400">Queue Time: {formatTime(queueTime)}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Estimated wait: {Math.max(10, status.estimatedWait || 30)}s
                        </div>
                      </div>
                    </div>

                    {/* Queue Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Finding match...</span>
                        <span>{Math.min(100, Math.round((queueTime / 30) * 100))}%</span>
                      </div>
                      <Progress value={Math.min(100, (queueTime / 30) * 100)} className="h-2" />
                    </div>

                    <Button
                      onClick={() => leaveQueue.mutate()}
                      variant="outline"
                      className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
                    >
                      Leave Queue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Difficulty Selection */}
                    <div>
                      <label className="text-gray-400 text-sm mb-3 block">Select Difficulty Preference</label>
                      <Tabs value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                          <TabsTrigger value="any">Any</TabsTrigger>
                          <TabsTrigger value="easy">Easy</TabsTrigger>
                          <TabsTrigger value="normal">Normal</TabsTrigger>
                          <TabsTrigger value="hard">Hard</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    {/* Queue Button */}
                    <Button
                      onClick={() => joinQueue.mutate()}
                      disabled={joinQueue.isPending}
                      className="w-full h-16 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Users className="mr-2" size={24} />
                      {joinQueue.isPending ? 'Joining...' : 'Find Match'}
                    </Button>

                    {/* Info */}
                    <Card className="bg-blue-900/20 border-blue-500/30">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
                          <div className="text-sm text-gray-300">
                            <p className="font-semibold mb-1 text-white">ELO Matchmaking</p>
                            <p>You'll be matched with players within ±200 ELO of your rating ({stats?.eloRating || 1000}).</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* How It Works */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-white">How PvP Works</h3>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-start gap-2">
                          <div className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                          <p>Join the queue and wait for a match</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                          <p>Battle against a real player in turn-based combat</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                          <p>Win to gain ELO rating and climb the ranks</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
