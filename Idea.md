# Runes of the Deep: Dwarven Cave Chronicles

## Game Overview

Runes of the Deep: Dwarven Cave Chronicles is a virtual reality roguelike dungeon crawler game set in a vast, procedurally generated underground dwarven stronghold composed of interconnected chambers and rooms. The players are tasked with exploring these confined spaces, fighting off hostile creatures, and uncovering ancient dwarven artifacts to upgrade their tools and weapons in order to delve deeper into the labyrinth. Designed for play within limited physical spaces, the game will employ a simple grid-based teleportation mechanic to provide an immersive experience that does not require large-scale movement from the player.

## Genre

Roguelike VR Dungeon Crawler Platform: WebXR

## I. Game World & Environment 

The game takes place in an expansive dwarven cave network filled with forgotten halls, abandoned mines, and magical chambers. Each level is procedurally generated to ensure a unique experience every time a player starts a new run. As players progress through the levels, they'll encounter various biomes such as subterranean forests or lava-filled caverns.

## II. Story & Lore

Deep within the Ironforge Mountains lies an ancient dwarven stronghold, hidden for centuries from the prying eyes of outsiders. Players assume the role of a skilled and ambitious dwarf who learns about the legend of this forgotten citadel from a mysterious old tome. The tome speaks of powerful artifacts and untold riches concealed within its walls, waiting to be discovered by a worthy adventurer.

The player's character, driven by a desire for glory and fortune, ventures into the depths of the Ironforge Mountains in search of the lost stronghold. As they traverse through winding tunnels and caverns, they begin to unravel the history behind this once-great dwarven citadel. It was a marvel of engineering and craftsmanship designed to safeguard vital relics that held immense power – enough to revitalize their dying civilization aboveground.

However, long ago, this sanctuary fell prey to a devastating event known as "The Shattering." Greed and ambition led some amongst the dwarves' ranks to misuse these artifacts' powers for personal gain, resulting in cataclysmic consequences. In an instant, much of their knowledge was lost as sections of the stronghold crumbled into darkness.

Over time, hostile creatures began to creep into these now-forsaken halls – whether drawn by lingering magic or merely seeking refuge in its shadows. Goblins, trolls, undead monstrosities, and rival dwarven factions now infest these once-hallowed chambers.

As players uncover more about what transpired during "The Shattering" and delve deeper into the stronghold's corridors brimming with danger at every turn, they'll also come across whispers about an even greater secret lying dormant within its deepest recesses – one that could have grave ramifications not only for their own fate but also for the entire dwarven race.

Piecing together clues from scattered documents and surviving murals on dungeon walls while encountering disillusioned dwarves still dwelling underground adds depth to both story and lore elements. It is up to players whether they choose to use discovered artifacts responsibly or follow down the ill-fated footsteps of those who brought about "The Shattering."

## III. Gameplay 

### 1. Mechanics

1. Procedurally Generated Levels - Each playthrough will present unique challenges with randomly generated dungeons offering varying levels of difficulty.
1. Combat System - Players must engage in close-quarters combat using hammers or axes.
1. ~Mining System - Players need to upgrade or buy tools to mine harder rocks as they progress to get better tools and weapons.~
1. Upgradable Tools & Weapons - Throughout gameplay, players will gather resources for upgrading equipment such as mining tools for resource gathering and weapons for combat effectiveness.
1. Artifact Collection - Discover hidden magical artifacts imbued with special powers that offer advantages during gameplay.
1. Traps and Puzzles - Navigate through environmental hazards and solve puzzles scattered throughout dungeons.
1. Permadeath - Upon character death, players must start anew but can retain some upgrades acquired in previous runs.
1. Game progress will be saved between sessions.
1. The player will have a map that slowly encovers all the dungeons visited.

### 2. Controls
1. Teleport - Players can move using teleportation on a grid. You can only teleport 1 or 2 tiles round you. To exit the room the player must be on the tile adjacent to the door.
2. Rotate - Snap to rotate
3. Move right controller with sword or pick axe
4. Block attacks with shield in left controller
5. Stats and menu is on inside of shield

