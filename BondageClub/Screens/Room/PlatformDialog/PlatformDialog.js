"use strict";
var PlatformDialog = null;
var PlatformDialogBackground = null;
var PlatformDialogText = null;
var PlatformDialogAnswer = null;
var PlatformDialogAnswerPosition = 0;
var PlatformDialogReply = null;
var PlatformDialogGoto = null;
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
				Text: "First thing first, I need to retrieve Lady Olivia collar's key and bathe her.",
				Character: [{ Name: "Olivia", Status: "Kimono", Pose: "Idle" }]
			},
			{ 
				Text: "Secondly, I have to clean the royal restraints for Countess Isabella.",
				Character: [{ Name: "Isabella", Status: "Winter", Pose: "Idle" }]
			},
			{ 
				Text: "And finally, I need to serve dinner for Marchioness Camille visit.",
				Character: [{ Name: "Camille", Status: "Armor", Pose: "Idle" }]
			},
			{ 
				Text: "Time to get dressed!",
				Character: [{ Name: "Melody", Status: "Maid", Pose: "Idle" }]
			},
			{ 
				Text: "Lady Olivia needs me first.  Let's go find her.",
				Character: [
					{
						Name: "Melody",
						Status: "Maid",
						Pose: "Idle"
					},
					{
						Name: "Olivia",
						Status: "Kimono",
						Pose: "Idle"
					}
				]
			},
		]
	},
	
	{
		Name: "JealousMaid",
		Exit : function () { PlatformEventSet("JealousMaid"); CommonSetScreen("Room", "Platform") },
		Dialog: [
			{
				Background: "CastleHall",
				Character: [{ Name: "Hazel", Status: "Maid", Pose: "Angry" }]
			},
			{ Text: "(As you enter the hallway, you get intercepted by another maid.)" },
			{
				Text: "Well, well, well.  Here comes little Melody the perfect servant.",
				Answer: [
					{ Text: "What do you want?", Reply: "You're not very bright aren't you?" },
					{ Text: "And here comes the laziest maid of the year.", Reply: "Shut up Melody, you're not funny." },
					{ Text: "It's great to see you sister.", Reply: "(She shakes her head no.)  Don't call me sister today." },
					{ Text: "(Ignore her and move forward.)", Reply: "You think you can snob me?  (She raises her fists.)", Goto: "End" }
				]
			},
			{ Text: "The maid staff has been talking about you." },
			{ Text: "We think you're getting too friendly with Lady Olivia." },
			{ Text: "There's no reason why Countess Isabella gave you that chore." },
			{ Text: "Today, I will unlock and bathe her, you can go back to bed." },
			{
				Text: "Stay in your room or you will get hurt.",
				Answer: [
					{ Text: "Sorry, I have work to do.", Reply: "Fine, I'll make sure you cannot work then.  (She raises her fists.)" },
					{ Text: "Please, can we negotiate a deal?", Reply: "There won't be any deal, only bruises.  (She raises her fists.)" },
					{ Text: "Over my dead body.", Reply: "I won't kill you, but you'll be in pain.  (She raises her fists.)" },
					{ Text: "(Try to run past her.)", Reply: "You're not going anywhere!  (She raises her fists.)" }
				]
			},
			{ ID: "End", Text: "(She rushes toward you.  You'll need to fight or dodge her.)" }
		]
	},
	
	{
		Name: "IntroIsabellaBeforeCollarKey",
		Exit : function () { PlatformEventSet("OliviaCollarKey"); PlatformChar[1].FixDialog = "IntroIsabellaAfterCollarKey"; CommonSetScreen("Room", "Platform") },
		Dialog: [
			{
				Background: "Balcony",
				Character: [{ Name: "Isabella", Status: "Winter", Animation: "Idle" }]
			},
			{ Text: "You finally made it Melody." },
			{
				Text: "Maids must be clean.  Why are you sweaty?",
				Answer: [
					{ Text: "I had a scuffle with other maids.", Reply: "I understand.  They envy your position." },
					{ Text: "I crushed some jealous maids.", Reply: "Very good, you have a sacred duty to to.", Domination: 2 },
					{ Text: "Other maids were mean with me Countess.", Reply: "Get stronger, don't let your sisters step on your toes.", Domination: -2 }
				]
			},
			{
				Text: "Do you know why I gave you the unlocking chore?",
				Answer: [
					{ Text: "I don't know.  Please explain.", Reply: "Because you're strong, you're a protector for Olivia." },
					{ Text: "Because I have a pretty butt.", Reply: "Don't try to be funny, you're better than that.", Love: -2 },
					{ Text: "Because Lady Olivia means the world to me.", Reply: "Absolutely.  You're her knight, her protector.", Love: 2 }
				]
			},
			{ Text: "Since we lost the war and so many of our men died, we need tough women like you." },
			{ Text: "There is strength in you Melody.  I've known this since I found you as a baby in that orphanage." },
			{ 
				Text: "Do you feel worthy of that collar key?",
				Answer: [
					{ Text: "It's an honor to carry that key.", Reply: "(She nods slowly.)  Don't let anyone steal that honor.", Love: 1, Domination: 1 },
					{ Text: "I don't know.  Maybe not.", Reply: "(She shakes her head from left to right.)  You talk better with your actions than your words.", Love: -1, Domination: -1 },
					{ Text: "You should not lock your daughter.", Reply: "Someday you will understand and accept my rules.", Love: -1, Domination: 1 },
					{ Text: "It's a heavy burden to carry.", Reply: "That's true.  Have more faith in yourself girl.", Love: 1, Domination: -1 }
				]
			},
			{ Text: "Enough chit-chat.  Olivia is waiting for you." },
			{ Text: "Go unlock my daughter.  (She gives you the collar key and points toward the hallway.)" },
		]
	},

	{
		Name: "IntroIsabellaAfterCollarKey",
		Exit : function () { CommonSetScreen("Room", "Platform") },
		Dialog: [
			{
				Background: "Balcony",
				Character: [{ Name: "Isabella", Status: "Winter", Animation: "Idle" }]
			},
			{ Text: "Why are you still here?  Go unlock my daughter.  (She points toward the hallway.)" },
		]
	},

	{
		Name: "IntroOliviaBeforeCollarKey",
		Exit : function () { CommonSetScreen("Room", "Platform") },
		Dialog: [
			{
				Background: "BedroomOlivia",
				Character: [{ Name: "Olivia", Status: "Chained", Animation: "Idle" }]
			},
			{ Text: "I'm happy to see you Melody." },
			{
				Text: "Do you have the key for my collar?",
				Answer: [
					{ Text: "Where is that key?", Reply: "(She giggles.)  You know that Mother sleeps with it." },
					{ Text: "No, I'll go get it.", Reply: "(She nods.)  Thanks!  Send my good words to Mother when you see her." },
					{ Text: "Why are you chained?", Reply: "(She sighs.)  I know that Mother's rules aren't easy to understand.  She keeps me chained to the bed so I don't run away or get kidnapped." },
				]
			},
			{ Text: "Countess Isabella is usually on the balcony around that time." },
			{ Text: "Go upstairs and head east to find the balcony." },
			{ Text: "Please get the key so we can start the day." }
		]
	},
	
	{
		Name: "IntroOliviaAfterCollarKey",
		Exit : function () { PlatformEventSet("OliviaUnchain"); PlatformLoadRoom("BedroomOlivia"); CommonSetScreen("Room", "Platform"); },
		Dialog: [
			{
				Background: "BedroomOlivia",
				Character: [{ Name: "Olivia", Status: "Chained", Animation: "Idle" }]
			},
			{ Text: "Melody!  Do you have the key?" },
			{ 
				Text: "Yes, your Mother sends her salutations.",
				Character: [{ Name: "Melody", Status: "Maid", Pose: "Idle" }]
			},
			{ 
				Text: "Great, we have a big day ahead.",
				Character: [{ Name: "Olivia", Status: "Chained", Animation: "Idle" }]
			},
			{ 
				Text: "(She tugs on her neck chain.)",
				Answer: [
					{ Text: "Why are you chained?", Reply: "(She sighs.)  Mother's rules aren't easy to understand.  She keeps me chained so I don't run away or get kidnapped." },
					{ Text: "I like to see you in chains.", Reply: "(She bows her head.)  Mother's rules are very strict, but they are for my own good.  I'm glad you like them.", Domination: 2 },
					{ Text: "An important Lady like you should not be chained.", Reply: "(She nods.)  You're sweet.  Mother's rules are strict but logical.  She's very protective.", Domination: -2 }
				]
			},			
			{
				Text: "Can you unlock me?",
				Answer: [
					{ Text: "Yes.  I will unlock you now.", Reply: "(You unlock her collar and she smiles.)  Thank you very much.  I appreciate." },
					{ Text: "A hug before I unlock you?", Reply: "(You exchange a warm hug before you unlock her.)  You're the best maid around Melody.", Love: 2 },
					{ Text: "You're spoiled.  (Unlock her.)", Reply: "(You unlock her collar and she pouts.)  I know we come from two different realities.", Love: -2 }
				]
			},
			{
				Character: [
					{ Name: "Olivia", Status: "Babydoll", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{ Text: "Thank you very much." },
			{
				Text: "I hope it's not painful or boring to come unlock me every morning.",
				Answer: [
					{ Text: "Seeing you is the best part of my day.", Reply: "(She smiles at you.)  You're so sweet.", Love: 1 },
					{ Text: "It's my duty and honor.", Reply: "(She nods slowly.)  I feel safe knowing you carry that duty.", Domination: 1 },
					{ Text: "I hope I'll get a vacation someday.", Reply: "(She giggles.)  You can ask Mother, but I doubt it will work.", Domination: -1 },
					{ Text: "This is kind of pointless.", Reply: "(She sighs.)  I'm sorry you feel that way.", Love: -1 }
				]
			},
			{ Text: "It's time for my morning soap, please join me in the bathroom." },
			{
				Text: "(She leaves for her bathroom.)",
				Character: [{ Name: "Melody", Status: "Maid", Pose: "Idle" }]
			}
		]
	},

	{
		Name: "OliviaBath",
		Exit : function () { PlatformEventSet("OliviaBath"); PlatformLoadRoom("BathroomOlivia"); CommonSetScreen("Room", "Platform"); },
		Dialog: [
			{
				Background: "BathroomOlivia",
				Character: [{ Name: "Olivia", Status: "Chastity", Pose: "Idle" }]
			},
			{ Text: "A warm bath is the best way to start the day." },
			{
				Text: "Please help me to get inside.",
				Answer: [
					{ Text: "It's my pleasure Lady Olivia.", Reply: "(You help her as she sinks in the bath with a huge smile.)  Such a good maid.", Domination: -1, Love: 1 },
					{ Text: "You're not a child, get in by yourself.", Reply: "You're in a grumpy mood today.  (She goes in the bath.)", Domination: 1, Love: -1 },
					{ Text: "(Help her to get in the bath.)", Reply: "(You help her as she sinks in the bath slowly.)" }
				]
			},
			{ 
				Text: "This is so relaxing.",
				Character: [{ Name: "Olivia", Status: "Chastity", Pose: "Bathing" }]
			},
			{ 
				Text: "(She tugs on her chastity belt and tries to get comfy.)",
				Answer: [
					{ Text: "That belt is cruel but necessary.", Reply: "Yes, cruel and necessary indeed.", Domination: 1 },
					{ Text: "When will you get out?", Reply: "Not until I get married next year." },
					{ Text: "Aren't you afraid it will get rusted?", Reply: "Don't worry, that belt is indestructible.", Domination: -1 }
				]
			},			
			{
				Text: "Would you like to hear why I must wear it?  If you already know that story, we can talk about something else.",
				Answer: [
					{ Text: "Tell me about it.", Reply: "Very well, I'll try not to get lost in the details." },
					{ Text: "I already know.", Reply: "Yes, we already spoke about that belt a few times before.", Goto: "SkipBelt" }
				]
			},
			{ Text: "All women in my family must wear a chastity belt, from puberty until marriage.  My mother Isabella, my sister Camille, my aunts, my grandmother, everyone." },
			{ Text: "It's part of an ancient tradition in House Alberus.  It's almost religious.  The belts cannot be destroyed and never rust." },
			{ Text: "Rumors says we have special powers, and this is a tool to protect us.  They say we are oracles." },
			{ Text: "I'm not sure if it's true.  Mother seems to believe it, but I've never seen her do any magic trick." },
			{ Text: "She told me that she will explain everything on my wedding day.  I wish she wasn't so mysterious." },
			{ Text: "There's only one key for that belt.  It belongs to Duke Sunesk of Slandia, my future husband." },
			{ Text: "When we lost the war against Slandia, the key was one of the tributes we had to offer." },
			{ Text: "I'm getting married next year, I hope the Duke will be a good spouse.  I'm nervous since I've never met him before." },
			{ Text: "Enough rambling.  I don't have the right to be sad or sour.  I have a privileged life." },
			
			{ 
				ID: "SkipBelt",
				Text: "Please start scrubbing Melody.",
				Answer: [
					{ Text: "(Wash her delicately.)", Reply: "(You wash her delicately as she relaxes.)  Put a little more effort my friend.", Domination: -1 },
					{ Text: "(Wash her normally.)", Reply: "(You wash her as she smiles.)  I would be miserable without my bath." },
					{ Text: "(Wash her slowly and passionately.)", Reply: "(She moans as you wash her lovingly.)  Oooooh, Melody.", Love: 2 },
					{ Text: "(Wash her vigorously.)", Reply: "(She gets rigid as you wash her with strength.)  Wow!  I know I'll be clean.", Domination: 1 }
				]
			},

			{ Text: "I've heard you will serve dinner tonight when my sister visits." },
			{ 
				Text: "I haven't seen Camille for two years, since her wedding with Marquess Alister.", 
				Answer: [
					{ Text: "I've always been scared of her.", Reply: "Don't worry, she yells a lot but she won't hurt you.", Domination: -1 },
					{ Text: "Do you miss your sister?", Reply: "I do, even if I don't know her that much.  We've never been close." },
					{ Text: "Let me know if she bullies you.", Reply: "Thanks, I will.  But she probably matured now, it should be fine.", Domination: 1 }
				]
			},
			{ Text: "We are very different but we both did not choose our husband.  Her wedding was arranged at her birth." },
			{ 
				Text: "I have a weird feeling, I hope that tonight's dinner will be pleasant.",
				Answer: [
					{ Text: "It will be a great feast.", Reply: "" },
					{ Text: "What weird feeling?", Reply: "", Love: 1 },
					{ Text: "Don't be chicken.", Reply: "", Love: -1 },
				]
			},
			{ Text: "Sorry if I sound ridiculous.  Can I have a towel?" },
		]
	}
	
];

/**
 * Loads the dialog at a specific position
 * @param {Number} Position - The position # to load
 * @returns {void} - Nothing
 */
function PlatformDialogLoadPosition(Position) {
	PlatformDialogPosition = Position;
	if (Position >= PlatformDialog.Dialog.length) return PlatformDialog.Exit();
	PlatformDialogText = PlatformDialog.Dialog[Position].Text;
	PlatformDialogAnswer = PlatformDialog.Dialog[Position].Answer;
	PlatformDialogAnswerPosition = 0;
	PlatformDialogReply = null;
	PlatformDialogGoto = null;
	if ((Position == 0) || (PlatformDialog.Dialog[Position].Background != null)) PlatformDialogBackground = "../Screens/Room/PlatformDialog/Background/" + PlatformDialog.Dialog[Position].Background;
	if ((Position == 0) || (PlatformDialog.Dialog[Position].Character != null)) PlatformDialogCharacterDisplay = PlatformDialog.Dialog[Position].Character;
}

/**
 * Starts a specific dialog
 * @param {String} DialogName - The name of the dialog to start
 * @returns {void} - Nothing
 */
function PlatformDialogStart(DialogName) {
	PlatformDialog = null;
	for (let Dialog of PlatformDialogData)
		if (Dialog.Name == DialogName)
			PlatformDialog = Dialog;
	if (PlatformDialog == null) return;
	PlatformDialogLoadPosition(0);
	window.removeEventListener("keydown", PlatformEventKeyDown);
	window.removeEventListener("keyup", PlatformEventKeyUp);
	CommonSetScreen("Room", "PlatformDialog");
}

/**
 * Loads the screen
 * @returns {void} - Nothing
 */
function PlatformDialogLoad() {
}

/**
 * Draws the dialog character, text & answers
 * @returns {void} - Nothing
 */
function PlatformDialogDraw() {
	if (PlatformDialogCharacterDisplay != null) {
		let X = 1000 - (PlatformDialogCharacterDisplay.length * 250);
		let Y = 0;
		for (let Character of PlatformDialogCharacterDisplay) {
			if (Character.Pose != null) 
				DrawImage("Screens/Room/PlatformDialog/Character/" + Character.Name + "/" + Character.Status + "/" + Character.Pose + ".png", (Character.X == null) ? X : Character.X, (Character.Y == null) ? Y : Character.Y);
			else 
				if (Character.Animation != null)
					for (let Char of PlatformTemplate)
						if ((Char.Name == Character.Name) && (Char.Status == Character.Status))
							for (let Anim of Char.Animation)
								if (Anim.Name == Character.Animation) {
									let AnimPos = Math.floor(CommonTime() / Anim.Speed) % Anim.Cycle.length;
									DrawImage("Screens/Room/Platform/Character/" + Character.Name + "/" + Character.Status + "/" + Character.Animation + "/" + Anim.Cycle[AnimPos].toString() + ".png", (Character.X == null) ? X - 250 : Character.X, (Character.Y == null) ? Y : Character.Y);
								}
			X = X + 500;
		}
	}
	if (PlatformDialogText != null) {
		let Color;
		let Name;
		let Love;
		let Domination;
		if ((PlatformDialogCharacterDisplay != null) && (PlatformDialogCharacterDisplay.length > 0))
			for (let Character of PlatformDialogCharacter)
				if (Character.Name == PlatformDialogCharacterDisplay[0].Name) {
					Name = (Character.NickName == null) ? Character.Name : Character.NickName;
					Color = Character.Color;
					Love = Character.Love;
					Domination = Character.Domination;
				}
		if (Color == null) Color = "#ffffff";
		if ((PlatformDialogCharacterDisplay != null) && (PlatformDialogCharacterDisplay.length > 0)) {
			if (Name == null) Name = PlatformDialogCharacterDisplay[0].Name;
			DrawEmptyRect(17, 610, 366, 66, Color, 6);
			DrawRect(20, 613, 360, 60, "#000000D0");
			DrawText(Name, 200, 645, Color, "Black");
		}
		DrawEmptyRect(17, 677, 1966, 306, Color, 6);
		DrawRect(20, 680, 1960, 300, "#000000D0");
		if ((PlatformDialogAnswer == null) || (PlatformDialogReply != null)) {
			DrawTextWrap((PlatformDialogReply != null) ? PlatformDialogReply : PlatformDialogText, 75, 700, 1850, 260, Color, null, 6);
		} else {
			DrawTextWrap(PlatformDialogText, 75, 700, 850, 260, Color, null, 6);
			DrawEmptyRect(997, 677, 0, 306, Color, 6);
			let Pos = 0;
			for (let Answer of PlatformDialogAnswer) {
				DrawText(Answer.Text, 1500, 725 + (Pos * 70), "#fe92cf", "Black");
				if (Pos == PlatformDialogAnswerPosition) DrawEmptyRect(1050, 693 + (Pos * 70), 900, 63, "#fe92cf", 4);
				Pos++;
			}
		}
		if ((Love != null) && (Domination != null)) {
			DrawEmptyRect(1617, 610, 366, 66, Color, 6);
			DrawRect(1620, 613, 360, 60, "#000000D0");
			DrawImage("Screens/Room/PlatformDialog/Love.png", 1640, 613);
			DrawImage("Screens/Room/PlatformDialog/Domination.png", 1805, 613);
			DrawText(((Love > 0) ? "+" : "") + Love.toString(), 1755, 645, Color, "Black");
			DrawText(((Domination > 0) ? "+" : "") + Domination.toString(), 1915, 645, Color, "Black");
		}
	}
}

/**
 * Runs and draws the screen.
 * @returns {void} - Nothing
 */
function PlatformDialogRun() {
	if ((PlatformDialogAnswer != null) && MouseIn(1050, 695, 900, 60 + (PlatformDialogAnswer.length - 1) * 70))
		PlatformDialogAnswerPosition = Math.floor((MouseY - 695) / 70);
	PlatformDialogDraw();
}

function PlatformDialogChangeValue(CurrentValue, Change) {
	if ((CurrentValue == null) || (Change == null)) return CurrentValue;
	if ((CurrentValue >= 10) && (Change > 0)) Change = 1;
	if ((CurrentValue <= -10) && (Change < 0)) Change = -1;
	if ((CurrentValue >= 20) && (Change > 0)) Change = 0;
	if ((CurrentValue <= -20) && (Change < 0)) Change = 0;
	return CurrentValue + Change;
}

/**
 * Pick an answer in a specific dialog
 * @param {Number} Position - The position of the answer picked
 * @returns {void} - Nothing
 */
function PlatformDialogPickAnswer(Position) {
	let P = 0;
	for (let Answer of PlatformDialogAnswer) {
		if (Position == P) {
			PlatformDialogReply = Answer.Reply;
			PlatformDialogGoto = Answer.Goto;
			if ((Answer.Love != null) || (Answer.Domination != null))
				if ((PlatformDialogCharacterDisplay != null) && (PlatformDialogCharacterDisplay.length > 0))
					for (let Character of PlatformDialogCharacter)
						if (Character.Name == PlatformDialogCharacterDisplay[0].Name) {
							Character.Love = PlatformDialogChangeValue(Character.Love, Answer.Love);
							Character.Domination = PlatformDialogChangeValue(Character.Domination, Answer.Domination);
						}
		}
		P++;
	}
}

/**
 * Processes the current dialog, can answer or skip to the next phase
 * @returns {void} - Nothing
 */
function PlatformDialogProcess() {
	if ((PlatformDialogAnswer != null) && (PlatformDialogReply == null)) return PlatformDialogPickAnswer(PlatformDialogAnswerPosition);
	if (PlatformDialogGoto != null) {
		let Pos = 0;
		for (let Dialog of PlatformDialog.Dialog) {
			if (Dialog.ID == PlatformDialogGoto)
				return PlatformDialogLoadPosition(Pos);
			Pos++;
		}
	} 
	PlatformDialogLoadPosition(PlatformDialogPosition + 1);
}

/**
 * When the user presses keys in the dialog screen
 * @returns {void} - Nothing
 */
function PlatformDialogKeyDown() {
	if ((KeyPress == 32) || (KeyPress == 13)) PlatformDialogProcess();
	if ((KeyPress == 87) || (KeyPress == 119) || (KeyPress == 90) || (KeyPress == 122)) {
		PlatformDialogAnswerPosition--;
		if (PlatformDialogAnswerPosition < 0) PlatformDialogAnswerPosition = (PlatformDialogAnswer != null) ? PlatformDialogAnswer.length - 1 : 0;
	}
	if ((KeyPress == 83) || (KeyPress == 115)) {
		PlatformDialogAnswerPosition++;
		if ((PlatformDialogAnswer != null) && (PlatformDialogAnswerPosition >= PlatformDialogAnswer.length)) PlatformDialogAnswerPosition = 0;
	}
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformDialogClick() {
	PlatformDialogProcess();
}
