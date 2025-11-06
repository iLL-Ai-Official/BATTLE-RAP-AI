export const dailyChallengesData = [
  // WIN-BASED CHALLENGES
  {
    name: 'Daily Victor',
    description: 'Win 3 battles today',
    type: 'win_battles',
    requirement: 3,
    xpReward: 300,
    currencyReward: 150,
    difficulty: 'easy',
    isActive: true,
    rotatesDaily: true,
  },
  {
    name: 'Dominator',
    description: 'Win 5 battles today',
    type: 'win_battles',
    requirement: 5,
    xpReward: 500,
    currencyReward: 250,
    difficulty: 'medium',
    isActive: true,
    rotatesDaily: true,
  },
  {
    name: 'Unstoppable',
    description: 'Win 10 battles today',
    type: 'win_battles',
    requirement: 10,
    xpReward: 1000,
    currencyReward: 500,
    difficulty: 'hard',
    isActive: true,
    rotatesDaily: true,
  },

  // PLAY-BASED CHALLENGES
  {
    name: 'Practice Makes Perfect',
    description: 'Complete 5 battles (win or lose)',
    type: 'play_battles',
    requirement: 5,
    xpReward: 200,
    currencyReward: 100,
    difficulty: 'easy',
    isActive: true,
    rotatesDaily: true,
  },
  {
    name: 'Battle Enthusiast',
    description: 'Complete 10 battles today',
    type: 'play_battles',
    requirement: 10,
    xpReward: 400,
    currencyReward: 200,
    difficulty: 'medium',
    isActive: true,
    rotatesDaily: true,
  },

  // WIN STREAK CHALLENGES
  {
    name: 'Hot Streak',
    description: 'Win 3 battles in a row',
    type: 'win_streak',
    requirement: 3,
    xpReward: 400,
    currencyReward: 200,
    difficulty: 'medium',
    isActive: true,
    rotatesDaily: true,
  },
  {
    name: 'On Fire',
    description: 'Win 5 battles in a row',
    type: 'win_streak',
    requirement: 5,
    xpReward: 800,
    currencyReward: 400,
    difficulty: 'hard',
    isActive: true,
    rotatesDaily: true,
  },

  // SCORE-BASED CHALLENGES
  {
    name: 'High Scorer',
    description: 'Score 800+ points in a single battle',
    type: 'earn_score',
    requirement: 800,
    xpReward: 350,
    currencyReward: 175,
    difficulty: 'medium',
    isActive: true,
    rotatesDaily: true,
  },
  {
    name: 'Perfect Performance',
    description: 'Score 1000+ points in a single battle',
    type: 'earn_score',
    requirement: 1000,
    xpReward: 600,
    currencyReward: 300,
    difficulty: 'hard',
    isActive: true,
    rotatesDaily: true,
  },

  // CHARACTER-SPECIFIC CHALLENGES
  {
    name: 'Razor Sharp',
    description: 'Win a battle using MC Razor',
    type: 'use_character',
    requirement: 1,
    xpReward: 250,
    currencyReward: 125,
    difficulty: 'easy',
    isActive: true,
    rotatesDaily: true,
  },
  {
    name: 'Venom Master',
    description: 'Win a battle using MC Venom',
    type: 'use_character',
    requirement: 1,
    xpReward: 250,
    currencyReward: 125,
    difficulty: 'easy',
    isActive: true,
    rotatesDaily: true,
  },
  {
    name: 'Silk Smooth',
    description: 'Win a battle using MC Silk',
    type: 'use_character',
    requirement: 1,
    xpReward: 250,
    currencyReward: 125,
    difficulty: 'easy',
    isActive: true,
    rotatesDaily: true,
  },

  // COMBO CHALLENGES
  {
    name: 'Well Rounded',
    description: 'Win battles against 3 different opponents',
    type: 'use_character',
    requirement: 3,
    xpReward: 450,
    currencyReward: 225,
    difficulty: 'medium',
    isActive: true,
    rotatesDaily: true,
  },
  {
    name: 'Nightmare Slayer',
    description: 'Win a battle on Nightmare difficulty',
    type: 'win_battles',
    requirement: 1,
    xpReward: 700,
    currencyReward: 350,
    difficulty: 'hard',
    isActive: true,
    rotatesDaily: true,
  },
];

export async function seedDailyChallenges(db: any) {
  console.log('📋 Seeding daily challenges...');
  
  const { dailyChallenges } = await import('@shared/schema');
  
  await db.insert(dailyChallenges).values(dailyChallengesData);
  
  console.log(`✅ Seeded ${dailyChallengesData.length} daily challenges`);
}
