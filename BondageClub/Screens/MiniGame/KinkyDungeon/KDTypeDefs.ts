/** Kinky Dungeon Typedefs*/
type item = {
	/** Name of the item*/
	name: string,
	/** Type of the item*/
	type?: string,
	/** Faction of the applied item */
	faction?: string,
	/** Events associated with the item*/
	//weapon?: KinkyDungeonWeapon, /** Item weapon data, if applicable*/
	//consumable?: any, /** Item consumable data, if applicable*/
	events?: KinkyDungeonEvent[],
	/** Number of consumables in the inventory*/
	quantity?: number,
	//looserestraint?: any, /** Loose restraint data, if applicable*/
	//restraint?: any, /** Which restraint the item is associated with*/
	/** Type of lock, Red, Blue, or Gold (potentially more in future)*/
	lock?: string,
	/** Bool to describe if the item is tethered to the leashing enemy*/
	tetherToLeasher?: boolean,
	/** Bool to describe if the item is tethered to KinkyDungeonJailGuard()*/
	tetherToGuard?: boolean,
	/** Location of the tether*/
	tx?: number,
	/** Location of the tether*/
	ty?: number,
	/** Length of the tether*/
	tetherLength?: number,
	/** Used for Gold locks only, determines which floor the lock will release*/
	lockTimer?: number,
	/** Stores a list of restraint names for the linked item system*/
	dynamicLink?: string[],
	/** Stores linked item locks*/
	oldLock?: string[],
	/** Stores linked item factions*/
	oldFaction?: string[],
	/** Stores linked item tightness*/
	oldTightness?: number[],
	/** Stores linked item tightness*/
	oldEvents?: KinkyDungeonEvent[][],
	/** Vibrator battery level*/
	battery?: number,
	/** Vibrator cooldown, won't restart vibrrating until this is 0. Ticks down each turn.*/
	cooldown?: number,
	/** Vibrator deny timer, similar to cooldown but independent. Ticks down each turn.*/
	deny?: number,
	/** Escape progress tracking*/
	pickProgress?: number,
	/** Escape progress tracking*/
	struggleProgress?: number,
	/** Escape progress tracking*/
	removeProgress?: number,
	/** Escape progress tracking*/
	cutProgress?: number,
	/** Escape progress tracking*/
	unlockProgress?: number,
	/** Number of escape attempts, integer*/
	attempts?: number,
	/** Can be used to make an item tighter and harder to escape, reduces with each escape attempt*/
	tightness?: number,
	/** Determines the current trap attached to the restraint*/
	trap?: string,
}

interface consumable {
	name: string,
	rarity: number,
	type: string,
	shop?: boolean,
	spell?: string,
	potion?: boolean,
	noHands?: boolean,
	needMouth?: boolean,
	/** Max strictness allowed before the item cant be used */
	maxStrictness?: number,
	mp_instant?: number,
	sp_instant?: number,
	ap_instant?: number,
	mp_gradual?: number,
	sp_gradual?: number,
	ap_gradual?: number,
	scaleWithMaxMP?: boolean,
	scaleWithMaxSP?: boolean,
	duration?: number,
	power?: number,
	amount?: number,
	rechargeCost?: number,
	aura?: string,
	buff?: string,
	costMod?: number,
	shrine?: string,
	sfx?: string,
	noConsumeOnUse?: boolean,
	useQuantity?: number,
}

