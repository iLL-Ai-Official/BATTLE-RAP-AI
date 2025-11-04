import { storage } from '../storage';

export interface MatchmakingOptions {
  userId: string;
  difficulty?: 'easy' | 'normal' | 'hard' | 'nightmare';
  preferredCharacters?: string[];
}

export interface RandomMatch {
  opponentId: string;
  opponentName: string;
  opponentCharacterId: string;
  difficulty: string;
  lyricComplexity: number;
  styleIntensity: number;
}

export class MatchmakingService {
  private matchQueue: Map<string, { userId: string; timestamp: number; options: MatchmakingOptions }> = new Map();
  private readonly MATCH_TIMEOUT = 30000; // 30 seconds

  // AI opponents with varying skill levels
  private aiOpponents = [
    { id: 'razor', name: 'MC Razor', difficulty: 'easy', gender: 'female' },
    { id: 'venom', name: 'MC Venom', difficulty: 'normal', gender: 'male' },
    { id: 'silk', name: 'MC Silk', difficulty: 'normal', gender: 'male' },
    { id: 'cypher', name: 'CYPHER-9000', difficulty: 'hard', gender: 'robot' },
    { id: 'inferno', name: 'MC Inferno', difficulty: 'hard', gender: 'male' },
    { id: 'phoenix', name: 'Phoenix', difficulty: 'nightmare', gender: 'female' },
  ];

  async findRandomMatch(options: MatchmakingOptions): Promise<RandomMatch> {
    console.log(`🎮 Finding random match for user ${options.userId}...`);

    // Clean up old queue entries
    this.cleanupQueue();

    // Get user stats to match skill level
    const userStats = await storage.getUserStats(options.userId);
    const userSkillLevel = this.calculateSkillLevel(userStats);

    console.log(`📊 User skill level: ${userSkillLevel}`);

    // Select random opponent based on user skill and preferences
    const opponent = this.selectRandomOpponent(options, userSkillLevel);

    // Calculate match parameters
    const match: RandomMatch = {
      opponentId: opponent.id,
      opponentName: opponent.name,
      opponentCharacterId: opponent.id,
      difficulty: opponent.difficulty,
      lyricComplexity: this.calculateComplexity(opponent.difficulty),
      styleIntensity: this.calculateIntensity(opponent.difficulty),
    };

    console.log(`✅ Random match found: ${match.opponentName} (${match.difficulty})`);

    return match;
  }

  private cleanupQueue() {
    const now = Date.now();
    for (const [key, entry] of this.matchQueue.entries()) {
      if (now - entry.timestamp > this.MATCH_TIMEOUT) {
        this.matchQueue.delete(key);
      }
    }
  }

  private calculateSkillLevel(stats: any): number {
    // Calculate skill level from 1-10 based on stats
    const winRate = stats.totalBattles > 0 ? stats.totalWins / stats.totalBattles : 0;
    const avgScore = stats.averageScore || 50;
    
    // Combine win rate and average score
    const skillLevel = Math.min(10, Math.max(1, 
      Math.floor((winRate * 5) + (avgScore / 20))
    ));

    return skillLevel;
  }

  private selectRandomOpponent(options: MatchmakingOptions, userSkillLevel: number): typeof this.aiOpponents[0] {
    // Filter opponents by preferred characters if specified
    let availableOpponents = this.aiOpponents;
    
    if (options.preferredCharacters && options.preferredCharacters.length > 0) {
      availableOpponents = this.aiOpponents.filter(opp => 
        options.preferredCharacters!.includes(opp.id)
      );
    }

    // If user has a difficulty preference, filter by that
    if (options.difficulty) {
      availableOpponents = availableOpponents.filter(opp => 
        opp.difficulty === options.difficulty
      );
    }

    // If no opponents match filters, use all opponents
    if (availableOpponents.length === 0) {
      availableOpponents = this.aiOpponents;
    }

    // Skill-based matchmaking: prefer opponents close to user skill level
    const skillWeightedOpponents = availableOpponents.map(opp => {
      const oppSkill = this.getDifficultySkillLevel(opp.difficulty);
      const skillDiff = Math.abs(oppSkill - userSkillLevel);
      const weight = Math.max(0.1, 1 - (skillDiff / 10)); // Higher weight for closer skill
      return { opponent: opp, weight };
    });

    // Weighted random selection
    const totalWeight = skillWeightedOpponents.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of skillWeightedOpponents) {
      random -= item.weight;
      if (random <= 0) {
        return item.opponent;
      }
    }

