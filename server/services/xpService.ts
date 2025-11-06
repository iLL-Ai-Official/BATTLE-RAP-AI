import { storage } from "../storage";

const BASE_XP = 100;
const MULTIPLIER = 1.4;

export interface BattleResult {
  won: boolean;
  score: number;
  opponentScore: number;
  roundsPlayed: number;
  difficulty?: string;
}

export interface LevelUpResult {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  rewards: {
    currency?: number;
    title?: string;
  };
}

export class XPService {
  /**
   * Calculate the current level based on total XP using exponential curve (1.4x multiplier)
   * Formula: Total XP for Level N = 100 × (1.4^(N-1) - 1) / 0.4
   */
  calculateLevelForXP(totalXP: number): number {
    if (totalXP <= 0) return 1;

    let level = 1;
    let xpRequired = 0;

    while (xpRequired <= totalXP) {
      level++;
      xpRequired = this.getTotalXPForLevel(level);
    }

    return level - 1;
  }

  /**
   * Get total XP required to reach a specific level
   */
  getTotalXPForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.floor(BASE_XP * (Math.pow(MULTIPLIER, level - 1) - 1) / (MULTIPLIER - 1));
  }

  /**
   * Get XP required to progress from current level to next level
   */
  getXPRequiredForLevel(level: number): number {
    if (level <= 1) return BASE_XP;
    const currentTotal = this.getTotalXPForLevel(level);
    const nextTotal = this.getTotalXPForLevel(level + 1);
    return nextTotal - currentTotal;
  }

  /**
   * Award XP for battle completion (100-500 XP based on performance)
   */
  async awardBattleXP(userId: string, battleResult: BattleResult): Promise<LevelUpResult> {
    let xpAmount = 100; // Base XP for participation

    if (battleResult.won) {
      xpAmount = 300; // Winner gets 300 XP base

      // Bonus XP for performance
      const scoreDiff = battleResult.score - battleResult.opponentScore;
      if (scoreDiff > 500) {
        xpAmount += 100; // Dominant victory
      } else if (scoreDiff > 200) {
        xpAmount += 50; // Clear victory
      }

      // Difficulty bonus
      const difficultyBonus: Record<string, number> = {
        easy: 0,
        normal: 0,
        hard: 50,
        nightmare: 100,
        god: 200,
      };
      xpAmount += difficultyBonus[battleResult.difficulty || 'normal'] || 0;
    }

    // Cap at 500 XP per battle
    xpAmount = Math.min(500, xpAmount);

    console.log(`🎯 Awarding ${xpAmount} XP to user ${userId} for battle (won: ${battleResult.won})`);

    return await this.addXP(userId, xpAmount, 'battle');
  }

  /**
   * Award XP for tournament placement (1000-5000 XP)
   */
  async awardTournamentXP(userId: string, placement: number): Promise<LevelUpResult> {
    const placementRewards: Record<number, number> = {
      1: 5000, // 1st place
      2: 3000, // 2nd place
      3: 2000, // 3rd place
      4: 1500,
      5: 1000,
      6: 1000,
      7: 1000,
      8: 1000,
    };

    const xpAmount = placementRewards[placement] || 1000;

    console.log(`🏆 Awarding ${xpAmount} XP to user ${userId} for tournament placement ${placement}`);

    return await this.addXP(userId, xpAmount, 'tournament');
  }

  /**
   * Award XP for completing daily challenge (200 XP)
   */
  async awardChallengeXP(userId: string, challengeType: string): Promise<LevelUpResult> {
    const xpAmount = 200;

    console.log(`✅ Awarding ${xpAmount} XP to user ${userId} for completing challenge: ${challengeType}`);

    return await this.addXP(userId, xpAmount, 'challenge');
  }

  /**
   * Award XP for daily login (50 XP)
   */
  async awardLoginXP(userId: string): Promise<LevelUpResult> {
    const xpAmount = 50;

    console.log(`📅 Awarding ${xpAmount} XP to user ${userId} for daily login`);

    return await this.addXP(userId, xpAmount, 'daily_login');
  }

  /**
   * Award custom amount of XP (for lessons, admin awards, etc.)
   */
  async awardXP(userId: string, xpAmount: number, source: string): Promise<LevelUpResult> {
    console.log(`⭐ Awarding ${xpAmount} XP to user ${userId} from ${source}`);

    return await this.addXP(userId, xpAmount, source);
  }

  /**
   * Add XP to user and check for level up
   */
  private async addXP(userId: string, xpAmount: number, source: string): Promise<LevelUpResult> {
    // Ensure user progress exists
    let progress = await storage.getUserProgress(userId);
    if (!progress) {
      progress = await storage.initializeUserProgress(userId);
    }

    const oldLevel = progress.level;
    const newTotalXP = progress.totalXP + xpAmount;
    const newLevel = this.calculateLevelForXP(newTotalXP);

    // Update user progress
    await storage.updateUserProgress(userId, newTotalXP, newLevel);

    // Check for level up
    if (newLevel > oldLevel) {
      console.log(`🎉 User ${userId} leveled up! ${oldLevel} → ${newLevel}`);
      const rewards = await this.distributeRewards(userId, newLevel);
      
      return {
        leveledUp: true,
        oldLevel,
        newLevel,
        rewards,
      };
    }

    return {
      leveledUp: false,
      oldLevel,
      newLevel: oldLevel,
      rewards: {},
    };
  }

  /**
   * Check if user has leveled up (used after XP award)
   */
  async checkLevelUp(userId: string): Promise<LevelUpResult> {
    const progress = await storage.getUserProgress(userId);
    if (!progress) {
      return {
        leveledUp: false,
        oldLevel: 1,
        newLevel: 1,
        rewards: {},
      };
    }

    const calculatedLevel = this.calculateLevelForXP(progress.totalXP);
    
    if (calculatedLevel > progress.level) {
      const rewards = await this.distributeRewards(userId, calculatedLevel);
      await storage.updateUserProgress(userId, progress.totalXP, calculatedLevel);
      
      return {
        leveledUp: true,
        oldLevel: progress.level,
        newLevel: calculatedLevel,
        rewards,
      };
    }

    return {
      leveledUp: false,
      oldLevel: progress.level,
      newLevel: progress.level,
      rewards: {},
    };
  }

  /**
   * Distribute rewards for milestone levels (5, 10, 20, 50, 100)
   */
  async distributeRewards(userId: string, newLevel: number): Promise<{ currency?: number; title?: string }> {
    const milestoneRewards: Record<number, { currency: number; title: string }> = {
      5: { currency: 100, title: "" },
      10: { currency: 200, title: "Rising Star" },
      20: { currency: 500, title: "Battle Warrior" },
      50: { currency: 1000, title: "Rap Legend" },
      100: { currency: 5000, title: "Rap God" },
    };

    const reward = milestoneRewards[newLevel];
    
    if (reward) {
      console.log(`🎁 Distributing milestone rewards for level ${newLevel}:`, reward);

      // Award currency
      if (reward.currency > 0) {
        await storage.addCurrencyTransaction(
          userId,
          reward.currency,
          'earned',
          `Level ${newLevel} milestone reward`
        );
      }

      // Award title
      if (reward.title) {
        await storage.updateUserProgress(userId, undefined, undefined, reward.title);
      }

      return reward;
    }

    return {};
  }

  /**
   * Get user's current progression info
   */
  async getUserProgressInfo(userId: string) {
    let progress = await storage.getUserProgress(userId);
    if (!progress) {
      progress = await storage.initializeUserProgress(userId);
    }

    const currentLevel = progress.level;
    const totalXP = progress.totalXP;
    const xpForCurrentLevel = this.getTotalXPForLevel(currentLevel);
    const xpForNextLevel = this.getTotalXPForLevel(currentLevel + 1);
    const currentLevelXP = totalXP - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
    const progressPercent = (currentLevelXP / xpNeededForNextLevel) * 100;

    return {
      level: currentLevel,
      totalXP,
      currentLevelXP,
      xpNeededForNextLevel,
      progressPercent: Math.min(100, Math.max(0, progressPercent)),
      title: progress.title,
      winStreak: progress.winStreak,
      bestWinStreak: progress.bestWinStreak,
      totalBattlesPlayed: progress.totalBattlesPlayed,
      totalBattlesWon: progress.totalBattlesWon,
    };
  }

  /**
   * Get top users for leaderboard
   */
  async getLeaderboard(limit: number = 10) {
    return await storage.getTopUsersByLevel(limit);
  }
}

export const xpService = new XPService();