type restraint = {
	/** Determines if the item appears in aroused mode only */
	arousalMode?: boolean,
	name: string,
	Group: string,
	Asset: string,
	/** Used for when the visual asset in BC is different from the actual group of the item*/
	AssetGroup?: string,
	Color: string[] | string,
	/** Weight for the restraint to be selected */
	weight: number,
	/** Minimum floor for the restraint to be used by enemies */
	minLevel: number,
	/** Maximum level, wont be used at this or higher. Inclusive. */
	maxLevel?: number,
	/** Relative power level. Used to determine if the restraint will get overridden by a more powerful one */
	power: number,
	/** Copied to the events variable */
	events?: KinkyDungeonEvent[],
	/** The item is present on all floors */
	allFloors?: boolean,
	/** Determines the floors the restraint can appear on */
	floors?: Map<any, any>,
	escapeChance: {
		Struggle?: number,
		Cut?: number,
		Remove?: number
		Pick?: number
		Unlock?: number
	},
	/** Overrides escapeChance when you have a ghost helping*/
	helpChance?: {
		Struggle?: number,
		Cut?: number,
		Remove?: number
		Pick?: number
		Unlock?: number
	},
	struggleMinSpeed?: {
		Struggle?: number,
		Cut?: number,
		Remove?: number
		Pick?: number
		Unlock?: number
	},
	struggleMaxSpeed?: {
		Struggle?: number,
		Cut?: number,
		Remove?: number
		Pick?: number
		Unlock?: number
	},
	/** Multiplier to struggle power */
	struggleMult?: {
		Struggle?: number,
		Cut?: number,
		Remove?: number
		Pick?: number
		Unlock?: number
	},
	/** The item is a chastity belt */
	chastity?: boolean,
	/** The item is a chastity bra */
	chastitybra?: boolean,
	/** The item is a piercing */
	piercing?: boolean,
	/** The item rubs against the crotch when you move or struggle*/
	crotchrope?: boolean,
	/** The item provides distraction when you walk around*/
	plugSize?: number,
	/** Enemy tags that modify the weight */
	enemyTags: any,
	/** Player tags that modify the weight */
	playerTags: any,
	shrine: string[],
	/** Binding arms hurts a lot of things but isn't as punishing as hands */
	bindarms?: boolean,
	/** Binding hands prevents use of weapons and picks */
	bindhands?: boolean,
	/** harnesses allow enemies to grab you and slow you */
	harness?: boolean,
	/** hobble is the simplest kind of slowing restraint, increasing slow by 1*/
	hobble?: boolean,
	/** Blocking feet is for restraints that tie the legs together, forcing the player into SLow Level 2 or higher */
	blockfeet?: boolean,
	/** Your total gag level is the sum of the gag values of all your variables. Ball gags have 0.3-0.75 based on size and harness, muzzles are 1.0 */
	gag?: number,
	/** Higher value = higher vision loss */
	blindfold?: number
	/** Maximum stamina percentage the player can have in order for the restraint to be applied. 0.25-0.35 for really strict stuff, 0.9 for stuff like ball gags, none for quick restraints like cuffs */
	maxstamina?: number,
	Type?: string,
	/** Item is removed when the wearer goes to prison */
	removePrison?: boolean,
	/** Changes the dialogue text when you fail to remove the item */
	failSuffix?: Record<string, string>,
	/** Changes the dialogue text when you try to struggle completely */
	specStruggleTypes?: string[],
	remove?: string[],
	slimeLevel?: number,
	addTag?: string[],
	OverridePriority?: number,
	Modules?: number[],
	/** The item is added to the inventory when you remove it yourself without cutting */
	inventory?: boolean,
	/** When added to the inventory, is added as a different item instead. Good for multiple stages of the same item, like cuffs */
	inventoryAs?: string,
	/** The item is always kept in your inventory no matter how it gets removed, so long as you don't cut it */
	alwaysKeep?: boolean,
	/** The jailer won't remove these */
	noJailRemove?: boolean,
	/** Increases the difficulty of other items */
	strictness?: number,
	/** Can be linked by items with this shrine category */
	LinkableBy?: string[],
	DefaultLock?: string,
	Link?: string,
	UnLink?: string,
	/** Default tether length */
	tether?: number,
	leash?: boolean,
	/** String containing vibrator keywords */
	vibeType?: string,
	/** Strength of the vibration */
	intensity?: number,
	/** Whether or not the item allows orgasm */
	orgasm?: boolean,
	/** Chance to begin teasing */
	teaseRate?: number,
	/** Vibrator starting batt */
	battery?: number,
	/** Vibrator max batt */
	maxbattery?: number,
	/** Starts when teasing starts */
	teaseCooldown?: number,
	/** Base chance to turn off if the user tries to let go */
	denyChance?: number,
	/** How long the denial lasts before the vibrator starts up again*/
	denyTime?: number,
	/** Chance to deny if the user is likely to succeed in an orgasm */
	denyChanceLikely?: number,
	/** Multiplies the escape chance */
	escapeMult?: number,
	/** Clothes for dressing */
	alwaysDress?: overrideDisplayItem[],
	/** The item always bypasses covering items, such as dresses and chastity belts */
	bypass?: boolean,
	/** The item can only be cut with magical implements */
	magic?: boolean,
	/** The item is regarded as a non-binding item, so the game knows how to handle it. Used for stuff like cuffs which are not binding by default */
	nonbinding?: boolean,
	/** Instantly forces a high slow level, for stuff like slime */
	freeze?: boolean,
	/** The item CAN be trapped, which triggers when you struggle out */
	trappable?: boolean,
	/** The item can only be removed through a special condition known as a curse */
	curse?: string,
	/** The extra difficulty the item adds to the global difficulty var */
	difficultyBonus?: number,
	/** Equip sound */
	sfx?: string,
	/** Whether or not the angels will take it off when you call them */
	divine?: boolean,
	/** If this is enabled, then you can spend ancient energy to use a potion at no reduction to potion effectiveness while gagged */
	potionAncientCost?: number,
	/** Always allows potions while this restraint is on */
	allowPotions?: boolean,
	/** Allows the user to walk across slime */
	slimeWalk?: boolean,
	/** Amount of ancient energy it draws per turn */
	enchantedDrain?: number,
	/** Whether or not this is an Ancient item, prison respects it */
	enchanted?: boolean,
	/** Faction primary color index */
	factionColor?: number[],
}

