"use strict";
var PlatformDialog = null;
var PlatformDialogBackground = null;
var PlatformDialogText = null;
var PlatformDialogCharacterDisplay = null;
var PlatformDialogPosition = 0;
var PlatformDialogCharacter = [
	{
		Name: "Melody",
		Color: "#fe92cf",
	},
	{
		Name: "Olivia",
		Color: "#ffffff",
		Love: 10,
		Domination: 0
	},
	{
		Name: "Isabella",
		Color: "#ffD700",
		Love: 5,
		Domination: -10
	},
	{
		Name: "Camille",
		Color: "#C0C0C0",
		Love: -5,
		Domination: -5
	},
	{
		Name: "Yuna",
		NickName: "Senior Maid",
		Color: "#E6E6FA",
	},
	{
		Name: "Hazel",
		NickName: "Junior Maid",
		Color: "#e1dd57",
	}	
];
var PlatformDialogData = [
	{
		Name: "IntroMelody",
		Exit : function () { CommonSetScreen("Room", "Platform") },
		Dialog: [
			{ 
				Text: "(Click or hit the spacebar to continue.)",
				Background: "MaidBed",
				Character: [
					{
						Name: "Melody",
						Status: "Underwear",
						Pose: "Sleep",
						X: 0,
						Y: 200
					}
				]
			},
			{ Text: "Zzzzzzzzzzz...", },
			{ Text: "Zzzzzzz...", },
			{ Text: "Zzz..." },
			{
				Character: [
					{
						Name: "Melody",
						Status: "Underwear",
						Pose: "Lay",
						X: 0,
						Y: -150
					}
				]
			},
			{ Text: "Is it morning already?" },
			{ Text: "It's a big day today, there's so much to do.  Let's review..." },
			{ 
				Background: "Black",
				Text: "First thing first, I need to unlock and bathe Lady Olivia.",
				Character: [
					{
						Name: "Olivia",
						Status: "Kimono",
						Pose: "StandIdle"
					}
				]
			},
			{ 
				Text: "Secondly, I have to clean the royal restraints for Countess Isabella.",
				Character: [
					{
						Name: "Isabella",
						Status: "Winter",
						Pose: "StandIdle"
					}
				]
			},
			{ 
				Text: "And finally, I need to serve dinner for Marchioness Camille.",
				Character: [
					{
						Name: "Camille",
						Status: "Armor",
						Pose: "StandIdle"
					}
				]
			},
			{ 
				Text: "Time to get dressed!",
				Character: [
					{
						Name: "Melody",
						Status: "Maid",
						Pose: "StandCocky"
					}
				]
			},
			{ 
				Text: "Lady Olivia needs me first.  Let's go find her.",
				Character: [
					{
						Name: "Melody",
						Status: "Maid",
						Pose: "StandCocky"
					},
					{
						Name: "Olivia",
						Status: "Kimono",
						Pose: "StandIdle"
					}
				]
			},
		]
	},
	
	{
		Name: "JealousMaid",
		Exit : function () { CommonSetScreen("Room", "Platform") },
		Dialog: [
			{
				Background: "CastleHall",
				Character: [
					{
						Name: "Hazel",
						Status: "Maid",
						Pose: "StandAngry",
					}
				]
			},
			{
				Text: "Well, well, well.  Here comes Melody the perfect servant.",
				Answer: [
					{ Text: "Get out of my way.", Reply: "(She stands her ground.)  Not so fast." },
					{ Text: "What do you want?", Reply: "You're not very bright aren't you?" },
					{ Text: "And here comes the laziest maid of the year.", Reply: "There won't be any deal, only bruises.  (She raises her fists.)" },
					{ Text: "It's great to see you sister.", Reply: "(She shakes her head no.)  Don't call me sister today." }
				]
			},
			{ Text: "The maid staff has been talking about you." },
			{ Text: "We think you're getting too friendly with Lady Olivia." },
			{ Text: "There's no reason why Countess Isabella gave you her collar key." },
			{ Text: "Today, I will unlock her, you can go back to bed." },
			{
				Text: "Give me her collar key or you will get hurt.",
				Answer: [
					{ Text: "Sorry, I cannot give you that key.", Reply: "Fine, I will take it by force then.  (She raises her fists.)" },
					{ Text: "Please, can we negotiate a deal?", Reply: "There won't be any deal, only bruises.  (She raises her fists.)" },
					{ Text: "Over my dead body.", Reply: "I won't kill you, but you'll be in pain.  (She raises her fists.)" },
					{ Text: "(Try to run away.)", Reply: "You're not going anywhere!  (She raises her fists.)" }
				]
			},
			{ Text: "(She rushes toward you.  You'll need to dodge or fight her.)" }
		]
	},
	
	{
		Name: "IntroOlivia",
		Exit : function () { CommonSetScreen("Room", "Platform") },
		Dialog: [
			{
				Background: "LadyBed",
				Color: "#ffffff",
				Character: [
					{
						Name: "Olivia",
						Status: "Underwear",
						Pose: "Chained",
						X: 0,
						Y: 0
					}
				]
			},
			{
				Text: "Melody!  I'm so happy to see you.",
				Answer: [
					{ Text: "I had to wake up early for you.", Reply: "Sorry about that, having that key is a huge responsibility.", Domination: 1, Love: -1 },
					{ Text: "It's nice to see you also.", Reply: "(She nods slowly and stretches.)" },
					{ Text: "Seeing you is the best part of my day.", Reply: "Flattery will get you everywhere. (She winks at you.)", Love: 1 },
					{ Text: "(Do a maid curtsy.)", Reply: "You're such a good maid.", Domination: -1 }
				]
			},
			{
				Text: "We have a busy day ahead.  (She tugs on her neck chain.)",
				Answer: [
					{ Text: "Why are you chained?", Reply: "(She sighs.)  Mother's rules aren't easy to understand.  She keeps me chained so I don't run away or get kidnapped." },
					{ Text: "I like to see you in chains.", Reply: "(She bows her head.)  Mother's rules are very strict, but they are for my own good.  I'm glad you like them.", Domination: 2 },
					{ Text: "An important Lady like you should not be chained.", Reply: "(She nods.)  You're sweet.  Mother's rules are strict but logical.  She's very protective.", Domination: -1 }
				]
			},
			{
				Text: "Can you unlock me?",
				Answer: [
					{ Text: "I will unlock you now.", Reply: "(You unlock her collar and she smiles.)  Thank you very much.  I appreciate." },
					{ Text: "A hug before I unlock you?", Reply: "(You exchange a warm hug before you unlock her.)  You're the best maid around Melody.", Love: 2 },
					{ Text: "You're spoiled.  (Unlock her.)", Reply: "(You unlock her collar and she pouts.)  I know we come from two different realities.", Love: -2 }
				]
			},
			{ 
				Background: "Black",
				Character: [
					{
						Name: "Melody",
						Status: "Maid",
						Pose: "StandIdle"
					},
					{
						Name: "Olivia",
						Status: "Kimono",
						Pose: "StandIdle"
					}
				]
			},
			{ Text: "Why are you sweaty?  Did you run to get here?", Focus: "Olivia" },
			{ Text: "Yes and no.  I had a little scuffle with another maid.", Focus: "Melody" },
			{ Text: "Yeah, the employees have been jealous of you, since Mother entrusted you with the key.", Focus: "Olivia" },
			{
				Text: "They were mean to you?",
				Answer: [
					{ Text: "Yes, I got hurt really bad.", Reply: "Poor Melody.  (She caresses you head.)  I'll talk to Mother about it.", Domination: -2, Love: 1 },
					{ Text: "Nothing to worry about.", Reply: "It's a good thing to avoid conflicts." },
					{ Text: "I might have to quit the job.", Reply: "Please don't quit.  I would be so lonely.", Love: -1 },
					{ Text: "I've kicked her butt.", Reply: "(She giggles.)  Of course you did.", Domination: 1 }
				]
			},
			{ Text: "It's time for my morning soap, please join me in the bathroom." },
			{
				Text: "(She leaves for the bathroom, leaving the door open.)",
				Character: [
					{
						Name: "Melody",
						Status: "Maid",
						Pose: "StandIdle"
					}
				]
			}
		]
	}
	
];

