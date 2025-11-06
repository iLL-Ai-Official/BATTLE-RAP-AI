import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, real, decimal, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from 'drizzle-orm';

// Define RoundScores interface first
export interface RoundScores {
  userScore: number;
  aiScore: number;
  rhymeDensity: number;
  flowQuality: number;
  creativity: number;
  totalScore: number;
}

// Battles table with user authentication
export const battles = pgTable("battles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  userScore: integer("user_score").notNull().default(0),
  aiScore: integer("ai_score").notNull().default(0),
  difficulty: text("difficulty").notNull().default("normal"),
  profanityFilter: boolean("profanity_filter").notNull().default(false),
  aiCharacterId: text("ai_character_id"),
  aiCharacterName: text("ai_character_name"),
  aiVoiceId: text("ai_voice_id"),
  lyricComplexity: integer("lyric_complexity").default(50), // 0-100 complexity level
  styleIntensity: integer("style_intensity").default(50), // 0-100 style intensity level
  voiceSpeed: real("voice_speed").default(1.0), // 0.5-2.0 voice speed multiplier
  rounds: jsonb("rounds").$type<Array<{
    id: string;
    battleId: string;
    roundNumber: number;
    userVerse: string | null;
    aiVerse: string;
    userAudioUrl: string | null;
    aiAudioUrl: string | null;
    scores: RoundScores;
    createdAt: Date;
  }>>().notNull().default([]),
  status: text("status").notNull().default("active"),
  // Arc Blockchain competitive stakes
  isStakeBattle: boolean("is_stake_battle").notNull().default(false), // Whether this is a competitive stake battle
  stakeAmountUSDC: decimal("stake_amount_usdc", { precision: 20, scale: 6 }), // USDC competitive stake amount
  stakeTxHash: varchar("stake_tx_hash"), // Arc blockchain transaction hash for competitive stake
  rewardTxHash: varchar("reward_tx_hash"), // Arc blockchain transaction hash for reward payout
  // Multiplayer PvP support
  isMultiplayer: boolean("is_multiplayer").notNull().default(false), // PvP battle vs real player
  opponentUserId: varchar("opponent_user_id"), // Real player opponent ID
  opponentScore: integer("opponent_score").default(0), // Opponent's score in PvP
  turnTimeLimit: integer("turn_time_limit").default(120), // Seconds per turn (2 minutes default)
  lastTurnAt: timestamp("last_turn_at"), // Last turn timestamp for timeout tracking
  isPaused: boolean("is_paused").default(false), // Battle paused (life happens!)
  pausedAt: timestamp("paused_at"), // When battle was paused
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const battleRounds = pgTable("battle_rounds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  battleId: varchar("battle_id").references(() => battles.id).notNull(),
  roundNumber: integer("round_number").notNull(),
  userVerse: text("user_verse"),
  aiVerse: text("ai_verse").notNull(),
  userAudioUrl: text("user_audio_url"),
  aiAudioUrl: text("ai_audio_url"),
  userBattleMap: text("user_battle_map"), // Professional battle rap mapping for display
  scores: jsonb("scores").$type<RoundScores>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBattleSchema = createInsertSchema(battles).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertBattleRoundSchema = createInsertSchema(battleRounds).omit({
  id: true,
  createdAt: true,
});

export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type Battle = typeof battles.$inferSelect;
export type InsertBattleRound = z.infer<typeof insertBattleRoundSchema>;
export type BattleRound = typeof battleRounds.$inferSelect;

export interface BattleState {
  id: string;
  currentRound: number;
  maxRounds: number;
  isRecording: boolean;
  isAIResponding: boolean;
  isPlayingAudio: boolean;
  userScore: number;
  aiScore: number;
  difficulty: "easy" | "normal" | "hard" | "nightmare" | "god";
  profanityFilter: boolean;
  timeRemaining: number;
}

export interface AudioRecording {
  blob: Blob;
  duration: number;
  transcript?: string;
}

export interface GroqTranscriptionResponse {
  text: string;
}

export interface GroqResponseData {
  id: string;
  object: string;
  status: string;
  output: Array<{
    type: string;
    content: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

export interface TypecastTTSResponse {
  audioUrl: string;
  duration: number;
}

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication and subscriptions
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  passwordHash: varchar("password_hash"), // For local email/password authentication
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id").unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("free"), // free, active, cancelled, past_due
  subscriptionTier: varchar("subscription_tier").default("free"), // free, premium, pro
  battlesRemaining: integer("battles_remaining").default(3), // Daily free battles
  lastBattleReset: timestamp("last_battle_reset").defaultNow(),
  storeCredit: decimal("store_credit", { precision: 10, scale: 2 }).notNull().default("1000.00"), // Store credit balance
  referralCode: varchar("referral_code"), // User's unique referral code
  referredBy: varchar("referred_by"), // Who referred this user
  totalBattles: integer("total_battles").default(0),
  totalWins: integer("total_wins").default(0),
  // User-managed API keys for enhanced TTS services
  openaiApiKey: varchar("openai_api_key"), // User's encrypted OpenAI API key
  groqApiKey: varchar("groq_api_key"), // User's encrypted Groq API key
  elevenlabsApiKey: varchar("elevenlabs_api_key"), // User's encrypted ElevenLabs API key
  preferredTtsService: varchar("preferred_tts_service").default("elevenlabs"), // "openai", "groq", "elevenlabs", "system"
  // Profile fields
  bio: text("bio"), // User bio/description
  rapStyle: varchar("rap_style"), // User's preferred rap style
  characterCardUrl: varchar("character_card_url"), // URL to generated character card image
  characterCardData: jsonb("character_card_data"), // Character card metadata
  // Arc Blockchain integration
  arcWalletAddress: varchar("arc_wallet_address"), // User's Arc L1 wallet address for USDC rewards
  arcUsdcBalance: decimal("arc_usdc_balance", { precision: 20, scale: 6 }).default("0.000000"), // USDC balance on Arc blockchain
  totalEarnedUSDC: decimal("total_earned_usdc", { precision: 20, scale: 6 }).default("0.000000"), // Total USDC earned from battles/tournaments
  // Safety and Legal Compliance
  birthDate: timestamp("birth_date"), // For age verification
  ageVerifiedAt: timestamp("age_verified_at"), // When age was verified
  ageVerificationStatus: varchar("age_verification_status").default("unverified"), // unverified, verified, failed
  tosAcceptedAt: timestamp("tos_accepted_at"), // Terms of Service acceptance timestamp
  tosVersion: varchar("tos_version"), // Which ToS version they accepted
  preferredJurisdiction: varchar("preferred_jurisdiction"), // User's location/jurisdiction
  ttsProvider: varchar("tts_provider").default("groq"), // Preferred TTS: 'groq' or 'elevenlabs'
  dailySpendLimitUSDC: decimal("daily_spend_limit_usdc", { precision: 20, scale: 6 }).default("50.00"), // Max spend per day
  perTxLimitUSDC: decimal("per_tx_limit_usdc", { precision: 20, scale: 6 }).default("25.00"), // Max spend per transaction
  dailySpendUsedUSDC: decimal("daily_spend_used_usdc", { precision: 20, scale: 6 }).default("0.00"), // Amount spent today
  lastSpendResetAt: timestamp("last_spend_reset_at").defaultNow(), // When daily limit resets
  moderationOptIn: boolean("moderation_opt_in").default(true), // Use content moderation
  isMinor: boolean("is_minor").default(false), // Flag for users under 18
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  // Index for Stripe webhook performance
  index("idx_users_stripe_customer_id").on(table.stripeCustomerId),
  // Index for Arc wallet lookups
  index("idx_users_arc_wallet").on(table.arcWalletAddress),
  // Index for age verification status
  index("idx_users_age_verification").on(table.ageVerificationStatus),
  // Index for minor flag
  index("idx_users_is_minor").on(table.isMinor),
]);



// Relations
export const userRelations = relations(users, ({ many }) => ({
  battles: many(battles),
}));

export const battleRelations = relations(battles, ({ one }) => ({
  user: one(users, { fields: [battles.userId], references: [users.id] }),
}));

// Type definitions
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Tournament system
export const tournaments = pgTable("tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull().default("single_elimination"), // single_elimination, double_elimination
  status: varchar("status").notNull().default("active"), // active, completed, abandoned
  currentRound: integer("current_round").notNull().default(1),
  totalRounds: integer("total_rounds").notNull(),
  difficulty: varchar("difficulty").notNull().default("normal"),
  profanityFilter: boolean("profanity_filter").notNull().default(false),
  lyricComplexity: integer("lyric_complexity").default(50),
  styleIntensity: integer("style_intensity").default(50),
  prize: varchar("prize"), // What player gets for winning
  opponents: jsonb("opponents").$type<string[]>().notNull().default([]), // Array of character IDs
  bracket: jsonb("bracket").$type<TournamentBracket>().notNull(),
  // Arc Blockchain tournament prizes
  isPrizeTournament: boolean("is_prize_tournament").notNull().default(false), // Whether this tournament has USDC prizes
  prizePool: decimal("prize_pool", { precision: 20, scale: 6 }), // Total USDC prize pool
  firstPlacePrize: decimal("first_place_prize", { precision: 20, scale: 6 }), // 1st place USDC prize
  secondPlacePrize: decimal("second_place_prize", { precision: 20, scale: 6 }), // 2nd place USDC prize
  thirdPlacePrize: decimal("third_place_prize", { precision: 20, scale: 6 }), // 3rd place USDC prize
  rewardTxHashes: jsonb("reward_tx_hashes").$type<Record<string, string>>(), // Map of userId -> Arc tx hash for prizes
  // Multiplayer PvP tournaments
  isMultiplayer: boolean("is_multiplayer").notNull().default(false), // PvP tournament with real players
  maxPlayers: integer("max_players").default(8), // Max players (8 for single elimination)
  registeredPlayers: jsonb("registered_players").$type<string[]>().default([]), // Array of registered user IDs
  matchTimeLimit: integer("match_time_limit").default(300), // Seconds per match (5 minutes default)
  allowAIFillIn: boolean("allow_ai_fill_in").notNull().default(true), // Use AI to fill empty slots
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const tournamentBattles = pgTable("tournament_battles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").references(() => tournaments.id).notNull(),
  battleId: varchar("battle_id").references(() => battles.id).notNull(),
  round: integer("round").notNull(),
  position: integer("position").notNull(), // Position in the bracket
  isCompleted: boolean("is_completed").notNull().default(false),
  winnerId: varchar("winner_id"), // user ID or character ID
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Referral system table
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").references(() => users.id).notNull(), // User who made the referral
  refereeId: varchar("referee_id").references(() => users.id), // User who was referred
  referralCode: varchar("referral_code").notNull(), // The referral code used
  status: varchar("status").notNull().default("pending"), // pending, completed, rewarded
  creditAwarded: decimal("credit_awarded", { precision: 10, scale: 2 }).default("0.00"), // Amount of credit given
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"), // When the referral was completed
});

export interface TournamentBracket {
  rounds: TournamentRound[];
}

export interface TournamentRound {
  roundNumber: number;
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  player1: TournamentPlayer;
  player2: TournamentPlayer;
  winner?: TournamentPlayer;
  battleId?: string;
  isCompleted: boolean;
}

export interface TournamentPlayer {
  id: string;
  name: string;
  type: 'user' | 'ai';
  avatar?: string;
}

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  createdAt: true,
  completedAt: true,
}).extend({
  bracket: z.object({
    rounds: z.array(z.object({
      roundNumber: z.number(),
      matches: z.array(z.object({
        id: z.string(),
        player1: z.object({
          id: z.string(),
          name: z.string(),
          type: z.enum(['user', 'ai']),
          avatar: z.string().optional()
        }),
        player2: z.object({
          id: z.string(),
          name: z.string(),
          type: z.enum(['user', 'ai']),
          avatar: z.string().optional()
        }),
        winner: z.object({
          id: z.string(),
          name: z.string(),
          type: z.enum(['user', 'ai']),
          avatar: z.string().optional()
        }).optional(),
        battleId: z.string().optional(),
        isCompleted: z.boolean()
      }))
    }))
  })
});

