/** Kinky Dungeon Typedefs*/
interface item {
     /** Name of the item*/
    name?: string,
    /** Type of the item*/
    type?: string,
    events?: KinkyDungeonEvent[], /** Events associated with the item*/
    weapon?: KinkyDungeonWeapon, /** Item weapon data, if applicable*/
    consumable?: any, /** Item consumable data, if applicable*/
    quantity?: number, /** Number of consumables in the inventory*/
    outfit?: any, /** Outfit data, if applicable*/
    looserestraint?: any, /** Loose restraint data, if applicable*/
    restraint?: any, /** Which restraint the item is associated with*/
    lock?: string, /** Type of lock, Red, Blue, or Gold (potentially more in future)*/
    tetherToLeasher?: boolean, /** Bool to describe if the item is tethered to the leashing enemy*/
    tetherToGuard?: boolean, /** Bool to describe if the item is tethered to KinkyDungeonJailGuard()*/
    tx?: number, /** Location of the tether*/
    ty?: number, /** Location of the tether*/
    tetherLength?: number, /** Length of the tether*/
    lockTimer?: number, /** Used for Gold locks only, determines which floor the lock will release*/
    dynamicLink?: string[], /** Stores a list of restraint names for the linked item system*/
    oldLock?: string[], /** Stores linked item locks*/
    oldTightness?: number[], /** Stores linked item tightness*/
    battery?: number, /** Vibrator battery level*/
    cooldown?: number, /** Vibrator cooldown, won't restart vibrrating until this is 0. Ticks down each turn.*/
    deny?: number, /** Vibrator deny timer, similar to cooldown but independent. Ticks down each turn.*/
    pickProgress?: number, /** Escape progress tracking*/
    struggleProgress?: number, /** Escape progress tracking*/
    removeProgress?: number, /** Escape progress tracking*/
    cutProgress?: number, /** Escape progress tracking*/
    unlockProgress?: number, /** Escape progress tracking*/
    attempts?: number, /** Number of escape attempts, integer*/
    tightness?: number, /** Can be used to make an item tighter and harder to escape, reduces with each escape attempt*/
    trap?: string, /** Determines the current trap attached to the restraint*/
}

interface consumable {
	name: string,
	rarity: number,
	type: string,
	shop?: boolean,
	spell?: string,
	potion?: boolean,
	noHands?: boolean,
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

interface restraint {
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
	/** Relative power level. Used to determine if the restraint will get overridden by a more powerful one */
	power: number,
	/** Copied to the events variable */
	events?: KinkyDungeonEvent[],
	/** Determines the floors the restraint can appear on */
	floors: Map<any, any>,
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
	/** The item is a chastity belt */
	chastity?: boolean,
	/** The item is a chastity bra */
	chastitybra?: boolean,
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
	/** Multiplies the escape chance */
	alwaysDress?: object[],
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
}

interface KinkyDungeonSave {
	level: number;
    checkpoint: number;
    rep: Record<string, number>;
    costs: Record<string, number>;
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
    id: number;
    choices: number[];
	choices2: boolean[];
	buffs: Record<string, any>;
	lostitems: any[];
	caches: number[];
	spells: string[];
	inventory: {
		restraint: any;
		looserestraint: any;
		weapon: any;
		consumable: any;
	}[];
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
	};
}

interface KinkyDungeonShopItem {
	cost: any;
	rarity: any;
	costMod?: any;
	shoptype: string;
	consumable?: string;
	quantity?: number;
	name: any;
}

interface KinkyDungeonWeapon {
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
}

interface KinkyDungeonEvent {
	type: string;
	trigger: string;
	sfx?: string;
	power?: number;
	damage?: string;
	dist?: number;
	aoe?: number;
	buffType?: string;
	time?: number;
	chance?: number;
	buff?: any;
    requireEnergy?: any;
    energyCost?: any;
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
}
