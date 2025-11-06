import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Trophy, Users, Calendar, Play, Crown, Zap, History, Target, BarChart3, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { SEO, generateWebPageStructuredData } from '@/components/SEO';
import type { Tournament } from '@shared/schema';
const tournamentImage = "/images/Tournament_championship_bracket_0fd32970.png";

interface CreateTournamentForm {
  name: string;
  type: 'single_elimination' | 'double_elimination';
  totalRounds: number;
  difficulty: string;
  profanityFilter: boolean;
  lyricComplexity: number;
  styleIntensity: number;
  prize: string;
}

const getPrizeValue = (prizeString: string | null): number => {
  if (!prizeString) return 0;
  const match = prizeString.match(/\$(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

const getPrizeBorderClass = (prize: string | null): string => {
  const value = getPrizeValue(prize);
  if (value >= 250) return 'neon-border-magenta neon-border-cyan';
  if (value >= 50) return 'neon-border-magenta';
  if (value >= 10) return 'neon-border-cyan';
  return '';
};

const getPrizeGlowClass = (prize: string | null): string => {
  const value = getPrizeValue(prize);
  if (value >= 250) return 'glow-pulse-magenta';
  return '';
};

const getStatusBorderClass = (status: string): string => {
  if (status === 'active') return 'neon-border-cyan glow-pulse-cyan';
  if (status === 'completed') return 'gradient-card-bg';
  return 'neon-border-magenta';
};

export default function Tournaments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<CreateTournamentForm>({
    name: '',
    type: 'single_elimination',
    totalRounds: 3,
    difficulty: 'normal',
    profanityFilter: false,
    lyricComplexity: 50,
    styleIntensity: 50,
    prize: 'Tournament Champion Title'
  });

  const structuredData = generateWebPageStructuredData(
    "Tournaments - Compete in Rap Battle Tournaments",
    "Create and compete in rap battle tournaments. Face multiple AI opponents in elimination-style competitions to prove your skills.",
    "https://rapbots.online/tournaments"
  );

  // Fetch user's tournaments
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ['/api/tournaments'],
  });

  // Fetch active tournaments (leaderboard)
  const { data: activeTournaments } = useQuery<Tournament[]>({
    queryKey: ['/api/tournaments/active'],
  });

  // Create tournament mutation
  const createTournament = useMutation({
    mutationFn: async (data: CreateTournamentForm) => {
      return apiRequest('POST', '/api/tournaments', data);
    },
    onSuccess: () => {
      toast({
        title: "Tournament Created!",
        description: "Your tournament has been created successfully.",
      });
      setShowCreateDialog(false);
      queryClient.invalidateQueries({ queryKey: ['/api/tournaments'] });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: "Failed to create tournament. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateTournament = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a tournament name.",
        variant: "destructive",
      });
      return;
    }
    createTournament.mutate(formData);
  };

  const getTournamentStatus = (tournament: Tournament) => {
    if (tournament.status === 'completed') return 'Completed';
    if (tournament.status === 'abandoned') return 'Abandoned';
    return `Round ${tournament.currentRound}/${tournament.totalRounds}`;
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'abandoned') return 'bg-red-500';
    return 'bg-blue-500';
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 relative">
      <SEO
        title="Tournaments - Compete in Rap Battle Tournaments | Battle Rap AI"
        description="Create and compete in rap battle tournaments. Face multiple AI opponents in elimination-style competitions to prove your skills and become the champion."
        keywords={['rap tournament', 'battle tournament', 'AI competition', 'rap bracket', 'elimination tournament', 'battle championship']}
        structuredData={structuredData}
      />
      {/* Tournament Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-12 z-0 pointer-events-none"
        style={{ backgroundImage: `url(${tournamentImage})` }}
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card neon-border-magenta p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-2 font-orbitron tracking-wider text-neon-magenta">
                TOURNAMENTS
              </h1>
              <p className="text-prism-cyan text-sm">Compete in elimination tournaments against multiple AI opponents</p>
              {tournaments && tournaments.length > 0 && (
                <div className="stat-badge mt-3 inline-block">
                  <Trophy className="inline-block mr-1" size={14} />
                  {tournaments.length} Active Tournament{tournaments.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="gradient-primary-bg hover:scale-105 transition-transform shadow-glow-magenta" data-testid="button-create-tournament">
                  <Trophy className="mr-2" size={20} />
                  Create Tournament
                </Button>
              </DialogTrigger>
            <DialogContent className="glass-card neon-border-cyan max-w-md">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader>
                  <DialogTitle className="text-neon-magenta font-orbitron">Create New Tournament</DialogTitle>
                  <DialogDescription className="text-prism-cyan">
                    Set up your tournament bracket and challenge multiple AI opponents
                  </DialogDescription>
                </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-white">Tournament Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Ultimate Rap Championship"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-tournament-name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-white">Tournament Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-tournament-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="single_elimination">Single Elimination</SelectItem>
                      <SelectItem value="double_elimination">Double Elimination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-white">Tournament Size</Label>
                  <Select value={formData.totalRounds.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, totalRounds: parseInt(value) }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-tournament-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="2">4 Opponents (2 Rounds)</SelectItem>
                      <SelectItem value="3">8 Opponents (3 Rounds)</SelectItem>
                      <SelectItem value="4">16 Opponents (4 Rounds)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-white">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lyric Complexity Slider */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Lyric Complexity</Label>
                    <span className="text-sm text-purple-400 font-medium">{formData.lyricComplexity}%</span>
                  </div>
                  <Slider
                    value={[formData.lyricComplexity]}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, lyricComplexity: value[0] }))}
                    max={100}
                    step={5}
                    className="w-full"
                    data-testid="slider-lyric-complexity"
                  />
                </div>

                {/* Style Intensity Slider */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Style Intensity</Label>
                    <span className="text-sm text-pink-400 font-medium">{formData.styleIntensity}%</span>
                  </div>
                  <Slider
                    value={[formData.styleIntensity]}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, styleIntensity: value[0] }))}
                    max={100}
                    step={5}
                    className="w-full"
                    data-testid="slider-style-intensity"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-white">Content Safety</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {formData.profanityFilter ? "Family" : "Battle"}
                    </span>
                    <Switch
                      checked={formData.profanityFilter}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, profanityFilter: checked }))}
                      data-testid="switch-content-safety"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="prize" className="text-white">Prize</Label>
                  <Input
                    id="prize"
                    value={formData.prize}
                    onChange={(e) => setFormData(prev => ({ ...prev, prize: e.target.value }))}
                    placeholder="Tournament Champion Title"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-prize"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="neon-border-cyan text-prism-cyan hover:bg-cyan-500/10">
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTournament}
                  disabled={createTournament.isPending}
                  className="gradient-primary-bg hover:scale-105 transition-transform"
                  data-testid="button-create-confirm"
                >
                  {createTournament.isPending ? "Creating..." : "Create Tournament"}
                </Button>
              </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: Target, label: 'Live Brackets', desc: 'Active tournaments', path: '/tournaments/brackets', testId: 'button-nav-brackets' },
            { icon: Crown, label: 'Leaderboard', desc: 'Top champions', path: '/tournaments/leaderboard', testId: 'button-nav-leaderboard' },
            { icon: History, label: 'History', desc: 'Your battles', path: '/tournaments/history', testId: 'button-nav-history' },
            { icon: BarChart3, label: 'Analytics', desc: 'Performance', path: '/tournaments', testId: 'button-nav-tournaments' }
          ].map((item, index) => (
            <motion.div
              key={item.testId}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                onClick={() => setLocation(item.path)}
                className="glass-panel neon-border-cyan hover-lift h-auto p-4 w-full"
                data-testid={item.testId}
              >
                <div className="flex flex-col items-center space-y-2">
                  <item.icon size={24} className="text-prism-cyan" />
                  <div className="text-center">
                    <div className="font-semibold text-white">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <Tabs defaultValue="my-tournaments" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger value="my-tournaments" className="data-[state=active]:bg-purple-600" data-testid="tab-my-tournaments">
              <Users className="mr-2" size={16} />
              My Tournaments
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600" data-testid="tab-leaderboard">
              <Crown className="mr-2" size={16} />
              Leaderboard
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-tournaments" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-panel neon-border-cyan rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : tournaments && tournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((tournament, index) => {
                  const prizeValue = getPrizeValue(tournament.prize);
                  const maxPlayers = Math.pow(2, tournament.totalRounds);
                  const currentPlayers = Math.floor(maxPlayers * (tournament.currentRound / tournament.totalRounds));
                  const playerProgress = (currentPlayers / maxPlayers) * 100;
                  const isNearCapacity = playerProgress > 75;
                  
                  return (
                    <motion.div
                      key={tournament.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <Card className={`glass-panel ${getStatusBorderClass(tournament.status)} ${getPrizeBorderClass(tournament.prize)} ${getPrizeGlowClass(tournament.prize)} hover-lift overflow-hidden`}>
                        <CardHeader className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-white text-lg font-orbitron">{tournament.name}</CardTitle>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                            >
                              <Badge className={`stat-badge ${
                                tournament.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                tournament.status === 'active' ? 'text-prism-cyan' : 
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {tournament.status === 'completed' && <Check className="mr-1" size={12} />}
                                {tournament.status === 'active' && <Clock className="mr-1" size={12} />}
                                {getTournamentStatus(tournament)}
                              </Badge>
                            </motion.div>
                          </div>
                          <CardDescription className="text-prism-cyan text-xs">
                            {tournament.type === 'single_elimination' ? '⚔️ Single Elimination' : '🏆 Double Elimination'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className={`${prizeValue >= 100 ? 'gradient-card-bg' : 'bg-gray-800/50'} p-3 rounded-lg`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-400">Prize Pool</span>
                                <Trophy className={prizeValue >= 100 ? 'text-neon-magenta' : 'text-yellow-400'} size={14} />
                              </div>
                              <div className={`stat-badge ${prizeValue >= 100 ? 'text-neon-magenta' : 'text-yellow-400'} text-lg font-bold`}>
                                {tournament.prize}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="stat-badge text-center">
                                <div className="text-xs text-gray-400">Difficulty</div>
                                <div className="text-sm font-semibold capitalize">{tournament.difficulty}</div>
                              </div>
                              <div className="stat-badge text-center">
                                <div className="text-xs text-gray-400">Players</div>
                                <div className="text-sm font-semibold">
                                  {currentPlayers}/{maxPlayers}
                                </div>
                              </div>
                            </div>

                            {tournament.status === 'active' && (
                              <div>
                                <div className="flex items-center justify-between mb-1 text-xs">
                                  <span className="text-gray-400">Tournament Progress</span>
                                  <span className={isNearCapacity ? 'text-neon-magenta' : 'text-prism-cyan'}>
                                    {Math.round(playerProgress)}%
                                  </span>
                                </div>
                                <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${playerProgress}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                                    className={`gradient-primary-bg h-full ${isNearCapacity ? 'glow-pulse-magenta' : ''}`}
                                  />
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center justify-between px-2 py-1 bg-gray-800/50 rounded">
                                <span className="text-gray-400">Complexity:</span>
                                <span className="text-prism-cyan font-semibold">{tournament.lyricComplexity}%</span>
                              </div>
                              <div className="flex items-center justify-between px-2 py-1 bg-gray-800/50 rounded">
                                <span className="text-gray-400">Intensity:</span>
                                <span className="text-neon-magenta font-semibold">{tournament.styleIntensity}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <motion.div 
                            className="mt-4"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link href={`/tournament/${tournament.id}`}>
                              <Button 
                                className="w-full gradient-primary-bg hover:shadow-glow-magenta transition-all"
                                data-testid={`button-view-tournament-${tournament.id}`}
                              >
                                {tournament.status === 'active' ? (
                                  <>
                                    <Play className="mr-2" size={16} />
                                    Continue Tournament
                                  </>
                                ) : tournament.status === 'completed' ? (
                                  <>
                                    <Trophy className="mr-2" size={16} />
                                    View Results
                                  </>
                                ) : (
                                  <>
                                    <Zap className="mr-2" size={16} />
                                    View Details
                                  </>
                                )}
                              </Button>
                            </Link>
                          </motion.div>
                        </CardContent>
                      </Card>
                      
                      {prizeValue >= 250 && (
                        <motion.div
                          className="absolute -inset-0.5 bg-gradient-to-r from-neon-magenta via-prism-cyan to-neon-magenta rounded-xl -z-10 opacity-75 blur-sm"
                          animate={{
                            opacity: [0.5, 0.75, 0.5],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="glass-panel neon-border-cyan text-center py-16">
                  <CardContent>
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    >
                      <Trophy className="mx-auto mb-6 text-prism-cyan" size={80} />
                    </motion.div>
                    <h3 className="text-2xl font-semibold font-orbitron text-neon-magenta mb-3">No Tournaments Yet</h3>
                    <p className="text-prism-cyan mb-6 max-w-md mx-auto">
                      Create your first tournament to compete against multiple AI opponents in an epic elimination bracket
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={() => setShowCreateDialog(true)}
                        className="gradient-primary-bg hover:shadow-glow-magenta transition-all px-8 py-6 text-lg"
                        data-testid="button-create-first-tournament"
                      >
                        <Trophy className="mr-2" size={20} />
                        Create Tournament
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="leaderboard" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-panel neon-border-magenta">
                <CardHeader>
                  <CardTitle className="text-neon-magenta font-orbitron flex items-center text-2xl">
                    <Crown className="mr-3 text-yellow-400" size={32} />
                    Tournament Champions
                  </CardTitle>
                  <CardDescription className="text-prism-cyan">
                    Top performers in tournament mode
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 360]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Zap className="mx-auto mb-6 text-yellow-400" size={64} />
                    </motion.div>
                    <h3 className="text-xl font-orbitron text-white mb-2">Leaderboard Coming Soon!</h3>
                    <p className="text-prism-cyan text-sm mt-3 max-w-md mx-auto">
                      Complete tournaments to earn your place among the champions and climb the global rankings
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                      {[
                        { rank: '1st', icon: Crown, color: 'text-yellow-400', glow: 'glow-pulse-magenta' },
                        { rank: '2nd', icon: Trophy, color: 'text-gray-300', glow: '' },
                        { rank: '3rd', icon: Target, color: 'text-orange-400', glow: '' }
                      ].map((item, i) => (
                        <motion.div
                          key={item.rank}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.2 }}
                          className={`stat-badge ${item.glow} p-4`}
                        >
                          <item.icon className={`mx-auto mb-2 ${item.color}`} size={32} />
                          <div className="text-xs text-gray-400">{item.rank} Place</div>
                          <div className="text-sm font-semibold">???</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}