export const insertTournamentBattleSchema = createInsertSchema(tournamentBattles).omit({
  id: true,
  createdAt: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournamentBattle = z.infer<typeof insertTournamentBattleSchema>;
export type TournamentBattle = typeof tournamentBattles.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;

// Subscription tiers and pricing
export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    price: 0,
    battlesPerDay: 3,
    features: ["3 battles per day", "Basic AI opponents", "Standard voices", "Ads supported", "Watch ads for free battles"]
  },
  premium: {
    name: "Premium",
    price: 9.99,
    battlesPerDay: 25,
    features: ["25 battles per day", "Advanced AI opponents", "Premium voices", "Battle analysis", "No ads", "Clone battles unlimited"]
  },
  pro: {
    name: "Pro",
    price: 19.99,
    battlesPerDay: -1, // unlimited
    features: ["Unlimited battles", "All AI opponents", "Custom voices", "Advanced analytics", "Priority support", "Tournament mode", "No ads", "Clone battles unlimited", "Sponsor clone battles"]
  }
} as const;

// Webhook idempotency tracking
export const processedWebhookEvents = pgTable("processed_webhook_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").unique().notNull(), // Stripe event ID
  eventType: varchar("event_type").notNull(), // e.g., payment_intent.succeeded
  processedAt: timestamp("processed_at").notNull().defaultNow(),
}, (table) => [
  index("idx_webhook_events_event_id").on(table.eventId),
  index("idx_webhook_events_processed_at").on(table.processedAt),
]);

