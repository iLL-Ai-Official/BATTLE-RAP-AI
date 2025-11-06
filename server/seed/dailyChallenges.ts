export const dailyChallengesData = [
  // WIN-BASED CHALLENGES
  {
    name: 'Daily Victor',
    description: 'Win 3 battles today',
    type: 'battle_wins',
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
    type: 'battle_wins',
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
    type: 'battle_wins',
    requirement: 10,
    xpReward: 1000,
    currencyReward: 500,
    difficulty: 'hard',
    isActive: true,
    rotatesDaily: true,
  },

  // TRAINING CHALLENGES
  {
    name: 'Practice Makes Perfect',
    description: 'Complete 3 training lessons',
    type: 'training',
    requirement: 3,
    xpReward: 200,
    currencyReward: 100,
    difficulty: 'easy',
    isActive: true,
    rotatesDaily: true,
  },
  {
    name: 'Training Expert',
    description: 'Complete 5 training lessons today',
    type: 'training',
    requirement: 5,
    xpReward: 400,
    currencyReward: 200,
    difficulty: 'medium',
    isActive: true,
    rotatesDaily: true,
  },

  // RHYME DENSITY CHALLENGES
  {
    name: 'Rhyme Master',
    description: 'Achieve 80% rhyme density in a battle',
    type: 'rhyme_density',
    requirement: 80,
    xpReward: 400,
    currencyReward: 200,
    difficulty: 'medium',
    isActive: true,
    rotatesDaily: true,
  },
  {
    name: 'Perfect Rhymer',
    description: 'Achieve 95% rhyme density in a battle',
    type: 'rhyme_density',
    requirement: 95,
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
    type: 'score_threshold',
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
    type: 'score_threshold',
    requirement: 1000,
    xpReward: 600,
    currencyReward: 300,
    difficulty: 'hard',
    isActive: true,
    rotatesDaily: true,
  },

  // TOURNAMENT CHALLENGES
  {
    name: 'Tournament Contender',
    description: 'Win a tournament match',
    type: 'tournament',
    requirement: 1,
    xpReward: 250,
    currencyReward: 125,
    difficulty: 'easy',
    isActive: true,
    rotatesDaily: true,
  },
  {
    name: 'Tournament Victor',
    description: 'Win 3 tournament matches',
    type: 'tournament',
    requirement: 3,
    xpReward: 500,
    currencyReward: 250,
    difficulty: 'medium',
    isActive: true,
    rotatesDaily: true,
  },
  {
    name: 'Tournament Champion',
    description: 'Win an entire tournament',
    type: 'tournament',
    requirement: 1,
    xpReward: 1000,
    currencyReward: 500,
    difficulty: 'hard',
    isActive: true,
    rotatesDaily: true,
  },

  // MIXED CHALLENGES
  {
    name: 'Well Rounded',
    description: 'Win battles against 3 different opponents',
    type: 'battle_wins',
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
    type: 'battle_wins',
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