### 3. Turns
Roguelikes have a common similarity: They are turn based. In normal games this mechanic can be implemented as the the player can be stopped from moving after a certain points are spend each turn. In VR this is near to impossible. We could just disable teleportation, but it will be really odd if you can't use you sword or shield while it's not your turn.

To get a slight feel of a turnbased game the turns are only applied to the enemies and the turns will just loop. This means that every fixed number of seconds, maybe 5 at the start (this will probably change when refining the gameplay), the enemies have a certain points to spend. For example, a certain enemy has 2 move points and 1 attack point. The enemy will spend 2 seconds moving and 1 to attack. The enemy will wait until the next turn and might spend them again. The exact durations might vary.

Other things that might work over turns are things like things being set on fire or things being poisoned. If you're on fire, you'll take X amount of damage every turn. For example 1 heart every 5 seconds for 3 turns, unless you find water.

Traps could follow a similar pattern, like being activated for 2 steps and off by 3. While looping every 5 seconds. 

### 4. Fighting
Fighting is done with a sword. There are different swords, mostly for aesthetic. 

Additional properties you can add to weapons, shields, and tools found in the dungeons:

- Elemental Affinity: Weapons or shields could have an elemental attribute such as fire, ice, or lightning. These attributes may deal bonus damage against certain enemies, grant status effects like burning/freezing/shocking opponents, or provide resistance against specific elemental attacks.

- Durability: Items may have limited durability that degrades with usage. As the item wears out, its stats decrease until it eventually breaks and becomes unusable. Players will need to repair or replace damaged items.

- Weight: Each item can have a weight value that affects the player's overall carry capacity and mobility. Heavier items provide better defense or damage but reduce agility or movement speed.

- Enchantments: Certain items could be enchanted with magical properties like increased critical hit chance, health regeneration, or status effect immunities (e.g., poison resistance).

- Set Bonuses: Collecting multiple pieces of equipment from a particular set (e.g., a matching sword and shield) can grant additional stat bonuses when used together.

- Skill Modifiers: Equipment may modify specific skills by granting access to new abilities (such as powerful sword techniques), increasing existing skill potency (like stronger shield bashes), or reducing ability cooldowns.

- Rarity Levels: Weapons and shields could have varying rarity levels (common, rare, epic, legendary) which influence their overall stat potential and appearance.

- Upgrade Slots: Some items may offer upgrade slots for players to insert gems or other components that enhance the item's properties further.

- Socketed Runes/Magical Stones: Tools found in dungeons might contain socketed runes/magical stones that give additional effects when equipped together with weapons/shields depending on the combination used.

- Unique Abilities: Certain legendary weapons or artifacts could come with unique abilities not found elsewhere in the game - like summoning allies during combat, casting powerful spells/effects after striking an enemy a certain number of times in a row etc.

## IV. Characters

1. Main Character (Player) - A determined dwarf adventurer seeking glory and treasure within treacherous depths.
2. Enemies - Various adversaries dwell within caves including goblins, trolls, undead creatures or rival dwarf factions.
3. NPCs - Interact with other dwarf miners or traders within safe zones who may offer quests or trade goods/services for resources.

## V. Visual & Audio Design

1. Visual Style: Pixel-art combined with a darker tone focusing on underground environments illuminated by torchlight or luminous flora/fauna. 
2. Audio Design: Atmospheric sound design featuring echoing footsteps/clanking armor; dynamic music adapting based on danger level; distinct sound cues for abilities/enemy encounters; 

## VI. Monetization

Runes of the Deep: Dwarven Cave Chronicles will free to play with Zesty ads. But may include optional paid expansions featuring new storylines/dungeons/enemies/tools/weapons at later stages post-release. Probably using HeyVR coins.

## VII. Development Schedule & Milestones

Estimated development time is 8-28 weeks divided into following phases:

1. Pre-production (2-4 weeks): Concept art creation; core gameplay mechanics; designing procedural generation algorithms; testing locomotion/combat systems; lore/story development. 
2. Production (4-20 weeks): Implementing level assets/enemy AI/NPCs/puzzles/traps; balancing economy/upgrades/difficulty curve/multiplayer components if any; rigorous testing/debugging/vr sickness prevention measures; audio design/voice acting integration. 
3. Post-production (2-4 weeks): Playtesting/feedback collection/polishing/tweaking all aspects based on feedback; final QA pass/bug fixing/performance optimization/certification process/marketing campaign/preparing launch materials.