export const insertWebhookEventSchema = createInsertSchema(processedWebhookEvents).omit({
  id: true,
  processedAt: true,
});

export type InsertWebhookEvent = z.infer<typeof insertWebhookEventSchema>;
export type ProcessedWebhookEvent = typeof processedWebhookEvents.$inferSelect;

// User Clones table - Bot clones of users that match their skill level
export const userClones = pgTable("user_clones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  cloneName: varchar("clone_name").notNull(), // e.g., "Shadow User" or custom name
  skillLevel: integer("skill_level").notNull().default(50), // 0-100, based on user's average performance
  avgRhymeDensity: integer("avg_rhyme_density").notNull().default(50), // Average rhyme density score
  avgFlowQuality: integer("avg_flow_quality").notNull().default(50), // Average flow quality score
  avgCreativity: integer("avg_creativity").notNull().default(50), // Average creativity score
  battlesAnalyzed: integer("battles_analyzed").notNull().default(0), // Number of user battles used for analysis
  style: text("style").notNull().default("balanced"), // User's battle style
  voiceId: text("voice_id"), // Voice ID for TTS (can use similar voice to user's preferred)
  isActive: boolean("is_active").notNull().default(true), // Whether clone is active/available
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserCloneSchema = createInsertSchema(userClones).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserClone = z.infer<typeof insertUserCloneSchema>;
export type UserClone = typeof userClones.$inferSelect;

// Relations for user clones
export const userCloneRelations = relations(userClones, ({ one }) => ({
  user: one(users, { fields: [userClones.userId], references: [users.id] }),
}));

// Arc Blockchain transaction tracking
export const arcTransactions = pgTable("arc_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  txHash: varchar("tx_hash").notNull().unique(), // Arc blockchain transaction hash
  txType: varchar("tx_type").notNull(), // battle_win, tournament_prize, stake_deposit, stake_payout, voice_command
  amount: decimal("amount", { precision: 20, scale: 6 }).notNull(), // USDC amount
  fromAddress: varchar("from_address").notNull(),
  toAddress: varchar("to_address").notNull(),
  status: varchar("status").notNull().default("pending"), // pending, confirmed, failed
  blockNumber: integer("block_number"),
  gasUsedUSDC: decimal("gas_used_usdc", { precision: 20, scale: 6 }),
  relatedBattleId: varchar("related_battle_id").references(() => battles.id),
  relatedTournamentId: varchar("related_tournament_id").references(() => tournaments.id),
  memo: text("memo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
}, (table) => [
  index("idx_arc_tx_user").on(table.userId),
  index("idx_arc_tx_hash").on(table.txHash),
  index("idx_arc_tx_status").on(table.status),
]);

export const insertArcTransactionSchema = createInsertSchema(arcTransactions).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
});