function PlatformDialogLoadPosition(Position) {
	PlatformDialogPosition = Position;
	if (Position >= PlatformDialog.Dialog.length) return PlatformDialog.Exit();
	PlatformDialogText = PlatformDialog.Dialog[Position].Text;
	if ((Position == 0) || (PlatformDialog.Dialog[Position].Background != null)) PlatformDialogBackground = "../Screens/Room/PlatformDialog/Background/" + PlatformDialog.Dialog[Position].Background;
	if ((Position == 0) || (PlatformDialog.Dialog[Position].Character != null)) PlatformDialogCharacterDisplay = PlatformDialog.Dialog[Position].Character;
}

function PlatformDialogStart(DialogName) {
	PlatformDialog = null;
	for (let Dialog of PlatformDialogData)
		if (Dialog.Name == DialogName)
			PlatformDialog = Dialog;
	if (PlatformDialog == null) return;
	PlatformDialogLoadPosition(0);
	CommonSetScreen("Room", "PlatformDialog");
}

/**
 * Loads the screen
 * @returns {void} - Nothing
 */
function PlatformDialogLoad() {
}

function PlatformDialogDraw() {
	if (PlatformDialogCharacterDisplay != null) {
		let X = 1000 - (PlatformDialogCharacterDisplay.length * 250);
		let Y = 0;
		for (let Character of PlatformDialogCharacterDisplay) {
			DrawImage("Screens/Room/PlatformDialog/Character/" + Character.Name + "/" + Character.Status + "/" + Character.Pose + ".png", (Character.X == null) ? X : Character.X, (Character.Y == null) ? Y : Character.Y);
			X = X + 500;
		}
	}
	if (PlatformDialogText != null) {
		let Color;
		let Name;
		if ((PlatformDialogCharacterDisplay != null) && (PlatformDialogCharacterDisplay.length > 0))
			for (let Character of PlatformDialogCharacter)
				if (Character.Name == PlatformDialogCharacterDisplay[0].Name) {
					Color = Character.Color;
					Name = (Character.NickName == null) ? Character.Name : Character.NickName;
				}
		if (Color == null) Color = "#ffffff";
		if ((PlatformDialogCharacterDisplay != null) && (PlatformDialogCharacterDisplay.length > 0)) {
			if (Name == null) Name = PlatformDialogCharacterDisplay[0].Name;
			DrawEmptyRect(17, 613, 366, 66, Color, 6);
			DrawRect(20, 616, 360, 60, "#000000D0");
			DrawText(Name, 200, 646, Color, "Black");
		}
		DrawEmptyRect(17, 677, 1966, 306, Color, 6);
		DrawRect(20, 680, 1960, 300, "#000000D0");
		DrawText(PlatformDialogText, 1000, 830, Color, "Black");
	}
}

/**
 * Runs and draws the screen.
 * @returns {void} - Nothing
 */
function PlatformDialogRun() {
	PlatformDialogDraw();
}

/**
 * When the user presses keys in the dialog screen
 * @returns {void} - Nothing
 */
function PlatformDialogKeyDown() {
	if (KeyPress == 32) PlatformDialogLoadPosition(PlatformDialogPosition + 1);
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformDialogClick() {
	PlatformDialogLoadPosition(PlatformDialogPosition + 1);
}