    // Fallback to last opponent
    return skillWeightedOpponents[skillWeightedOpponents.length - 1].opponent;
  }

  private getDifficultySkillLevel(difficulty: string): number {
    const difficultyMap: Record<string, number> = {
      'easy': 2,
      'normal': 5,
      'hard': 7,
      'nightmare': 10,
    };
    return difficultyMap[difficulty] || 5;
  }

  private calculateComplexity(difficulty: string): number {
    const complexityMap: Record<string, number> = {
      'easy': 30,
      'normal': 50,
      'hard': 70,
      'nightmare': 90,
    };
    return complexityMap[difficulty] || 50;
  }

  private calculateIntensity(difficulty: string): number {
    const intensityMap: Record<string, number> = {
      'easy': 30,
      'normal': 50,
      'hard': 75,
      'nightmare': 95,
    };
    return intensityMap[difficulty] || 50;
  }

  // Queue a user for matchmaking (for future PvP features)
  async queueForMatch(options: MatchmakingOptions): Promise<void> {
    console.log(`📥 Adding user ${options.userId} to matchmaking queue...`);
    
    this.matchQueue.set(options.userId, {
      userId: options.userId,
      timestamp: Date.now(),
      options,
    });

    console.log(`✅ User queued. Queue size: ${this.matchQueue.size}`);
  }

  // Check if a match is available - REAL PVP SUPPORT
  async checkForMatch(userId: string): Promise<RandomMatch | null> {
    const userEntry = this.matchQueue.get(userId);
    if (!userEntry) {
      return null;
    }

    // Look for another real player in queue
    for (const [otherId, otherEntry] of this.matchQueue.entries()) {
      if (otherId !== userId) {
        // Found a real player match!
        console.log(`🎮 PVP MATCH FOUND: ${userId} vs ${otherId}`);
        
        // Remove both players from queue
        this.matchQueue.delete(userId);
        this.matchQueue.delete(otherId);
        
        // Get opponent's user data
        const opponentUser = await storage.getUser(otherId);
        if (!opponentUser) {
          console.error('Opponent user not found, falling back to AI');
          return this.findRandomMatch(userEntry.options);
        }
        
        // Calculate opponent's skill level for match difficulty
        const opponentStats = await storage.getUserStats(otherId);
        const opponentSkillLevel = this.calculateSkillLevel(opponentStats);
        
        // Return real player as opponent
        const match: RandomMatch = {
          opponentId: otherId,
          opponentName: opponentUser.firstName || 'Anonymous Player',
          opponentCharacterId: 'pvp_player', // Special ID for real players
          difficulty: this.skillLevelToDifficulty(opponentSkillLevel),
          lyricComplexity: Math.min(90, 50 + (opponentSkillLevel * 4)),
          styleIntensity: Math.min(95, 50 + (opponentSkillLevel * 4.5)),
        };
        
        console.log(`✅ Real PVP match created: ${match.opponentName} (skill ${opponentSkillLevel})`);
        return match;
      }
    }

    return null;
  }
  
  // Convert skill level (1-10) to difficulty label
  private skillLevelToDifficulty(skillLevel: number): string {
    if (skillLevel <= 3) return 'easy';
    if (skillLevel <= 6) return 'normal';
    if (skillLevel <= 8) return 'hard';
    return 'nightmare';
  }

  // Cancel matchmaking
  cancelMatchmaking(userId: string): void {
    this.matchQueue.delete(userId);
    console.log(`❌ User ${userId} cancelled matchmaking`);
  }
}

export const matchmakingService = new MatchmakingService();