export type InsertArcTransaction = z.infer<typeof insertArcTransactionSchema>;
export type ArcTransaction = typeof arcTransactions.$inferSelect;

// Multiplayer matchmaking queue
export const matchmakingQueue = pgTable("matchmaking_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  queueType: varchar("queue_type").notNull(), // "casual", "ranked", "stakes", "tournament"
  stakeAmount: decimal("stake_amount", { precision: 20, scale: 6 }), // For competitive stake matches
  skillRating: integer("skill_rating").default(1000), // ELO-style rating for matchmaking
  status: varchar("status").notNull().default("waiting"), // waiting, matched, expired
  matchedWithUserId: varchar("matched_with_user_id"), // Opponent user ID when matched
  battleId: varchar("battle_id").references(() => battles.id), // Created battle ID
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(), // Queue expires after 5 minutes
  matchedAt: timestamp("matched_at"),
}, (table) => [
  index("idx_matchmaking_status").on(table.status),
  index("idx_matchmaking_queue_type").on(table.queueType),
  index("idx_matchmaking_user").on(table.userId),
]);

export const insertMatchmakingQueueSchema = createInsertSchema(matchmakingQueue).omit({
  id: true,
  joinedAt: true,
  matchedAt: true,
});

export type InsertMatchmakingQueue = z.infer<typeof insertMatchmakingQueueSchema>;
export type MatchmakingQueueEntry = typeof matchmakingQueue.$inferSelect;

