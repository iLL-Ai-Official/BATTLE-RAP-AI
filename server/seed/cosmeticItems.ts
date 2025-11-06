export const cosmeticItemsData = [
  // AVATARS (Common to Legendary)
  {
    name: 'Classic Microphone',
    description: 'A timeless classic for any MC',
    type: 'avatar',
    rarity: 'common',
    price: '100.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { color: '#888888' }
  },
  {
    name: 'Gold Microphone',
    description: 'Shine bright with this golden mic',
    type: 'avatar',
    rarity: 'rare',
    price: '500.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { color: '#FFD700' }
  },
  {
    name: 'Diamond Microphone',
    description: 'The ultimate status symbol',
    type: 'avatar',
    rarity: 'epic',
    price: '2000.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: false,
    metadata: { color: '#B9F2FF', sparkle: true }
  },
  {
    name: 'Legendary Fire Mic',
    description: 'Your bars are literally fire',
    type: 'avatar',
    rarity: 'legendary',
    price: '5000.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: true,
    metadata: { animated: true, effect: 'flames' }
  },

  // BADGES (Achievement Badges)
  {
    name: 'First Win',
    description: 'Won your first battle',
    type: 'badge',
    rarity: 'common',
    price: null,
    unlockLevel: 1,
    isPremium: false,
    isLimited: false,
    metadata: { icon: 'trophy' }
  },
  {
    name: 'Win Streak 5',
    description: 'Won 5 battles in a row',
    type: 'badge',
    rarity: 'rare',
    price: null,
    unlockLevel: 5,
    isPremium: false,
    isLimited: false,
    metadata: { icon: 'fire', color: '#FF6B35' }
  },
  {
    name: 'Battle Legend',
    description: 'Won 100 battles total',
    type: 'badge',
    rarity: 'epic',
    price: null,
    unlockLevel: 20,
    isPremium: false,
    isLimited: false,
    metadata: { icon: 'crown', color: '#9B59B6' }
  },
  {
    name: 'Rap God',
    description: 'Reached level 50',
    type: 'badge',
    rarity: 'legendary',
    price: null,
    unlockLevel: 50,
    isPremium: false,
    isLimited: false,
    metadata: { icon: 'star', animated: true, color: '#FFD700' }
  },

  // TITLES (Equippable Name Titles)
  {
    name: 'The Rookie',
    description: 'Just getting started',
    type: 'title',
    rarity: 'common',
    price: '50.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { prefix: 'Rookie' }
  },
  {
    name: 'The Challenger',
    description: 'Always ready for a battle',
    type: 'title',
    rarity: 'rare',
    price: '300.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { prefix: 'Challenger' }
  },
  {
    name: 'The Legendary',
    description: 'A name that echoes through time',
    type: 'title',
    rarity: 'epic',
    price: '1500.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: false,
    metadata: { prefix: 'Legendary', color: '#9B59B6' }
  },
  {
    name: 'The Immortal',
    description: 'Your legacy will never die',
    type: 'title',
    rarity: 'legendary',
    price: '4000.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: true,
    metadata: { prefix: 'Immortal', color: '#FFD700', animated: true }
  },

  // EMOTES (Victory Animations)
  {
    name: 'Mic Drop',
    description: 'Classic mic drop celebration',
    type: 'emote',
    rarity: 'common',
    price: '150.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { animation: 'mic_drop' }
  },
  {
    name: 'Victory Dance',
    description: 'Show off your moves',
    type: 'emote',
    rarity: 'rare',
    price: '400.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { animation: 'dance', duration: 3 }
  },
  {
    name: 'Crown Toss',
    description: 'Toss your crown to the crowd',
    type: 'emote',
    rarity: 'epic',
    price: '1800.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: false,
    metadata: { animation: 'crown_toss', particles: true }
  },
  {
    name: 'Fire Breathing',
    description: 'Breathe fire like a dragon',
    type: 'emote',
    rarity: 'legendary',
    price: '4500.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: true,
    metadata: { animation: 'fire_breath', effect: 'flames', duration: 5 }
  },

  // MIC EFFECTS (Sound Effects)
  {
    name: 'Echo Effect',
    description: 'Add echo to your voice',
    type: 'mic_effect',
    rarity: 'common',
    price: '200.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { effect: 'echo', intensity: 0.3 }
  },
  {
    name: 'Auto-Tune',
    description: 'Perfect pitch every time',
    type: 'mic_effect',
    rarity: 'rare',
    price: '600.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { effect: 'autotune', key: 'C' }
  },
  {
    name: 'Bass Boost',
    description: 'Make your voice boom',
    type: 'mic_effect',
    rarity: 'epic',
    price: '2200.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: false,
    metadata: { effect: 'bass_boost', gain: 6 }
  },
  {
    name: 'Demon Voice',
    description: 'Strike fear into opponents',
    type: 'mic_effect',
    rarity: 'legendary',
    price: '5500.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: true,
    metadata: { effect: 'pitch_shift', semitones: -12, distortion: 0.5 }
  },

  // STAGE BACKGROUNDS
  {
    name: 'Street Corner',
    description: 'Where it all began',
    type: 'stage_background',
    rarity: 'common',
    price: '100.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { theme: 'urban', ambience: 'street' }
  },
  {
    name: 'Underground Club',
    description: 'The classic battle venue',
    type: 'stage_background',
    rarity: 'rare',
    price: '500.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { theme: 'club', ambience: 'bass', lights: 'neon' }
  },
  {
    name: 'Stadium Arena',
    description: 'Perform for thousands',
    type: 'stage_background',
    rarity: 'epic',
    price: '2000.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: false,
    metadata: { theme: 'stadium', ambience: 'crowd_roar', capacity: 50000 }
  },
  {
    name: 'Floating in Space',
    description: 'Battle among the stars',
    type: 'stage_background',
    rarity: 'legendary',
    price: '6000.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: true,
    metadata: { theme: 'space', animated: true, particles: 'stars', ambience: 'ethereal' }
  },

  // VICTORY ANIMATIONS
  {
    name: 'Confetti Burst',
    description: 'Celebrate with confetti',
    type: 'victory_animation',
    rarity: 'common',
    price: '150.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { animation: 'confetti', duration: 3, colors: ['#FFD700', '#FF6B35'] }
  },
  {
    name: 'Fireworks Display',
    description: 'Light up the sky',
    type: 'victory_animation',
    rarity: 'rare',
    price: '450.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { animation: 'fireworks', duration: 5, sound: true }
  },
  {
    name: 'Lightning Strike',
    description: 'Strike with lightning',
    type: 'victory_animation',
    rarity: 'epic',
    price: '2100.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: false,
    metadata: { animation: 'lightning', duration: 4, effect: 'electric', sound: true }
  },
  {
    name: 'Phoenix Rising',
    description: 'Rise from the ashes',
    type: 'victory_animation',
    rarity: 'legendary',
    price: '5500.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: true,
    metadata: { animation: 'phoenix', duration: 8, effect: 'fire_wings', sound: true, particles: true }
  },

  // SKINS (Alternative Mic Designs)
  {
    name: 'Chrome Finish',
    description: 'Sleek and shiny',
    type: 'skin',
    rarity: 'common',
    price: '120.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { material: 'chrome', reflectivity: 0.9 }
  },
  {
    name: 'Neon Glow',
    description: 'Glow in the dark',
    type: 'skin',
    rarity: 'rare',
    price: '550.00',
    unlockLevel: null,
    isPremium: false,
    isLimited: false,
    metadata: { material: 'neon', color: '#00FFFF', glow: true }
  },
  {
    name: 'Dragon Scale',
    description: 'Covered in dragon scales',
    type: 'skin',
    rarity: 'epic',
    price: '2300.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: false,
    metadata: { material: 'scales', color: '#8B4513', texture: 'dragon' }
  },
  {
    name: 'Celestial',
    description: 'Blessed by the stars',
    type: 'skin',
    rarity: 'legendary',
    price: '6500.00',
    unlockLevel: null,
    isPremium: true,
    isLimited: true,
    metadata: { material: 'cosmic', animated: true, effect: 'galaxy', particles: 'stars' }
  },
];

export async function seedCosmeticItems(db: any) {
  console.log('🛍️ Seeding cosmetic items...');
  
  const { cosmeticItems } = await import('@shared/schema');
  
  await db.insert(cosmeticItems).values(cosmeticItemsData);
  
  console.log(`✅ Seeded ${cosmeticItemsData.length} cosmetic items`);
}
