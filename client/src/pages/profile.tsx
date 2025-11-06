import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Sparkles, Trophy, Target, Flame, Award, Zap, Crown, Star, TrendingUp, TrendingDown } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { motion } from "framer-motion";

interface Profile {
  id: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  bio?: string;
  rapStyle?: string;
  totalBattles: number;
  totalWins: number;
  storeCredit?: string;
  characterCardUrl?: string;
  characterCardData?: {
    name: string;
    rapStyle: string;
    bio: string;
    attacks: Array<{
      name: string;
      power: number;
      description: string;
      type: string;
    }>;
    stats: {
      flow: number;
      wordplay: number;
      delivery: number;
      stage_presence: number;
    };
  };
  createdAt: string;
}

export default function ProfilePage() {
  const [, params] = useRoute("/profile/:userId");
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const [editForm, setEditForm] = useState({
    bio: "",
    rapStyle: "default",
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  // If no userId param, assume viewing own profile; otherwise check if param matches current user
  const isOwnProfile = !params?.userId || params?.userId === (currentUser as any)?.id;
  const userId = params?.userId || (currentUser as any)?.id;

  useEffect(() => {
    if (userId && !authLoading) {
      fetchProfile();
    }
  }, [userId, authLoading]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditForm({
          bio: data.bio || "",
          rapStyle: data.rapStyle || "default",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("bio", editForm.bio);
      formData.append("rapStyle", editForm.rapStyle);
      
      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setEditing(false);
        fetchProfile();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleGenerateCard = async () => {
    try {
      setGenerating(true);
      
      const formData = new FormData();
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("/api/generate-character-card", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const costMsg = result.cost > 0 
          ? `Card generated! Cost: $${result.cost.toFixed(2)}. New balance: $${result.newBalance.toFixed(2)}`
          : "First card generated for FREE!";
        
        toast({
          title: "Success",
          description: costMsg,
        });
        fetchProfile();
      } else {
        const error = await response.json();
        
        // Handle insufficient credits
        if (response.status === 402) {
          toast({
            title: "Insufficient Credits",
            description: error.message,
            variant: "destructive",
          });
        } else {
          throw new Error(error.message);
        }
      }
    } catch (error: any) {
      console.error("Error generating card:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate character card",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Profile not found</p>
      </div>
    );
  }

  const winRate = profile.totalBattles > 0 
    ? ((profile.totalWins / profile.totalBattles) * 100).toFixed(1) 
    : "0.0";

  // Mock achievements data (would come from API in production)
  const achievements = [
    { id: 1, name: "First Blood", description: "Win your first battle", icon: Trophy, unlocked: profile.totalWins > 0, rarity: "common" },
    { id: 2, name: "Battle Veteran", description: "Complete 10 battles", icon: Target, unlocked: profile.totalBattles >= 10, rarity: "rare" },
    { id: 3, name: "Hot Streak", description: "Win 3 battles in a row", icon: Flame, unlocked: false, rarity: "epic" },
    { id: 4, name: "Rap Legend", description: "Win 50 battles", icon: Crown, unlocked: profile.totalWins >= 50, rarity: "legendary" },
    { id: 5, name: "Wordsmith", description: "Score 90+ in wordplay", icon: Sparkles, unlocked: false, rarity: "rare" },
    { id: 6, name: "Flow Master", description: "Score 95+ in flow", icon: Zap, unlocked: false, rarity: "epic" },
  ];

  // Mock battle history (would come from API in production)
  const battleHistory = [
    { id: 1, opponent: "MC Razor", result: "win", score: 85, opponentScore: 72, date: "2 hours ago" },
    { id: 2, opponent: "MC Silk", result: "loss", score: 78, opponentScore: 82, date: "5 hours ago" },
    { id: 3, opponent: "MC Venom", result: "win", score: 92, opponentScore: 76, date: "1 day ago" },
    { id: 4, opponent: "MC Razor", result: "win", score: 88, opponentScore: 74, date: "2 days ago" },
  ];

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-500";
      case "rare": return "neon-border-cyan";
      case "epic": return "neon-border-magenta";
      case "legendary": return "border-2 border-transparent bg-gradient-to-r from-neon-magenta via-prism-cyan to-neon-magenta bg-clip-border";
      default: return "border-gray-500";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-primary-dark via-secondary-dark to-primary-dark">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header with Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-neon-magenta">
            {isOwnProfile ? "Your Profile" : `${profile.firstName}'s Profile`}
          </h1>
          {profile.totalWins >= 10 && (
            <div className="inline-block gradient-card-bg px-6 py-2 rounded-full">
              <span className="text-sm font-orbitron font-bold text-white flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Battle Veteran
              </span>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Identity Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="glass-card neon-border-magenta glow-pulse-magenta">
              <CardHeader>
                <CardTitle className="font-orbitron text-neon-magenta flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden neon-border-magenta bg-gray-900 glow-pulse-magenta">
                    {profile.profileImageUrl ? (
                      <img 
                        src={profile.profileImageUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <Camera className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  
                  {isOwnProfile && editing && (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                      className="max-w-xs bg-black/60 border-neon-magenta text-white"
                    />
                  )}
                </div>

                {/* Name */}
                <div className="text-center">
                  <h2 className="text-2xl font-orbitron font-bold text-white">
                    {profile.firstName} {profile.lastName}
                  </h2>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-sm text-gray-400 font-orbitron">Bio</label>
                  {editing ? (
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell us about your rap journey..."
                      className="mt-2 bg-black/60 border-prism-cyan text-white"
                      rows={4}
                    />
                  ) : (
                    <p className="mt-2 text-gray-300">
                      {profile.bio || "No bio yet"}
                    </p>
                  )}
                </div>

                {/* Rap Style */}
                <div>
                  <label className="text-sm text-gray-400 font-orbitron">Rap Style</label>
                  {editing ? (
                    <Select
                      value={editForm.rapStyle}
                      onValueChange={(value) => setEditForm({ ...editForm, rapStyle: value })}
                    >
                      <SelectTrigger className="mt-2 bg-black/60 border-prism-cyan text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Balanced</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                        <SelectItem value="smooth">Smooth</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-2">
                      <span className="stat-badge text-prism-cyan capitalize">
                        {profile.rapStyle || "Balanced"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isOwnProfile && (
                  <div className="flex gap-2 pt-4">
                    {editing ? (
                      <>
                        <Button onClick={handleSaveProfile} className="flex-1 bg-gradient-primary-bg hover:opacity-80">
                          Save Changes
                        </Button>
                        <Button 
                          onClick={() => setEditing(false)} 
                          variant="outline"
                          className="flex-1 border-prism-cyan text-prism-cyan"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setEditing(true)} className="w-full bg-gradient-primary-bg hover:opacity-80">
                        Edit Profile
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Store Credit Display */}
            {isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="glass-card glow-pulse-magenta mt-6">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <div className="text-sm text-gray-400 font-orbitron">Store Credit</div>
                      <div className="gradient-primary-bg rounded-2xl p-4">
                        <div className="text-4xl font-orbitron font-bold text-white">
                          ${parseFloat(profile.storeCredit || '0').toFixed(2)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Card generation: $0.50 (first free!)
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Stats Dashboard & Character Card Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glass-panel neon-border-cyan">
                <CardHeader>
                  <CardTitle className="font-orbitron text-prism-cyan flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Battle Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="text-center glass-panel p-4 rounded-lg hover-lift"
                    >
                      <div className="stat-badge text-prism-cyan mb-2">
                        <div className="text-3xl font-orbitron font-bold">{profile.totalBattles}</div>
                      </div>
                      <div className="text-sm text-gray-400 font-orbitron">Battles Played</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="text-center glass-panel p-4 rounded-lg hover-lift"
                    >
                      <div className="stat-badge text-neon-magenta mb-2">
                        <div className="text-3xl font-orbitron font-bold">{profile.totalWins}</div>
                      </div>
                      <div className="text-sm text-gray-400 font-orbitron">Victories</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      className="text-center glass-panel p-4 rounded-lg hover-lift"
                    >
                      <div className="stat-badge text-prism-cyan mb-2">
                        <div className="text-3xl font-orbitron font-bold">{winRate}%</div>
                      </div>
                      <div className="text-sm text-gray-400 font-orbitron">Win Rate</div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Character Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="glass-card neon-border-magenta">
                <CardHeader>
                  <CardTitle className="font-orbitron text-neon-magenta flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Character Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.characterCardData ? (
                    <div className="space-y-4">
                      {/* Card Image */}
                      <div className="relative aspect-[2/3] gradient-primary-bg rounded-lg p-1 overflow-hidden glow-pulse-magenta">
                        <div className="bg-black/80 rounded-lg h-full p-4 space-y-3">
                          {/* Header */}
                          <div className="text-center border-b border-neon-magenta pb-2">
                            <h3 className="text-xl font-orbitron font-bold text-neon-magenta">
                              {profile.characterCardData.name}
                            </h3>
                            <p className="text-xs text-prism-cyan capitalize font-orbitron">
                              {profile.characterCardData.rapStyle} Style
                            </p>
                          </div>

                          {/* Image */}
                          <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden neon-border-cyan">
                            {profile.profileImageUrl ? (
                              <img 
                                src={profile.profileImageUrl} 
                                alt={profile.characterCardData.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <Camera className="w-16 h-16" />
                              </div>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between stat-badge">
                              <span className="text-gray-400">Flow:</span>
                              <span className="text-prism-cyan font-bold font-orbitron">
                                {profile.characterCardData.stats.flow}
                              </span>
                            </div>
                            <div className="flex justify-between stat-badge">
                              <span className="text-gray-400">Wordplay:</span>
                              <span className="text-prism-cyan font-bold font-orbitron">
                                {profile.characterCardData.stats.wordplay}
                              </span>
                            </div>
                            <div className="flex justify-between stat-badge">
                              <span className="text-gray-400">Delivery:</span>
                              <span className="text-prism-cyan font-bold font-orbitron">
                                {profile.characterCardData.stats.delivery}
                              </span>
                            </div>
                            <div className="flex justify-between stat-badge">
                              <span className="text-gray-400">Presence:</span>
                              <span className="text-prism-cyan font-bold font-orbitron">
                                {profile.characterCardData.stats.stage_presence}
                              </span>
                            </div>
                          </div>

                          {/* Attacks */}
                          <div className="space-y-2">
                            <div className="text-xs font-bold text-neon-magenta border-b border-neon-magenta pb-1 font-orbitron">
                              Signature Moves
                            </div>
                            {profile.characterCardData.attacks.slice(0, 2).map((attack, idx) => (
                              <div key={idx} className="glass-panel rounded p-2 hover-lift">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-xs font-bold text-neon-magenta font-orbitron">
                                    {attack.name}
                                  </span>
                                  <span className="text-xs text-prism-cyan font-orbitron">
                                    {attack.power} DMG
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400">
                                  {attack.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Generate New Card Button */}
                      {isOwnProfile && (
                        <Button
                          onClick={handleGenerateCard}
                          disabled={generating}
                          className="w-full bg-gradient-primary-bg hover:opacity-80"
                        >
                          {generating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              {profile.characterCardUrl ? 'Regenerate Card ($0.50)' : 'Generate Card (FREE)'}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <p className="text-gray-400">No character card yet</p>
                      {isOwnProfile && (
                        <>
                          <p className="text-sm text-neon-magenta font-orbitron">
                            Your first card is FREE!
                          </p>
                          <Button
                            onClick={handleGenerateCard}
                            disabled={generating}
                            className="bg-gradient-primary-bg hover:opacity-80"
                          >
                            {generating ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Character Card
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Achievements Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card neon-border-cyan glow-pulse-cyan">
            <CardHeader>
              <CardTitle className="font-orbitron text-prism-cyan flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {achievements.map((achievement, idx) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + idx * 0.1 }}
                      className={`glass-panel rounded-lg p-4 text-center hover-lift ${getRarityBorder(achievement.rarity)} ${
                        achievement.unlocked ? 'glow-pulse-cyan' : 'opacity-50'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${
                        achievement.unlocked ? 'text-prism-cyan' : 'text-gray-600'
                      }`} />
                      <h4 className="text-xs font-orbitron font-bold text-white mb-1">
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {achievement.description}
                      </p>
                      {achievement.unlocked && (
                        <div className="mt-2">
                          <span className="text-xs text-prism-cyan font-orbitron">✓ Unlocked</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Career Stats Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass-panel neon-border-magenta">
            <CardHeader>
              <CardTitle className="font-orbitron text-neon-magenta flex items-center gap-2">
                <Target className="w-5 h-5" />
                Career Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel rounded-lg p-4 hover-lift">
                  <div className="text-sm text-gray-400 font-orbitron mb-2">Total Battles</div>
                  <div className="stat-badge text-prism-cyan">
                    <span className="text-2xl font-orbitron font-bold">{profile.totalBattles}</span>
                  </div>
                  <div className="mt-2 h-2 bg-black/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-primary-bg" 
                      style={{ width: `${Math.min((profile.totalBattles / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="glass-panel rounded-lg p-4 hover-lift">
                  <div className="text-sm text-gray-400 font-orbitron mb-2">Total Wins</div>
                  <div className="stat-badge text-neon-magenta">
                    <span className="text-2xl font-orbitron font-bold">{profile.totalWins}</span>
                  </div>
                  <div className="mt-2 h-2 bg-black/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-neon-magenta to-prism-cyan" 
                      style={{ width: `${Math.min((profile.totalWins / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="glass-panel rounded-lg p-4 hover-lift">
                  <div className="text-sm text-gray-400 font-orbitron mb-2">Win Rate</div>
                  <div className="stat-badge text-prism-cyan">
                    <span className="text-2xl font-orbitron font-bold">{winRate}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-black/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-primary-bg" 
                      style={{ width: `${parseFloat(winRate)}%` }}
                    />
                  </div>
                </div>

                <div className="glass-panel rounded-lg p-4 hover-lift">
                  <div className="text-sm text-gray-400 font-orbitron mb-2">Losses</div>
                  <div className="stat-badge text-gray-400">
                    <span className="text-2xl font-orbitron font-bold">{profile.totalBattles - profile.totalWins}</span>
                  </div>
                  <div className="mt-2 h-2 bg-black/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-600" 
                      style={{ width: `${Math.min(((profile.totalBattles - profile.totalWins) / profile.totalBattles) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Battle History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glass-card neon-border-cyan">
            <CardHeader>
              <CardTitle className="font-orbitron text-prism-cyan flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Recent Battles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {battleHistory.map((battle, idx) => (
                  <motion.div
                    key={battle.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + idx * 0.1 }}
                    className={`glass-panel rounded-lg p-4 ${
                      battle.result === 'win' ? 'neon-border-cyan' : 'neon-border-magenta'
                    } hover-lift flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-4">
                      {battle.result === 'win' ? (
                        <TrendingUp className="w-6 h-6 text-prism-cyan" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-neon-magenta" />
                      )}
                      <div>
                        <h4 className="font-orbitron font-bold text-white">
                          vs {battle.opponent}
                        </h4>
                        <p className="text-xs text-gray-400">{battle.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`stat-badge ${
                          battle.result === 'win' ? 'text-prism-cyan' : 'text-neon-magenta'
                        }`}>
                          <span className="font-orbitron font-bold">{battle.score}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">vs {battle.opponentScore}</p>
                      </div>
                      <Star className={`w-5 h-5 ${
                        battle.result === 'win' ? 'text-prism-cyan' : 'text-gray-600'
                      }`} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