// User progression system
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  level: integer("level").notNull().default(1),
  currentXP: integer("current_xp").notNull().default(0),
  totalXP: integer("total_xp").notNull().default(0),
  winStreak: integer("win_streak").notNull().default(0),
  bestWinStreak: integer("best_win_streak").notNull().default(0),
  totalBattlesPlayed: integer("total_battles_played").notNull().default(0),
  totalBattlesWon: integer("total_battles_won").notNull().default(0),
  totalTournamentsWon: integer("total_tournaments_won").notNull().default(0),
  prestige: integer("prestige").notNull().default(0),
  title: varchar("title"),
  equippedBadge: varchar("equipped_badge"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("idx_user_progress_user_id").on(table.userId),
  index("idx_user_progress_level").on(table.level),
]);

// Cosmetic items catalog
export const cosmeticItems = pgTable("cosmetic_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // skin, emote, mic_effect, victory_animation, title, badge, stage_background
  rarity: varchar("rarity").notNull().default("common"), // common, rare, epic, legendary
  imageUrl: varchar("image_url"),
  unlockLevel: integer("unlock_level"), // Level required to unlock (null if purchasable only)
  price: decimal("price", { precision: 10, scale: 2 }), // Price in virtual currency (null if level-locked only)
  isPremium: boolean("is_premium").notNull().default(false), // Premium currency only
  isLimited: boolean("is_limited").notNull().default(false), // Limited time availability
  availableUntil: timestamp("available_until"), // When limited item expires
  metadata: jsonb("metadata"), // Additional data (animation URLs, sound effects, etc.)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User inventory
export const userInventory = pgTable("user_inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  cosmeticId: varchar("cosmetic_id").references(() => cosmeticItems.id).notNull(),
  isEquipped: boolean("is_equipped").notNull().default(false),
  acquiredAt: timestamp("acquired_at").notNull().defaultNow(),
}, (table) => [
  index("idx_user_inventory_user_id").on(table.userId),
]);