interface overrideDisplayItem {
	/** Bondage club asset */
	Item: string,
	/** Group */
	Group: string,
	/** Color */
	Color: string[]|string,
	/** Whether or not it overrides items already on */
	override?: boolean,
	/** Uses the player's hair color as the item color */
	useHairColor?: boolean,
	/** Used for overriding BC priority */
	OverridePriority?: number[]|number,
}

interface enemy {
	name: string,
	/** Tags, used for determining weaknesses, spawning, restraints applied, and rank*/
	tags: Map<string, boolean>,
	/** Spell resist, formula is spell damage taken = 1 / (1 + spell resist) */
	spellResist?: number,
	/** Whether or not the enemy is friendly to the player and attacks enemies */
	allied?: boolean,
	/** Enemies will prioritize this enemy less than other enemies. Used by allies only. */
	lowpriority? : boolean,
	/** Hit chance = 1 / (1 + evasion) */
	evasion?: number,
	/** */
	armor?: number,
	/** */
	followRange?: number,
	/** wander = wanders randomly
	 * hunt = wanders, then follows the player
	 * guard = follows a specific point
	 * ambush = waits for the player to come near before becoming active
	 * patrol = walks between predefined global points on the map
	*/
	AI?: string,
	/** HP regen per turn*/
	regen?: number,
	/** */
	visionRadius?: number,
	/** Max enemy hp*/
	maxhp?: number,
	/** HP the enemy starts at */
	startinghp?: number,
	/** */
	minLevel?: number,
	/** */
	weight?: number,
	/** */
	movePoints?: number,
	/** */
	attackPoints?: number,
	/** String declaring what types of attacks this unit has */
	attack?: string,
	/** */
	attackRange?: number,
	/** */
	terrainTags?: Record<string, number>,
	/** */
	floors?: Map<number, boolean>,
	/** */
	allFloors?: boolean,
	/** */
	noblockplayer?: boolean,
	/** */
	triggersTraps?: boolean,
	/** The enemy follows the player at the end of the level */
	keepLevel?: boolean,
	/** Boost to accuracy, 1 + (1 + accuracy)*/
	accuracy?: number,
	/** Blindsight toward the player but not other enemies. Mainly used by allies so they know where the player is. */
	playerBlindSight?: number,
	/** */
	attackWidth?: number,
	/** */
	power?: number,
	/** */
	dmgType?: string,
	/** */
	bound?: string,
	/** */
	color?: string,
	/** Does not count toward the player's permanent summmon limit */
	noCountLimit?: boolean,
	/** Does not target silenced enemies */
	noTargetSilenced?: boolean,
	/** */
	silenceTime?: number,
	/** List of spells*/
	spells?: string[],
	/** */
	spellCooldownMult?: number,
	/** */
	spellCooldownMod?: number,
	/** */
	kite?: number,
	/** */
	playerFollowRange?: number,
	/** */
	minSpellRange?: number,
	/** */
	stopToCast?: boolean,
	/** Shows a marker when the creature has a spell ready */
	spellRdy?: boolean,
	/** Casts while moving */
	castWhileMoving?: boolean,
	/** Enemy does not attack */
	noAttack?: boolean,
	/** Disarm counter increased by this fraction when attacked. When it reaches 1, the player's next attack will miss, otherweise it will reduce by this amount per turn */
	disarm?: number,
	/** Boost to power when target is not the player or when the enemy cant tie up the player */
	fullBoundBonus?: number,
	/** Loot*/
	dropTable?: any[],
	/** */
	attackWhileMoving?: boolean,
	/** Doesnt cast spells when the player is out of stamina */
	noSpellsLowSP?: boolean,
	/** Damage type */
	damage?: string,
	/** Rep changes on death */
	rep?: Record<string, number>,
	/** When generating clusters of enemies, the clustering units must have this tag*/
	clusterWith?: string,
	/** Chance to ignore the player if the enemy has an ignore tag like ignorenoSP */
	ignorechance?: number,
	/** The enemy count is incremented by this amount when the enemy is spawned during map gen*/
	difficulty?: number,
	/** The enemy will not attack if the path to the player is blocked, and will move closer*/
	projectileAttack?: boolean,
	/** The enemy will use 'buff' tagged spells on allies*/
	buffallies?: boolean,
	/** Special attack property*/
	stunTime?: number,
	/** Special attack property. Cooldown of the special attack.*/
	specialCD?: number,
	/** Special attack property. Added to the special attack in addition to the enemy's default attack*/
	specialAttack?: string,
	/** Special attack property. Removed these types from the main attack when special attacking.*/
	specialRemove?: string,
	/** Special attack property*/
	specialPower?: number,
	/** Special attack property*/
	specialDamage?: string,
	/** Special attack property. Special attack will go on CD when the enemy uses it, not when it hits*/
	specialCDonAttack?: boolean,
	/** Special attack property*/
	specialWidth?: number,
	/** Special attack property*/
	specialRange?: number,
	/** Which shrines the enemy is associated with*/
	shrines?: string[],
	/** */
	followLeashedOnly?: boolean,
	/** */
	blindSight?: number,
	/** */
	specialCharges?: number,
	/** */
	strictAttackLOS?: boolean,
	/** */
	specialAttackPoints?: number,
	/** */
	specialMinrange?: number,
	/** */
	stealth?: number,
	/** After being seen the enemy can go back into stealth if the player moves away*/
	noReveal?: boolean,
	/** */
	ambushRadius?: number,
	/** For AI = 'ambush', this enemy will wander until it sees the player and triggers the ambush. Mostly used for invisible enemies. */
	wanderTillSees?: boolean,
	/** For kiting enemies, this enemy moves in to attack Only When the player is Disabled. Used on enemies like the Maidforce stalker who stay away from the enemy but have powerful disabling effects like flash bombs*/
	kiteOnlyWhenDisabled?: boolean,
	/** The special attack only binds on kneeling players*/
	bindOnKneelSpecial?: boolean,
	/** The regular attack only binds on kneeling players*/
	bindOnKneel?: boolean,
	/** Sfx when an attack lands*/
	hitsfx?: string,
	/** All lockable restraints will use this lock*/
	useLock?: string,
	/** Minimum range for attack warning tiles, used to prevent high range enemies from attacking all around them*/
	tilesMinRange?: number,
	/** */
	noKiteWhenHarmless?: boolean,
	/** */
	noSpellsWhenHarmless?: boolean,
	/** */
	ignoreStaminaForBinds?: boolean,
	/** */
	sneakThreshold?: number,
	/** */
	remote?: number,
	/** */
	remoteAmount?: number,
	/** */
	bypass?: boolean,
	/** */
	multiBind?: number,
	/** */
	noLeashUnlessExhausted?: boolean,
	/** */
	ethereal?: boolean,
	/** */
	alwaysEvade?: boolean,
	/** */
	summonRage?: boolean,
	/** */
	noAlert?: boolean,
	/** The enemy will follow enemies defined by this block*/
	master?: {type: string, range: number, loose?: boolean, aggressive?: boolean, dependent?: boolean},
	/** */
	pullTowardSelf?: boolean,
	/** */
	pullDist?: number,
	/** */
	summon?: any[],
	/** */
	sneakthreshold?: number,
	/** */
	blockVisionWhileStationary?: boolean,
	/** */
	squeeze?: boolean,
	/** Enemy will not chase player for being unrestrained. Use on enemies like drones who have lines but dont bind readily */
	noChaseUnrestrained?: boolean,
	/** */
	suicideOnSpell?: boolean,
	/** */
	suicideOnAdd?: boolean,
	/** */
	suicideOnLock?: boolean,
	/** Hostile even on parole */
	alwaysHostile?: boolean,
	/** */
	specialsfx?: string,
	/** Stuns the enemy when the special attack goes on CD without a hit */
	stunOnSpecialCD?: number,
	/** Dashes to the player even when a dash misses*/
	dashOnMiss?: boolean,
	/** */
	cohesion?: number,
	/** */
	noSpellLeashing?: boolean,
	/** */
	projectileTargeting?: boolean,
	/** */
	ondeath?: any[],
	/** */
	blindTime?: number,
	/** */
	tilesMinRangeSpecial?: number,
	/** */
	convertTiles?: any[],
	/** the enemy sends a special message when pulling the player */
	pullMsg?: boolean,
	/** */
	dashThruWalls?: boolean,
	/** */
	dashThrough?: boolean,
	/** */
	cohesionRange?: number,
	/** */
	kiteChance?: number,
	/** this enemy ignores the player when these flags are set*/
	ignoreflag?: string[],
	/** flags set when the player is hit but no binding occurs*/
	failAttackflag?: string[],
	/** */
	visionSummoned?: number,
	/** */
	dependent?: boolean,
	/** */
	nopickpocket?: boolean,
	/** */
	attackThruBars?: boolean,
	/** */
	noCancelAttack?: boolean,
	/** */
	keys?: boolean,
	/** If this enemy is always enraged */
	rage?: boolean,
	/** Starting lifetime of enemy*/
	lifespan?: number,
	/** This enemy cant be swapped */
	noDisplace?: boolean,
	/** The enemy will cast spells even if you are in parole */
	spellWhileParole?: boolean,
	/** This line is a suffic to the line they say when they want to play with you */
	playLine?: string,
	/** Blocks vision */
	blockVision?: boolean,
	/** Hit SFX for enemy special attack */
	hitsfxSpecial?: string,
	/** Effect when the enemy misses */
	misssfx?: string,
	/** The enemyeffect when player is hit */
	effect?: any,
	/** Cant cast spells while winding up an attack */
	noSpellDuringAttack?: boolean,
	/** Base faction of this enemy, overridden by the entity faction */
	faction?: string,
	/** This enemy does not channel its spells */
	noChannel?: boolean,
	/** Focuses player over summmons, ignores decoys */
	focusPlayer?: boolean;


}

