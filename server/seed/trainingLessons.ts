import { db } from "../db";
import { trainingLessons } from "@shared/schema";

export const lessonData = [
  {
    title: "Flow Fundamentals",
    description: "Master the basics of rap flow and rhythm",
    category: "basics",
    difficulty: "beginner",
    order: 1,
    content: `# Flow Fundamentals

Flow is the rhythm and cadence of your rap delivery. It's how you ride the beat and make your words dance.

## Key Concepts

1. **Beat Awareness**: Feel the pulse of the beat
2. **Syllable Timing**: Place syllables on beat hits
3. **Breath Control**: Plan where to breathe
4. **Natural Rhythm**: Let your words flow naturally

## Practice Tips

- Start slow and build up speed
- Count beats: 1-2-3-4
- Practice with a metronome
- Record yourself to hear your flow

## Example Pattern

\`\`\`
[1] I'm [2] learn-ing [3] how to [4] flow
[1] Watch me [2] grow and [3] steal the [4] show
\`\`\``,
    practicePrompt: "Write a 4-bar verse about learning rap with clear rhythm on each beat",
    xpReward: 100,
    currencyReward: 50,
    unlockLevel: 1,
    isPremium: false,
  },
  {
    title: "Basic Rhyme Patterns",
    description: "Learn simple rhyme schemes like AABB and ABAB",
    category: "basics",
    difficulty: "beginner",
    order: 2,
    content: `# Basic Rhyme Patterns

Rhyme schemes are the backbone of memorable rap verses. Let's start with the fundamentals.

## Common Schemes

### AABB (Couplets)
Two consecutive lines rhyme
\`\`\`
I'm spitting fire, call me the king (A)
My rhymes are tight, hear the crowd sing (A)
My flow is sick, it's out of sight (B)
I'm taking over every night (B)
\`\`\`

### ABAB (Alternating)
Lines 1 and 3 rhyme, lines 2 and 4 rhyme
\`\`\`
I step up to the mic with pride (A)
My lyrics cut like a blade (B)
Can't be stopped, I won't hide (A)
Watch me dominate this trade (B)
\`\`\`

## Practice

Start with AABB - it's easier and builds confidence!`,
    practicePrompt: "Create an 8-bar verse using AABB rhyme scheme about your journey in rap",
    xpReward: 100,
    currencyReward: 50,
    unlockLevel: 1,
    isPremium: false,
  },
  {
    title: "Storytelling Basics",
    description: "Tell engaging stories through your verses",
    category: "basics",
    difficulty: "beginner",
    order: 3,
    content: `# Storytelling in Rap

Great rap tells stories. Whether it's your life, a character, or a message - narrative drives impact.

## Story Elements

1. **Setup**: Introduce the scene
2. **Conflict**: Present the challenge
3. **Climax**: The peak moment
4. **Resolution**: How it ends

## Techniques

- **First Person**: "I walked down the street..."
- **Vivid Details**: Use all 5 senses
- **Emotion**: Make listeners feel
- **Clear Arc**: Beginning, middle, end

## Example Structure

\`\`\`
Verse 1: Where I started (Setup)
Verse 2: The struggle (Conflict)
Verse 3: The breakthrough (Climax)
Hook: The lesson learned (Resolution)
\`\`\``,
    practicePrompt: "Tell a short story about overcoming a challenge in 8 bars",
    xpReward: 100,
    currencyReward: 50,
    unlockLevel: 2,
    isPremium: false,
  },
  {
    title: "Wordplay Introduction",
    description: "Start using clever wordplay and double meanings",
    category: "basics",
    difficulty: "beginner",
    order: 4,
    content: `# Introduction to Wordplay

Wordplay makes your lyrics memorable and shows skill. Let's explore the basics.

## Types of Wordplay

### Homonyms
Words that sound the same but mean different things
- "I'm so fly, I take flight" (fly = cool & flying)

### Puns
Play on words for humor or emphasis
- "I'm write-ing hits, that's right!" (write/right)

### Metaphors
Compare two things directly
- "My mind's a weapon, lyrics are bullets"

## How to Practice

1. List words with multiple meanings
2. Find sound-alike words
3. Create metaphors for common ideas
4. Mix techniques together

## Example
\`\`\`
I'm board of basic bars, so I'm bored no more (board/bored)
I'm a shark in these waters, watch me explore the shore
\`\`\``,
    practicePrompt: "Write 8 bars using at least 3 different wordplay techniques",
    xpReward: 150,
    currencyReward: 75,
    unlockLevel: 3,
    isPremium: false,
  },

  {
    title: "Perfect Rhymes vs Slant Rhymes",
    description: "Master different types of rhymes for variety",
    category: "rhyme_schemes",
    difficulty: "intermediate",
    order: 5,
    content: `# Perfect vs Slant Rhymes

Variety in rhyming makes your verses more sophisticated and less predictable.

## Perfect Rhymes
Exact vowel and consonant matches
- cat / hat / bat / mat
- sing / ring / king / thing

## Slant Rhymes (Near Rhymes)
Similar but not exact sounds
- love / enough
- mind / time
- home / roam

## Why Use Both?

- **Perfect**: Strong, clear, memorable
- **Slant**: Subtle, sophisticated, flexible

## Advanced Technique

Mix perfect and slant rhymes in the same verse:
\`\`\`
I'm climbing to the top, can't stop my grind (A - perfect)
My vision's crystal clear, success I'll find (A - perfect)
They sleeping on me now, but soon they'll wake (B - slant)
I'm building my empire, watch me take (B - slant)
\`\`\``,
    practicePrompt: "Write 8 bars alternating between perfect and slant rhymes",
    xpReward: 150,
    currencyReward: 75,
    unlockLevel: 4,
    isPremium: false,
  },
  {
    title: "Internal Rhymes",
    description: "Add rhymes within lines for complexity",
    category: "rhyme_schemes",
    difficulty: "intermediate",
    order: 6,
    content: `# Internal Rhymes

Internal rhymes occur within a single line, adding layers of complexity to your flow.

## What Are Internal Rhymes?

Rhymes that happen BEFORE the end of the line:
\`\`\`
"I wake and bake, then make my way to greatness"
   ↑      ↑        ↑
\`\`\`

## Patterns

### Simple Internal
\`\`\`
"I'm spitting fire, getting higher, never tire"
\`\`\`

### Complex Internal
\`\`\`
"The wicked lyricist is gifted, twisted, lifted to mythic"
\`\`\`

## Why They Matter

1. Adds density to your bars
2. Shows technical skill
3. Makes lines more memorable
4. Creates hypnotic rhythms

## Practice

Start by rhyming every 2-3 words in a line, then experiment!`,
    practicePrompt: "Create 8 bars where every line has at least 2 internal rhymes",
    xpReward: 200,
    currencyReward: 100,
    unlockLevel: 5,
    isPremium: false,
  },
  {
    title: "Multi-Syllabic Rhymes",
    description: "Rhyme multiple syllables for advanced schemes",
    category: "rhyme_schemes",
    difficulty: "intermediate",
    order: 7,
    content: `# Multi-Syllabic Rhymes

The hallmark of technical rappers - rhyming 2, 3, or more syllables at a time.

## What Are Multi-Syllables?

Rhyming multiple syllables instead of just one:

### Single Syllable
"I'm the best MC"

### Multi-Syllable (2)
"I'm the **MASTER-PIECE**"

### Multi-Syllable (3)
"Mas-ter-y, dis-as-ter free, cap-tur-ing"

## Examples by Syllable Count

**2-Syllable:**
- "better than" / "wetter pen"
- "masterful" / "faster pull"

**3-Syllable:**
- "immaculate" / "elaborate"  
- "capacity" / "audacity"

**4-Syllable:**
- "original" / "pivotal"
- "invincible" / "invisible"

## Practice Method

1. Pick an ending (e.g., "-ation")
2. List 10 words with that ending
3. Build bars using 3+ in a row

## Pro Example
\`\`\`
"My dedication to education, no hesitation
Creating narration with no limitation"
\`\`\``,
    practicePrompt: "Write 8 bars using primarily 3-syllable rhymes throughout",
    xpReward: 250,
    currencyReward: 125,
    unlockLevel: 7,
    isPremium: false,
  },
  {
    title: "Compound Rhymes",
    description: "Combine words to create complex rhyme patterns",
    category: "rhyme_schemes",
    difficulty: "advanced",
    order: 8,
    content: `# Compound Rhymes

The most advanced rhyme technique - combining words to create rhyme patterns.

## What Is It?

Using multiple words together to rhyme with other multi-word phrases:

\`\`\`
"I'm outstanding" rhymes with "commanding"
"I ran the land then" rhymes with "demand when"
\`\`\`

## Technique

Break words into phonetic sounds and recombine:
- "Eminem" = "M&M" = "them and them"
- "dictionary" = "diction airy" = "friction hairy"

## Advanced Examples

**Simple Compound:**
\`\`\`
"I'm so fly / toast and rye"
"best of all / rest and fall"
\`\`\`

**Complex Compound:**
\`\`\`
"I'm elevating, never hesitating, demonstrating devastation"
"Celebrating, generating greatness in my narration"
\`\`\`

## Master's Technique

Eminem is famous for this:
\`\`\`
"His palms are sweaty, knees weak, arms are heavy" 
All rhyme phonetically: et-y, ea-vy

## Practice

1. Pick a phrase (e.g., "I am winning")
2. Break into sounds ("I-am-win-ing")
3. Find words matching those sounds
4. Build your bar`,
    practicePrompt: "Create 8 bars using compound rhymes in every line",
    xpReward: 300,
    currencyReward: 150,
    unlockLevel: 10,
    isPremium: true,
  },

  {
    title: "Syncopation & Off-Beat Flow",
    description: "Rap off the beat for unique rhythms",
    category: "flow",
    difficulty: "intermediate",
    order: 9,
    content: `# Syncopation & Off-Beat Flow

Breaking the rhythm creates surprise and shows mastery of the beat.

## What Is Syncopation?

Landing syllables BETWEEN beats instead of on them:

**On-Beat:**
\`\`\`
[1] I'm [2] rap-[3]ping [4] now
\`\`\`

**Syncopated:**
\`\`\`
[1] I'm [&] rap-[2]ping [&] right [3] now
     ↑            ↑
\`\`\`

## Why Use It?

1. Creates tension and release
2. Sounds more natural/conversational
3. Shows rhythmic complexity
4. Keeps listeners engaged

## Practice Technique

1. Start on-beat
2. Shift some words slightly early/late
3. Listen to the "bounce"
4. Build muscle memory

## Example Flow Patterns

**Triplet Flow:**
\`\`\`
I'm-a-get-it, ne-ver-quit-it, al-ways-with-it
   1  &  a    2  &  a    3  &  a
\`\`\`

**Double-Time:**
\`\`\`
rapid-fire-witha-lyrical-desire
\`\`\``,
    practicePrompt: "Write 8 bars with deliberate syncopation and off-beat elements",
    xpReward: 200,
    currencyReward: 100,
    unlockLevel: 6,
    isPremium: false,
  },
  {
    title: "Breath Control",
    description: "Extend your bars without running out of breath",
    category: "flow",
    difficulty: "intermediate",
    order: 10,
    content: `# Breath Control

The ability to rap longer bars without gasping for air separates amateurs from pros.

## Why It Matters

- Longer, complex bars
- Smoother delivery
- More energy in performance
- Professional sound quality

## Breathing Techniques

### 1. Diaphragmatic Breathing
Breathe from your belly, not your chest
- Stand/sit straight
- Inhale through nose (belly expands)
- Exhale through mouth (belly contracts)

### 2. Strategic Breath Points
Plan where to breathe in your verse:
\`\`\`
I'm spitting fire nonstop [BREATH]
My lyrics never drop [BREATH]
I'm reaching for the top [BREATH]
Can't nobody make me stop [BREATH]
\`\`\`

### 3. Extending Breath
\`\`\`
[DEEP BREATH]
I'm running through this verse with precision and vision
Making my decision with lyrical incision
No collision with tradition just ambition
[QUICK BREATH]
\`\`\`

## Exercises

1. Hum for 20 seconds straight
2. Rap your verse in one breath
3. Increase length weekly
4. Practice daily`,
    practicePrompt: "Write and deliver a 16-bar verse with only 2 breath points",
    xpReward: 200,
    currencyReward: 100,
    unlockLevel: 8,
    isPremium: false,
  },
  {
    title: "Switching Flows",
    description: "Change flow patterns within a verse",
    category: "flow",
    difficulty: "advanced",
    order: 11,
    content: `# Switching Flows

Master rappers switch their flow multiple times in one verse for dynamic delivery.

## What Is Flow Switching?

Changing your rhythm, cadence, or delivery style mid-verse:

### Example Structure
\`\`\`
Bars 1-4: Slow, deliberate (storytelling)
Bars 5-8: Fast, aggressive (energy boost)
Bars 9-12: Choppy, staccato (emphasis)
Bars 13-16: Smooth, melodic (outro)
\`\`\`

## Types of Switches

**Speed Switch:**
- Slow → Fast → Slow

**Pattern Switch:**
- On-beat → Syncopated → Triplets

**Emotion Switch:**
- Calm → Aggressive → Triumphant

## Techniques

1. **Pivot Words**: Use words to signal change
   - "But wait..." (speed up)
   - "Now let me slow it down..."

2. **Beat Changes**: Switch on beat transitions

3. **Natural Breaks**: Use pauses strategically

## Famous Examples

- Kendrick Lamar: Changes flow every 4 bars
- J. Cole: Smooth transitions
- Eminem: Rapid-fire switches

## Practice

Start with 2 distinct flows in one 16-bar verse, then add more.`,
    practicePrompt: "Create a 16-bar verse with at least 3 distinct flow changes",
    xpReward: 300,
    currencyReward: 150,
    unlockLevel: 12,
    isPremium: true,
  },
  {
    title: "Melodic Rap Flow",
    description: "Blend singing and rapping for modern style",
    category: "flow",
    difficulty: "advanced",
    order: 12,
    content: `# Melodic Rap Flow

Modern rap blends melody with traditional rapping for emotional impact and mainstream appeal.

## What Is Melodic Flow?

Adding pitch variation and singing elements to rap delivery:

### Traditional Rap
\`\`\`
Monotone delivery, rhythm-focused
\`\`\`

### Melodic Rap
\`\`\`
Varied pitch, sung phrases, hooks within verses
\`\`\`

## Techniques

### 1. Pitch Variations
Don't stay on one note - move up and down:
\`\`\`
I'm FLY-ing HIGH (pitch rises)
Never gonna DIE (pitch stays high)
Watch me TOUCH the SKY (pitch descends)
\`\`\`

### 2. Sustained Notes
Hold certain words for melody:
\`\`\`
I'm never gonna stooooop
Rising to the tooooop
\`\`\`

### 3. Harmonies
Layer melodies in the chorus or ad-libs

## Modern Artists

- Drake: Singing and rapping blend
- Travis Scott: Auto-tune melodic flow
- Juice WRLD: Freestyle melodic style
- Lil Uzi Vert: Punk rock melody

## Practice

1. Find a beat with melody
2. Hum a melody first
3. Add words to your melody
4. Mix rap and singing

## Pro Tip

Use auto-tune or pitch correction to enhance melodic delivery if needed.`,
    practicePrompt: "Write an 8-bar melodic verse blending rap and singing elements",
    xpReward: 300,
    currencyReward: 150,
    unlockLevel: 15,
    isPremium: true,
  },

  {
    title: "Metaphors & Similes",
    description: "Paint pictures with comparative language",
    category: "wordplay",
    difficulty: "intermediate",
    order: 13,
    content: `# Metaphors & Similes

Create vivid imagery and memorable bars through comparison.

## Similes (Using "like" or "as")

Direct comparisons:
\`\`\`
"Fast like a bullet"
"Sharp as a razor"
"Cold like December"
\`\`\`

## Metaphors (IS statements)

Implicit comparisons:
\`\`\`
"I'm a bullet" (not: I'm LIKE a bullet)
"My mind's a weapon"
"Life's a battlefield"
\`\`\`

## Extended Metaphors

Build an entire verse around one comparison:
\`\`\`
I'm a lion in this jungle that we call the game
My roar shakes the canopy, they all know my name
I'm hunting for success, my prey is in my sight
The king of this domain, I dominate the night
\`\`\`

## Creating Strong Metaphors

1. **Unexpected**: Surprise the listener
   - "My pen bleeds truth" (not: "my pen writes well")

2. **Vivid**: Use sensory details
   - "My flow's a tsunami, drowning weak MCs"

3. **Relevant**: Connect to your message
   - "I'm planting seeds of wisdom in concrete jungles"

## Avoid Clichés

**Weak:** "I'm hot as fire"
**Strong:** "I'm molten lava, reshaping landscapes"`,
    practicePrompt: "Write 8 bars using an extended metaphor throughout the verse",
    xpReward: 200,
    currencyReward: 100,
    unlockLevel: 6,
    isPremium: false,
  },
  {
    title: "Double Entendres",
    description: "Use phrases with multiple simultaneous meanings",
    category: "wordplay",
    difficulty: "advanced",
    order: 14,
    content: `# Double Entendres

The art of saying two things at once - the mark of sophisticated lyricism.

## What Is It?

A phrase with two or more interpretations that both make sense:

### Example 1
"I'm write-ing my wrongs"
- Meaning 1: Correcting mistakes (righting)
- Meaning 2: Literally writing lyrics (writing)

### Example 2
"Money over everything, that's my principal"
- Meaning 1: My main rule/belief (principal)
- Meaning 2: The original investment amount (principal)

## Classic Techniques

### Homophone Double Entendre
Words that sound the same:
\`\`\`
"I'm so fly, I'm in-plane sight"
- in plain sight
- in plane sight (airplane)
\`\`\`

### Contextual Double Meaning
\`\`\`
"I'm killing the game, call it murder"
- Dominating rap (killing it)
- Actual murder (crime theme)
\`\`\`

## Layering Meanings

The best double entendres work on 3+ levels:
\`\`\`
"I'm board of basic rap, so I'm jumping ship"
- Bored (tired of)
- Board (plank of wood)
- Jumping ship (leaving)
- Nautical theme continues
\`\`\`

## Famous Examples

**Jay-Z:**
"I'm not a businessman, I'm a business, man"
- Businessman (entrepreneur)
- Business, man (I AM the business)

## Practice Method

1. List words with homophones
2. Create phrases using both meanings
3. Build bars around them`,
    practicePrompt: "Write 8 bars with at least 4 double entendres",
    xpReward: 300,
    currencyReward: 150,
    unlockLevel: 10,
    isPremium: true,
  },
  {
    title: "Name Flips & References",
    description: "Manipulate names and pop culture for wordplay",
    category: "wordplay",
    difficulty: "advanced",
    order: 15,
    content: `# Name Flips & References

Using celebrity names, brands, and pop culture for clever wordplay.

## Name Flipping

Transform names into phrases or vice versa:

### Celebrity Names
\`\`\`
"I'm Curry with the shot, Stephen my aim"
"Like Jordan, I'm flying through the air"
"Elon my ambitions, reaching for Mars"
\`\`\`

### Brand Flips
\`\`\`
"I got that Gucci flow, so expensive"
"Nike'd up my game, just do it"
"Mercedes Benz-ing through these bars"
\`\`\`

## Pop Culture References

Connect to movies, shows, history:

### Movies
\`\`\`
"Avengers assembled, I'm collecting infinity stones"
"Matrix-dodging bullets, Neo with the flow"
\`\`\`

### Historical Figures
\`\`\`
"Einstein with the theory, I'm relatively smart"
"Napoleon complex, I conquer every bar"
\`\`\`

## Techniques

### 1. Sound-Alike Names
\`\`\`
"Kanye stop me now" (Can't, Kanye)
"Drake-ing in the success" (Basking, Drake)
\`\`\`

### 2. Contextual References
\`\`\`
"Building empires like Caesar, veni vidi vici"
"Tesla coils around my flow, electric delivery"
\`\`\`

### 3. Multiple References
\`\`\`
"I'm Bezos rich, Amazon-ing competition
Gates keeping, Windows to your soul's mission"
\`\`\`

## Pro Tips

- Stay current with references
- Know your audience
- Don't force references
- Layer multiple meanings`,
    practicePrompt: "Write 8 bars incorporating 5+ name flips or pop culture references",
    xpReward: 250,
    currencyReward: 125,
    unlockLevel: 14,
    isPremium: true,
  },
  {
    title: "Alliteration & Assonance",
    description: "Use repeated sounds for powerful delivery",
    category: "wordplay",
    difficulty: "intermediate",
    order: 16,
    content: `# Alliteration & Assonance

Repetition of sounds creates memorable, punchy bars.

## Alliteration

Repeating CONSONANT sounds at the beginning of words:

\`\`\`
"Big bad bars breaking barriers"
"Dropping dope devastating devastation"
"Massive mic mastery makes millions"
\`\`\`

## Assonance

Repeating VOWEL sounds within words:

\`\`\`
"I'm mean and extreme, my team's supreme"
 (ee sound repeated)

"Flow so cold, I'm bold and gold"
 (o sound repeated)
\`\`\`

## Combining Both

\`\`\`
"Peter Piper picked a peck" (alliteration: P)
"I'm mean, keen, and clean with my scheme" (assonance: ee, alliteration: clean/keen)
\`\`\`

## Strategic Use

### For Emphasis
\`\`\`
"Battle-tested, bar-bending beast"
\`\`\`

### For Flow
\`\`\`
"Flowing freely, feeling fine, fighting time"
\`\`\`

### For Memorability
\`\`\`
"Lyrics like lightning, striking twice"
\`\`\`

## Practice Method

1. Pick a letter (e.g., "S")
2. List 20 words starting with it
3. Build a bar using 4-5 of them
4. Ensure it makes sense!

## Warning

Don't overdo it - use strategically for impact, not every line.`,
    practicePrompt: "Write 8 bars using alliteration in 4 lines and assonance in 4 lines",
    xpReward: 200,
    currencyReward: 100,
    unlockLevel: 9,
    isPremium: false,
  },

  {
    title: "Direct Attacks",
    description: "Craft effective battle rap disses",
    category: "battle_tactics",
    difficulty: "intermediate",
    order: 17,
    content: `# Direct Attacks

Battle rap's foundation - attacking your opponent with precision and creativity.

## Types of Attacks

### Personal Attacks
- Appearance
- Skills/Lack thereof
- Past failures
- Character flaws

### Skill-Based Attacks
\`\`\`
"Your rhymes are weak, your flow is trash
My bars hit hard like a linebacker clash"
\`\`\`

### Comparison Attacks
\`\`\`
"You're a bicycle, I'm a Benz
You got training wheels, I set trends"
\`\`\`

## Effective Attack Formula

1. **Setup**: Introduce the angle
2. **Punchline**: Deliver the blow
3. **Emphasis**: Drive it home

### Example
\`\`\`
Setup: "They call you a rapper?"
Punchline: "More like a wrapper - empty inside"
Emphasis: "Gift-wrapped garbage, I'mma put you in the trash"
\`\`\`

## Wordplay in Attacks

Make disses clever, not just mean:

**Weak:** "You're trash"
**Strong:** "You're garbage with a recycle symbol - used up and disposable"

## Angle Creation

Find unique angles:
- Career trajectory
- Style weaknesses
- Contradictions
- Failed predictions

## Rules

1. **Be creative**: Avoid basic insults
2. **Be specific**: Personal attacks land harder
3. **Be clever**: Wordplay > simplicity
4. **Be confident**: Delivery matters

## Remember

Battle rap is competitive art - bring creativity, not just hate.`,
    practicePrompt: "Write 8 bars of direct battle rap attacks against a fictional opponent",
    xpReward: 200,
    currencyReward: 100,
    unlockLevel: 8,
    isPremium: false,
  },
  {
    title: "Rebuttals & Defense",
    description: "Counter opponent attacks and defend yourself",
    category: "battle_tactics",
    difficulty: "advanced",
    order: 18,
    content: `# Rebuttals & Defense

The best offense is a good defense - flipping attacks back on opponents.

## Rebuttal Techniques

### 1. The Flip
Turn their attack into your strength:

**Opponent:** "You're short"
**Rebuttal:** "I'm short? Napoleon was short too, conquered continents while you conquered nothing"

### 2. The Agree & Amplify
Accept the premise, make it positive:

**Opponent:** "You're crazy"
**Rebuttal:** "Yeah I'm crazy - crazy talented, crazy successful, you're just crazy jealous"

### 3. The Counter
Attack back harder:

**Opponent:** "Your flow is weak"
**Rebuttal:** "My flow is weak? Your career's on life support, I'm pulling the plug"

## Pre-Emptive Defense

Address potential attacks before they come:

\`\`\`
"You gonna say I'm new to this game?
At least I'm new, you're old and you stayed the same"
\`\`\`

## Breakdown Rebuttals

Systematically destroy their logic:

\`\`\`
"You said I can't rap? Let me break that down:
First, I'm here competing, you're barely around
Second, crowd's reacting to me, sleeping on you
Third, even your crew's like 'he's better than you'"
\`\`\`

## Timing

- **Immediate**: In real-time battles
- **Next Round**: Prepared responses
- **Pre-emptive**: Cut them off

## Building Shields

1. Acknowledge your weaknesses first
2. Frame them as strengths
3. Have 3 angles ready for each vulnerability

## Practice

List 10 potential attacks against you, write rebuttals for each.`,
    practicePrompt: "Write 8 bars defending against and countering 3 different attack angles",
    xpReward: 300,
    currencyReward: 150,
    unlockLevel: 13,
    isPremium: true,
  },
  {
    title: "Crowd Control",
    description: "Engage and manipulate audience reactions",
    category: "battle_tactics",
    difficulty: "advanced",
    order: 19,
    content: `# Crowd Control

Battle rap is performance - control the crowd, control the battle.

## Reaction Triggers

### 1. Punchline Delivery
Pause after punchlines for crowd reaction:
\`\`\`
"I'm a lyrical surgeon, operating on beats...
[PAUSE]
Your career's dying, I'm pulling the sheets"
[LET CROWD REACT]
\`\`\`

### 2. Call & Response
\`\`\`
"When I say 'hip' you say 'hop' - HIP!"
[Crowd: HOP]
"One more time - HIP!"
[Crowd: HOP]
\`\`\`

### 3. Signature Moves
Develop catchphrases or gestures:
- "You already know!"
- "Talk to 'em!"
- Hand gestures on punchlines

## Energy Management

### Build & Release
\`\`\`
Start calm → Build intensity → EXPLOSIVE PUNCHLINE → Reset
\`\`\`

### Volume Control
- Whisper for tension
- Shout for emphasis
- Normal for flow

## Crowd Reading

Watch for:
- Head nods (they're with you)
- Phone recording (strong moment)
- Silence (either building or lost them)
- Groans (opponent's in trouble)

## Silence Usage

Strategic silence creates anticipation:
\`\`\`
"I'm about to end this man's whole career...
[3 SECOND PAUSE]
Actually, what career?"
\`\`\`

## Comeback Techniques

If crowd's against you:
1. Acknowledge it directly
2. Make it part of your angle
3. Win them back gradually
4. One big punchline can flip energy

## Practice

Record yourself, watch reactions, adjust delivery.`,
    practicePrompt: "Write 8 bars designed to maximize crowd reaction with pauses and emphasis",
    xpReward: 300,
    currencyReward: 150,
    unlockLevel: 16,
    isPremium: true,
  },
  {
    title: "Three-Round Strategy",
    description: "Plan your battle approach across multiple rounds",
    category: "battle_tactics",
    difficulty: "advanced",
    order: 20,
    content: `# Three-Round Battle Strategy

Winning battles requires strategic planning across all rounds.

## Classic Structure

### Round 1: Establishment
- Introduce yourself
- Set the tone
- Light jabs & setup
- Show your style
- Build credibility

\`\`\`
"First round I'm letting you know who I am
Established vet, you're just a flash in the pan"
\`\`\`

### Round 2: Destruction
- Heavy attacks
- Breakdown opponent
- Best material
- Maximum aggression
- Win the round decisively

\`\`\`
"Second round I'm going for the throat
Every bar's a bullet, every line's a quote"
\`\`\`

### Round 3: Burial
- Finish strong
- Address their counter-attacks
- Victory lap
- Memorable closer
- Leave lasting impression

\`\`\`
"Third round I'm putting nails in your coffin
Your career's deceased, no coming back often"
\`\`\`

## Alternative Strategies

### The Escalation
Each round progressively harder

### The Anchor
Strong round 1 & 3, coast round 2

### The Surprise
Weak round 1, destroy rounds 2 & 3

### The Consistency
Three equally strong rounds

## Adaptation

### If You're Winning
- Maintain energy
- Don't get cocky
- Close strong

### If You're Losing
- Change tactics round 2
- Address their strong points
- Come back desperate and hungry

## Round Planning

Prepare material for:
- 3 different opponent types
- Rebuttals for common angles
- Freestyle contingencies
- Backup bars

## Closer Techniques

End each round memorably:
- Big punchline
- Quotable bar
- Crowd interaction
- Confident exit`,
    practicePrompt: "Plan and write an 8-bar strategy outlining your approach for each round",
    xpReward: 350,
    currencyReward: 175,
    unlockLevel: 18,
    isPremium: true,
  },

  {
    title: "Literary Devices",
    description: "Advanced literary techniques for sophisticated bars",
    category: "advanced",
    difficulty: "advanced",
    order: 21,
    content: `# Advanced Literary Devices

Elevate your lyricism with sophisticated literary techniques.

## Personification

Giving human qualities to non-human things:
\`\`\`
"The beat cries out for my flow
My pen bleeds truth on paper below"
\`\`\`

## Hyperbole

Extreme exaggeration for effect:
\`\`\`
"My bars so hot, the sun asked for sunscreen
I'm so fly, gravity filed a restraining order"
\`\`\`

## Irony

Saying opposite of what you mean:
\`\`\`
"Oh you're a 'legend'? Never heard of you
You're 'underground'? Six feet under, it's true"
\`\`\`

## Oxymoron

Contradictory terms together:
\`\`\`
"Deafening silence when you spit
Bittersweet victory, you admit defeat"
\`\`\`

## Imagery

Paint vivid pictures:
\`\`\`
"Crimson sunset bleeding on horizon's edge
My dreams take flight from ambition's ledge"
\`\`\`

## Symbolism

Objects representing bigger ideas:
\`\`\`
"My pen's a sword, my pad's a battlefield
Every bar's a soldier, never gonna yield"
\`\`\`

## Synesthesia

Mixing senses:
\`\`\`
"I taste success, it sounds like trumpets
My vision's colorful like a thousand sonnets"
\`\`\`

## Combining Devices

Layer multiple techniques:
\`\`\`
"My flow's a hurricane (metaphor + personification)
Destroying everything (hyperbole)
Leaving sweet destruction (oxymoron) 
In rainbow aftermath" (imagery)
\`\`\``,
    practicePrompt: "Write 8 bars using at least 5 different literary devices",
    xpReward: 350,
    currencyReward: 175,
    unlockLevel: 17,
    isPremium: true,
  },
  {
    title: "Conceptual Storytelling",
    description: "Create multi-layered narrative verses",
    category: "advanced",
    difficulty: "expert",
    order: 22,
    content: `# Conceptual Storytelling

Master-level narrative construction with multiple layers of meaning.

## What Is It?

Stories that work on multiple levels simultaneously:
- Surface story (what's literally happening)
- Metaphorical layer (what it represents)
- Personal meaning (autobiographical)
- Universal theme (relates to all)

## Example Structure

### Surface: Climbing a mountain
### Metaphor: Career struggle
### Personal: Your journey in rap
### Universal: Overcoming obstacles

\`\`\`
"I started at the base, looking up at peaks (surface)
Every step was hard, determination speaks (metaphor)
They said I couldn't make it, dreams were too steep (personal)
But everybody's mountain starts beneath their feet" (universal)
\`\`\`

## Advanced Techniques

### Time Shifting
Jump between past, present, future:
\`\`\`
"I remember when I started (past)
Now I'm at the top (present)
Tomorrow's even brighter (future)"
\`\`\`

### Perspective Changes
Switch viewpoints:
\`\`\`
Verse 1: First person (I)
Verse 2: Second person (You)
Verse 3: Third person (He/She/They)
\`\`\`

### Symbolism Throughout
Use consistent symbols:
- Light = Hope
- Darkness = Struggle  
- Water = Emotion
- Fire = Passion

## Classic Concepts

- **The Journey**: Quest narrative
- **The Struggle**: Overcoming adversity
- **The Transformation**: Change over time
- **The Reflection**: Looking back
- **The Prophecy**: Future prediction

## Execution

1. Choose your concept
2. Outline all layers
3. Write each layer separately
4. Weave them together
5. Ensure cohesion

## Examples From Masters

- Kendrick: "DUCKWORTH" (multi-perspective story)
- J. Cole: "Love Yourz" (perspective on success)
- Nas: "I Gave You Power" (gun's perspective)`,
    practicePrompt: "Write a 16-bar conceptual story with at least 3 layers of meaning",
    xpReward: 400,
    currencyReward: 200,
    unlockLevel: 20,
    isPremium: true,
  },
  {
    title: "Voice & Character Development",
    description: "Create and maintain a unique artistic voice",
    category: "advanced",
    difficulty: "expert",
    order: 23,
    content: `# Voice & Character Development

Develop your unique artistic identity and maintain it consistently.

## Finding Your Voice

### Authenticity
What makes YOU unique?
- Life experiences
- Perspective
- Values
- Story
- Struggles

### Style Elements
- Word choice (vocabulary)
- Flow patterns (signature rhythms)
- Topics (what you talk about)
- Delivery (how you sound)
- Energy (aggressive, chill, melodic)

## Character Archetypes

### The Storyteller
- Narrative-focused
- Detailed imagery
- Personal experiences
- Example: J. Cole

### The Lyricist
- Technical wordplay
- Complex rhymes
- Metaphors
- Example: MF DOOM

### The Battle Rapper
- Aggressive
- Competitive
- Sharp punchlines
- Example: Eminem

### The Poet
- Emotional
- Philosophical
- Introspective
- Example: Kendrick Lamar

### The Entertainer
- High energy
- Catchy hooks
- Party vibes
- Example: Lil Wayne

## Consistency

Maintain your voice across:
- Different beats
- Various topics
- Multiple projects
- Live performances

## Evolution

Voice should:
- Start authentic
- Develop naturally
- Grow with experience
- Stay recognizable

## Building Your Voice

1. **Study yourself**: What comes naturally?
2. **Identify patterns**: What do you always do?
3. **Amplify strengths**: Double down on what works
4. **Minimize weaknesses**: Improve or avoid
5. **Signature elements**: Create recognizable features

## Exercises

- Write 5 verses on same beat, different emotions
- Record 10 different deliveries, find your favorite
- Analyze what makes your favorite rappers unique
- Define your voice in 3 words

## Avoiding Imitation

Learn from others, don't copy:
- Study technique, not style
- Borrow structure, not content
- Understand why, not what`,
    practicePrompt: "Write an 8-bar verse that clearly demonstrates your unique artistic voice",
    xpReward: 400,
    currencyReward: 200,
    unlockLevel: 22,
    isPremium: true,
  },
  {
    title: "Production & Beat Selection",
    description: "Choose beats that enhance your style and message",
    category: "advanced",
    difficulty: "expert",
    order: 24,
    content: `# Production & Beat Selection

The beat is 50% of your song - choosing the right one is crucial.

## Beat Analysis

### Tempo (BPM)
- **Slow (60-90 BPM)**: Storytelling, emotional
- **Medium (90-120 BPM)**: Versatile, standard rap
- **Fast (120-140 BPM)**: High energy, aggressive
- **Double-time (140+)**: Technical, rapid-fire

### Mood
- Dark/Menacing: Battle rap, aggressive
- Uplifting: Inspirational, success stories
- Melancholic: Emotional, reflective
- Energetic: Party, hype

### Instrumentation
- **Minimal**: Your voice shines (poetry, technical)
- **Layered**: Rich sound (melodic, mainstream)
- **Boom Bap**: Traditional hip-hop (90s style)
- **Trap**: Modern, 808s (current trends)

## Matching Beat to Message

### Storytelling
Choose beats with:
- Clear structure
- Emotional instrumentation
- Moderate tempo
- Space for vocals

### Battle Rap
Choose beats with:
- Hard-hitting drums
- Aggressive energy
- Minimal melody
- Strong presence

### Motivational
Choose beats with:
- Uplifting melody
- Building progression
- Epic feel
- Triumphant sound

## Testing Compatibility

1. **Freestyle**: Can you flow naturally?
2. **Write**: Do lyrics come easily?
3. **Perform**: Can you deliver with energy?
4. **Listen**: Does it move you emotionally?

## Creating Contrast

Use beat selection strategically:
- Album opener: High energy
- Deep cuts: Experimental
- Closer: Emotional/reflective

## Working With Producers

- Communicate your vision
- Reference similar beats
- Be open to suggestions
- Trust the process

## Beat Structure Understanding

### Standard Structure
- Intro
- Verse
- Hook
- Verse
- Hook
- Bridge
- Hook
- Outro

### Your Approach
Know when to:
- Start rapping (after intro)
- Take breaks (during hooks)
- Build intensity (verse progression)
- End strong (outro approach)

## Practice

Download 10 different beats, write to each, compare results.`,
    practicePrompt: "Select a beat and write 8 bars explaining why you chose it",
    xpReward: 400,
    currencyReward: 200,
    unlockLevel: 25,
    isPremium: true,
  },
];

export async function seedTrainingLessons() {
  console.log('🌱 Seeding training lessons...');

  try {
    for (const lesson of lessonData) {
      await db.insert(trainingLessons).values(lesson).onConflictDoNothing();
      console.log(`✅ Seeded lesson: ${lesson.title}`);
    }

    console.log('🎉 Successfully seeded all 24 training lessons!');
  } catch (error) {
    console.error('❌ Error seeding training lessons:', error);
    throw error;
  }
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedTrainingLessons()
    .then(() => {
      console.log('✅ Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed script failed:', error);
      process.exit(1);
    });
}
