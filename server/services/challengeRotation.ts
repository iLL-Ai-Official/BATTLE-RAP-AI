import { storage } from '../storage';
import * as cron from 'node-cron';

class ChallengeRotationService {
  private isRunning = false;
  private cronJob: cron.ScheduledTask | null = null;

  async assignDailyChallenges(userId: string): Promise<void> {
    try {
      const allChallenges = await storage.getActiveDailyChallenges();
      
      if (allChallenges.length === 0) {
        console.warn('⚠️ No active challenges available');
        return;
      }

      const selectedChallenges = allChallenges
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
      
      const challengeIds = selectedChallenges.map(c => c.id);
      await storage.assignDailyChallenges(userId, challengeIds);

      console.log(`📋 Assigned ${challengeIds.length} daily challenges to user ${userId}`);
    } catch (error) {
      console.error(`Error assigning daily challenges to user ${userId}:`, error);
    }
  }

  async rotateChallengesForAllUsers(): Promise<void> {
    console.log('🔄 Starting daily challenge rotation...');

    try {
      const users = await storage.getAllUsers();
      
      if (!users || users.length === 0) {
        console.log('No users found for challenge rotation');
        return;
      }

      console.log(`Rotating challenges for ${users.length} users`);

      let successCount = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          await this.assignDailyChallenges(user.id);
          successCount++;
        } catch (error) {
          console.error(`Failed to assign challenges to user ${user.id}:`, error);
          errorCount++;
        }
      }

      console.log(`✅ Challenge rotation complete: ${successCount} successful, ${errorCount} errors`);
    } catch (error) {
      console.error('Error during challenge rotation:', error);
    }
  }

  start(): void {
    if (this.isRunning) {
      console.log('Challenge rotation service is already running');
      return;
    }

    this.cronJob = cron.schedule('0 0 * * *', async () => {
      console.log('⏰ Midnight - Starting automatic challenge rotation');
      await this.rotateChallengesForAllUsers();
    }, {
      timezone: 'UTC'
    });

    this.isRunning = true;
    console.log('🔄 Challenge rotation service started (runs daily at midnight UTC)');
  }

  stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }
    this.isRunning = false;
    console.log('🛑 Challenge rotation service stopped');
  }

  async manualRotation(): Promise<void> {
    console.log('🔄 Manual challenge rotation triggered');
    await this.rotateChallengesForAllUsers();
  }

  getStatus(): { isRunning: boolean; nextRotation: string } {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setUTCHours(24, 0, 0, 0);

    return {
      isRunning: this.isRunning,
      nextRotation: nextMidnight.toISOString(),
    };
  }
}

export const challengeRotationService = new ChallengeRotationService();
