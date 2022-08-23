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
var PlatformDialogCharacter = null;
var PlatformDialogCharacterTemplate = [
	{
		Name: "Melody",
		Color: "#fe92cf",
	},
	{
		Name: "Olivia",
		Color: "#ffffff",
		IdlePose: ["Oracle"],
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
		Name: "Edlaran",
		Color: "#add9a0",
		IdlePose: ["Archer"],
		Love: 0,
		Domination: 0
	},
	{
		Name: "Yuna",
		NickName: "Senior Maid",
		Color: "#efb5ff",
	},
	{
		Name: "Hazel",
		NickName: "Junior Maid",
		Color: "#e1dd57",
	},
	{
		Name: "Lucy",
		NickName: "Guard",
		Color: "#6fd9d3",
	},
	{
		Name: "Vera",
		NickName: "Forest Bandit",
		Color: "#e38d00",
	},
	{
		Name: "Lyn",
		NickName: "Bandit Boss",
		Color: "#c32fce",
	},
];

var PlatformDialogData = [
	{
		Name: "IntroMelody",
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
				Text: "Secondly, I have to clean the dungeon restraints for Countess Isabella.",
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
					{ Name: "Melody", Status: "Maid", Pose: "Idle" },
					{ Name: "Olivia", Status: "Kimono", Pose: "Idle" }
				]
			},
		]
	},

	{
		Name: "JealousMaid",
		Exit : function () { PlatformEventSet("JealousMaid"); },
		Dialog: [
			{
				Background: "CastleHall",
				Character: [{ Name: "Hazel", Status: "Maid", Pose: "Angry" }]
			},
			{ Text: "(As you enter the hallway, you get intercepted by another maid.)" },
			{
				Character: [
					{ Name: "Hazel", Status: "Maid", Pose: "Angry" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				],
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
		Exit : function () { PlatformEventSet("OliviaCollarKey"); PlatformChar[1].Dialog = "IntroIsabellaAfterCollarKey"; },
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
		Exit : function () { PlatformEventSet("OliviaUnchain"); PlatformLoadRoom(); },
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
		Exit : function () { PlatformEventSet("OliviaBath"); PlatformLoadRoom(); },
		Dialog: [
			{
				Background: "BathroomOlivia",
				Character: [{ Name: "Olivia", Status: "Chastity", Animation: "Idle" }]
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
				Background: "Black",
				Character: [{ Name: "Olivia", Status: "Chastity", Pose: "Bathing", X: 0 }]
			},
			{ Text: "(She slides down as her chastity belt makes a loud metallic sound from scraping the bath.)" },
			{
				Text: "Sorry for that noise.  The belt scraped the bath.",
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
			{ Text: "Rumors says we have special powers, and this is a tool to protect us.  They say we are Oracles." },
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
					{ Text: "Camille is a bitch.", Reply: "Please don't say that.  She's my only sister.", Love: -1, Domination: 1 },
					{ Text: "Let me know if she bullies you.", Reply: "Thanks, I will.  But she probably matured now, it should be fine.", Love: 1, Domination: 1 }
				]
			},
			{ Text: "We are very different, but we both did not choose our husband.  Her wedding was arranged at her birth." },
			{
				Text: "I have a weird feeling, I hope that tonight's dinner will be pleasant.",
				Answer: [
					{ Text: "It will be a great feast.", Reply: "(She nods slowly.)  Yes, I should focus on the meal." },
					{ Text: "What weird feeling?", Reply: "Thanks for asking Melody.  I'm scared, but I don't know why.  There's no reason.", Love: 1 },
					{ Text: "Don't be so chicken.", Reply: "(She sighs.)  I guess I'm going crazy.", Love: -1, Domination: 1 },
				]
			},
			{ Text: "Sorry if I sound ridiculous." },
			{
				Text: "I have these strange emotions lately and I cannot control them.",
				Answer: [
					{ Text: "You need better self-control.", Reply: "(She nods slowly.)  I know, Mother also told me that.", Domination: 1 },
					{ Text: "This is really scary.", Reply: "Don't be scared Melody.  Everything will be fine.", Domination: -1 },
					{ Text: "Maybe it's the Oracle in you.", Reply: "(She shrugs.)  I don't know, maybe you're right." },
				]
			},
			{
				Entry: function() {
					if (PlatformDialogGetCharacter("Olivia").Love < 14) PlatformDialogGoto = "Towel";
					PlatformDialogProcess();
				}
			},
			{ ID: "Orgasm", Text: "(She takes a long breath.)  Melody, you're such a dear friend." },
			{ Text: "(She blushes.)  I have a very personal question for you." },
			{
				Text: "How does it feel to have an orgasm?",
				Answer: [
					{ Text: "It's overrated.", Reply: "Please be honest.  You're not my mother.", Love: -1 },
					{ Text: "Why do you ask?", Reply: "(She blushes some more and ponders.)" },
					{ Text: "It's heaven.  I wish I could give you one.", Reply: "(She nods.)  That would be wonderful.", Love: 1 },
					{ Text: "I don't know.  I'm not married.", Reply: "Please be honest.  I know you've had some adventures.", Love: -1 },
				]
			},
			{ Text: "This belt protects me, but also shields me from life's pleasures." },
			{
				Text: "Should I have an orgasm?",
				Answer: [
					{ Text: "Yes, but you might need patience.", Reply: "Yes, lots of patience.  I'm too curious." },
					{ Text: "Yes Lady Olivia.  If only I could help you.", Reply: "You're a wonderful maid.  I'm too curious.", Domination: -1 },
					{ Text: "The Duke of Slandia will take care of that.", Reply: "I know, but I wish I could experiment first.  I'm too curious.", Domination: 1 },
				]
			},
			{ Text: "I bet it feels so nice and relaxing, like spring flowers." },
			{
				Text: "Melody, could you show me an orgasm?",
				Answer: [
					{ Text: "(Nod politely and get naked.)", Reply: "(She smirks as you strip down.)", Domination: -1 },
					{ Text: "My pleasure.  (Get naked.)", Reply: "(She smiles as you strip down.)" },
					{ Text: "Olivia, this is not appropriate.", Reply: "(She bows her head.)  Of course, sorry about that.", Goto: "Towel", Domination: 1 },
					{ Text: "(Blush.)  Sorry, not now.", Reply: "I understand, sorry about that.", Goto: "Towel" },
				]
			},
			{
				Text: "(You slowly get naked and expose your body.)",
				Character: [{ Name: "Melody", Status: "Naked", Pose: "CoverBreast" }]
			},
			{ Text: "It's been a long while since we got naked together." },
			{ Text: "Since we were little girls, way before we became adults." },
			{ Text: "Let me show you an orgasm.  (You wink at her.)" },
			{
				Text: "(You slowly start to masturbate your breast and pussy lips.)",
				Character: [{ Name: "Melody", Status: "Naked", Pose: "Masturbate" }]
			},
			{ Text: "You first need to learn your body and how it reacts." },
			{ Text: "Some prefer the clitoris, others the vagina, and others the butt, breast and more." },
			{ Text: "Discovering your body is both important and fun." },
			{ Text: "(You start to masturbate lovingly and moan lightly.)" },
			{ Text: "Aaaaaaafter some stimulation, the pleasure starts to build." },
			{ Text: "It will grow stronger and stronger, getting you on the edge." },
			{ Text: "Oooooooooonce on the edge, you can go slowly to keep that feeling." },
			{ Text: "Or gain momentum to reach the orgasm." },
			{ Text: "(You masturbate faster and moan loudly.)" },
			{ Text: "Iiiiiiiii'm very cl cl close now." },
			{ Text: "It it it becomes haaaaaaard to stay in control." },
			{ TextScript:  function () { return (PlatformDialogGetCharacter("Olivia").Domination < 0) ? "Can I have my orgasm Lady Olivia?" : "It's time for the climax"; } },
			{
				TextScript:  function () { return (PlatformDialogGetCharacter("Olivia").Domination < 0) ? "Yes, you can have your orgasm my maid." : "(She smiles and watches you carefully.)"; },
				Character: [{ Name: "Olivia", Status: "Chastity", Pose: "Bathing", X: 0 }]
			},
			{
				Entry: function() { PlatformEventSet("OliviaBathOrgasm"); PlatformAddExperience(PlatformPlayer, 10); },
				Text: "Yes!  Yeah!  Eeeeeeeeeeeeaaaaaaaaahhh!",
				Character: [{ Name: "Melody", Status: "Naked", Pose: "MasturbateOrgasm" }]
			},
			{ Text: "(You get a wonderful orgasm right in front of her.)" },
			{ Text: "Aaaaaaahhh, and the moment after the orgasm is also great." },
			{ Text: "I hope you enjoyed the orgasm class." },
			{
				Text: "(You dress back up as she relaxes in the bath with a huge smile.)",
				Character: [{ Name: "Olivia", Status: "Chastity", Pose: "Bathing", X: 0 }]
			},
			{ Text: "Thanks you so much Melody, I've learned a lot." },
			{ ID: "Towel", Text: "Can you give me a towel?  I'd like to get out." },
			{ Text: "(You help her out as she dresses up.)" },
			{
				Background: "BathroomOlivia",
				Character: [{ Name: "Olivia", Status: "Oracle", Pose: "Idle" }]
			},
			{ Text: "Thanks Melody, what is your next duty today?" },
			{
				Text: "I need to go to the dungeon and clean the restraints.",
				Character: [{ Name: "Melody", Status: "Maid", Pose: "Idle" }]
			},
			{
				Text: "Very well, I'll ask the staff to open the gate.",
				Character: [{ Name: "Olivia", Status: "Oracle", Pose: "Idle" }]
			},
			{ Text: "The dungeon is scary, good luck down there." },
			{ Text: "(She heads back to her bedroom.)" }
		]
	},

	{
		Name: "OliviaAfterBath",
		Dialog: [
			{
				Background: "BedroomOlivia",
				Character: [{ Name: "Olivia", Status: "Oracle", Pose: "Idle" }]
			},
			{ Text: "The gate leading downstairs should be open." },
			{ Text: "The dungeon is scary, good luck down there." }
		]
	},

	{
		Name: "IntroGuardBeforeCurse",
		Exit : function () { PlatformEventSet("IntroGuard"); },
		Dialog: [
			{
				Background: "CastleHall",
				Character: [{ Name: "Lucy", Status: "Armor", Pose: "Idle" }]
			},
			{ Text: "(As you enter the first floor, a guard greets you.)" },
			{ Text: "Sorry little maid, you cannot clean here.  We are expecting a prestige guest very soon." },
			{
				Character: [
					{ Name: "Lucy", Status: "Armor", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				],
				Text: "All maids must work upstairs.",
				Answer: [
					{ Text: "What prestige guest?", Reply: "Marchioness Camille of House Alister will be arriving shortly." },
					{ Text: "I will not bother Marchioness Camille.", Reply: "Good, she doesn't want to questioned or bothered." },
					{ Text: "Camille isn't prestigious.", Reply: "Do not be impolite!  Especially when she arrives." },
					{ Text: "I need to clean the dungeon restraints.", Reply: "You're Melody aren't you?  We've been warned by Countess Isabella.", Goto: "End" }
				]
			},
			{
				Character: [{ Name: "Lucy", Status: "Armor", Pose: "Idle" }],
				Text: "Marchioness Camille wants to do a full review of the guards when she arrives."
			},
			{ Text: "It's quite unusual since she doesn't live here anymore." },
			{ Text: "She's a fierce swordswoman as you might know, with a boiling demeanor." },
			{ Text: "You don't want to be there when she comes for the review." },
			{
				Character: [
					{ Name: "Lucy", Status: "Armor", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				],
				Text: "Why did you come downstairs?",
				Answer: [
					{ Text: "I must clean the restraints.", Reply: "You're Melody aren't you?  We've been warned by Countess Isabella." },
					{ Text: "I'm going to the dungeon.", Reply: "To clean the restraints?  We've been warned by Countess Isabella." },
					{ Text: "Countess Isabella gave me a secret mission.", Reply: "(She laughs.)  It's not a secret.  You're here to clean restraints.  We've been warned by Countess Isabella." }
				]
			},
			{
				ID: "End",
				Character: [{ Name: "Lucy", Status: "Armor", Pose: "Idle" }],
				Text: "You may proceed.  Walk the hall to reach the dungeon."
			},
			{ Text: "(She starts to patrol the hallway.)" }
		]
	},

	{
		Name: "IntroGuardAfterCurse",
		Exit : function () { PlatformEventSet("IntroGuardCurse"); },
		Dialog: [
			{
				Background: "CastleHall",
				Character: [{ Name: "Lucy", Status: "Armor", Pose: "Zombie" }]
			},
			{ Text: "(As you enter the hall, a guard stares at you with blank eyes.)" },
			{ Text: "Uuuuueeeeggghh!" },
			{
				Text: "(The guard advances toward you.)",
				Character: [
					{ Name: "Lucy", Status: "Armor", Pose: "Zombie" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				],
				Answer: [
					{ Text: "Wait!", Reply: "(She doesn't listen and charges at you.)" },
					{ Text: "What's going on?", Reply: "(She doesn't listen and charges at you.)" },
					{ Text: "Are you alright?", Reply: "(She doesn't listen and charges at you.)" }
				]
			}
		]
	},

	{
		Name: "CursedMaid",
		Exit : function () { PlatformEventSet("CursedMaid"); },
		Dialog: [
			{
				Background: "CastleHall",
				Character: [{ Name: "Yuna", Status: "Maid", Pose: "Zombie" }]
			},
			{ Text: "(A maid comes to you drooling, her eyes are the same as the guards.)" },
			{ Text: "Aaaaaannngg! Naaaaannnmm!" },
			{
				Text: "(She moves toward you.)",
				Character: [
					{ Name: "Yuna", Status: "Maid", Pose: "Zombie" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				],
				Answer: [
					{ Text: "Wake up sister!", Reply: "(She doesn't seem to understand and charges at you.)" },
					{ Text: "Go away or I'll kick your butt.", Reply: "(She doesn't seem to understand and charges at you.)" },
					{ Text: "You seem brighter than usual.", Reply: "(She charges at you brainlessly.)" },
					{ Text: "(Fight her.)", Reply: "(She charges at you brainlessly.)" }
				]
			}
		]
	},

	{
		Name: "IntroEdlaranBeforeCurseStart",
		Exit : function () { PlatformEventSet("EdlaranIntro"); PlatformLoadRoom(); },
		Dialog: [
			{
				Background: "DungeonCell",
				Character: [{ Name: "Edlaran", Status: "Chained", Pose: "Idle" }]
			},
			{ Text: "Hey!  Hey maid!  Can you help me?" },
			{
				Text: "Can you unlock me?",
				Answer: [
					{ Text: "Why are you chained?", Reply: "For no reason.  I swear it's true!" },
					{ Text: "You know you're a cute prisoner?", Reply: "(She blushes.)  Well thanks, I guess.", Domination: 1, Love: 1 },
					{ Text: "There's too many rats in that dungeon.", Reply: "(She grumbles.)  That's not very kind!", Love: -2 },
					{ Text: "This is cruel and inhumane.", Reply: "(She nods.)  That's very true girl.", Domination: -1, Love: 1 }
				]
			},
			{ Text: "The manor guards jumped on me without any reason or warning." },
			{ Text: "They chained me up and locked me in that cell." },
			{
				Text: "Release me before they come back.",
				Answer: [
					{ Text: "You must be lying.", Reply: "Fine!  I admit I was inside the manor without permission.", Love: -1 },
					{ Text: "It's hard to believe.", Reply: "Alright, I was inside the manor without permission." },
					{ Text: "The guards can be too strict.", Reply: "Yeah, simply because I was inside the manor without permission.", Love: 1 }
				]
			},
			{ Text: "Is it a crime to enter a building without being invited?  Don't answer." },
			{ Text: "These silly guards think I'm a thief, it's so unfair." },
			{
				Text: "They must be racist.",
				Answer: [
					{ Text: "Racist?  Why?", Reply: "(She wiggles her ears.)  Isn't it obvious?  I'm an elf.", Domination: -1 },
					{ Text: "Elves have a bad reputation?", Reply: "I don't know, it's the first time I come here." },
					{ Text: "It's not racism.  They enforce the law.", Reply: "(Sighs.)  Well the law is unfair then.", Domination: 1 },
				]
			},
			{ Text: "I'm Edlaran by the way, a wood elf archer." },
			{ Text: "I protect travellers, but we were attacked by zombies." },
			{ Text: "I came here for help, but they wanted to take my bow, so I aimed for a guard." },
			{ Text: "Is it a crime to threaten a guard?  Don't answer."},
			{ Text: "So after an unsuccessful negotiation, they threw me in jail."},
			{
				Text: "Enough about me.  Who are you?",
				Answer: [
					{ Text: "I'm Melody, it's a pleasure to meet you.", Reply: "(She nods happily.)  Same here.", Love: 1 },
					{ Text: "I'm Melody the manor maid.  (Do a curtsy.)", Reply: "You're a good maid.", Domination: -1 },
					{ Text: "I'm Melody.", Reply: "Very good Melody." },
					{ Text: "I'm Melody, remember that name little elf.", Reply: "(She gulps and nods.)  Yes Miss.", Domination: 1 },
				]
			},
			{ Text: "Now that we know each other, can you help?" },
			{
				Text: "Will you unlock me?",
				Answer: [
					{ Text: "It's not my job.", Reply: "(She grumbles.)  Fine, go clean some furniture." },
					{ Text: "I don't want trouble with the guards.", Reply: "(She sighs.)  I'll show you real trouble someday.", Domination: -1 },
					{ Text: "I don't have the key.", Reply: "(She pouts.)  Thanks anyway.", Love: 1 },
					{ Text: "Thieves must be punished.", Reply: "(She gets angry.)  I'm not a thief!", Domination: 1, Love: -1 }
				]
			},
			{ Text: "(She gets grumpy and stops talking.)" },
		]
	},

	{
		Name: "IntroEdlaranBeforeCurseEnd",
		Dialog: [
			{
				Background: "DungeonCell",
				Character: [{ Name: "Edlaran", Status: "Chained", Pose: "Idle" }]
			},
			{ Text: "Have you changed your mind?" },
			{
				Text: "Will you unlock me?",
				Answer: [
					{ Text: "It's not my job.", Reply: "(She grumbles.)  Fine, go clean some furniture." },
					{ Text: "I don't want trouble with the guards.", Reply: "(She sighs.)  I'll show you real trouble someday." },
					{ Text: "I don't have the key.", Reply: "(She pouts.)  Thanks anyway." },
					{ Text: "Thieves must be punished.", Reply: "(She gets angry.)  I'm not a thief!" }
				]
			},
			{ Text: "(She gets grumpy and stops talking.)" },
		]
	},

	{
		Name: "IntroEdlaranAfterCurseStart",
		Exit : function () { PlatformEventSet("EdlaranCurseIntro"); PlatformLoadRoom(); },
		Dialog: [
			{
				Background: "DungeonCell",
				Character: [{ Name: "Edlaran", Status: "Chained", Pose: "Idle" }]
			},
			{ TextScript:  function () { return (PlatformEventDone("EdlaranIntro")) ? "Is it you Melody?  Are you a zombie?" :  "Hey!  I'm Edlaran, a wood elf, are you a zombie?"; } },
			{
				Text: "Talk to me maid.",
				Answer: [
					{ Text: "Don't be scared.  I'm not a zombie.", Reply: "Thanks a lot.  Something is very wrong.", Domination: 1 },
					{ Text: "I'm fine, but the guards are going nuts.", Reply: "Yes, something is very wrong." },
					{ Text: "UeeeehhgggAHAHAHA!  Just kidding.", Reply: "That's not funny!  Something is very wrong.", Love: -1 },
				]
			},
			{ Text: "The guards have a dead look in their eyes, they only mumble." },
			{ Text: "I've tried offering them some gold or a favor but they were not interested." },
			{ Text: "Is it a crime to bribe a guard?  Don't answer." },
			{
				Text: "What is going on with them?",
				Answer: [
					{ Text: "They fallen for your pretty face.", Reply: "(She blushes.)  You sure pick your time to flirt.", Love: 1 },
					{ Text: "Some magic is going on.", Reply: "You're probably right, but I don't know magic." },
					{ Text: "I don't know, but I'm scared.", Reply: "I understand, this is scary indeed.", Domination: -1 },
					{ Text: "Maybe they are undead.", Reply: "Yes, some kind of zombies, this is scary." },
				]
			},
			{ Text: "At first, there was a loud woman scream." },
			{ Text: "Then it went pitch black for a minute in here." },
			{
				Text: "What was that darkness?",
				Answer: [
					{ Text: "Whatever it was, it's a bad omen.", Reply: "Yes, something evil is brewing.", Domination: -1 },
					{ Text: "It could be a solar eclipse.", Reply: "(She nods.)  Yes, it makes a lot of sense.", Love: 1 },
					{ Text: "I will investigate it later.", Reply: "That's great to hear.", Domination: 1 },
					{ Text: "I don't know what you're talking about.", Reply: "Don't pretend you did not see it.", Love: -1 },
				]
			},
			{ Text: "It's dangerous to keep me here in chains.  I could be killed." },
			{ Text: "If you find the key for my shackles, can you release me?" },
			{ Text: "One of the guards must have that key.  I don't know which one." },
			{ Text: "Please find the key and come back to rescue me.  I'll repay you." }
		]
	},

	{
		Name: "IntroEdlaranAfterCurseEnd",
		Dialog: [
			{
				Background: "DungeonCell",
				Character: [{ Name: "Edlaran", Status: "Chained", Pose: "Idle" }]
			},
			{ Text: "It's dangerous to keep me here in chains.  I could be killed." },
			{ Text: "If you find the key for my shackles, can you release me?" },
			{ Text: "One of the guards must have that key.  I don't know which one." },
			{ Text: "Please find the key and come back to rescue me.  I'll repay you." }
		]
	},

	{
		Name: "EdlaranUnlock",
		Exit : function () { PlatformEventSet("EdlaranUnlock"); PlatformLoadRoom(); },
		Dialog: [
			{
				Background: "DungeonCell",
				Character: [{ Name: "Edlaran", Status: "Chained", Pose: "Idle" }]
			},
			{ Text: "Melody!  Have you found the key?" },
			{
				Text: "Will you unlock me?",
				Answer: [
					{ Text: "Sure, it's too dangerous right now.", Reply: "(She nods happily.)  Absolutely." },
					{ Text: "Yes, but you will owe me a favor.", Reply: "(She gulps.)  Very good, I swear I'll repay you somehow someday.", Domination: 1 },
					{ Text: "Of course, elves are too important to be chained.", Reply: "(She nods slowly.)  Well said little maid.", Domination: -1 },
					{ Text: "Not right now.  (Leave her.)", Script: function() { PlatformDialogLeave(); } },
				]
			},
			{
				Text: "(You unlock her shackles as she gathers her equipment.)",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{ Text: "Thanks a lot Melody.  (She stretches happily.)" },
			{
				Text: "How about a hug?",
				Answer: [
					{ Text: "Alright, let's do a quick hug.", Reply: "(You exchange a friendly hug.)", Love: 1 },
					{ Text: "It's not the best time.", Reply: "(She pouts.)  I guess you're right.", Love: -1 },
					{ Text: "(Give her a long loving hug.)", Reply: "(You exchange a long and warm hug.)", Love: 2 },
					{ Text: "Don't touch me.", Reply: "Oh!  Alright then.", Love: -2 },
				]
			},
			{ Text: "I'll try to escape while I can." },
			{
				Text: "What will you do?",
				Answer: [
					{ Text: "My duty is to protect Lady Olivia.", Reply: "You're her maid in shiny armor.  (She giggles.)", Domination: 1 },
					{ Text: "I'll check for Countess Isabella.", Reply: "Good luck with that, whoever that is." },
					{ Text: "I'll find a place to hide.", Reply: "Find a broom closet.  (She laughs.)", Domination: -1 },
				]
			},
			{ Text: "See you later Melody.  I'll repay you someday." },
			{ Text: "(She leaves the room.)" },
		]
	},

	{
		Name: "EdlaranBedroomIsabella",
		Exit : function () { PlatformEventSet("EdlaranBedroomIsabella"); PlatformLoadRoom(); },
		Dialog: [
			{
				Background: "BedroomIsabella",
				Character: [{ Name: "Edlaran", Status: "Archer", Pose: "Idle" }]
			},
			{ Text: "(Edlaran is searching in Countess Isabella armoire.)" },
			{ Text: "Oh!  Hello Melody.  (She looks surprised.)" },
			{
				Text: "What's going on?",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				],
				Answer: [
					{ Text: "I'm patrolling for thieves.", Reply: "(She looks around.)  Thieves?  I hope you're not talking about me.", Love: -1, Domination: 1 },
					{ Text: "Why are you in the Countess bedroom?", Reply: "I...  I was...  I got lost!  This place is confusing." },
					{ Text: "Did you found any good loot?", Reply: "(She shakes her head no.)  Not yet, but we could share if I do.", Love: 1 },
					{ Text: "Stealing is wrong you know.", Reply: "You sound like my mother.  I'm not stealing.", Love: -1, Domination: -1 },
				]
			},
			{ Text: "I was trying to leave the manor, but the guards chased me down." },
			{ Text: "I ran upstairs, but the maids are also nuts." },
			{ Text: "I found this comfy room to catch my breath, and checked this armoire while I was there." },
			{ Text: "Is it a crime to search in a random armoire?  Don't answer." },
			{ Text: "Look!  There are lots of kinky toys in here." },
			{ Text: "(She shows you a pile of gags and restraints that belongs to Countess Isabella.)" },
			{
				Text: "What is that for?",
				Answer: [
					{ Text: "The Countess secret garden should stay secret.", Reply: "You're so boring, aren't you a little curious?", Love: -1 },
					{ Text: "It's used to lock up cute elves.", Reply: "(She blushes.)  You're very direct for a maid.", Love: 1, Domination: 1 },
					{ Text: "These are tools punish servants like me.", Reply: "(She laughs.)  I must get punished all the time.", Domination: -1 },
				]
			},
			{ Text: "I bet she uses these naughty toys when lovers come by." },
			{ Text: "She might be the Dominant, the submissive or switch roles." },
			{ Text: "She's probably very naughty.  (She giggles.)" },
			{
				Entry: function() {
					if (PlatformDialogGetCharacter("Edlaran").Domination >= 4) PlatformDialogGoto = "Dominant";
					else if (PlatformDialogGetCharacter("Edlaran").Domination <= -4) PlatformDialogGoto = "Submissive";
					else PlatformDialogGoto = "End";
					PlatformDialogProcess();
				}
			},

			{
				ID: "Dominant",
				Text: "(You grab a few cuffs and look at her.)",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "CleanRestraints" }
				]
			},
			{
				Text: "What are you doing with these restraints?",
				Answer: [
					{ Text: "Turn around and give me your hands.", Reply: "(She turns slowly as you lock and chain her.)" },
					{ Text: "(Snap them on her forcefully).", Reply: "(She grumbles as you lock and chain her.)", Love: -1, Domination: 1 },
					{ Text: "You need to put them back.", Reply: "(She nods.)  Yeah, yeah, I know.", Goto: "End" },
				]
			},
			{
				Character: [
					{ Name: "Edlaran", Status: "Chained", Pose: "Kneel" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{ Text: "This is really tight Miss Melody." },
			{
				Text: "Why did you lock me up?",
				Answer: [
					{ Text: "So you can please me sweetie.", Reply: "(She nods and crawls under your skirt.)", Love: 1 },
					{ Text: "(Pull her head under your skirt).", Reply: "(You pull her head under your skirt.)", Domination: 1 },
					{ Text: "To see you struggle.", Reply: "(She struggles for your pleasure before you release her.)", Goto: "End" },
				]
			},
			{ Character: [{ Name: "Edlaran", Status: "Chained", Pose: "KneelUnderMaidMelodySkirt" }] },
			{ Text: "(She clumsily pull down your panties with her teeth.)" },
			{ Text: "(You hear her lick her lips before approaching your clitoris.)" },
			{ Text: "(She licks you slowly and lovingly, making you moan silently.)" },
			{ Text: "(You push her deeper inside as she starts working on your pussy lips.)" },
			{ Text: "(She explores your pussy with her tongue as you moan of pleasure.)" },
			{
				Text: "(You're about to climax.)",
				Answer: [
					{ Text: "Please help me cum.", Reply: "(She goes faster to help you reach a tremendous orgasm.)", Love: 1, Domination: -1 },
					{ Text: "EDLARAAAAAAAN! YES!", Reply: "(You scream and reach a tremendous orgasm.)", Love: 1 },
					{ Text: "That's enough.  (Push her back.)", Reply: "(She pouts as you push her back and release her.)  You were so close.", Love: -2, Goto: "End" },
				]
			},
			{ Character: [{ Name: "Edlaran", Status: "Chained", Pose: "KneelUnderMaidMelodySkirtOrgasm" }] },
			{ Text: "(You slowly catch your breath after a long and powerful orgasm.)" },
			{ Text: "(You pet her head gently to reward her, while recovering from the pleasure wave.)" },
			{ Text: "I hope you enjoyed it Miss Melody.  (You push her back and unlock her.)" },
			{ Entry: function() { PlatformEventSet("EdlaranCountessBedroomOrgasmDom"); PlatformAddExperience(PlatformPlayer, 10); PlatformDialogGoto = "End"; PlatformDialogProcess(); } },

			{ ID: "Submissive", Text: "(She grabs a few cuffs and looks at you.)" },
			{
				Text: "I have a wild idea.",
				Answer: [
					{ Text: "I don't like the look on your face.", Reply: "Turn around and you won't see it.  (She turns you around and chains you.)", Love: -1 },
					{ Text: "What's on your mind?", Reply: "It's a surprise!  (She turns you around and chains you.)" },
					{ Text: "(Turn around and present your hands.)", Reply: "Such a good maid.  (She cuffs and chains you.)", Domination: -1 },
					{ Text: "Don't you dare!", Reply: "Fine!  You're no fun.", Love: -1, Domination: 1, Goto: "End" },
				]
			},
			{
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "ChainedKneel" }
				]
			},
			{ Text: "(You tug on the cuffs and chains to test them.)" },
			{
				Text: "You know what's coming next?",
				Answer: [
					{ Text: "I know who's coming.  (Wink at her.)", Reply: "(She laughs and removes her pants and undies.)", Love: 1 },
					{ Text: "(Stay silent and nod slowly.)", Reply: "(She smirks and removes her pants and undies.)", Domination: -1 },
					{ Text: "Next time you'll do it for me.", Reply: "(She shakes her head no and removes her pants and undies.)", Domination: 1 },
				]
			},
			{
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "NoPants" },
					{ Name: "Melody", Status: "Maid", Pose: "ChainedKneel" }
				]
			},
			{ Text: "Come here little maid, don't be shy." },
			{ Text: "(She snaps her fingers as you slowly crawl next to her.)" },
			{ Character: [{ Name: "Edlaran", Status: "Archer", Pose: "LickedByMaidMelody" }] },
			{ Text: "(You lick her slowly and skillfully, making her shiver from pleasure.)" },
			{ Text: "(She pulls you deeper inside as you start working on her pussy lips.)" },
			{ Text: "(You explore her pussy with your tongue as she moans of pleasure.)" },
			{
				Text: "(She's about to climax.)",
				Answer: [
					{ Text: "(Tease her some more.)", Reply: "(She moans loudly for a long time and finally reaches a great orgasm.)", Love: 1 },
					{ Text: "(Try to give her the best orgasm of her life.)", Reply: "(She screams from the pleasure and reaches a tremendous orgasm.)", Love: 2 },
					{ Text: "(Pull back suddenly.)", Reply: "(She grumbles as you pull back before her orgasm.)  That was cruel!  (She releases you and dresses back.)", Domination: 1, Love: -2, Goto: "End" },
				]
			},
			{ Character: [{ Name: "Edlaran", Status: "Archer", Pose: "LickedByMaidMelodyOrgasm" }] },
			{ Text: "Wow!  Simply wow!  (She tries to recover from her powerful orgasm.)" },
			{ Text: "That was amazing Melody, you're the best maid ever." },
			{ Text: "(She slowly pushes you back and releases you.)" },
			{ Entry: function() { PlatformEventSet("EdlaranCountessBedroomOrgasmSub"); PlatformAddExperience(PlatformPlayer, 10); PlatformDialogGoto = "End"; PlatformDialogProcess(); } },

			{
				ID: "End",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				],
				Text: "(She puts the kinky items back in the armoire.)"
			},
			{ Text: "Time flies too quickly, I need to go." },
			{ Text: "I haven't forgot my promise Melody.  I'll repay you someday." },
			{ Text: "(She leaves the room.)" },
		]
	},

	{
		Name: "EdlaranWineCellar",
		Exit : function () { PlatformEventSet("EdlaranWineCellar"); PlatformLoadRoom(); },
		Dialog: [
			{
				Background: "WineCellar",
				Character: [{ Name: "Edlaran", Status: "Archer", Pose: "Flirt" }]
			},
			{ Text: "(Edlaran is tasting some wine.  She opened a few bottles from the Countess cellar.)" },
			{ Text: "(She hiccups and turns to you.)  Meldy!  (She looks a little tipsy.)" },
			{ Text: "Ish it a crime to open wine battles?  Don't ansher." },
			{
				Text: "Are you thristy?",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Flirt" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				],
				Answer: [
					{ Text: "Party time!  (Drink with her.)", Reply: "(You open another bottle and share a good time.)", Love: 1 },
					{ Text: "Sure, one glass.  (Have a glass.)", Reply: "(You try a glass of wine from the Countess cellar.)" },
					{ Text: "No, drinking is bad for your health.", Reply: "You no fun!  (She hiccups.)  Shcared of wine.", Domination: -1, Love: -1 },
					{ Text: "No, this is stolen wine.", Reply: "(She pouts.)  Why are you sho sherious?", Domination: 1, Love: -1 },
				]
			},
			{
				Entry: function() {
					if (PlatformDialogGetCharacter("Edlaran").Love < 4) PlatformDialogGoto = "End";
					PlatformDialogProcess();
				}
			},
			{ Text: "Meldy, you're shuch a good friend.  (She gives you a hug.)" },
			{ Text: "You're a shuper... friend.  (She hugs you some more.)" },
			{ Text: "How about I (She hiccups.) repay you now?  I'll help you in bottles." },
			{ Text: "Gimme a minute to shober up and I'll fight for you." },
			{ Text: "(Edlaran joined your party.  You can switch your active character at any save point.)" },
			{ Entry: function() { PlatformEventSet("EdlaranJoin"); PlatformPartyBuild(); PlatformLoadRoom(); PlatformDialogLeave(); } },
			{ ID: "End", Text: "Drinking ish fun, but we have important shtuff to... do." },
			{ Text: "Shee you later Meldy.  I'll repay you some (She hiccups.) day." },
			{ Text: "(She leaves the room.)" },

		]
	},

	{
		Name: "ChestRestraintsBeforeCurse",
		Exit : function () { PlatformEventSet("Curse"); PlatformLoadRoom(); },
		Dialog: [
			{
				Text: "(There's a huge metal chest.)",
				Background: "DungeonStorage",
				Character: [{ Name: "Chest", Status: "Metal", Pose: "Idle", X: 500 }],
			},
			{
				Text: "(It contains the dungeon restraints.)",
				Answer: [
					{ Text: "(Clean the restraints.)", Reply: "(You open the chest.)" },
					{ Text: "(Go do something else.)", Script: function() { PlatformDialogLeave(); } },
				]
			},
			{
				Text: "(There are many cuffs, shackles, chains and collars.)",
				Character: [{ Name: "Melody", Status: "Maid", Pose: "CleanRestraints" }]
			},
			{ Text: "(You start cleaning restraints one by one.)" },
			{ Text: "(It's a lot of work, it will take you many hours.)" },
			{ Text: "(You clean, scrub, oil and repair the restraints.)" },
			{
				Background: "DungeonStorageDark",
				Character: [{ Name: "Melody", Status: "Maid", Pose: "CurseStart" }],
				Text: "(As you finish your work, everything goes dark.)"
			},
			{ Text: "(You hear a loud woman scream coming from upstairs.)" },
			{ Text: "(The scream fades and everything becomes very silent.)" },
			{ Text: "(The world around you is dark, silent and oppressing.)" },
			{
				Background: "DungeonStorage",
				Character: [{ Name: "Melody", Status: "Maid", Pose: "CleanRestraints" }],
				Text: "(After a minute, the sun starts to shine again.)"
			},
			{ Text: "(You finish cleaning in a hurry and leave the chest.)" },
		]
	},

	{
		Name: "ChestRestraintsAfterCurse",
		Dialog: [
			{
				Text: "(The dungeon restraints are clean.)",
				Background: "DungeonStorage",
				Character: [{ Name: "Chest", Status: "Metal", Pose: "Idle", X: 500 }]
			}
		]
	},

	{
		Name: "OliviaCurseIntro",
		Exit : function () { PlatformEventSet("OliviaCurseIntro"); PlatformLoadRoom(); },
		Dialog: [
			{
				Text: "Melody!  (She tugs on the cuffs in vain.)",
				Background: "BedroomOliviaFloor",
				Character: [{ Name: "Olivia", Status: "Oracle", Animation: "Bound", Y: -400 }]
			},
			{
				Text: "I'm relieved to see you.",
				Answer: [
					{ Text: "Who dared to touch you?", Reply: "(She bows her head slowly.)", Domination: 1 },
					{ Text: "Poor Lady Olivia.", Reply: "I know this is scary Melody.", Domination: -1 },
					{ Text: "What happened?", Reply: "(She takes a long deep breath.)" },
					{ Text: "(Spank her butt.)  You're cute in chains.", Reply: "(She whimpers and blushes.)  Thanks, but it's not the best time to be flirty.", Domination: 2, Love: 1, Perk: true }
				]
			},
			{ Text: "My sister Camille came from far away to visit the family." },
			{ Text: "She had a stern look on her face and her voice was weird." },
			{ Text: "She talked privately with Mother for a long while, I think they had an argument." },
			{ Text: "I was hiding from the dispute in my room when darkness fell suddenly." },
			{
				Text: "Everything was black.",
				Answer: [
					{ Text: "Did you hear that horrible scream?", Reply: "(She blushes.)  Sorry about that.  I did that scream.", Love: -1 },
					{ Text: "I heard a woman scream.", Reply: "(She sighs.)  I did that scream." },
					{ Text: "I heard your voice in the dark.", Reply: "Wow, you recognized my scream from the dungeon?", Love: 1 },
					{ Text: "I was terrified from a loud scream Miss.", Reply: "(She nods.)  Don't be scared Melody, I did that scream.", Domination: -2, Perk: true }
				]
			},
			{ Text: "When darkness came, the maids came in my room with strange eyes." },
			{ Text: "They started to grab me, so I screamed.  Louder than I ever did." },
			{ Text: "I don't know what happened, but glass shattered everywhere and the maids fell unconscious." },
			{ Text: "I was scared and trembling, then Camille entered my room as light came back." },
			{ Text: "She slapped me and locked me up in these chains.  She said it was to protect me." },
			{ Text: "Camille took the key for these shackles and left me hogtied on the floor." },
			{
				Text: "I've been stuck since then.",
				Answer: [
					{ Text: "I'll go kick her butt.", Reply: "Do you really think violence is the answer?  Be careful.", Domination: 1, Love: -1 },
					{ Text: "Maybe I can beg her for the key.", Reply: "Negotiation might be possible, but be careful.", Domination: -1, Love: 1 },
					{ Text: "I'll see what I can do.", Reply: "(She nods.)  Be careful Melody." },
					{ Text: "There will be blood!", Reply: "(She struggles.)  Please don't kill her Melody, she's my sister.", Domination: 2, Love: -2, Perk: true }
				]
			},
			{ Text: "Camille is very dangerous, she might kill you." },
			{ Text: "I think she went upstairs, maybe she's still there." },
			{ Text: "Best of luck if you go there." }
		]
	},

	{
		Name: "OliviaCurse",
		Dialog: [
			{
				Text: "Please be careful Melody.",
				Background: "BedroomOliviaFloor",
				Character: [{ Name: "Olivia", Status: "Oracle", Animation: "Bound", Y: -400 }]
			},
			{ Text: "Camille is very dangerous, she might kill you." },
			{ Text: "I think she went upstairs, maybe she's still there." },
			{ Text: "Best of luck if you go there." }
		]
	},

	{
		Name: "OliviaCurseRelease",
		Exit : function () { PlatformEventSet("OliviaCurseRelease"); PlatformPartyBuild(); PlatformLoadRoom(); },
		Dialog: [
			{
				Text: "Melody!  Are you alright?",
				Background: "BedroomOliviaFloor",
				Character: [{ Name: "Olivia", Status: "Oracle", Animation: "Bound", Y: -400 }]
			},
			{
				Text: "Yes, I found your sister Camille in the Countess Hall.",
				Background: "BedroomOlivia",
				Character: [{ Name: "Melody", Status: "Maid", Pose: "Idle" }]
			},
			{ Text: "She's behind that strange curse that's affecting everyone but us." },
			{ Text: "She was looking for Countess Isabella." },
			{ Text: "We talked a little but she got mad and attacked me." },
			{ Text: "I was able to knock her down and restrain her." },
			{ Text: "She gave me this key to rescue you." },
			{ Text: "(You unlock Olivia.)" },
			{
				Text: "(She stretches happily.)  Thank you so much Melody.",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{
				Text: "You're the best.",
				Answer: [
					{ Text: "It's my pleasure and duty.", Reply: "You're a wonderful protector.", Love: 1, Domination: 1 },
					{ Text: "I would do anything for you.", Reply: "You're the best friend ever.", Love: 2, Perk: true },
					{ Text: "Don't mention it.", Reply: "You're such a good friend.", Love: 1, Perk: false },
					{ Text: "(Do a maid curtsy.)", Reply: "You're a wonderful maid.", Domination: -1, Love: 1 },
				]
			},
			{ Text: "(Everything goes dark suddenly.)", Background: "BedroomOliviaDark" },
			{
				Text: "What's going on?",
				Answer: [
					{ Text: "I don't know.  This is scary.", Reply: "(She nods.)  Maybe it's another curse from Camille.", Domination: -1 },
					{ Text: "Another curse?", Reply: "Yes, it could be another curse." },
					{ Text: "Don't be afraid.  I'm here.", Reply: "(She gets closer to you.)  Maybe it's another curse from Camille.", Domination: 1 },
					{ Text: "(Hold her in your arms.)", Reply: "(You hold each other close for a little while.)", Love: 1, Perk: true },
				]
			},
			{ Text: "Could she have more magic tricks?" },
			{ Text: "She's restrained, she could be in danger." },
			{ Text: "(Darkness fades after a few seconds.)", Background: "BedroomOlivia" },
			{ Text: "It was faster than the previous time.  Is that a good sign?" },
			{ Text: "Let's go check for Camille.  I'm worried for her." },
			{ Text: "(Olivia joined your party.  You can switch your active character at any save point.)" },
		]
	},

	{
		Name: "OliviaLearnMagic",
		Dialog: [
			{
				Background: "Black",
				Character: [{ Name: "Olivia", Status: "Oracle", Pose: "Flustered" }]
			},
			{ Text: "(Olivia seems to be sweating and breathing heavily.)" },
			{
				Text: "M... M, M... Melody!",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "Flustered" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				],
				Answer: [
					{ Text: "That's my name.", Reply: "It's...  It's no time for jokes...  It's...  It's the belt...", Love: -1 },
					{ Text: "Are you in distress Miss Olivia?", Reply: "(She nods quickly.)  It's...  It's the belt...", Domination: -1 },
					{ Text: "Who dared to touch you?", Reply: "No...  No one...  It's...  It's the belt...", Domination: 1 },
					{ Text: "Was your belt activated?", Reply: "Yes!  (She nods quickly.)  Y, y, yes...  The belt...", Love: 1, Perk: true }
				]
			},
			{ Text: "It's moving!  (She shivers without much control.)" },
			{
				Text: "What...  What is going on?",
				Answer: [
					{ Text: "I don't know.", Reply: "Why...  Why is it moving like that?" },
					{ Text: "Everything will be fine sweetie.", Reply: "You...  You think?  Why is it moving like that?", Love: 1 },
					{ Text: "That belt is cursed.", Reply: "It's...  It's a family tradition.  Why is it moving like that?", Love: -1 },
					{ Text: "I'm scared Lady Olivia.", Reply: "Don't worry...  Ever...  Everything will be aaaaaa....", Domination: -1, Perk: true }
				]
			},
			{ Text: "AaaaaaaAAAAHHH!" },
			{ Text: "(She starts to breath faster and faster.)" },
			{ Text: "MELODY!  Why...  Why am I sweating?" },
			{
				Text: "Why am I so wet?",
				Answer: [
					{ Text: "The chastity belt is training you.", Reply: "T... Train...  Training me?  What...", Domination: 1 },
					{ Text: "I'm sorry, I cannot help you.", Reply: "D....  Don't worry...  You're a good...", Domination: -1 },
					{ Text: "Relax and enjoy.  (Caress her hair.)", Reply: "R.... Relax?   En... En, en, enjoy...", Love: 1 },
					{ Text: "Wake your naughty side.", Reply: "W... What?  No, no, no.  I cannot...", Love: -1 }
				]
			},
			{ Text: "(She falls on her knees.)", Character: [{ Name: "Olivia", Status: "Oracle", Pose: "KneelOrgasm", Y: -400 }] },
			{ Text: "Aaaaahhh!  AAAAAAaaahhhh!" },
			{ Text: "EEEEEEEEEEEEEAAAAAAAAAAAAAAAAAHHHHHH!!!" },
			{ Text: "(She gets a shattering orgasm right in front of you.)" },
			{ Text: "(Everything goes dark for a second and becomes bright again.)" },
			{ Text: "(Her powerful scream rings in your ears, giving you a headache.)" },
			{ Text: "Oh..." },
			{ Text: "Melody..." },
			{
				Text: "(She stands up.)",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "Flustered" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				],
			},
			{ Text: "It stopped moving." },
			{
				Text: "I'm sorry.",
				Answer: [
					{ Text: "It's fine.  Are you alright?", Reply: "I don't know." },
					{ Text: "Welcome to heaven.", Reply: "That was so...  so wonderful.", Love: 1 },
					{ Text: "That scream was horrible.", Reply: "I know, I could not control it.", Love: -1 },
					{ Text: "You're a woman now, an Oracle.", Reply: "(She nods.)  You might be right.", Domination: 1, Perk: true }
				]
			},
			{ Text: "I feel weird.  I feel different." },
			{ Text: "It's like I've been sleeping and now I'm awake." },
			{ Text: "Why did it become dark?  It's probably the same power that Camille is using." },
			{ Text: "Let's head out, there's something I'd like to try." },
			{ Text: "(Olivia can now use magic.  Her magic points will be shown in the upper corner.)" },
			{ Text: "(Use the K key to scream and harm all enemies in the current area.)" }
		]
	},

	{
		Name: "CamilleIntro",
		Dialog: [
			{
				Background: "CountessHall",
				Character: [{ Name: "Camille", Status: "Armor", Pose: "Angry" }]
			},
			{ Text: "(As you enter the countess hall, you can see Camille next to a closed iron gate.)" },
			{ Text: "(She yells at the gate furiously and doesn't seem to notice you.)" },
			{ Text: "Mother!  I swear on my blade and Father's grave that I will kill you if you don't open the gate." },
			{ Text: "OPEN NOW!  (She kicks the iron gate but nothing happens.)" },
			{ Text: "(She turns around and sees you.)" },
			{
				Text: "Melody.  It's been a while.",
				Character: [
					{ Name: "Camille", Status: "Armor", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" },
				]
			},
			{
				Text: "The curse isn't working on you?",
				Answer: [
					{ Text: "What curse?", Reply: "You've always been clueless little maid.", Domination: -1 },
					{ Text: "So you're the source of the zombies.", Reply: "They are not zombies.", Love: -1 },
					{ Text: "Your tricks cannot affect me.", Reply: "You've gained some confidence since we last met.", Domination: 1 },
					{ Text: "You're way too weak for me.", Reply: "You're not afraid of anything aren't you?", Domination: 2, Perk: true }
				]
			},
			{ Text: "I don't know why you're not affected.  You've always been weird." },
			{ Text: "Mother might have selected you for that reason.  That old bitch!" },
			{ Text: "Whatever it is, you're not welcome here." },
			{
				Text: "Get out!",
				Answer: [
					{ Text: "Stop the curse and I'll go.", Reply: "You think I will obey you?", Domination: 1 },
					{ Text: "I'm not going anywhere bitch.", Reply: "Now you're in trouble.", Love: -2 },
					{ Text: "Please Lady Camille, you must stop that curse.", Reply: "Forget it Melody.", Domination: -1, Love: 1 },
					{ Text: "(Get on your knees.) I beg you Lady Camille.", Reply: "You're not worthy of my time.", Domination: -2, Perk: true }
				]
			},
			{
				Text: "(She raises her arm, mumbles some words and an iron gate closes behind you.)",
				Character: [{ Name: "Camille", Status: "Armor", Pose: "Angry" }]
			},
			{ Text: "You're going down little maid." },
			{ Text: "(She draws her sword and advances toward you.)" },
		]
	},

	{
		Name: "CamilleDefeat",
		Dialog: [
			{
				Text: "Mel...  Melody...  How could you...",
				Background: "CountessHallFloor",
				Character: [{ Name: "Camille", Status: "Armor", Animation: "Bound", Y: -400 }]
			},
			{
				Text: "How could you defeat me?",
				Answer: [
					{ Text: "Face it, you're not that strong.", Reply: "I underestimated you maid.", Domination: 2 },
					{ Text: "I protect the manor.", Reply: "You've always been a loyal maid.", Domination: 1, Love: 1 },
					{ Text: "It doesn't matter.", Reply: "You're very direct.", Domination: 1, Love: -1 },
					{ Text: "The good Camille within you allowed me to win.", Reply: "The good Camille?  Don't...  Don't be ridiculous.", Love: 2, Perk: true }
				]
			},
			{ Text: "(She struggles and sighs.)" },
			{ Text: "You know, I've always envied the relationship between you and Olivia." },
			{ Text: "You two were so close, like sisters.  I barely know my little sister." },
			{
				Text: "Do you think she will forgive me?",
				Answer: [
					{ Text: "I don't know.", Reply: "Only time will tell." },
					{ Text: "She will hate you forever.", Reply: "Fine, I don't care.", Love: -1, Domination: 1 },
					{ Text: "She will forgive you someday.", Reply: "You have a kind heart.", Love: 1, Domination: -1 },
					{ Text: "I will convince her to forgive you.", Reply: "Thanks.  I don't think I deserve such good treatment from you.", Love: 1, Domination: 1, Perk: true }
				]
			},
			{ Text: "Take these keys for her shackles and go rescue her." },
			{ Text: "(She gives you the key for Olivia's restraints.)" },
			{
				Text: "Go help Olivia.",
				Answer: [
					{ Text: "Stop the curse first.", Reply: "I'll need Mother for that.  Now go.", Domination: 1 },
					{ Text: "Enjoy your struggles.", Reply: "(She tries to spit on you.)  Get lost.", Love: -1 },
					{ Text: "I'll be back to help you.", Reply: "Very well, be quick.", Love: 1 },
					{ Text: "(Nod slowly.)", Reply: "Run little maid.", Love: 1, Domination: -1 },
				]
			},
			{ Text: "(She stares at the floor and stops talking.)" },
		]
	},

	{
		Name: "CamilleDefeatEnd",
		Dialog: [
			{
				Text: "Go help Olivia.",
				Background: "CountessHallFloor",
				Character: [{ Name: "Camille", Status: "Armor", Animation: "Bound", Y: -400 }]
			},
			{ Text: "(She stares at the floor and stops talking.)" },
		]
	},

	{
		Name: "CamilleEscape",
		Dialog: [
			{
				Background: "CountessHall",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{ Text: "(As you enter the countess hall, you see the open iron gates and that Camille is missing.)" },
			{ Text: "This is where you two had your battle?" },
			{
				Text: "Where is she?",
				Answer: [
					{ Text: "This is dangerous!  She escaped.", Reply: "Don't worry Melody.  I'm sure she learned her lesson.", Domination: -1, Perk: false },
					{ Text: "(Hide behind Lady Olivia.)", Reply: "(She moves to protect you.)  Don't worry little Melody.  I'm sure she learned her lesson.", Domination: -2, Perk: true },
					{ Text: "Damn bitch!  I'll track her down.", Reply: "(She gulps.)  Is violence always the answer?", Domination: 1, Love: -1 },
					{ Text: "Let's investigate.", Reply: "Yes, she cannot be too far away." },
					{ Text: "Stay behind me, it could be a trap.", Reply: "(She nods and hides behind you.)", Domination: 1 },
				]
			},
			{ Text: "The terrace gate is open, let's see if she's there." },
			{ Text: "(She invites you to walk the countess hall.)" }
		]
	},

	{
		Name: "OliviaTerrace",
		Exit : function () { PlatformEventSet("OliviaTerrace"); PlatformLoadRoom(); },
		Dialog: [
			{
				Background: "Terrace",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{ Text: "Where could they be?  (She starts to look around.)" },
			{ Text: "Look!  There's a rope!  (She points to a tied rope, going down the manor wall.)" },
			{ Text: "(She checks the rope carefully.)  This knot was made by Mother." },
			{ Text: "Trust me, I know her knots.  (She blushes.)" },
			{ Text: "Mother must have fled and Camille chased her down." },
			{
				Text: "What should we do?",
				Answer: [
					{ Text: "We could track them.", Reply: "It won't be easy, but if anyone can do it, it's you.", Domination: 1 },
					{ Text: "Let's find a cure for that curse.", Reply: "(She smiles.)  Yes, we need to help our friends.", Love: 1 },
					{ Text: "It's safer to stay here.", Reply: "(She nods.)  I'm sure Mother will manage on her own.", Domination: -1 },
					{ Text: "I don't know.", Reply: "(She sighs.)  I'm sure we'll figure a way to help.", Love: -1, Perk: false },
					{ Text: "We will find her and cure everyone.", Reply: "(She nods happily.)  I know we can do it.", Love: 2, Perk: true }
				]
			},
			{ Text: "Whatever you do Melody.  I will be there with you." },
			{
				TextScript: function () {
					let Love = PlatformDialogGetCharacter("Olivia").Love - 10;
					let Dom = PlatformDialogGetCharacter("Olivia").Domination;
					if ((Love >= 5) && (Love >= Math.abs(Dom))) return "My dear Olivia, together we are unstoppable.";
					if ((Love >= 0) && (Love >= Math.abs(Dom))) return "I'm glad we are in this mess together Olivia.";
					if (Dom >= 5) return "And I'll be there to lock you up every night little lady.";
					if (Dom >= 0) return "And I'll be there to protect you Olivia.";
					if (Dom <= -5) return "And your maid will be there to serve and obey you Lady Olivia.  (You do a maid curtsy.)";
					return "And I'll be there to help you Lady Olivia.";
				},
				Character: [{ Name: "Melody", Status: "Maid", Pose: "Idle" }]
			},
			{
				Entry: function() {
					if (PlatformDialogGetCharacter("Olivia").Love < 17) PlatformDialogGoto = "End";
					PlatformDialogProcess();
				},
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{ Text: "(She blushes.)  There's something I'd like to ask you." },
			{
				Text: "Can...  Can I kiss you?",
				Answer: [
					{ Text: "Of course my love.  (Kiss her.)", Reply: "(You both get closer and prepare for a long kiss.)", Love: 1 },
					{ Text: "(Grab her and kiss her.)", Reply: "(You grab her waist and bring her closer for a long kiss.)", Domination: 1 },
					{ Text: "(Blush and giggle.)", Reply: "(She grabs your waist and brings you closer for a long kiss.)", Domination: -1 },
					{ Text: "Sorry, it wouldn't be appropriate.", Reply: "(She sighs.)  I guess you're right.  Let's head for our next mission.", Love: -2, Goto: "End" },
				]
			},
			{
				Entry: function() {
					PlatformEventSet("OliviaTerraceKiss");
					PlatformAddExperience(PlatformPlayer, 10);
					if (PlatformDialogGetCharacter("Olivia").Domination < 0) PlatformDialogCharacterDisplay[0].Pose = "KissMaidMelodySub";
				},
				Character: [{ Name: "Olivia", Status: "Oracle", Pose: "KissMaidMelody" }]
			},
			{ Text: "(You exchange a long and passionate kiss.)" },
			{ Text: "(Time seems to stop as you feel her sweet lips on yours.)" },
			{ Text: "(You both moan slowly as you taste each other mouth for the first time.)" },
			{
				Text: "(You separate after a little while and smile at each other.)",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{ ID: "End", Text: "Should we go down that rope?" },
			{ Text: "(She points to the rope that runs down the castle wall.)" }
		]
	},

	{
		Name: "EdlaranTerrace",
		Dialog: [
			{
				Background: "Terrace",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{ Text: "Where are they?" },
			{ Text: "(She looks at Olivia.)" },
		]
	},

	{
		Name: "OliviaCabin",
		Exit : function () { PlatformEventSet("OliviaCabin"); },
		Dialog: [
			{
				Background: "ForestCabin",
				Entry: function() {
					if (PlatformEventDone("OliviaCabin")) PlatformDialogGoto = "End";
					PlatformDialogProcess();
				}
			},
			{
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{ Text: "Way before the war, when I was a child, Father used to bring us to this hunting cabin." },
			{ Text: "Mother and sister kept complaining about mosquitos, but I loved the fresh air." },
			{ Text: "Father said that me and Camille needed to learn on how to survive in the forest.  That real life is harsher than a comfy manor." },
			{
				Text: "I guess he was right.  (She sighs.)",
				Answer: [
					{ Text: "The forest is a scary place.", Reply: "Don't worry Melody, we will be fine.", Domination: -1 },
					{ Text: "(Nod in agreement.)", Reply: "(She nods and puts another log in the fireplace.)" },
					{ Text: "The Count educated you well.", Reply: "(She bows her head slowly.)  He did.", Domination: 1 },
					{ Text: "(Put a log in the fireplace.)", Reply: "Thanks Melody, I was getting cold.", Love: 1, Perk: true },
				]
			},
			{ Text: "Father is dead, Mother is gone and sister went insane." },
			{
				Text: "I'm all alone now.",
				Answer: [
					{ Text: "Learn to accept it.", Reply: "(She sighs and nods.)  Complaining will not solve anything.", Love: -1 },
					{ Text: "I know how you feel.", Reply: "As an orphan, you must certainly understand." },
					{ Text: "You're not alone, you have me.", Reply: "(She smiles at you.)  I do, thanks my friend.", Love: 1 },
				]
			},
			{
				ID: "End",
				Character: [{ Name: "Olivia", Status: "Oracle", Pose: "Back" }],
				Text: "(She warms herself by the fireplace and gets lost in her thoughts.)"
			},
		]
	},

	{
		Name: "EdlaranCabin",
		Exit : function () { PlatformEventSet("EdlaranCabin"); },
		Dialog: [
			{
				Background: "ForestCabin",
				Entry: function() {
					if (PlatformEventDone("EdlaranCabin")) PlatformDialogGoto = "End";
					PlatformDialogProcess();
				}
			},
			{
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" },
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" }
				]
			},
			{ Text: "I love this cabin, it's a good place to hide and get a free lunch." },
			{ Text: "I mean... it would be a good place to hide and eat, since it's my first time here." },
			{
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" }
				],
				Text: "Edlaran, this hunting cabin used to belong to my late father."
			},
			{ Text: "You should not break in to sleep or get a free meal.  This is not appropriate." },
			{
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				],
				Text: "Is it a crime to sleep in an unoccupied cabin?  Don't answer."
			},
			{ Text: "It's easy to judge others when you're rich and never knew cold or hunger." },
			{
				Text: "Tell her Melody.",
				Answer: [
					{ Text: "I don't want to get involved.", Reply: "Yeah, she would not understand anyway." },
					{ Text: "Breaking in the cabin is wrong.", Reply: "(She looks disappointed.)  Don't side with her rich family.", Love: -2, Script: function() { PlatformDialogAlterProperty("Olivia", "Love", 2); } },
					{ Text: "House Alberus can share it's cabin.", Reply: "Thanks Melody!  (She pulls her tongue at Olivia.)", Love: 2, Script: function() { PlatformDialogAlterProperty("Olivia", "Love", -2); } },
					{ Text: "No jury would convict you Edlaran.", Reply: "(She nods.)  There's nothing wrong with finding some shelter.", Love: 1, Perk: true },
				]
			},
			{ Text: "(She looks around.)  This cabin can be our new castle." },
			{
				Text: "I'll use the big chair as my throne.",
				Answer: [
					{ Text: "The throne is mine girl.", Reply: "(She gulps.)  You can have the comfy chair.", Domination: 2 },
					{ Text: "You'll make a good cabin queen.", Reply: "(She smirks.)  Cabin queen?  I like it.", Domination: -2 },
					{ Text: "This is not a throne.", Reply: "(She laughs.)  You need to use your imagination." },
					{ Text: "Lady Olivia should have the throne.", Reply: "(She sighs.)  You're no fun.", Love: -1 },
				]
			},
			{
				ID: "End",
				Character: [{ Name: "Edlaran", Status: "Archer", Pose: "Idle" }],
				Text: "Let's rest while we can, we have a long journey ahead."
			},
		]
	},

	{
		Name: "IntroForestBanditEdlaran",
		Exit : function () { PlatformEventSet("IntroForestBandit"); },
		Dialog: [
			{
				Background: "ForestBirchLight",
				Character: [{ Name: "Vera", Status: "Leather", Pose: "Grumpy" }]
			},
			{ Text: "(As you venture deeper in the woods, a shady lady jumps in front in you.)" },
			{ Text: "You're finally back Edlaran.  I don't know why you're accompanied." },
			{ Text: "How was the manor raid?  Any good loot to repay your debt?" },
			{
				Text: "Mmmmmh...  What?  Manor raid?  Loot?  Debt?  Do I know you?",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" },
					{ Name: "Vera", Status: "Leather", Pose: "Grumpy" }
				]
			},
			{
				Text: "I don't know what she's talking about.",
				Answer: [
					{ Text: "She's mistaken you for someone else.", Reply: "Exactly!  That peasant girl is confused.", Domination: -1, Love: 1 },
					{ Text: "I think you know what's going on.", Reply: "(She shakes her head.)  That girl is delirious." },
					{ Text: "You will be punished later Edlaran.", Reply: "(She bows her head and ponders for a few seconds.)", Domination: 2, Love: -1 },
				]
			},
			{ Text: "We are on an official mission with her Highness Lady Olivia or Alberus!" },
			{ Text: "Move out of the way or you'll get hurt." },
			{
				Text: "(She stares at your group.)",
				Character: [{ Name: "Vera", Status: "Leather", Pose: "Angry" }]
			},
			{ Text: "Lady Olivia you say?  Thanks for the tip, she would fetch a good ransom." },
			{
				Text: "What?  That wasn't a tip.",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" },
					{ Name: "Olivia", Status: "Oracle", Pose: "IdleSubmissive" },
					{ Name: "Vera", Status: "Leather", Pose: "Angry" }
				],
				Answer: [
					{ Text: "She knows too much now.", Reply: "That's very true, we'll need to get rid of the bandits.", Love: 1 },
					{ Text: "Edlaran, you're an idiot.", Reply: "That's not fair!  Damn it, let's get rid of the bandits.", Domination: 1, Love: -2 },
					{ Text: "Oh my!  What do we do?.", Reply: "Don't stand there like a tree, we must get rid of the bandits.", Domination: -2 },
					{ Text: "(Wink at Edlaran and flank the bandit.)", Reply: "(She winks back as you both flank her.)", Love: 2, Perk: true },
				]
			},
			{ Text: "Attack!" },
		]
	},

	{
		Name: "IntroForestBanditOlivia",
		Exit : function () { PlatformEventSet("IntroForestBandit"); },
		Dialog: [
			{
				Background: "ForestBirchLight",
				Character: [{ Name: "Vera", Status: "Leather", Pose: "Grumpy" }]
			},
			{ Text: "(As you venture deeper in the woods, a shady lady jumps in front in you.)" },
			{ Text: "Well, well, well, who dares to enter our forest?" },
			{ Text: "(She looks at Olivia carefully.)" },
			{ Text: "Wait... aren't you some kind of royalty?" },
			{
				Text: "You're the Countess daughter!",
				Character: [
					{ Name: "Vera", Status: "Leather", Pose: "Angry" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" },
					{ Name: "Olivia", Status: "Oracle", Pose: "IdleSubmissive" }
				],
				Answer: [
					{ Text: "You're mistaken.", Reply: "I'm not mistaken at all." },
					{ Text: "Get lost or you'll get hurt.", Reply: "You think a maid can scare me?" },
					{ Text: "Please don't give us trouble.", Reply: "You've set yourself in trouble." },
				]
			},
			{ Text: "She will fetch a great ransom." },
			{ Text: "Get her!  (The bandits attack you.)" },
		]
	},

	{
		Name: "IntroForestBanditKidnapEdlaran",
		Exit : function () { PlatformEventSet("EdlaranForestIntro"); },
		Dialog: [
			{
				Background: "OakHeavy",
				Character: [
					{ Name: "Vera", Status: "Leather", X: 600, Pose: "StareDownRight" },
					{ Name: "Edlaran", Status: "Archer", X: 700, Animation: "Bound" }
				]
			},
			{ Text: "(Next to a giant oak, you find a forest bandit tormenting a bound elf.)" },
			{ Text: "This is your last warning!  Pay your debt or I cut your pretty ears Edlaran." },
			{ Text: "(She pulls out a knife and the elf notices you.)" },
			{
				Text: "Help!  Please!",
				Character: [
					{ Name: "Edlaran", Status: "Archer", X: 1100, Animation: "Bound" },
					{ Name: "Vera", Status: "Leather", X: 1000, Pose: "StareDownRight" },
					{ Name: "Melody", Status: "Maid", X: 400, Pose: "Idle" },
					{ Name: "Olivia", Status: "Oracle", X: 0, Pose: "IdleAngry" }
				],
				Answer: [
					{ Text: "Let her go.  Now!", Reply: "(The bandit grumbles and turns to you.)", Domination: 2 },
					{ Text: "Can we please pay her debt?", Reply: "(The bandit smirks and turns to you.)", Domination: -2 },
					{ Text: "This is none of my business.", Reply: "(The bandit turns to you.)" },
				]
			},
			{
				Text: "It seems I have more urgent mathers to settle first.  Don't try anything Edlaran.",
				Character: [{ Name: "Vera", Status: "Leather", Pose: "Grumpy" }]
			},
			{ Text: "(She charges toward you)." }
		]
	},

	{
		Name: "EdlaranForestBeg",
		Dialog: [
			{
				Background: "OakHeavy",
				Character: [{ Name: "Edlaran", Status: "Archer", Animation: "Bound" }]
			},
			{ Text: "Help!  One of these bandits must have the keys to these chains." },
			{ Text: "(She struggles in vain and whimpers.)" },
			{ Entry: function() { if (!PlatformEventDone("EdlaranForestKey")) PlatformDialogLeave(); else PlatformDialogProcess(); } },
			{
				Text: "Do you have the key?",
				Answer: [
					{ Text: "I don't.  (Leave her.)", Reply: "(She sighs and nods.)", Script: function() { PlatformDialogLeave(); } },
					{ Text: "It's the least I can do.  (Unlock her.)", Reply: "(She nods slowly as you unlock her.)", Domination: -2, Love: 1 },
					{ Text: "You owe me a big favor.  (Unlock her.)", Reply: "(The gulps as you unlock her.)", Domination: 2, Love: 1 },
					{ Text: "Get up sexy elf.  (Unlock her.)", Reply: "(She smiles as you unlock her.)", Love: 2 },
				]
			},
			{
				Text: "Thanks!  You're the best.",
				Character: [{ Name: "Edlaran", Status: "Archer", Pose: "IdleHappy" }]
			},
			{
				Text: "I owe you one.  I could help you against these bandits or in your adventures.",
				Entry: function() { PlatformEventSet("EdlaranJoin"); PlatformPartyBuild(); PlatformLoadRoom(); }
			},
			{
				Text: "I'm Edlaran.  I know how to fight, shoot and plunder.  I also know these woods.",
				Answer: [
					{ Text: "Deal!  You can join our quest.", Reply: "(She gives you a thumbs up.)", Love: 1 },
					{ Text: "Fine, but don't steal from us.", Reply: "Of course.  (She rolls her eyes up.)", Domination: 1 },
					{ Text: "Fine, it will share the burden.", Reply: "I can share anything.  (She giggles.)", Domination: -1 },
					{ Text: "Ok, but don't touch Lady Olivia.", Reply: "Very well, I won't." },
				]
			},
			{ Text: "Just let me know what's going on and I'll be your best shooter." },
			{ Text: "(You take some time to tell her about the castle, the curse and the quest.)" },
			{ Text: "Thanks!  Let's go!" },
			{ Text: "(Edlaran joined your party.  You can switch your active character at any save point.)" },
		]
	},

	{
		Name: "ForestLost",
		Dialog: [
			{
				Background: "ForestMaze",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{ Text: "Wait... didn't we walk on that path a few minutes ago?" },
			{ Text: "Yes!  It's the exact same tree!  And the same rock!" },
			{ Text: "How is that possible?  We followed the path.  Did we?" },
			{
				Text: "Where should we go?",
				Answer: [
					{ Text: "Let's go straight on the path.", Reply: "(She nods as you walk together.)", Script: function() { PlatformLoadRoom("ForestBirchEast") } },
					{ Text: "Let's turn left here.", Reply: "(She nods as you walk together.)", Script: function() { PlatformLoadRoom("ForestBirchMaze") }  },
					{ Text: "We should go right.", Reply: "(She nods as you walk together.)", Script: function() { PlatformLoadRoom("ForestOakHeavy") }  },
					{ Text: "We should go back.", Reply: "(She nods as you walk together.)", Script: function() { PlatformLoadRoom("ForestBirchCenter") }  },
				]
			},
		]
	},

	{
		Name: "ForestPath",
		Dialog: [
			{
				Background: "ForestMaze",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" },
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" }
				]
			},
			{ Text: "Wait... didn't we walk on that path a few minutes ago?" },
			{ Text: "Yes!  It's the exact same tree!  And the same rock!" },
			{ Text: "How is that possible?  We followed the path.  Did we?" },
			{
				Text: "(Edlaran steps foward.)  Move over princess.",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "IdleHappy" },
					{ Name: "Olivia", Status: "Oracle", Pose: "IdleAngry" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{ Text: "You could not find your way out of your own golden bathroom." },
			{ Text: "(She inspects the forest for a while.)" },
			{ Text: "I see what's going on, this place is a clever maze." },
			{
				Text: "Let me guide the group.  I'll show you the way.",
				Answer: [
					{ Text: "Guide us Edlaran.", Script: function() { PlatformDialogStart("ForestTrap") } },
					{ Text: "I fully trust you Edlaran.", Domination: -1, Love: 1, Script: function() { PlatformDialogStart("ForestTrap") } },
					{ Text: "Fine.  Don't get us lost.", Domination: 1, Love: -1, Script: function() { PlatformDialogStart("ForestTrap") } },
					{ Text: "No!  We're going this way.", Reply: "(She sighs as everyone follows you.)", Script: function() { PlatformLoadRoom("ForestBirchMaze") }  },
				]
			},
		]
	},

	{
		Name: "ForestTrap",
		Exit : function () { PlatformEventSet("ForestCapture"); PlatformPartyActivate("Olivia"); },
		Dialog: [
			{
				Text: "(Eldaran finds many hidden paths and guides you in the forest.)",
				Background: "ForestMaze",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" }
				]
			},
			{ Text: "(She tracks the steps on the ground and helps you to avoid bandits.)" },
			{ Text: "(As you walk in the woods, Olivia steps on a rope.)" },
			{
				Text: "(A huge cloud of smoke springs for the ground.)",
				Background: "Gas",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "IdleSubmissive" },
					{ Name: "Melody", Status: "Maid", Pose: "Alert" }
				]
			},
			{ Text: "That smoke!  *Cough*  It's coming from the soil." },
			{ Text: "*Cough*  Where is Edlaran?  *Cough*" },
			{
				Text: "*Cough*   I feel sick.",
				Answer: [
					{ Text: "Everyone is afraid!", Reply: "(She whimpers and starts to get dizzy.)", Love: -1, Domination: -1 },
					{ Text: "That cloud is toxic.", Reply: "(She nods and starts to get dizzy.)", },
					{ Text: "I will protect you.", Reply: "(She smiles and starts to get dizzy.)", Love: 1, Domination: 1 },
					{ Text: "Edlaran!", Reply: "(You scream as she starts to get dizzy.)", },
				]
			},
			{
				Text: "*Cough*  Melody!  *Cough*",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "IdleSubmissive" },
					{ Name: "Melody", Status: "Maid", Pose: "Alert" }
				]
			},
			{
				Character: [
					{ Name: "Melody", Status: "Maid", Pose: "CarrySleepingOlivia", X: 500 },
				]
			},
			{ Text: "(She passes out in your arms as you start coughing.)" },
			{ Text: "(You carry her through the smoke, getting dizzy.)" },
			{ Text: "(You run in the thick cloud, hurting yourself on trees.)" },
			{ Text: "(You feel sick, sleepy and disoriented.)" },
			{
				Background: "Black",
				Text: "(Everything turns dark...)",
				Character: []
			},
			{ Text: "..." },
			{
				Background: "BarnInterior",
				Character: [{ Name: "Lyn", Status: "Thief", Pose: "Curious" }]
			},
			{ Text: "You're waking up?  Good." },
			{ Text: "We have a long trip ahead your highness." },
			{ Text: "You must be wondering why you're restrained." },
			{ Text: "That gag isn't pleasant, but it's necessary." },
			{
				Character: [
					{ Name: "Lyn", Status: "Thief", Pose: "Curious" },
					{ Name: "Olivia", Status: "Oracle", Pose: "BoundGagged" },
				]
			},
			{ Text: "We don't want a screamer while we travel." },
			{
				Text: "Mmmgnh!  Uuungmm mn!",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "BoundGagged" },
					{ Name: "Lyn", Status: "Thief", Pose: "Curious" }
				]
			},
			{
				Text: "Don't be afraid, we are bringing you back to your husband, the Duke.",
				Character: [
					{ Name: "Lyn", Status: "Thief", Pose: "Curious" },
					{ Name: "Olivia", Status: "Oracle", Pose: "BoundGagged" },
				]
			},
			{ Text: "He will surely pay a huge amount to see you safe." },
			{
				Text: "Aaamh mmhmm Mmmnndy!  Mh maaym!",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "BoundGagged" },
					{ Name: "Lyn", Status: "Thief", Pose: "Curious" }
				]
			},
			{
				Text: "We cannot bring your maid, she will be sold in a nearby town.",
				Character: [
					{ Name: "Lyn", Status: "Thief", Pose: "Curious" },
					{ Name: "Olivia", Status: "Oracle", Pose: "BoundGagged" },
				]
			},
			{ Text: "It's better than to be left for the crows." },
			{ Text: "Exercise your legs, we will leave soon." },

		]
	},

	{
		Name: "BarnThief",
		Dialog: [
			{
				Background: "BarnInterior",
				Character: [
					{ Name: "Lyn", Status: "Thief", Pose: "Curious" },
					{ Name: "Olivia", Status: "Oracle", Pose: "BoundGagged" },
				]
			},
			{ Text: "I'm not letting you out of the barn." },
			{ Text: "Your husband will pay a royal ransom for you." },
			{ Text: "Exercise your legs, we will leave soon." },
		],
	},

	{
		Name: "ForestBanditCrate",
		Exit : function () { PlatformEventSet("ForestBanditCrate"); },
		Dialog: [
			{
				Background: "SecludedClearing",
				Character: [
					{ Name: "Vera", Status: "Leather", Pose: "Angry" },
					{ Name: "Crate", Status: "Wood", Pose: "Idle" },
					{ Name: "Lucy", Status: "Armor", Pose: "Idle" },
				]
			},
			{ Text: "(Two thieves are watching a crate and talking.)" },
			{ Text: "This is boring.  When is that slave trader coming?" },
			{ Text: "Did you bring some cards or some..." },
			{ Text: "(She turns to Edlaran.)" },
			{ Text: "It seems we have a rat.  Get her!" },
		],
	},

	{
		Name: "MelodyCrate",
		Dialog: [
			{
				Background: "SecludedClearing",
				Character: [
					{ Name: "Crate", Status: "Wood", Pose: "Idle" },
				],
				Entry: function() {
					if ((PlatformChar[2].Bound == true) && (PlatformChar[3].Bound == true) && !PlatformEventDone("ForestCaptureRescueMelody")) PlatformDialogStart("MelodyCrateOpen");
				}
			},
			{ TextScript: function () { return (PlatformEventDone("ForestCaptureRescueMelody")) ? "(The crate is open and empty.)" : "(It's too dangerous to inspect the crate while it's guarded.)"; }  }
		],
	},

	{
		Name: "MelodyCrateOpen",
		Dialog: [
			{
				Background: "SecludedClearing",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Crate", Status: "Wood", Pose: "Idle" },
				],
				Text: "(There's a huge wooden crate in the middle of the woods.)"
			},
			{ Text: "(You can hear that someone is alive inside.)" },
			{
				Text: "(What will you do?)",
				Answer: [
					{ Text: "(Open the crate.)", Reply: "(You work hard to open the crate.)", Script: function() { PlatformEventSet("ForestCaptureRescueMelody") } },
					{ Text: "(Leave it.)", Script: function() { PlatformDialogLeave(); } },
				]
			},
			{
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Animation: "Bound" },
				],
			},
			{ Text: "(Melody slowly crawls out of the box in tight bondage.)" },
			{ Text: "I'm glad to see you again." },
			{
				Text: "Why did you stay in the smoke trap?",
				Answer: [
					{ Text: "Why did you abandoned us?", Reply: "(She frowns.)  When there's a trap you run, it's common knowledge.", Love: -1 },
					{ Text: "I was trying to save Lady Olivia.", Reply: "That princess needs to watch where she steps." },
					{ Text: "Nevermind.  Thanks for the rescue.", Reply: "(She smiles.)  My pleasure Melody.", Love: 1 },
				]
			},
			{
				Entry: function() {
					if (PlatformDialogGetCharacter("Edlaran").Domination <= -5) PlatformDialogGoto = "PayForRelease";
					PlatformDialogProcess();
				}
			},
			{ Text: "They got you in tight ropes." },
			{
				Text: "Can you struggle out?",
				Answer: [
					{ Text: "I don't think so.", Reply: "(She nods and unties you.)  There you go." },
					{ Text: "Can you please help?", Reply: "(She smirks and unites you.)  There you go girl.", Domination: -1 },
					{ Text: "Stop being silly and untie me.", Reply: "(She unties you quickly.)  You should be good now.", Domination: 1 },
					{ Text: "Help me and I'll pay you.", Reply: "Deal!  (She releases you happily.)  There you go Melody.", Love: 1, Perk: true },
				]
			},
			{
				ID: "EndLick",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" },
				],
			},
			{ Text: "They wanted to sell you to a slaver." },
			{
				Text: "Did they sold Olivia?",
				Answer: [
					{ Text: "We must save our friend.", Reply: "(She nods.)  That's the spirit!", Love: 1 },
					{ Text: "Let's move, we must find her.", Reply: "(She grabs her bow.)  Well said!", Domination: 1 },
					{ Text: "Never say that!", Reply: "(She frowns.)  No need to yell.", Love: -1 },
					{ Text: "I'm so scared for her.", Reply: "(She shakes her head.)  Everything will be alright.", Domination: -1 },
				]
			},
			{ Text: "Let's go find her." },
			{ Text: "(Meanwhile...  In Olivia's barn.)" },
			{ Entry: function() { PlatformPartyActivate("Olivia"); PlatformDialogLeave(); } },
			{
				ID: "PayForRelease",
				Text: "I could release you..."
			},
			{
				Text: "But there's a price.",
				Answer: [
					{ Text: "What price?", Reply: "(She removes her bottom and smirks.)  Can you guess?" },
					{ Text: "I will pay your price.", Reply: "(She removes her bottom and smirks.)  Good girl.", Domination: -1 },
					{ Text: "I'm not giving you any money.", Reply: "(She removes her bottom and smirks.)  I don't want money from you.", Domination: 1 },
				]
			},
			{
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "NoPants" },
					{ Name: "Melody", Status: "Maid", Animation: "Bound" },
				]
			},
			{ Text: "You will need to work for your freedom." },
			{ Text: "(She gets on her knees and closer to your mouth.)" },
			{
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "KneelingLickedByMaidMelody", X: 500 },
				]
			},
			{
				Text: "Get to work!",
				Answer: [
					{ Text: "(Lick her slowly, without much passion.)", Reply: "(You slowly lick as she masturbates to get an orasm.)", Love: 1 },
					{ Text: "(Lick her lovingly and skillfully,)", Reply: "(You lick her with skill and she gets a wonderful orgasm.)", Love: 2, Domination: -1 },
					{ Text: "(Do nothing.)", Reply: "(She grumbles, dresses back and releases you.)  Fine!  I'll release you for free.  You ungrateful bitch.", Love: -2, Domination: 1, Goto: "EndLick" },
				]
			},
			{
				Entry: function() { PlatformAddExperience(PlatformPlayer, 10); },
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "KneelingLickedByMaidMelodyOrgasm", X: 500 },
				]
			},
			{ Text: "OoooOOOooooh! Oooohhh yeah!  YEAAAAAAAAAAAAHHHH!!!" },
			{ Text: "(She gets a shaterring orgasm in front of the bound bandits.)" },
			{ Text: "Yes!  That feels so good.  I needed that." },
			{ Text: "But we're wasting time with your naughty ideas, we need to rush." },
			{ Text: "(She releases you and dresses back.)" },
			{ Entry: function() { PlatformDialogGoto = "EndLick"; PlatformDialogProcess(); } },

		],
	},

	{
		Name: "BarnThiefRescueMelody",
		Exit : function () { PlatformEventSet("BarnThiefRescueMelody"); PlatformLoadRoom(); PlatformPlayer.X = 200; },
		Dialog: [
			{
				Background: "BarnInterior",
				Character: [
					{ Name: "Hazel", Status: "Maid", Pose: "Angry" },
					{ Name: "Lyn", Status: "Thief", Pose: "Curious" },
				]
			},
			{ Text: "(A servant enters the barn to speak with the thief boss.)" },
			{ Text: "Boss, we have a problem." },
			{ Text: "The slave trading outpost has been attacked." },
			{ Text: "The maid we were expecting to sell has run away." },
			{
				Text: "(The boss gets angry.)",
				Character: [
					{ Name: "Lyn", Status: "Thief", Pose: "Curious" },
					{ Name: "Hazel", Status: "Maid", Pose: "Angry" },
					{ Name: "Olivia", Status: "Oracle", Pose: "BoundGagged" },
				]
			},
			{ Text: "Do I need to do everything myself?" },
			{ Text: "I'll get the whip cracking, you stay here and guard the prisoner." },
			{ Text: "Do not ungag her, do not unlock her and do not let her out." },
			{ Text: "(She gets even more angry.)" },
			{ Text: "You know what?  Torture the bitch!  It will teach her not to try to escape." },
			{ Text: "(She runs away and slams the barn door, which makes a loud creaking sound.)" },
			{
				Text: "I can torture you?  Sweet!",
				Character: [
					{ Name: "Hazel", Status: "Maid", Pose: "Angry" },
					{ Name: "Olivia", Status: "Oracle", Pose: "BoundGagged" },
				]
			},
			{ Text: "(She charges toward you.  The barn door seems to be weak.)" },

		],
	},

	{
		Name: "ForestCaptureEnd",
		Exit : function () { PlatformEventSet("ForestCaptureEnd"); PlatformLoadRoom(); PlatformPlayer.HalfBound = false; PlatformAddExperience(PlatformPlayer, 20); },
		Dialog: [
			{
				Background: "LakeRaft",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "BoundGagged" },
				]
			},
			{ Text: "(Olivia jumps on the wooden raft which starts to drift on the lake.)" },
			{ Text: "(Her pursuers jump in the water but quickly turn back, failing to swin.)" },
			{ Text: "(The raft slowly gets further toward the middle of the lake.)" },
			{ 
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "BoundGaggedKneeling", X: 500, Y: 300 },
				]
			},
			{ Text: "(After a while, the wooden embarcation stops completly.)" },
			{ Text: "(Olivia is left bound, gagged and stranded on the huge lake.)" },
			{ Text: "(A few hours later...)" },
			{
				Background: "CampGround",
				Character: [
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
					{ Name: "Melody", Status: "Maid", Pose: "Idle" },
				],
			},
			{ Text: "(Edlaran stares at the lake.)" },
			{
				Text: "The sea is a harsh Mistress.",
				Answer: [
					{ Text: "What's going on?", Reply: "I'm philosophizing by the lake." },
					{ Text: "I should be your Mistress.", Reply: "(She blushes and looks down.)  That's not what I meant.", Domination: 2 },
					{ Text: "Why are you saying that?", Reply: "It's an old sailor proverb." },
					{ Text: "I would love to have a Mistress.", Reply: "(She grins.)  Be careful on what you wish for.", Domination: -2 },
				]
			},
			{ Text: "(She points to the middle of the lake.)" },
			{ Text: "Do you see that little raft?  Look carefully." },
			{ Text: "You don't have my perfect elven vision.  (She winks at you.)" },
			{ Text: "(You finally see the raft.)  Check the girl in white, isn't it Olivia?" },
			{ Text: "Oh my!  I think she's bound.  Is she stranded on the lake?" },
			{
				Text: "What should we do?",
				Answer: [
					{ Text: "Move!  I'll go get her.", Reply: "No need to yell.  (She steps away from the lake.)", Love: -1 },
					{ Text: "Save her!  Like the friends we are.", Reply: "(She nods in agreement.)  What will you do?", Love: 1 },
					{ Text: "I think I can swim it.", Reply: "Are you sure?  (She looks at the middle of the lake.)" },
					{ Text: "Heroes must get wet.", Reply: "You will try to swim?  (She seems impressed.)", Perk: true, Domination: 1 },
				]
			},
			{
				Character: [
					{ Name: "Melody", Status: "Underwear", Pose: "Cocky" },
					{ Name: "Edlaran", Status: "Archer", Pose: "Idle" },
				],
			},
			{ Text: "(You quickly remove your clothes.)" },
			{ Text: "If I drown, you'll need to find another way to save her." },
			{ Text: "(You dive in the water.)" },
			{
				Background: "Water",
				Character: [
					{ Name: "Melody", Status: "Underwear", Pose: "Swimming", X: 0 },
				],
			},
			{ Text: "(You swim like you never did before.)" },
			{ Text: "(Catching your breath when you need.)" },
			{ Text: "(Focusing on the raft, focusing on Olivia.)" },
			{ Text: "(You swim for hours, feeling your soar muscle.)" },
			{ Text: "(You cannot give up, too much is at stake.)" },
			{ Text: "(You finally reach Olivia's raft.)" },
			{ 
				Background: "LakeRaft",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "BoundGaggedKneeling", X: 250, Y: 300 },
					{ Name: "Melody", Status: "Underwear", Pose: "ExhaustedRight" },
				]
			},
			{ Text: "(You climb on the raft as she cheers in her gag.)" },
			{
				Text: "Mmnhdy!",
				Answer: [
					{ Text: "I almost drown for you.", Reply: "(She grumbles in her gag.)", Love: -1 },
					{ Text: "I will always be there to protect you.", Reply: "(She bows her head.)", Domination: 1 },
					{ Text: "I'm so happy to see you.", Reply: "(She nods happily.)", Love: 1 },
					{ Text: "I was so scared for you.", Reply: "(She shakes her head from left to right.)", Domination: -1 },
				]
			},
			{ Text: "(You release her from her bondage.)" },
			{ 
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle" },
					{ Name: "Melody", Status: "Underwear", Pose: "Cocky" },
				]
			},
			{ Text: "Ah!  Thank you so much." },
			{
				Text: "I owe you one.",
				Answer: [
					{ Text: "Kiss me girl.", Reply: "(You grab her for a long kiss.)", Love: 1, Domination: 1 },
					{ Text: "Don't mention it.", Reply: "You're way too humble." },
					{ Text: "No Miss.  I'm doing my servant work.", Reply: "(She gives you a curious look.)  I'll have to raise your salary my maid.", Love: -1, Domination: -1 },
					{ Text: "I would die to save your life Miss.", Reply: "(She gives you a hug.)  Please don't die my maid.", Perk: true, Love: 1, Domination: -1 },
				]
			},
			{
				Entry: function() {
					if (PlatformDialogGetCharacter("Olivia").Domination < 5) PlatformDialogGoto = "End";
					PlatformDialogProcess();
				}
			},
			{ 
				Text: "It was very reckless to go on the lake alone, bound and gagged.",
				Character: [
					{ Name: "Melody", Status: "Underwear", Pose: "Cocky", X: 1000 },
					{ Name: "Olivia", Status: "Oracle", Pose: "Idle", X: 500 },
				]
			},
			{ Text: "You could have been killed young lady." },
			{
				Text: "I'm sorry Melody.  (She bows her head.)",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "IdleSubmissive" },
					{ Name: "Melody", Status: "Underwear", Pose: "Cocky" },
				],
				Answer: [
					{ Text: "Promise me not to do it again.", Reply: "I promise!  (She smiles at you.)  Let's go back.", Domination: -1, Love: 1, Goto: "End" },
					{ Text: "I forgive you.", Reply: "Very good.  (She nods.)  Let's go back.", Goto: "End" },
					{ Text: "You must be punished.  (Spank her.)", Reply: "Punished?  What?  How?  Melody!  You cannot do that!", Love: -2, Domination: 2 },
					{ Text: "What would your mother do?  (Spank her.)", Reply: "She... she would spank me Melody.", Perk: true, Domination: 2 },
				]
			},
			{ 
				Text: "Bend down young lady.  You will be spanked.",
				Character: [
					{ Name: "Melody", Status: "Underwear", Pose: "Cocky", X: 1000 },
					{ Name: "Olivia", Status: "Oracle", Pose: "IdleSubmissive", X: 500 },
				]
			},
			{ Text: "(She blushes, bends down, and presents her butt.)" },
			{
				Entry: function() { PlatformAddExperience(PlatformPlayer, 10); },
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "SpankedByMelodyUnderwear", X: 500 },
				]
			},
			{ Text: "(You spank her many times, making sure she remembers that lesson.)" },
			{ Text: "Ow!  Melody!  Please don't hit me so hard." },
			{ Text: "(She's cries from the physical pain and from the humiliation.)" },
			{ Text: "(You spank her a few times again, hitting the same spots.)" },
			{ Text: "I promise I will be a good girl, I won't do it again." },
			{ Text: "I've learned my lesson, can we go back to firm land?" },
			{
				Text: "(You nod and stop spanking her.)",
				Character: [
					{ Name: "Olivia", Status: "Oracle", Pose: "IdleSubmissive" },
					{ Name: "Melody", Status: "Underwear", Pose: "Cocky" },
				]
			},
			{ Text: "(She bows her head and changes subject.)" },
			{ ID: "End", Text: "It will take us hours to reach the shore." },
			{ Text: "More time to know each other.  (She smiles.)" },
			{ Text: "(You work together to bring the raft back.)" },
		],
	},

	{
		Name: "ThiefBossFlee",
		Exit : function () { PlatformLoadRoom("ForestPlainToSavannah"); PlatformPlayer.X = 100; PlatformPlayer.FaceLeft = false; },
		Dialog: [
			{
				Background: "Savannah",
				Character: [
					{ Name: "Vera", Status: "Leather", Pose: "Grumpy" },
					{ Name: "Lyn", Status: "Thief", Pose: "Curious" },
					{ Name: "Vera", Status: "Leather", Pose: "Angry" }
				]
			},
			{ Text: "(The bandit boss and her minions are having a loud argument.)" },
			{ Text: "(It's way too dangerous to go that way.)" },
			{ Text: "(Olivia retreats silently.)" },
		],

	},

	{
		Name: "ThiefBossIntro",
		Exit : function () { PlatformLoadRoom("ForestPlainToSavannah"); PlatformPlayer.X = 100; PlatformPlayer.FaceLeft = false; },
		Dialog: [
			{
				Background: "Savannah",
				Character: [
					{ Name: "Vera", Status: "Leather", Pose: "Grumpy" },
					{ Name: "Lyn", Status: "Thief", Pose: "Curious" },
					{ Name: "Vera", Status: "Leather", Pose: "Angry" }
				]
			},
			{ Text: "(The bandit boss and her minions are having a loud argument.)" },
			{
				Text: "(What will you do?)",
				Answer: [
					{ Text: "(Turn back silently.)", Script: function() { PlatformDialogLeave(); PlatformLoadRoom("ForestPlainToSavannah"); PlatformPlayer.X = 100; PlatformPlayer.FaceLeft = false; } },
					{ Text: "(Walk around and try to avoid them.)", Reply: "(One of the bandits spots you.)" },
					{ Text: "(Provoke them.)", Reply: "(All bandits turns toward you.)" },
				]
			},
			{ Text: "Boss!  We have a rat in the camp." },
			{
				Character: [
					{ Name: "Lyn", Status: "Thief", Pose: "Curious" },
					{ Name: "Vera", Status: "Leather", Pose: "Grumpy" },
					{ Name: "Vera", Status: "Leather", Pose: "Angry" }
				]
			},
			{ Text: "Good!  Spring the trap girls." },
			{ Text: "(A fence springs from the ground behind you.)" },
			{ Text: "I'll take care of that rat myself." },
			{ Text: "(She charges toward you with her minions.)" },
			{ Text: "(*** You've reached the end of Bondage Brawl for now. ***)" },
			{ Text: "(*** The Brawl will continue in a future update of the Club. ***)" },
			{ Text: "(*** If you like the game or have ideas for it, please reach Ben987. ***)" },
		],

	}

];