## VIII.Target Demographic

Primarily targeting VR enthusiasts aged 15+ interested in immersive dungeon crawlers exploring procedurally generated worlds filled with adventure/combat/resource management.

With this blueprint outlined above, "Runes of the Deep: Dwarven Cave Chronicles" aims to provide an engaging virtual reality experience that keeps players immersed in its ever-changing depths while fostering intense exploration-based gameplay full of memorable moments and endless replayability potential.

## IX. Technical Implementation:

### Level Generation 
Maze generation combined with random rooms.

### Game Engine - Wonderland Engine
Runes of the Deep: Dwarven Cave Chronicles will be developed using the Wonderland Engine as its core game engine platform. The Wonderland Engine is a cutting-edge WebXR-focused engine optimized for creating highly efficient virtual reality experiences with minimal performance overhead.
Utilizing Wonderland Engine allows us to create an immersive VR experience tailored for confined spaces without sacrificing visual fidelity or gameplay complexity. Additionally, leveraging WebXR technology makes our game more accessible across different VR platforms such as Oculus Rift, HTC Vive, and Valve Index without requiring extensive adaptations for each device.

Together, these technical choices ensure that Runes of the Deep: Dwarven Cave Chronicles delivers an innovative gameplay experience in procedurally generated environments while remaining highly optimized for diverse virtual reality hardware setups within confined playing spaces.

### Enemies


### Loot

## X. Details on Rooms and Props 

There rooms and pros are just for brainstorming and are probably going to change or they might just not work with the roomscale VR in mind.

### Types of Rooms

#### Special Rooms
These special rooms may occur at the dead ends in the maze and might provide extra props, ores or gems.
- The Abandoned Forge: A large chamber with ancient, rusted anvils and furnaces, once used by skilled dwarven blacksmiths to craft weapons and armor.
- The Hall of Heroes: A grand corridor adorned with statues of legendary dwarven heroes, each standing on a pedestal with an inscription detailing their great feats.
- The Mine Shaft Chamber: A cavernous room where players will encounter multiple branching tunnels leading to different areas of the stronghold, some more treacherous than others.
- The Library Archives: A once-impressive library filled with crumbling bookshelves and scattered scrolls, offering glimpses into the dwarves' extensive knowledge.
- The Crystal Cavern: A mesmerizing room filled with glowing crystals and rare gemstones protruding from the walls, providing a source of magical energy.
- The Throne Room: An opulent chamber containing a magnificent throne crafted from precious metals, where the ruler of the stronghold would have held court.
- The Barracks: A functional room with rows of abandoned bunk beds and weapon racks that once housed the stronghold's military force.
- The Great Dining Hall: An enormous communal space featuring long tables and benches, now eerily empty and covered in a layer of dust.
- The Alchemy Lab: A small yet fascinating chamber littered with beakers, flasks, and other equipment used for creating powerful potions or conducting magical experiments.
- The Collapsed Chamber: An unstable area marked by rubble and debris where players must navigate carefully to avoid triggering any further cave-ins or traps left behind by desperate dwarves during "The Shattering."
 
