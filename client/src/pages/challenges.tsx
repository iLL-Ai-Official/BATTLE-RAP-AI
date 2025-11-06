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
import { motion } from 'framer-motion';

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
      case 'battle_wins': return <Trophy className="text-neon-magenta" size={24} />;
      case 'score_threshold': return <TrendingUp className="text-prism-cyan" size={24} />;
      case 'rhyme_density': return <Star className="text-neon-magenta" size={24} />;
      case 'training': return <Award className="text-prism-cyan" size={24} />;
      case 'tournament': return <Target className="text-neon-magenta" size={24} />;
      default: return <Zap className="text-prism-cyan" size={24} />;
    }
  };

  const getChallengeBorderClass = (type: string, isCompleted: boolean) => {
    if (isCompleted) return 'gradient-card-bg border-2 border-emerald-500/50';
    
    switch (type) {
      case 'battle_wins': return 'neon-border-magenta glow-pulse-magenta';
      case 'training': return 'neon-border-cyan glow-pulse-cyan';
      case 'score_threshold': return 'neon-border-cyan glow-pulse-cyan';
      default: return 'neon-border-cyan';
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
        <motion.div 
          className="mb-8 glass-card neon-border-magenta glow-pulse-magenta p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-2 font-orbitron text-neon-magenta flex items-center gap-3">
                <Target size={48} className="text-neon-magenta" />
                Daily Challenges
              </h1>
              <p className="text-gray-300">Complete challenges to earn XP and currency rewards</p>
            </div>
            <div className="stat-badge">
              <Clock className="inline mr-2" size={16} />
              Daily
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-panel border-2 border-emerald-500/30 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 rounded-full p-3 neon-border-cyan">
                    <CheckCircle2 className="text-prism-cyan" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white font-orbitron">{completedCount}/{challenges.length}</div>
                    <div className="text-sm text-gray-300">Completed Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-panel border-2 border-purple-500/30 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/20 rounded-full p-3 neon-border-magenta">
                    <Zap className="text-neon-magenta" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white font-orbitron">{totalRewards.toLocaleString()}</div>
                    <div className="text-sm text-gray-300">XP Earned Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-panel border-2 border-orange-500/30 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500/20 rounded-full p-3 neon-border-magenta glow-pulse-magenta">
                    <Flame className="text-neon-magenta" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white font-orbitron">{(user as any)?.challengeStreak || 0}</div>
                    <div className="text-sm text-gray-300">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Challenge List */}
        <div className="space-y-4">
          {challenges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-panel border-2 border-gray-700/50">
                <CardContent className="text-center py-12">
                  <Target className="mx-auto mb-4 text-gray-500" size={48} />
                  <p className="text-gray-300 mb-2 font-orbitron">No challenges available right now</p>
                  <p className="text-sm text-gray-400">Check back tomorrow for new daily challenges!</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            challenges.map((challenge, index) => {
              const challengeProgress = getChallengeProgress(challenge.id);
              const isCompleted = challengeProgress?.isCompleted || false;
              const currentProgress = challengeProgress?.currentProgress || 0;
              const progressPercent = getProgressPercentage(challenge);
              const canClaim = isCompleted && !challengeProgress?.completedAt;
              const isCompletable = progressPercent >= 100 && !isCompleted;

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card 
                    className={`glass-panel hover-lift transition-all ${getChallengeBorderClass(challenge.type, isCompleted)} ${
                      isCompletable ? 'glow-pulse-cyan' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="glass-panel rounded-lg p-3 border-2 border-white/10">
                            {getChallengeIcon(challenge.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <CardTitle className="text-xl text-white mb-1 font-orbitron">{challenge.title}</CardTitle>
                                <CardDescription className="text-gray-300">{challenge.description}</CardDescription>
                              </div>
                              {isCompleted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                >
                                  <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={24} />
                                </motion.div>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-3">
                              <span className="stat-badge">
                                {getTypeLabel(challenge.type)}
                              </span>
                              <div className="flex items-center gap-1 text-sm text-gray-300">
                                <Clock size={14} className="text-prism-cyan" />
                                <span>Expires in {Math.max(0, Math.floor((new Date(challenge.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)))}h</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right glass-panel p-3 rounded-lg border border-white/10">
                            <div className="flex items-center gap-1 text-neon-magenta mb-1">
                              <Zap size={16} />
                              <span className="font-bold font-orbitron">{challenge.xpReward} XP</span>
                            </div>
                            <div className="flex items-center gap-1 text-prism-cyan text-sm">
                              <Star size={14} />
                              <span className="font-orbitron">${challenge.currencyReward}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">Progress</span>
                          <span className="stat-badge text-white">
                            {currentProgress} / {challenge.targetValue}
                          </span>
                        </div>
                        <div className="glass-panel rounded-full p-1">
                          <motion.div
                            className="h-3 rounded-full gradient-primary-bg relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 + 0.3 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                          </motion.div>
                        </div>
                        
                        {canClaim && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Button
                              onClick={() => claimReward.mutate(challenge.id)}
                              className="w-full mt-4 gradient-primary-bg neon-border-magenta hover-lift font-orbitron"
                            >
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="inline-block mr-2"
                              >
                                <Trophy size={16} />
                              </motion.div>
                              Claim Reward
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card neon-border-cyan mt-8">
            <CardHeader>
              <CardTitle className="text-white font-orbitron text-neon-magenta">Quick Actions</CardTitle>
              <CardDescription className="text-gray-300">Start completing challenges now!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/battle">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full gradient-primary-bg neon-border-magenta hover-lift font-orbitron">
                      <Trophy className="mr-2" size={16} />
                      Start Battle
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/training">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full gradient-primary-bg neon-border-cyan hover-lift font-orbitron">
                      <Award className="mr-2" size={16} />
                      Training
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/tournaments">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full gradient-primary-bg neon-border-magenta hover-lift font-orbitron">
                      <Target className="mr-2" size={16} />
                      Tournaments
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