interface shopItem {
	cost: any;
	rarity: any;
	costMod?: any;
	shoptype: string;
	consumable?: string;
	quantity?: number;
	name: any;
}

interface weapon {
	name: string;
	dmg: number;
	chance: number;
	type: string;
	bind?: number;
	boundBonus?: number;
	tease?: boolean;
	rarity: number;
	staminacost?: number;
	magic?: boolean;
	cutBonus?: number;
	playSelfBonus?: number;
	playSelfMsg?: string;
	playSelfSound?: string;
	unarmed: boolean;
	shop: boolean;
	noequip?: boolean;
	sfx: string;
	events?: KinkyDungeonEvent[];
	noHands?: boolean;
	silent?: boolean;
	special?: {
		type: string,
		spell?: string,
		selfCast?: boolean,
		requiresEnergy?: boolean,
		energyCost?: number,
		range?: number,};
}

interface KinkyDungeonEvent {
	type: string;
	trigger: string;
	sfx?: string;
	power?: number;
	bind?: number;
	mult?: number;
	damage?: string;
	dist?: number;
	aoe?: number;
	buffType?: string;
	time?: number;
	chance?: number;
	buff?: any;
	lock?: string;
	msg?: string;
	/** A required enemy tag */
	requiredTag?: string;
	/** Type of struggle that this event triggers on */
	StruggleType?: string;
	requireEnergy?: boolean;
	/** Limit of whatever thius event modifies */
	limit?: number
	energyCost?: number;
	/** The event gets copied to any restraint if the item is linked */
	inheritLinked?: boolean;
	/** Spell to cast at the target */
	spell?: string;
	/** Chance to trigger is 1+(submissive % * subMult)*/
	subMult?: number;
	/** Won't trigger while being leashed */
	noLeash?: boolean;
	/** Stun duration */
	stun?: number;
	/** Chance the player will get warned instead of punshed */
	warningchance?: number;
	/** triggers from this component */
	punishComponent?: string;
	/** List of restraints or other string params */
	list?: string[];
	/** Whether or not the event only triggers on human targets */
	humanOnly?: boolean;
	/** Distance having to do with stealth */
	distStealth?: number;