#### Common Rooms
There rooms can occur often.
- The Trap Room: A deceptively simple chamber filled with hidden pressure plates, tripwires, and other dangerous mechanisms designed to catch intruders off-guard.
- The Shifting Tunnels: A series of branching pathways with walls made from a mix of rocks and ores. Players can mine for valuable resources while fending off lurking mobs, but the layout changes periodically as tunnels cave in or new ones open.
- The Flooded Cavern: An underground chamber partially submerged in water, where players must navigate slippery platforms and avoid deep pools teeming with aquatic creatures or hazards.
- The Glistening Vein Chamber: A spacious room with rich deposits of sparkling gems embedded within the walls, attracting both miners and monster guardians. Players must navigate carefully between clusters to avoid dislodging precious stones and triggering an avalanche.
- The Steam Vents Room: A heated chamber filled with various metal-rich ores, where players mine close to natural steam vents emitting scalding bursts at irregular intervals – forcing them to be cautious while extracting resources and battling aggressive creatures drawn to the warmth.
- The Terraced Mining Pits: A multi-leveled area with platforms connected by ladders and ropes, allowing players to climb and descend as they gather ore deposits scattered across each level – all while fending off aerial and ground-based foes taking advantage of the vertical terrain.
- The Slumbering Golem Chamber: A cavernous space populated by powerful rock golems guarding precious ore veins, who awaken when disturbed by mining activities – challenging players to balance resource gathering with managing unexpected combat encounters.
- The Fungi Forest Room: An underground grove overgrown with bioluminescent mushrooms that cast an eerie glow over valuable ores hidden beneath their roots. Players must contend with fungal creatures seeking to protect their territory as they harvest both minerals and potentially useful plants.
- The Echoing Chasm: A deep pit-like chamber echoing with strange noises produced by roaming monsters and dripping water from above. Ore deposits are nestled on narrow ledges along its walls, encouraging careful exploration while combating adversaries eager to knock intruders into the abyss below.
- The Bridge Spanning Chambers: A series of interconnected rooms separated by ancient stone bridges crumbling underfoot, requiring precise movement to access the valuable ores located within each pocket – all while dodging enemy attacks threatening to send unwary adventurers plummeting downward.
- The Elemental Nexus Room: An underground chamber infused with elemental energy that imbues nearby ores with magical properties – attracting powerful elemental creatures keen on protecting these prized resources from exploitation.
- The Whispers' Web Gallery: A dark corridor lined with spider web-covered alcoves containing coveted minerals interspersed among delicate strands capable of ensnaring unwitting adventurers - forcing them to tread lightly while dispatching arachnid foes stalking from the shadows.

### Types of Props
- Abandoned mining equipment: Pickaxes, shovels, and mining carts
- Ancient dwarven weapons: Battle-axes, hammers, and shields with intricate engravings
- Crystals and gemstones: Precious minerals that emit a faint glow or have magical properties
- Torn pages from old tomes: Fragments containing hints about the stronghold's history or maps of its layout
- Broken statues: Once-majestic representations of dwarven heroes or leaders now in ruins
- Unlit torches and lanterns: Devices for lighting the way in darker sections of the dungeon/mine
- Dwarven inscriptions and murals: Detailed artwork on walls depicting important events or individuals from the citadel's past
- Gilded treasure chests: Ornate containers holding valuable items or powerful artifacts
- Remnants of machinery or contraptions: Puzzle pieces for unlocking secret passages or activating hidden mechanisms within the stronghold
- Bones and skulls of fallen creatures or dwarves: Evidence of previous battles fought in the depths of Ironforge Mountains
- Ores; Can be used to upgrade weapons, tools and shields.

- Broken dwarven statues: Symbolize the fallen glory of the stronghold.
- Rusty weapons and shields: Tell stories of past battles and conflict.
- Abandoned mining equipment: Pickaxes, carts, and lanterns hint at dwarven industry.
- Cracked pottery and dishware: Suggest daily life before "The Shattering."
- Torn banners with faded insignias: Represent lost alliances or rival factions within the stronghold.
- Withered plants and fungi: Indicate deteriorating conditions in once-lush caverns.
- Candles, torches, and sconces: Offer light sources for navigation in dimly lit areas (some might still be burning).
- Piles of bones or skeletal remains: Provide an eerie reminder of those who perished during "The Shattering" or since then by hostile creatures.
- Stacks of old scrolls, books, or blueprin ts: Allude to lost knowledge about artifact usage.
- Dusty barrels, crates, and chests: Contain hidden supplies or loot for players to discover while exploring.
- Glowing gemstones embedded in walls or veins of ore deposits: Illuminate magical powers still present after "The Shattering."
- Strange runes etched into surfaces (floors, walls, pillars): Signify enchantments or protective measures set up by surviving dwarves.
- Mechanisms with intricate gears: Found around lock systems or as part of a puzzle that players need to solve to access the treasure or advance in the dungeon.
- Faint scratch marks on floors/walls: Indicate previous trap activations and alert players to potential danger ahead.
- Mural depicting a riddle or clue: Offers a hint about disarming a trap or unlocking a chamber containing valuable loot.
- Glistening piles of gold coins and gems: Serve as rewards for overcoming challenges while exploring the dungeon.
- Ornate weapon racks and armor stands: Display precious equipment that adventurers may covet for their own use.
- Magic-infused items (potions, scrolls, wands): Offer unique abilities or powers that could aid players throughout their quest.