// Battle Pass seasons
export const battlePasses = pgTable("battle_passes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seasonNumber: integer("season_number").notNull().unique(),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("9.99"),
  premiumPrice: decimal("premium_price", { precision: 10, scale: 2 }).notNull().default("19.99"),
  maxTiers: integer("max_tiers").notNull().default(50),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  themeImageUrl: varchar("theme_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Battle Pass tier rewards
export const battlePassTiers = pgTable("battle_pass_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  battlePassId: varchar("battle_pass_id").references(() => battlePasses.id).notNull(),
  tier: integer("tier").notNull(),
  xpRequired: integer("xp_required").notNull(),
  freeRewardType: varchar("free_reward_type"), // xp_boost, currency, cosmetic
  freeRewardId: varchar("free_reward_id"), // cosmeticId if type is cosmetic
  freeRewardAmount: integer("free_reward_amount"), // Amount of currency/XP
  premiumRewardType: varchar("premium_reward_type"),
  premiumRewardId: varchar("premium_reward_id"),
  premiumRewardAmount: integer("premium_reward_amount"),
  isPremiumOnly: boolean("is_premium_only").notNull().default(false),
}, (table) => [
  index("idx_battle_pass_tiers_pass_id").on(table.battlePassId),
]);

// User Battle Pass progress
export const userBattlePass = pgTable("user_battle_pass", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  battlePassId: varchar("battle_pass_id").references(() => battlePasses.id).notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  currentTier: integer("current_tier").notNull().default(0),
  currentXP: integer("current_xp").notNull().default(0),
  purchasedAt: timestamp("purchased_at"),
  claimedRewards: jsonb("claimed_rewards").$type<number[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("idx_user_battle_pass_user_id").on(table.userId),
  index("idx_user_battle_pass_battle_pass_id").on(table.battlePassId),
]);

// Daily challenges
export const dailyChallenges = pgTable("daily_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // win_battles, play_battles, win_streak, earn_score, use_character
  requirement: integer("requirement").notNull(), // Number required (e.g., 3 battles, 5 wins)
  xpReward: integer("xp_reward").notNull(),
  currencyReward: integer("currency_reward").notNull().default(0),
  difficulty: varchar("difficulty").notNull().default("easy"), // easy, medium, hard
  isActive: boolean("is_active").notNull().default(true),
  rotatesDaily: boolean("rotates_daily").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User challenge progress
export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  challengeId: varchar("challenge_id").references(() => dailyChallenges.id).notNull(),
  progress: integer("progress").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  rewardClaimed: boolean("reward_claimed").notNull().default(false),
  dateAssigned: timestamp("date_assigned").notNull().defaultNow(),
}, (table) => [
  index("idx_user_challenge_progress_user_id").on(table.userId),
  index("idx_user_challenge_progress_challenge_id").on(table.challengeId),
]);

// Virtual currency transactions
export const currencyTransactions = pgTable("currency_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  type: varchar("type").notNull(), // earned, spent, purchased, refunded
  source: varchar("source").notNull(), // battle_win, level_up, challenge, purchase, cosmetic_buy
  metadata: jsonb("metadata"), // Additional context
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("idx_currency_transactions_user_id").on(table.userId),
]);

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCosmeticItemSchema = createInsertSchema(cosmeticItems).omit({ id: true, createdAt: true });
export const insertUserInventorySchema = createInsertSchema(userInventory).omit({ id: true, acquiredAt: true });
export const insertBattlePassSchema = createInsertSchema(battlePasses).omit({ id: true, createdAt: true });
export const insertUserBattlePassSchema = createInsertSchema(userBattlePass).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges).omit({ id: true, createdAt: true });

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type CosmeticItem = typeof cosmeticItems.$inferSelect;
export type InsertCosmeticItem = z.infer<typeof insertCosmeticItemSchema>;
export type UserInventory = typeof userInventory.$inferSelect;
export type BattlePass = typeof battlePasses.$inferSelect;
export type UserBattlePass = typeof userBattlePass.$inferSelect;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;