	// MUTABLE QUANTITIES
	prevSlowLevel?: number;
}

interface entity {
	Enemy: enemy,
	personality?: string,
	patrolIndex?: number,
	aggro?: number,
	id?: number,
	hp: number,
	AI?: string,
	moved?: boolean,
	playerdmg?: number,
	idle?: boolean,
	summoned?: boolean,
	boundLevel?: number,
	lifetime?: number,
	maxlifetime?: number,
	attackPoints?: number,
	movePoints?: number,
	aware?: boolean,
	vp?: number,
	tracking?: boolean,
	revealed?: boolean,
	ambushtrigger?: boolean,
	castCooldown?: number,
	castCooldownSpecial?: number,
	specialCharges?: number,
	usingSpecial?: boolean,
	specialCD?: number,
	disarmflag?: number,
	channel?: number,
	items?: string[],
	x: number,
	y: number,
	fx?: number,
	fy?: number,
	path?: {x: number, y: number}[],
	gx?: number,
	gy?: number,
	gxx?: number,
	gyy?: number,
	rage?: number,
	hostile?: number,
	faction?: string,
	allied?: number,
	bind?: number,
	blind?: number,
	slow?: number,
	freeze?: number,
	stun?: number,
	silence?: number,
	vulnerable?: number,
	buffs?: any,
	warningTiles?: any,
	visual_x?: number,
	visual_y?: number,
	Analyze?: boolean,
	/** Number of turns the enemy is temporarily hostile for */
	playWithPlayer?: number,
	playWithPlayerCD?: number,
}

