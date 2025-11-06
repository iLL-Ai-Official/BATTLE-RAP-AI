import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Crown, Star, Gift, Lock, Check, Zap, Trophy, Award, ChevronRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Navigation } from '@/components/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface BattlePassTier {
  id: string;
  tier: number;
  xpRequired: number;
  freeReward: {
    type: string;
    value: number;
    item?: string;
  };
  premiumReward: {
    type: string;
    value: number;
    item?: string;
  };
}

interface UserBattlePass {
  id: string;
  userId: string;
  currentTier: number;
  totalXP: number;
  isPremium: boolean;
  seasonId: string;
  claimedTiers: number[];
}

export default function BattlePassPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rewards'>('overview');

  // Fetch current battle pass
  const { data: battlePass } = useQuery<UserBattlePass>({
    queryKey: ['/api/battle-pass'],
  });

  // Fetch all tiers
  const { data: tiers = [] } = useQuery<BattlePassTier[]>({
    queryKey: ['/api/battle-pass/tiers'],
  });

  // Claim tier reward
  const claimReward = useMutation({
    mutationFn: async (tierId: number) => {
      return apiRequest('POST', `/api/battle-pass/claim/${tierId}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Reward Claimed!",
        description: "Your reward has been added to your account.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/battle-pass'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });

  // Upgrade to premium
  const upgradeToPremium = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/battle-pass/upgrade', {});
    },
    onSuccess: () => {
      toast({
        title: "Premium Unlocked!",
        description: "You now have access to all premium rewards!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/battle-pass'] });
    },
  });

  const currentTier = battlePass?.currentTier || 0;
  const totalXP = battlePass?.totalXP || 0;
  const isPremium = battlePass?.isPremium || false;
  const claimedTiers = battlePass?.claimedTiers || [];

  const getCurrentTierProgress = () => {
    const currentTierData = tiers.find(t => t.tier === currentTier);
    const nextTierData = tiers.find(t => t.tier === currentTier + 1);
    
    if (!currentTierData || !nextTierData) return 0;
    
    const tierXP = totalXP - currentTierData.xpRequired;
    const xpNeeded = nextTierData.xpRequired - currentTierData.xpRequired;
    
    return Math.min(100, (tierXP / xpNeeded) * 100);
  };

  const canClaimReward = (tier: number) => {
    return currentTier >= tier && !claimedTiers.includes(tier);
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'currency': return <Star className="text-yellow-400" size={20} />;
      case 'xp': return <Zap className="text-prism-cyan" size={20} />;
      case 'cosmetic': return <Award className="text-neon-magenta" size={20} />;
      case 'battle_pack': return <Trophy className="text-prism-cyan" size={20} />;
      default: return <Gift className="text-green-400" size={20} />;
    }
  };

  const getRewardRarity = (tier: number): string => {
    if (tier >= 45) return 'legendary';
    if (tier >= 30) return 'epic';
    if (tier >= 15) return 'rare';
    return 'common';
  };

  const getRarityBorderClass = (rarity: string): string => {
    switch (rarity) {
      case 'legendary': return 'border-2 border-yellow-400 shadow-lg shadow-yellow-400/50';
      case 'epic': return 'neon-border-magenta';
      case 'rare': return 'neon-border-cyan';
      default: return 'border border-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-4">
      <Navigation />
      
      <div className="max-w-7xl mx-auto pt-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card neon-border-magenta glow-pulse-magenta p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-2 font-orbitron text-neon-magenta">
                BATTLE PASS
              </h1>
              <p className="text-prism-cyan font-code">Season 1: Rise of the Rappers</p>
            </div>
            
            {!isPremium ? (
              <Button 
                onClick={() => upgradeToPremium.mutate()}
                className="gradient-primary-bg hover:scale-105 transition-transform text-white font-bold text-lg px-8 py-6 shadow-lg shadow-neon-magenta/50"
              >
                <Crown className="mr-2" size={24} />
                Upgrade to Premium - $9.99
              </Button>
            ) : (
              <Badge className="gradient-primary-bg text-white font-bold text-lg px-6 py-3">
                <Crown className="mr-2" size={20} />
                PREMIUM ACTIVE
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-panel neon-border-cyan mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-white flex items-center gap-2 font-orbitron">
                    <TrendingUp className="text-prism-cyan" />
                    Tier {currentTier} / {tiers.length}
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-code mt-2">
                    <span className="stat-badge">
                      {totalXP.toLocaleString()} XP Earned
                    </span>
                  </CardDescription>
                </div>
                {isPremium && (
                  <Badge className="gradient-primary-bg text-white font-bold text-lg px-4 py-2">
                    <Crown className="mr-1" size={16} />
                    PREMIUM
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-prism-cyan font-code">
                  <span>Progress to Tier {currentTier + 1}</span>
                  <span className="stat-badge">{Math.round(getCurrentTierProgress())}%</span>
                </div>
                <div className="glass-panel rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getCurrentTierProgress()}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="gradient-primary-bg h-full glow-pulse-magenta"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs value={selectedTab} onValueChange={(v: any) => setSelectedTab(v)} className="space-y-6">
          <TabsList className="glass-panel">
            <TabsTrigger value="overview" className="font-orbitron">Overview</TabsTrigger>
            <TabsTrigger value="rewards" className="font-orbitron">All Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Current and Next Few Tiers */}
            <AnimatePresence mode="wait">
              {tiers.slice(Math.max(0, currentTier - 1), currentTier + 4).map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card 
                    className={`glass-panel transition-all ${
                      tier.tier === currentTier 
                        ? 'glow-pulse-magenta scale-105' 
                        : tier.tier < currentTier 
                          ? 'neon-border-cyan'
                          : 'border border-gray-700/50'
                    } ${canClaimReward(tier.tier) ? 'hover-lift' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 flex-1">
                          <div className="text-center">
                            <div className={`text-4xl font-bold font-orbitron ${
                              tier.tier === currentTier ? 'text-neon-magenta' :
                              tier.tier < currentTier ? 'text-prism-cyan' : 'text-gray-500'
                            }`}>
                              {tier.tier}
                            </div>
                            <div className="stat-badge mt-2">
                              {tier.xpRequired.toLocaleString()} XP
                            </div>
                          </div>

                          <div className="h-16 w-px bg-gradient-to-b from-prism-cyan to-neon-magenta" />

                          {/* Free Reward */}
                          <div className="flex-1">
                            <div className="text-xs text-gray-400 mb-2 font-code">FREE REWARD</div>
                            <div className="flex items-center gap-3">
                              {getRewardIcon(tier.freeReward.type)}
                              <div>
                                <div className="font-semibold text-white font-code">
                                  {tier.freeReward.item || `${tier.freeReward.value} ${tier.freeReward.type}`}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="h-16 w-px gradient-primary-bg" />

                          {/* Premium Reward */}
                          <div className="flex-1">
                            <div className={`text-xs mb-2 flex items-center gap-1 font-code ${
                              isPremium ? 'text-neon-magenta' : 'text-gray-500'
                            }`}>
                              <Crown size={12} />
                              PREMIUM REWARD
                            </div>
                            <div className="flex items-center gap-3">
                              {isPremium ? (
                                <>
                                  {getRewardIcon(tier.premiumReward.type)}
                                  <div>
                                    <div className="font-semibold text-white font-code">
                                      {tier.premiumReward.item || `${tier.premiumReward.value} ${tier.premiumReward.type}`}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <Lock className="text-gray-600" size={20} />
                                  <div className="text-gray-600 font-code">
                                    Premium Required
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Claim Button */}
                        <div className="ml-4">
                          {claimedTiers.includes(tier.tier) ? (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="glass-panel neon-border-cyan rounded-lg px-4 py-2"
                            >
                              <Check className="text-prism-cyan" size={24} />
                            </motion.div>
                          ) : canClaimReward(tier.tier) ? (
                            <motion.div
                              animate={{ 
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                  '0 0 20px hsla(330, 100%, 50%, 0.3)',
                                  '0 0 40px hsla(330, 100%, 50%, 0.6)',
                                  '0 0 20px hsla(330, 100%, 50%, 0.3)'
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Button
                                onClick={() => claimReward.mutate(tier.tier)}
                                className="gradient-primary-bg hover:scale-110 transition-transform text-white font-bold"
                              >
                                <Gift className="mr-2" size={16} />
                                Claim
                              </Button>
                            </motion.div>
                          ) : tier.tier > currentTier ? (
                            <div className="text-gray-600 text-sm font-code">
                              <Lock size={16} className="inline mr-1" />
                              Locked
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tiers.map((tier, index) => {
                const rarity = getRewardRarity(tier.tier);
                const borderClass = getRarityBorderClass(rarity);
                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card 
                      className={`glass-panel ${borderClass} ${
                        tier.tier <= currentTier ? 'hover-lift' : ''
                      } transition-all`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-white font-orbitron">
                            Tier {tier.tier}
                          </CardTitle>
                          {claimedTiers.includes(tier.tier) && (
                            <motion.div
                              initial={{ rotate: 0 }}
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <Check className="text-prism-cyan" size={20} />
                            </motion.div>
                          )}
                        </div>
                        <CardDescription className="text-xs font-code">
                          <span className="stat-badge">
                            {tier.xpRequired.toLocaleString()} XP
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="glass-panel rounded p-3">
                          <div className="text-xs text-gray-400 mb-1 font-code">Free</div>
                          <div className="flex items-center gap-2">
                            {getRewardIcon(tier.freeReward.type)}
                            <span className="text-sm text-white font-code">
                              {tier.freeReward.item || (
                                <span className="stat-badge">
                                  {tier.freeReward.value} {tier.freeReward.type}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className={`rounded p-3 ${
                          isPremium ? 'gradient-card-bg glow-pulse-magenta' : 'glass-panel'
                        }`}>
                          <div className={`text-xs mb-1 flex items-center gap-1 font-code ${
                            isPremium ? 'text-neon-magenta' : 'text-gray-500'
                          }`}>
                            <Crown size={10} />
                            Premium
                          </div>
                          <div className="flex items-center gap-2">
                            {isPremium ? (
                              <>
                                {getRewardIcon(tier.premiumReward.type)}
                                <span className="text-sm text-white font-code">
                                  {tier.premiumReward.item || (
                                    <span className="stat-badge">
                                      {tier.premiumReward.value} {tier.premiumReward.type}
                                    </span>
                                  )}
                                </span>
                              </>
                            ) : (
                              <>
                                <Lock className="text-gray-600" size={16} />
                                <span className="text-sm text-gray-600 font-code">Locked</span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* How to Earn XP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="glass-panel neon-border-cyan mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2 font-orbitron">
                <Zap className="text-prism-cyan" />
                How to Earn XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="glass-card hover-lift p-4"
                >
                  <Trophy className="text-neon-magenta mb-2" size={24} />
                  <div className="font-semibold text-white mb-1 font-orbitron">Win Battles</div>
                  <div className="stat-badge">500 XP per victory</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="glass-card hover-lift p-4"
                >
                  <Star className="text-yellow-400 mb-2" size={24} />
                  <div className="font-semibold text-white mb-1 font-orbitron">Complete Challenges</div>
                  <div className="stat-badge">200-500 XP each</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="glass-card hover-lift p-4"
                >
                  <Award className="text-prism-cyan mb-2" size={24} />
                  <div className="font-semibold text-white mb-1 font-orbitron">Training Lessons</div>
                  <div className="stat-badge">100 XP per lesson</div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