// Rap Training Program
export const trainingLessons = pgTable("training_lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(), // basics, rhyme_schemes, flow, wordplay, battle_tactics, advanced
  difficulty: varchar("difficulty").notNull().default("beginner"), // beginner, intermediate, advanced, expert
  order: integer("order").notNull(), // Display order
  videoUrl: varchar("video_url"), // Tutorial video URL
  content: text("content").notNull(), // Lesson content (markdown)
  practicePrompt: text("practice_prompt"), // What to practice
  xpReward: integer("xp_reward").notNull().default(100),
  currencyReward: integer("currency_reward").notNull().default(50),
  unlockLevel: integer("unlock_level").default(1), // Level required to unlock
  isPremium: boolean("is_premium").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userTrainingProgress = pgTable("user_training_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  lessonId: varchar("lesson_id").references(() => trainingLessons.id).notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  practiceScore: integer("practice_score"), // Score on practice battle (0-100)
  attempts: integer("attempts").notNull().default(0),
  lastAttemptAt: timestamp("last_attempt_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("idx_user_training_user_id").on(table.userId),
  index("idx_user_training_lesson_id").on(table.lessonId),
]);

export type TrainingLesson = typeof trainingLessons.$inferSelect;
export type UserTrainingProgress = typeof userTrainingProgress.$inferSelect;

// Platform wallet configuration
export const platformWallets = pgTable("platform_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletType: varchar("wallet_type").notNull().unique(), // rewards_pool, company_profit, revenue_share
  walletAddress: varchar("wallet_address").notNull(),
  balance: decimal("balance", { precision: 20, scale: 6 }).notNull().default("0.000000"),
  minBalance: decimal("min_balance", { precision: 20, scale: 6 }).default("100.000000"), // Minimum balance alert threshold
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").references(() => platformWallets.id).notNull(),
  txType: varchar("tx_type").notNull(), // deposit, withdrawal, reward_payout, profit_transfer
  amount: decimal("amount", { precision: 20, scale: 6 }).notNull(),
  balanceBefore: decimal("balance_before", { precision: 20, scale: 6 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 20, scale: 6 }).notNull(),
  txHash: varchar("tx_hash"), // Blockchain transaction hash
  userId: varchar("user_id").references(() => users.id), // If related to a user
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("idx_wallet_transactions_wallet_id").on(table.walletId),
  index("idx_wallet_transactions_user_id").on(table.userId),
  index("idx_wallet_transactions_type").on(table.txType),
]);

export type PlatformWallet = typeof platformWallets.$inferSelect;
export type WalletTransaction = typeof walletTransactions.$inferSelect;

// Arc Blockchain monetization configuration
export const MONETIZATION_CONFIG = {
  PLATFORM_WALLETS: {
    REWARDS_POOL_MIN_BALANCE: "100.00", // Alert if rewards pool drops below $100
    PROFIT_TRANSFER_THRESHOLD: "1000.00", // Auto-transfer profits when reaching $1000
    COMPANY_WALLET_ADDRESS: process.env.COMPANY_WALLET_ADDRESS || "", // Set via environment variable
  },
  ARC_REWARDS: {
    BATTLE_WIN_USDC: "0.10", // $0.10 USDC for winning a battle
    TOURNAMENT_1ST: "5.00", // $5.00 USDC for 1st place
    TOURNAMENT_2ND: "2.50", // $2.50 USDC for 2nd place
    TOURNAMENT_3RD: "1.00", // $1.00 USDC for 3rd place
    VOICE_COMMAND_REWARD: "0.01", // $0.01 USDC for using voice command
  },
  COMPETITIVE_STAKES_LIMITS: {
    MIN_STAKE_USDC: "0.50", // Minimum competitive stake: $0.50 USDC
    MAX_STAKE_USDC: "100.00", // Maximum competitive stake: $100 USDC
    PLATFORM_FEE_PERCENT: 5, // 5% platform fee on competitive challenges
  },
  TOURNAMENT_PRIZE_POOLS: {
    SMALL: {
      total: "10.00", // $10 total prize pool
      first: "5.00",
      second: "3.00",
      third: "2.00",
    },
    MEDIUM: {
      total: "50.00", // $50 total prize pool
      first: "25.00",
      second: "15.00",
      third: "10.00",
    },
    LARGE: {
      total: "250.00", // $250 total prize pool
      first: "150.00",
      second: "60.00",
      third: "40.00",
    },
  },
  MATCHMAKING: {
    QUEUE_TIMEOUT_SECONDS: 300, // 5 minutes max wait
    MAX_SKILL_DIFF: 200, // Max ELO difference for matching
    TURN_TIME_LIMIT: 120, // 2 minutes per turn default
    TOURNAMENT_MATCH_LIMIT: 300, // 5 minutes per tournament match
    PAUSE_TIME_LIMIT: 3600, // 1 hour max pause time
  },
} as const;