type KinkyDungeonDress = {
	Item: string;
	Group: string;
	Color: string | string[];
	Lost: boolean;
	NoLose?: boolean;
	OverridePriority?: number;
	Skirt?: boolean;
}[]

interface KinkyDialogueTrigger {
	dialogue: string;
	allowedPrisonStates?: string[];
	/** Only allows the following personalities to do it */
	allowedPersonalities?: string[];
	blockDuringPlaytime?: boolean;
	/** Exclude if enemy has one of these tags */
	excludeTags?: string[];
	/** Require all of these tags */
	requireTags?: string[];
	playRequired?: boolean;
	/** If any NPC is in combat in last 3 turns this wont happen */
	noCombat?: boolean;
	/** Prevents this from happening if the target is hostile */
	nonHostile?: boolean;
	prerequisite: (enemy: entity, dist: number) => boolean;
	weight: (enemy: entity, dist: number) => number;
}

interface spell {
	name: string;
	/** Whether the spell defaults to the Player faction */
	allySpell?: boolean;
	/** Whether the spell defaults to the Enemy faction */
	enemySpell?: boolean;
	/** Conjure, Illusion, Elements */
	school?: string;
	/** if the type is special, this is the special type */
	special?: string;
	/** Damage of the spell */
	power?: number;
	/** Damage type */
	damage?: string;
	/** size of sprite */
	size?: number;
	/** AoE */
	aoe?: number;
	/** bind */
	bind?: number;
	/** Bonus daMAGE TO BOUND TATRGETS */
	boundBonus?: number;
	/** outfit applied (special parameter) */
	outfit?: string;
	/** speed */
	speed?: number;
	knifecost?: number;
	staminacost?: number;
	manacost: number;
	/** Verbal, arms, or legs */
	components?: any[];
	/** Spell level */
	level: number;
	/** Whether the spell is passive (like the summon count up) or active like the bolt or toggle spells*/
	passive?: boolean;
	/** costOnToggle */
	costOnToggle?: boolean;
	/** Type of the spell */
	type: string;
	/** Type of effect on hit */
	onhit?: string;
	/** Duration of the status effect applied */
	time?: number;
	/** For Inert spells, this is the lifetime of the main bullet */
	delay?: number;
	/** castRange */
	castRange?: number;
	/** Spell range */
	range?: number;
	/** lifetime of the Hit bullet created by the spell, not the bullet itself in the case of an "inert" bullet*/
	lifetime?: number;
	/** Specifically for the bullet lifetime, currently unused */
	bulletLifetime?: number;
	/** channel turns */
	channel?: number;
	/** Noise spell makes on cast */
	noise?: number;
	/** block */
	block?: number;
	/** played on cast */
	sfx?: string;
	/** Played on damage dealt */
	hitsfx?: string;
	/** Played on bullet impact */
	landsfx?: string;
	/** trailPower */
	trailPower?: number;
	/** trailHit */
	trailHit?: string;
	/** trailLifetime */
	trailLifetime?: number;
	/** trailTime */
	trailTime?: number;
	/** Random number to increase lifetime by */
	lifetimeHitBonus?: number;
	/** Random number to increase trail lifetime by */
	trailLifetimeBonus?: number;
	/** Playereffect of the trail */
	trailPlayerEffect?: any;
	/** trailChance */
	trailChance?: number;
	/** trailDamage */
	trailDamage?: string;
	/** trailspawnaoe */
	trailspawnaoe?: number;
	/** Casts a spell as a trail */
	trailcast?: any;
	/** trail */
	trail?: string;
	/** Spell points cost to buy */
	spellPointCost?: number;
	/** Whether the spell heals or not */
	heal?: boolean;
	/** Whether AI treats as a buff */
	buff?: boolean;
	/** Player can only cast spell on a creature or player */
	mustTarget?: boolean;
	/** Player cant target player */
	noTargetPlayer?: boolean;
	/** Only target walls */
	WallsOnly?: boolean;
	/** Spell can be dodged */
	evadeable?: boolean;
	/** Targeting location */
	meleeOrigin?: boolean;
	/** Cant hit the same enemy twice per turrn, impoprtant for piercing spells */
	noDoubleHit?: boolean;
	/** Doesnt do spellcast on the hit */
	noCastOnHit?: boolean;
	/** Casts a spellcast during the delay */
	castDuringDelay?: boolean;
	/** Casts spell */
	spellcast?: any;
	/** Casts spell on cast */
	extraCast?: any;
	/** spell cast on hit */
	spellcasthit?: any;
	/** List of buffs applied by the spell */
	buffs?: any[];
	/** Whether the spell is off by default */
	defaultOff?: boolean;
	/** List of events  applied by the spell */
	events?: KinkyDungeonEvent[];
	/** spell pierces */
	piercing?: boolean;
	/** spell pierces */
	passthrough?: boolean;
	/** Deals DoT */
	dot?: boolean;
	/** spell pierces */
	noTerrainHit?: boolean;
	/** spell pierces */
	noEnemyCollision?: boolean;
	/** trail pierces */
	piercingTrail?: boolean;
	/** nonVolatile */
	nonVolatile?: boolean;
	/** Cancels automove when cast */
	cancelAutoMove?: boolean;
	/** noTargetDark */
	noTargetDark?: boolean;
	/** selfTargetOnly */
	selfTargetOnly?: boolean;
	/** AI will only target creatures with this tag */
	filterTags?: string[];
	/** Whether or not sends a message on cast */
	msg?: boolean;
	/** Suppress summon message */
	noSumMsg?: boolean;
	/** Targeted like a bolt, showing the aim line */
	projectileTargeting?: boolean;
	/** CastInWalls */
	CastInWalls?: boolean;
	/** noTargetEnemies */
	noTargetEnemies?: boolean;
	/** Sets the enemy's specialCD shared between others */
	specialCD?: number;
	/** AI wont choose this as first choice */
	noFirstChoice?: boolean;
	/** Player effect */
	playerEffect?: any;
	/** Doesnt send cast message */
	noCastMsg?: boolean;
	/** Casts on self always */
	selfcast?: boolean;
	/** Cant miscast */
	noMiscast?: boolean;
	/** summon */
	summon?: any[];
	/** Spell does not show up in the spells scrreen until learned */
	secret?: boolean;
	/** Enemies summoned by this spell will have their default faction and not the caster's faction */
	defaultFaction?: boolean;

}