### Technical
Every room gets a seed assigned when it is generated. Everything in the room will be randomly placed using that seed. This (should) mean that it is safe to delete every when the room is exited, because it will generate exactly the same as before because it is using the same seed. Also, when saving the game, only the seed needs to be saved. The only problem here might arise when the game is updated, and changed, when the player reloads the game.


## XI. Dungeon and Story
The journey through the dungeons should follow the Kishōtenketsu structure. Here's a first idea on how that might be implemented.

1. Introduction (Ki):

The entrance area for the dungeon sets the scene and introduces the player to the environment. This area can include an ancient entrance, lore-inscribed walls, or even a relic room that provides hints about the legend of this forgotten citadel. In this section, players should feel intrigued by the story and have a clear understanding of their goal: seeking powerful artifacts and untold riches hidden within.

2. Development (Shō):

As players progress through the maze-dungeon, gradually introduce more complex layouts, traps, puzzles, and enemy encounters. This section is about exploration and discovery while piecing together clues about this once-great dwarven citadel's history. Include areas with remnants of engineering marvels, workshops with abandoned tools used in crafting relics, or rooms containing murals showcasing their past glory.

3. Twist (Ten):

Introduce a turning point or twist in the maze-dungeon by revealing what led to its downfall - "The Shattering." Players could stumble upon a central chamber where they witness evidence of misuse of artifacts' powers causing destruction in certain sections. This section may also showcase new types of enemies – goblins, trolls, undead monstrosities – indicating how once-hallowed chambers now stand infested due to greed-driven catastrophe.

4. Conclusion (Ketsu):

Design the final part of the maze-dungeon with increasing challenges leading to a climactic confrontation or discovery at its deepest recesses – revealing an even greater secret tied to both player character's fate and the entire dwarven race. Integrate choices that force players to decide between using discovered artifacts responsibly or risking another "Shattering" event for personal gain.

By following these guidelines and aligning your maze-dungeon progression with Kishōtenketsu storytelling structure, we create an engaging gaming experience for players while immersing them in a rich lore-filled world throughout their journey.

### Implementation

One way of getting this to work is to keep track of the distance in 'rooms' how for we are into the dungeon and change the story accordingly. 

## XI. Enemies and Traps

### Enemies

- Cave Rats (Easy+Medium): Small, fast-moving rodents with sharp teeth that scurry around and nip at the player's ankles. They often attack in groups and can be taken out with a well-placed kick or swing of a weapon. These ca be infected.
- Spiders (Easy+Medium): Hide in the corners of at the ceiling and drop down when the player comes close.  These can be poisonous. 
- Goblin Scouts (Easy): Short, green-skinned creatures armed with rusty daggers and slingshots. They prefer to attack from a distance, but will use their daggers when cornered.
- Undead Dwarves (Medium): The reanimated corpses of fallen dwarven warriors, still clad in their tattered armor. They wield rusty weapons and are slow but relentless in their pursuit of the player.
- Troll Brutes (Medium): Larger than goblins, these hulking creatures possess incredible strength and swing large clubs at the player to deal massive damage.
- Ensnaring Fungi (Medium): Strange, bioluminescent fungi that have grown over time due to lingering magic within the stronghold's walls. When approached too closely, they extend tendrils to ensnare the player and slowly drain their life force.
- Bats (Medium+Hard): Large bats (can be venomous) that swoop down from above to attack unsuspecting players. Their presence is often signaled by eerie screeching echoing through the caverns.
- Rival Dwarven Faction Soldiers (Hard): Armed with more advanced weapons than undead dwarves, these enemies have various combat abilities depending on their rank – such as archers raining arrows from afar or warriors charging into melee combat.
- Golem Protectors (Hard): Animated stone constructs built by the dwarves as guardians for their most precious relics prior to "The Shattering." They are nearly impervious to physical attacks but can be weakened through magical means or exploiting specific weak points on their bodies.
- Corrupted Artifacts (Very Hard): These once-magnificent relics have become twisted by malevolent energies unleashed during "The Shattering," which give them various powers such as unleashing devastating magical attacks or summoning powerful minions to fight alongside them.
- The Shattered One (Final Boss - Extremely Hard): A vengeful spirit born from the combined greed and ambition of those who caused "The Shattering." It is an ethereal creature that possesses ancient artifacts, gaining unique abilities from each one it claims and using them against the player in its ultimate bid for power.

