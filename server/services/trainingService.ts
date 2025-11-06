import { db } from "../db";
import { trainingLessons, userTrainingProgress, type TrainingLesson, type UserTrainingProgress } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { storage } from "../storage";
import { xpService } from "./xpService";

export class TrainingService {
  async getLessons(userId: string, category?: string) {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const userProgress = await storage.getUserProgress(userId);
    const userLevel = userProgress?.level || 1;

    let query = db.select().from(trainingLessons);
    
    if (category) {
      query = query.where(eq(trainingLessons.category, category)) as any;
    }

    const lessons = await query.orderBy(trainingLessons.order);

    const lessonsWithProgress = await Promise.all(
      lessons.map(async (lesson) => {
        const [progress] = await db
          .select()
          .from(userTrainingProgress)
          .where(
            and(
              eq(userTrainingProgress.userId, userId),
              eq(userTrainingProgress.lessonId, lesson.id)
            )
          );

        const isLocked = (lesson.unlockLevel || 1) > userLevel;
        
        return {
          ...lesson,
          isLocked,
          progress: progress || null,
        };
      })
    );

    return lessonsWithProgress;
  }

  async getLesson(userId: string, lessonId: string) {
    const [lesson] = await db
      .select()
      .from(trainingLessons)
      .where(eq(trainingLessons.id, lessonId));

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const userProgress = await storage.getUserProgress(userId);
    const userLevel = userProgress?.level || 1;

    const isLocked = (lesson.unlockLevel || 1) > userLevel;

    if (isLocked) {
      throw new Error(`Lesson locked. Reach level ${lesson.unlockLevel || 1} to unlock.`);
    }

    const [progress] = await db
      .select()
      .from(userTrainingProgress)
      .where(
        and(
          eq(userTrainingProgress.userId, userId),
          eq(userTrainingProgress.lessonId, lessonId)
        )
      );

    return {
      ...lesson,
      progress: progress || null,
    };
  }

  async completePractice(userId: string, lessonId: string, score: number) {
    const lesson = await this.getLesson(userId, lessonId);
    
    const passingScore = 70;
    const passed = score >= passingScore;

    let progress = await db
      .select()
      .from(userTrainingProgress)
      .where(
        and(
          eq(userTrainingProgress.userId, userId),
          eq(userTrainingProgress.lessonId, lessonId)
        )
      );

    if (progress.length === 0) {
      await db.insert(userTrainingProgress).values({
        userId,
        lessonId,
        attempts: 1,
        practiceScore: score,
        isCompleted: passed,
        completedAt: passed ? new Date() : null,
        lastAttemptAt: new Date(),
      });

      // Award XP and currency on first completion
      if (passed) {
        await xpService.awardXP(userId, lesson.xpReward, `lesson_${lessonId}`);
        
        await storage.addCurrencyTransaction(
          userId,
          lesson.currencyReward,
          'earned',
          `Completed lesson: ${lesson.title}`
        );

        console.log(`🎓 User ${userId} completed lesson "${lesson.title}" on first attempt - awarded ${lesson.xpReward} XP and ${lesson.currencyReward} currency`);

        return {
          passed: true,
          firstCompletion: true,
          xpAwarded: lesson.xpReward,
          currencyAwarded: lesson.currencyReward,
          score,
        };
      }
    } else {
      const currentProgress = progress[0];
      const newAttempts = currentProgress.attempts + 1;
      const isFirstCompletion = !currentProgress.isCompleted && passed;

      await db
        .update(userTrainingProgress)
        .set({
          attempts: newAttempts,
          practiceScore: Math.max(currentProgress.practiceScore || 0, score),
          isCompleted: passed || currentProgress.isCompleted,
          completedAt: isFirstCompletion ? new Date() : currentProgress.completedAt,
          lastAttemptAt: new Date(),
        })
        .where(eq(userTrainingProgress.id, currentProgress.id));

      if (isFirstCompletion) {
        await xpService.awardXP(userId, lesson.xpReward, `lesson_${lessonId}`);
        
        await storage.addCurrencyTransaction(
          userId,
          lesson.currencyReward,
          'earned',
          `Completed lesson: ${lesson.title}`
        );

        console.log(`🎓 User ${userId} completed lesson "${lesson.title}" - awarded ${lesson.xpReward} XP and ${lesson.currencyReward} currency`);

        return {
          passed: true,
          firstCompletion: true,
          xpAwarded: lesson.xpReward,
          currencyAwarded: lesson.currencyReward,
          score,
        };
      }
    }

    return {
      passed,
      firstCompletion: false,
      xpAwarded: 0,
      currencyAwarded: 0,
      score,
    };
  }

  async markComplete(userId: string, lessonId: string) {
    const lesson = await this.getLesson(userId, lessonId);

    const [existingProgress] = await db
      .select()
      .from(userTrainingProgress)
      .where(
        and(
          eq(userTrainingProgress.userId, userId),
          eq(userTrainingProgress.lessonId, lessonId)
        )
      );

    if (existingProgress) {
      if (!existingProgress.isCompleted) {
        await db
          .update(userTrainingProgress)
          .set({
            isCompleted: true,
            completedAt: new Date(),
          })
          .where(eq(userTrainingProgress.id, existingProgress.id));
      }
    } else {
      await db.insert(userTrainingProgress).values({
        userId,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
        attempts: 0,
        lastAttemptAt: new Date(),
      });
    }

    return { success: true };
  }

  async getUserProgress(userId: string) {
    const allProgress = await db
      .select()
      .from(userTrainingProgress)
      .where(eq(userTrainingProgress.userId, userId));

    const completedLessons = allProgress.filter(p => p.isCompleted).length;
    const totalLessons = await db
      .select({ count: sql<number>`count(*)` })
      .from(trainingLessons);

    const totalCount = totalLessons[0]?.count || 0;
    const completionPercentage = totalCount > 0 ? (completedLessons / totalCount) * 100 : 0;

    const progressByCategory = await db
      .select({
        category: trainingLessons.category,
        completed: sql<number>`count(case when ${userTrainingProgress.isCompleted} then 1 end)`,
        total: sql<number>`count(*)`,
      })
      .from(trainingLessons)
      .leftJoin(
        userTrainingProgress,
        and(
          eq(userTrainingProgress.lessonId, trainingLessons.id),
          eq(userTrainingProgress.userId, userId)
        )
      )
      .groupBy(trainingLessons.category);

    return {
      completedLessons,
      totalLessons: totalCount,
      completionPercentage,
      progressByCategory,
      recentProgress: allProgress.slice(0, 5),
    };
  }

  async getCategories() {
    const categories = await db
      .selectDistinct({ category: trainingLessons.category })
      .from(trainingLessons);

    return categories.map(c => c.category);
  }
}

export const trainingService = new TrainingService();