interface KinkyDialogue {
	/** REPLACETEXT -> Replacement */
	data?: Record<string, string>;
	/** Function to play when clicked. If not specified, nothing happens. */
	clickFunction?: (gagged: boolean) => void;
	/** Function to play when clicked, if considered gagged. If not specified, will use the default function. */
	gagFunction?: () => void;
	/** Will not appear unless function returns true */
	prerequisiteFunction?: (gagged: boolean) => boolean;
	/** Will appear greyed out unless true */
	greyoutFunction?: (gagged: boolean) => boolean;
	greyoutTooltip?: string;
	/** List of personalities supported by this dialogue */
	personalities?: string[];
	/** Jumps to the specified dialogue when clicked, after setting the response string*/
	leadsTo?: string;
	leadsToStage?: string;
	/** After leading to another dialogue, the response will NOT be updated */
	dontTouchText?: boolean;
	exitDialogue?: boolean;
	/** The response the NPC will give when this dialogue is clicked. If response is "null", then it keeps the original, "" uses pregenerated
	 * The string name will be "r" + response with a couple of enemy-specific variations
	 */
	response?: string;
	/** The option for you to select for this dialogue. "" means pregenerated, OK to put "" for top-level KinkyDialogues
	 * The string name will be "d" + response
	 */
	playertext?: string;
	/** Whether or not this line has a gag-specific dialogue line */
	gag?: boolean;
	/** Threshold at which the player is considered gagged for this dialogue. Default is 0.01*/
	gagThreshold?: number;
	/** Whether or not this option appears while gagged */
	gagDisabled?: boolean;
	/** Whether or not this option appears while ungagged */
	gagRequired?: boolean;
	/** Options to display */
	options?: Record<string, KinkyDialogue>;
	/** Name of a dialogue to get extra options from. Merges them, preferring this dialogue's options if the name is the same */
	extraOptions?: string;
}

interface KinkyDungeonSave {
	level: number;
	checkpoint: number;
	rep: Record<string, number>;
	costs: Record<string, number>;
	pcosts: Record<string, number>;
	orbs: number[];
	chests: number[];
	dress: string;
	gold: number;
	points: number;
	levels: {
		Elements: number;
		Conjure: number;
		Illusion: number;
	};
	rescued: Record<string, boolean>;
	aid: Record<string, boolean>;
	seed: string;
	statchoice: [string, boolean][];
	mapIndex: number[];
	id: number;
	choices: number[];
	choices2: boolean[];
	buffs: Record<string, any>;
	lostitems: any[];
	caches: number[];
	hearts: number[];
	spells: string[];
	inventory: item[];
	KDGameData: KDGameDataBase;
	flags: [string, number][];
	stats: {
		picks: number;
		keys: number;
		bkeys: number;
		knife: number;
		eknife: number;
		mana: number;
		stamina: number;
		distraction: number;
		wep: any;
		npp: number;
		diff: number;
	};
}