/**
 * Loads the dialog at a specific position
 * @param {Number} Position - The position # to load
 * @returns {void} - Nothing
 */
function PlatformDialogLoadPosition(Position) {
	PlatformDialogPosition = Position;
	if (Position >= PlatformDialog.Dialog.length) {
		if (PlatformDialog.Exit != null) PlatformDialog.Exit();
		PlatformDialogLeave();
		return;
	}
	PlatformDialogText = PlatformDialog.Dialog[Position].Text;
	if (PlatformDialog.Dialog[Position].TextScript != null) PlatformDialogText = PlatformDialog.Dialog[Position].TextScript();
	PlatformDialogAnswer = PlatformDialog.Dialog[Position].Answer;
	PlatformDialogAnswerPosition = 0;
	PlatformDialogReply = null;
	PlatformDialogGoto = null;
	if ((Position == 0) || (PlatformDialog.Dialog[Position].Background != null)) PlatformDialogBackground = "../Screens/Room/PlatformDialog/Background/" + PlatformDialog.Dialog[Position].Background;
	if ((Position == 0) || (PlatformDialog.Dialog[Position].Character != null)) PlatformDialogCharacterDisplay = (PlatformDialog.Dialog[Position].Character == null) ? null : JSON.parse(JSON.stringify(PlatformDialog.Dialog[Position].Character));
	if (PlatformDialog.Dialog[Position].Entry != null) PlatformDialog.Dialog[Position].Entry();
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
			for (let Answer of PlatformDialogAnswer)
				if ((Answer.Perk == null) || ((Answer.Perk == true) && PlatformDialogLeaderHasPerk("Manipulation")) || ((Answer.Perk == false) && !PlatformDialogLeaderHasPerk("Manipulation"))) {
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

/**
 * Change the love/domination value based on the option picked, influenced also by perks
 * @param {Number} CurrentValue - The current value
 * @param {Number} Change - The modifier to apply
 * @param {Boolean} Bonus - If there's a bonus to apply or not
 * @returns {Number} - The new stat after changes
 */
function PlatformDialogChangeValue(CurrentValue, Change, Bonus) {
	if ((CurrentValue == null) || (Change == null)) return CurrentValue;
	if (Bonus == null) Bonus = false;
	if (!Bonus && (CurrentValue >= 10) && (Change > 0)) Change = 1;
	if (!Bonus && (CurrentValue <= -10) && (Change < 0)) Change = -1;
	if (Bonus && (CurrentValue < 10) && (Change > 0)) Change++;
	if (Bonus && (CurrentValue > -10) && (Change < 0)) Change--;
	let Value = CurrentValue + Change;
	if (Value > 20) Value = 20;
	if (Value < -20) Value = -20;
	return Value;
}

/**
 * Pick a specific idle pose if the character allows it
 * @param {Object} Character - The character to evaluate
 * @param {Number} Love - The love value that changed
 * @param {Number} Domination - The domination value that changed
 * @returns {Object} - A unused object
 */
function PlatformDialogSetIdlePose(Character, Love, Domination) {
	if (Character == null) return;
	for (let C of PlatformDialogCharacterDisplay)
		if (C.Name == Character.Name) {
			if ((C.Pose == null) || (C.Pose.substr(0, 4) != "Idle")) return;
			for (let T of PlatformDialogCharacterTemplate)
				if (T.Name == Character.Name)
					if ((T.IdlePose == null) || (T.IdlePose.indexOf(C.Status) < 0))
						return;
			if (Love == null) Love = 0;
			if (Domination == null) Domination = 0;
			if ((Love >= 2) && (Math.abs(Love) >= Math.abs(Domination))) return C.Pose = "IdleCheer";
			if ((Love == 1) && (Math.abs(Love) >= Math.abs(Domination))) return C.Pose = "IdleHappy";
			if ((Love == -1) && (Math.abs(Love) >= Math.abs(Domination))) return C.Pose = "IdleSad";
			if ((Love <= -2) && (Math.abs(Love) >= Math.abs(Domination))) return C.Pose = "IdleAngry";
			if (Domination > 0) return C.Pose = "IdleSubmissive";
			if (Domination < 0) return C.Pose = "IdleDominant";
			return C.Pose = "Idle";
		}
}

/**
 * Pick an answer in a specific dialog
 * @param {Number} Position - The position of the answer picked
 * @returns {void} - Nothing
 */
function PlatformDialogPickAnswer(Position) {
	let P = 0;
	for (let Answer of PlatformDialogAnswer)
		if ((Answer.Perk == null) || ((Answer.Perk == true) && PlatformDialogLeaderHasPerk("Manipulation")) || ((Answer.Perk == false) && !PlatformDialogLeaderHasPerk("Manipulation"))) {
			if (Position == P) {
				PlatformDialogReply = Answer.Reply;
				PlatformDialogGoto = Answer.Goto;
				if ((PlatformDialogCharacterDisplay != null) && (PlatformDialogCharacterDisplay.length > 0))
					for (let Character of PlatformDialogCharacter)
						if (Character.Name == PlatformDialogCharacterDisplay[0].Name) {
							PlatformDialogSetIdlePose(Character, Answer.Love, Answer.Domination);
							Character.Love = PlatformDialogChangeValue(Character.Love, Answer.Love, PlatformDialogLeaderHasPerk("Seduction"));
							Character.Domination = PlatformDialogChangeValue(Character.Domination, Answer.Domination, PlatformDialogLeaderHasPerk("Persuasion"));
						}
				if (Answer.Script != null) Answer.Script();
			}
			P++;
		}
}

/**
 * Alters a property (love or domination) for a specific character
 * @param {String} CharacterName - The name of the character to alter
 * @param {String} Property - The name of the property to alter
 * @param {Number} Value - The value to change
 * @returns {void} - Nothing
 */
function PlatformDialogAlterProperty(CharacterName, Property, Value) {
	if ((Character == null) || (Property == null) || (Value == null) || (Value == 0)) return;
	for (let Character of PlatformDialogCharacter)
		if (Character.Name == CharacterName) {
			if (Property == "Love") Character.Love = PlatformDialogChangeValue(Character.Love, Value, PlatformDialogLeaderHasPerk("Seduction"));
			if (Property == "Domination") Character.Domination = PlatformDialogChangeValue(Character.Domination, Value, PlatformDialogLeaderHasPerk("Persuasion"));
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
 * @param {object | number} Key - The key or keyCode pressed
 * @returns {void} - Nothing
 */
function PlatformDialogKeyDown(Key) {
	if (typeof Key === "object") Key = Key.keyCode;
	if (Key == null) Key = KeyPress;
	if ((Key == 32) || (Key == 13) || (Key == 75) || (Key == 76) || (Key == 107) || (Key == 108)) PlatformDialogProcess();
	if ((Key == 87) || (Key == 119) || (Key == 90) || (Key == 122)) {
		PlatformDialogAnswerPosition--;
		if (PlatformDialogAnswerPosition < 0) PlatformDialogAnswerPosition = (PlatformDialogAnswer != null) ? PlatformDialogAnswer.length - 1 : 0;
	}
	if ((Key == 83) || (Key == 115)) {
		PlatformDialogAnswerPosition++;
		if ((PlatformDialogAnswer != null) && (PlatformDialogAnswerPosition >= PlatformDialogAnswer.length)) PlatformDialogAnswerPosition = 0;
	}
}

/**
 * Exits the dialog and returns to the game
 * @returns {void} - Nothing
 */
function PlatformDialogLeave() {
	CommonSetScreen("Room", "Platform");
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformDialogClick() {
	if ((PlatformDialogAnswer == null) || (PlatformDialogReply != null) || MouseIn(1050, 695, 900, 60 + (PlatformDialogAnswer.length - 1) * 70))
		PlatformDialogProcess();
}

/**
 * Returns a dialog character
 * @param {String} Name - The name of a character
 * @returns {Object} - The character object
 */
function PlatformDialogGetCharacter(Name) {
	for (let Character of PlatformDialogCharacter)
		if (Character.Name == Name)
			return Character;
}

/**
 * Handles the controller inputs
 * @param {Object} Buttons - The buttons pressed on the controller
 * @returns {boolean} - Always TRUE to indicate that the controller is handled
 */
function PlatformDialogController(Buttons) {
	if ((Buttons[ControllerA].pressed == true) && (ControllerGameActiveButttons.A == false)) PlatformDialogProcess();
	else if ((Buttons[ControllerB].pressed == true) && (ControllerGameActiveButttons.B == false)) PlatformDialogProcess();
	else if ((Buttons[ControllerX].pressed == true) && (ControllerGameActiveButttons.X == false)) PlatformDialogProcess();
	else if ((Buttons[ControllerY].pressed == true) && (ControllerGameActiveButttons.Y == false)) PlatformDialogProcess();
	else if ((Buttons[ControllerDPadUp].pressed == true) && (ControllerGameActiveButttons.UP == false)) PlatformDialogKeyDown(90);
	else if ((Buttons[ControllerDPadDown].pressed == true) && (ControllerGameActiveButttons.DOWN == false)) PlatformDialogKeyDown(83);
	return true;
}

/**
 * Returns TRUE if the party leader (Melody) has a specific social perk
 * @param {String} PerkName - The name of the perk
 * @returns {boolean} - TRUE if the perk is active
 */
function PlatformDialogLeaderHasPerk(PerkName) {
	if ((PlatformParty == null) || (PlatformParty.length <= 0)) return false;
	if ((PlatformParty[0].Perk == null) || (PlatformParty[0].Perk.length < 10)) return false;
	if ((PerkName == "Seduction") && (PlatformParty[0].Perk.substr(7, 1) == "1")) return true;
	if ((PerkName == "Persuasion") && (PlatformParty[0].Perk.substr(8, 1) == "1")) return true;
	if ((PerkName == "Manipulation") && (PlatformParty[0].Perk.substr(9, 1) == "1")) return true;
	return false;
}

/**
 * Sets up some special event parameters based on the game progress
 * @returns {void}
 */
function PlatformDialogEvent() {

	// In the forest capture mode, Olivia is stuck half bound in a barn
	if (PlatformEventDone("ForestCapture") && !PlatformEventDone("ForestCaptureEnd") && (PlatformPlayer.Name == "Olivia")) {
		PlatformPlayer.HalfBound = true;
		PlatformPlayer.X = 1000;
		PlatformLoadRoom("ForestBarnInterior");
	}

	// In the forest capture mode, Melody is bound, stuck in a crate
	if (PlatformEventDone("ForestCapture") && !PlatformEventDone("ForestCaptureEnd") && !PlatformEventDone("ForestCaptureRescueMelody") && (PlatformPlayer.Name == "Melody")) {
		PlatformPlayer.Health = 0;
		PlatformPlayer.Bound = true;
		PlatformPlayer.X = 1000;
		PlatformLoadRoom("ForestCrateInterior");
	}

	// In the forest capture mode, Melody can be rescued
	if (PlatformEventDone("ForestCapture") && !PlatformEventDone("ForestCaptureEnd") && PlatformEventDone("ForestCaptureRescueMelody") && (PlatformPlayer.Name == "Melody")) {
		PlatformPlayer.X = 1000;
		PlatformLoadRoom("ForestCampGround");
	}

	// In the forest capture mode, Edlaran starts at a campfire
	if (PlatformEventDone("ForestCapture") && !PlatformEventDone("ForestCaptureEnd") && (PlatformPlayer.Name == "Edlaran")) {
		PlatformPlayer.X = 1000;
		PlatformLoadRoom("ForestCampGround");
	}

}
