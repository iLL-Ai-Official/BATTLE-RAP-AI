import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Target, CheckCircle2, Clock, Trophy, Star, Zap, Award, TrendingUp, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Navigation } from '@/components/navigation';
import { Link } from 'wouter';

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'battle_wins' | 'score_threshold' | 'rhyme_density' | 'training' | 'tournament';
  targetValue: number;
  xpReward: number;
  currencyReward: number;
  expiresAt: Date;
}

interface UserChallengeProgress {
  challengeId: string;
  currentProgress: number;
  isCompleted: boolean;
  completedAt?: Date;
}

export default function ChallengesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch daily challenges
  const { data: challenges = [] } = useQuery<DailyChallenge[]>({
    queryKey: ['/api/challenges/daily'],
  });

  // Fetch user progress
  const { data: progress = [] } = useQuery<UserChallengeProgress[]>({
    queryKey: ['/api/challenges/progress'],
  });

  // Claim reward
  const claimReward = useMutation({
    mutationFn: async (challengeId: string) => {
      return apiRequest('POST', `/api/challenges/claim/${challengeId}`, {});
    },
    onSuccess: (data: any) => {
      toast({
        title: "Reward Claimed!",
        description: `You earned ${data.xpReward} XP and $${data.currencyReward}!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/challenges/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });

  const getChallengeProgress = (challengeId: string) => {
    return progress.find(p => p.challengeId === challengeId);
  };

  const getProgressPercentage = (challenge: DailyChallenge) => {
    const challengeProgress = getChallengeProgress(challenge.id);
    if (!challengeProgress) return 0;
    return Math.min(100, (challengeProgress.currentProgress / challenge.targetValue) * 100);
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'battle_wins': return <Trophy className="text-yellow-400" size={24} />;
      case 'score_threshold': return <TrendingUp className="text-green-400" size={24} />;
      case 'rhyme_density': return <Star className="text-purple-400" size={24} />;
      case 'training': return <Award className="text-blue-400" size={24} />;
      case 'tournament': return <Target className="text-pink-400" size={24} />;
      default: return <Zap className="text-orange-400" size={24} />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'battle_wins': 'Battle Wins',
      'score_threshold': 'High Score',
      'rhyme_density': 'Rhyme Master',
      'training': 'Training',
      'tournament': 'Tournament'
    };
    return labels[type] || type;
  };

  const completedCount = challenges.filter(c => getChallengeProgress(c.id)?.isCompleted).length;
  const totalRewards = challenges.reduce((sum, c) => {
    const prog = getChallengeProgress(c.id);
    return prog?.isCompleted ? sum + c.xpReward : sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-black to-red-900 text-white p-4">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-20">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
            <Target size={48} />
            Daily Challenges
          </h1>
          <p className="text-gray-400">Complete challenges to earn XP and currency rewards</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-900/80 border-orange-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/20 rounded-full p-3">
                  <CheckCircle2 className="text-orange-400" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{completedCount}/{challenges.length}</div>
                  <div className="text-sm text-gray-400">Completed Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 rounded-full p-3">
                  <Zap className="text-purple-400" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{totalRewards.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">XP Earned Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border-blue-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 rounded-full p-3">
                  <Flame className="text-blue-400" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{(user as any)?.challengeStreak || 0}</div>
                  <div className="text-sm text-gray-400">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenge List */}
        <div className="space-y-4">
          {challenges.length === 0 ? (
            <Card className="bg-gray-900/80 border-gray-700 backdrop-blur">
              <CardContent className="text-center py-12">
                <Target className="mx-auto mb-4 text-gray-500" size={48} />
                <p className="text-gray-400 mb-2">No challenges available right now</p>
                <p className="text-sm text-gray-500">Check back tomorrow for new daily challenges!</p>
              </CardContent>
            </Card>
          ) : (
            challenges.map((challenge) => {
              const challengeProgress = getChallengeProgress(challenge.id);
              const isCompleted = challengeProgress?.isCompleted || false;
              const currentProgress = challengeProgress?.currentProgress || 0;
              const progressPercent = getProgressPercentage(challenge);
              const canClaim = isCompleted && !challengeProgress?.completedAt;

              return (
                <Card 
                  key={challenge.id}
                  className={`bg-gray-900/80 border-2 backdrop-blur transition-all ${
                    isCompleted 
                      ? 'border-green-500/50 shadow-green-500/20' 
                      : 'border-gray-700/50 hover:border-purple-500/50'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          {getChallengeIcon(challenge.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <CardTitle className="text-xl text-white mb-1">{challenge.title}</CardTitle>
                              <CardDescription className="text-gray-400">{challenge.description}</CardDescription>
                            </div>
                            {isCompleted && (
                              <CheckCircle2 className="text-green-400 flex-shrink-0" size={24} />
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              {getTypeLabel(challenge.type)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Clock size={14} />
                              <span>Expires in {Math.max(0, Math.floor((new Date(challenge.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)))}h</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-purple-400">
                            <Zap size={16} />
                            <span className="font-bold">{challenge.xpReward} XP</span>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400 text-sm">
                            <Star size={14} />
                            <span>${challenge.currencyReward}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-semibold">
                          {currentProgress} / {challenge.targetValue}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                      
                      {canClaim && (
                        <Button
                          onClick={() => claimReward.mutate(challenge.id)}
                          className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                          <Trophy className="mr-2" size={16} />
                          Claim Reward
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-900/80 border-blue-500/30 mt-8 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription>Start completing challenges now!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/battle">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Trophy className="mr-2" size={16} />
                  Start Battle
                </Button>
              </Link>
              <Link href="/training">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Award className="mr-2" size={16} />
                  Training
                </Button>
              </Link>
              <Link href="/tournaments">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  <Target className="mr-2" size={16} />
                  Tournaments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