Players must defeat each of these enemies by learning their attack patterns and exploiting weaknesses while managing limited resources like health potions or magical items found throughout the dungeon to ultimately uncover secrets locked away within the Ironforge Mountains' depths.

### Traps

- Tripwire (Easy): A barely visible wire stretched across the floor that, when stepped on or touched, triggers a hidden mechanism to release darts or activate a swinging pendulum. Players can avoid it by carefully stepping over the wire or disarming it.

- Pressure Plates (Easy): Subtle depressions in the floor tiles that activate various traps, such as releasing poisonous gas or causing spikes to protrude from the walls. Players can bypass them by finding alternative routes or placing objects on the plates to avoid triggering them directly.

- Pit Traps (Medium): False flooring hiding deep pits filled with sharp spikes, concealed beneath an apparently safe surface. Players must be cautious of these traps and use ranged weapons or magical abilities to test suspicious floors for safety.

- Swinging Pendulums (Medium): Massive blades hanging from the ceiling that swing back and forth across a narrow passageway. Timing is crucial for players to sprint past these traps unscathed.

- Flamethrower Statues (Medium): Stone statues of dwarven warriors with mouths that emit bursts of flame when triggered, often located in tight spaces where dodging is difficult. Players must time their movements carefully to avoid being scorched.

- Sliding Walls (Hard): Walls that suddenly slide closed once triggered, either crushing unwary adventurers between them or separating party members and isolating them from one another. Keen observation of wall markings can help players anticipate and avoid this trap.

- Collapsing Ceilings (Hard): Sections of ceilings rigged with hidden mechanisms to collapse under certain conditions, such as entering a specific room or removing an item from its pedestal. Players must search for structural weaknesses or clues indicating potential danger before proceeding.

- Magical Runes (Hard): Glyphs engraved into floors, walls, or ceilings that trigger powerful spells upon activation – ranging from localized explosions to summoning hostile creatures against players who inadvertently activate them with touch or magical energy proximity detection.

- Acid Pools (Very Hard): Hidden pools of corrosive acid disguised as water sources; adventurers who attempt to quench their thirst become victims instead, suffering severe damage over time until they manage to neutralize it using items like antidote potions found within the stronghold's depths.

- The Guardian's Curse Trap (Final Trap - Extremely Hard): A unique trap located deep within the stronghold near valuable relics; those who get too close are inflicted with a potent curse sapping their strength and magic gradually while buffeting enemies around them with increased power – only lifted by defeating enemies drawn towards cursed players in increasingly difficult waves before reaching vital relics protected by this supernatural failsafe measure meant solely for "The Shattering" preventers caught unprepared during artifact handling events.

# Weapons

There will be a lot of different weapons. The player stars with a random iron weapon. There will be chests scattered around. These chests are of a random level (Small, medium, large) and the further the game progresses the better the stuff in the chests. Chests in the beginning are made from wood, later they will become iron and gold. Weapons found in the chests will have random stats, but these will increase the further in the game the player gets. 


# possible assets

These assets might be usable for the first version of the game:

- https://merchant-shade.itch.io/16x16-mixed-rpg-icons (free)
- https://xenophero.itch.io/rock-sprites (free)
- https://incremental-inc.itch.io/ores-and-rocks-16x16-pixel-sprites ($2)
- https://merchant-shade.itch.io/16x16-puny-characters-plus-sprites ($10)
- https://brullov.itch.io/fire-animation
- 
# Note

The first draft of this design document is created by Rosie and tweaked by hand. Since it mostly generated it probably going to change a lot while developing the game. The document is vastly extended since using a combination of AI and just I. 

