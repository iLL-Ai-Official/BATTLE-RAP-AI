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
      case 'xp': return <Zap className="text-purple-400" size={20} />;
      case 'cosmetic': return <Award className="text-pink-400" size={20} />;
      case 'battle_pack': return <Trophy className="text-blue-400" size={20} />;
      default: return <Gift className="text-green-400" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-4">
      <Navigation />
      
      <div className="max-w-7xl mx-auto pt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Battle Pass
            </h1>
            <p className="text-gray-400">Season 1: Rise of the Rappers</p>
          </div>
          
          {!isPremium && (
            <Button 
              onClick={() => upgradeToPremium.mutate()}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg px-8 py-6"
            >
              <Crown className="mr-2" size={24} />
              Upgrade to Premium - $9.99
            </Button>
          )}
        </div>

        {/* Progress Overview */}
        <Card className="bg-gray-900/80 border-purple-500/30 mb-8 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <TrendingUp className="text-purple-400" />
                  Tier {currentTier} / {tiers.length}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {totalXP.toLocaleString()} Total XP Earned
                </CardDescription>
              </div>
              {isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
                  <Crown className="mr-1" size={16} />
                  PREMIUM
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Progress to Tier {currentTier + 1}</span>
                <span>{Math.round(getCurrentTierProgress())}%</span>
              </div>
              <Progress value={getCurrentTierProgress()} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedTab} onValueChange={(v: any) => setSelectedTab(v)} className="space-y-6">
          <TabsList className="bg-gray-900 border border-purple-500/30">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rewards">All Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Current and Next Few Tiers */}
            {tiers.slice(Math.max(0, currentTier - 1), currentTier + 4).map((tier) => (
              <Card 
                key={tier.id} 
                className={`bg-gray-900/80 border-2 backdrop-blur transition-all ${
                  tier.tier === currentTier 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/50' 
                    : tier.tier < currentTier 
                      ? 'border-green-500/30'
                      : 'border-gray-700/50'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${
                          tier.tier === currentTier ? 'text-purple-400' :
                          tier.tier < currentTier ? 'text-green-400' : 'text-gray-500'
                        }`}>
                          {tier.tier}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {tier.xpRequired.toLocaleString()} XP
                        </div>
                      </div>

                      <div className="h-16 w-px bg-gray-700" />

                      {/* Free Reward */}
                      <div className="flex-1">
                        <div className="text-xs text-gray-400 mb-2">FREE REWARD</div>
                        <div className="flex items-center gap-3">
                          {getRewardIcon(tier.freeReward.type)}
                          <div>
                            <div className="font-semibold text-white">
                              {tier.freeReward.item || `${tier.freeReward.value} ${tier.freeReward.type}`}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-16 w-px bg-gradient-to-b from-yellow-500 to-orange-500" />

                      {/* Premium Reward */}
                      <div className="flex-1">
                        <div className="text-xs text-yellow-400 mb-2 flex items-center gap-1">
                          <Crown size={12} />
                          PREMIUM REWARD
                        </div>
                        <div className="flex items-center gap-3">
                          {isPremium ? (
                            <>
                              {getRewardIcon(tier.premiumReward.type)}
                              <div>
                                <div className="font-semibold text-white">
                                  {tier.premiumReward.item || `${tier.premiumReward.value} ${tier.premiumReward.type}`}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <Lock className="text-gray-600" size={20} />
                              <div className="text-gray-600">
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
                        <div className="bg-green-900/50 border border-green-500 rounded-lg px-4 py-2">
                          <Check className="text-green-400" size={24} />
                        </div>
                      ) : canClaimReward(tier.tier) ? (
                        <Button
                          onClick={() => claimReward.mutate(tier.tier)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Gift className="mr-2" size={16} />
                          Claim
                        </Button>
                      ) : tier.tier > currentTier ? (
                        <div className="text-gray-600 text-sm">
                          <Lock size={16} className="inline mr-1" />
                          Locked
                        </div>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tiers.map((tier) => (
                <Card 
                  key={tier.id}
                  className={`bg-gray-900/80 border backdrop-blur ${
                    tier.tier <= currentTier ? 'border-purple-500/50' : 'border-gray-700/50'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">Tier {tier.tier}</CardTitle>
                      {claimedTiers.includes(tier.tier) && (
                        <Check className="text-green-400" size={20} />
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      {tier.xpRequired.toLocaleString()} XP Required
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-gray-800/50 rounded p-3">
                      <div className="text-xs text-gray-400 mb-1">Free</div>
                      <div className="flex items-center gap-2">
                        {getRewardIcon(tier.freeReward.type)}
                        <span className="text-sm text-white">
                          {tier.freeReward.item || `${tier.freeReward.value} ${tier.freeReward.type}`}
                        </span>
                      </div>
                    </div>
                    <div className={`rounded p-3 ${
                      isPremium ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30' : 'bg-gray-800/30'
                    }`}>
                      <div className="text-xs text-yellow-400 mb-1 flex items-center gap-1">
                        <Crown size={10} />
                        Premium
                      </div>
                      <div className="flex items-center gap-2">
                        {isPremium ? (
                          <>
                            {getRewardIcon(tier.premiumReward.type)}
                            <span className="text-sm text-white">
                              {tier.premiumReward.item || `${tier.premiumReward.value} ${tier.premiumReward.type}`}
                            </span>
                          </>
                        ) : (
                          <>
                            <Lock className="text-gray-600" size={16} />
                            <span className="text-sm text-gray-600">Locked</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* How to Earn XP */}
        <Card className="bg-gray-900/80 border-blue-500/30 mt-8 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Zap className="text-blue-400" />
              How to Earn XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded p-4">
                <Trophy className="text-purple-400 mb-2" size={24} />
                <div className="font-semibold text-white mb-1">Win Battles</div>
                <div className="text-gray-400 text-sm">Earn 500 XP per victory</div>
              </div>
              <div className="bg-gray-800/50 rounded p-4">
                <Star className="text-yellow-400 mb-2" size={24} />
                <div className="font-semibold text-white mb-1">Complete Challenges</div>
                <div className="text-gray-400 text-sm">Earn 200-500 XP per challenge</div>
              </div>
              <div className="bg-gray-800/50 rounded p-4">
                <Award className="text-pink-400 mb-2" size={24} />
                <div className="font-semibold text-white mb-1">Training Lessons</div>
                <div className="text-gray-400 text-sm">Earn 100 XP per lesson</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
