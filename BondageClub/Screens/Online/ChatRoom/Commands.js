"use strict";

/** @type {ICommand[]} */
var Commands = [];
/** @readonly */
let CommandsKey = "/";
/** @type {TextCache} */
let CommandText = null;

/**
 * Loads the commands for the Player
 * @returns {void} - Nothing
 */
function CommandsLoad() {
	CommandCombine(CommonCommands);
	CommandsTranslate();
}

/**
 * Translates the help for commands
 * @returns {void} - Nothing
 */
function CommandsTranslate() {
	if (!CommandText) {
		CommandText = new TextCache("Screens/Online/ChatRoom/Text_Commands.csv");
	}
	else CommandText.buildCache();
}

/**
 * Gets all available commands
 * @returns [ICommand[]]
 */
function GetCommands() {
	return Commands;
}

/**
 * Fill the user input with the command
 * @param {string} command
 * @returns {void} - Nothing
 */
function CommandSet(command) {
	ElementValue("InputChat", CommandsKey + command + " ");
	ElementFocus("InputChat");
}

/**
 * Add a list of commands
 * @param {ICommand | ICommand[]} add - Commands to add
 * @returns {void} - Nothing
 */
function CommandCombine(add) {
	if (!add) return;
	const arr = Array.isArray(add) ? add : [add];
	Commands = Commands.filter(C => !arr.some(A => A.Tag == C.Tag)).concat(arr);
	Commands.sort((A, B) => String.prototype.localeCompare.call(A.Tag, B.Tag));
}

/**
 * Parse the input chat message
 * @param {string} msg - Input string, cannot be empty
 */
function CommandParse(msg) {
	if (msg.startsWith(CommandsKey + CommandsKey)) {
		msg = msg.substr(1);
	} else if (msg.startsWith(CommandsKey)) {
		CommandExecute(msg);
		return;
	}
	if (msg.startsWith("*") || (Player.ChatSettings.MuStylePoses && msg.startsWith(":") && msg.length > 3)) {
		ChatRoomSendEmote(msg);
		ElementValue("InputChat", "");
		return;
	}
	const WhisperTarget = ChatRoomCharacter.find(C => C.MemberNumber == ChatRoomTargetMemberNumber);
	if (!ChatRoomShouldBlockGaggedOOCMessage(msg, WhisperTarget)) {
		if (ChatRoomTargetMemberNumber == null) {

			// Regular chat can be prevented with an owner presence rule, also validates for forbidden words
			if (!ChatRoomOwnerPresenceRule("BlockTalk", null) && ChatRoomOwnerForbiddenWordCheck(msg)) {
				ServerSend("ChatRoomChat", { Content: msg, Type: "Chat" });
				ChatRoomStimulationMessage("Talk");
			}

		} else {

			// The whispers get sent to the server and shown on the client directly
			ServerSend("ChatRoomChat", { Content: msg, Type: "Whisper", Target: ChatRoomTargetMemberNumber });
			const TargetName = WhisperTarget ? WhisperTarget.Name : "";

			const div = document.createElement("div");
			div.setAttribute('class', 'ChatMessage ChatMessageWhisper');
			div.setAttribute('data-time', ChatRoomCurrentTime());
			div.setAttribute('data-sender', Player.MemberNumber.toString());
			div.textContent = TextGet("WhisperTo") + " " + TargetName + ": " + msg;

			const Refocus = document.activeElement.id == "InputChat";
			const ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
			if (document.getElementById("TextAreaChatLog") != null) {
				document.getElementById("TextAreaChatLog").appendChild(div);
				if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
				if (Refocus) ElementFocus("InputChat");
			}
		}
	} else {
		// Throw an error message
		ChatRoomMessage({ Content: "ChatRoomBlockGaggedOOC", Type: "Action", Sender: Player.MemberNumber });
	}

	// Clears the chat text message
	ElementValue("InputChat", "");
}

/**
 * Prints out the help for commands with tags that include low
 * @param {string} low - lower case search keyword for tags
 * @param {number} [timeout] - total time to display the help message in ms
 * @returns {void} - Nothing
 */
function CommandHelp(low, timeout) {
	ChatRoomSendLocal(TextGet("CommandHelp").replace('KeyWord', low), timeout);
	CommandPrintHelpFor(GetCommands().filter(C => !low || C.Tag.includes(low)), timeout);
}

/**
 * Prints out the help for commands
 * @param {Optional<ICommand, 'Action'>[]} Commands - list of commands
 * @param {number} Timeout - total time to display the help message in ms
 */
function CommandPrintHelpFor(Commands, Timeout) {
	Commands
		.filter(C => !C.Prerequisite || C.Prerequisite.call(C))
		.forEach(C => {
			const Help = CommandText.cache[C.Tag] || C.Description || TextGet("CommandHelpMissing");
			ChatRoomSendLocal(`<strong onclick='window.CommandSet("${C.Tag}")'>${CommandsKey}${C.Tag}</strong> ${Help}`, Timeout);
		});
}

/**
 * Finds command and executes it from the message
 * @param {string} msg - User input
 * @returns {void} - Nothing
 */
function CommandExecute(msg) {
	const low = msg.toLowerCase();
	const [key, ...parsed] = low.replace(/\s{2,}/g, ' ').split(' ');
	const flt = GetCommands().filter(C => key.indexOf(CommandsKey + C.Tag) == 0);
	let C = flt[0];

	if (flt.length > 1) C = null;
	if (C && C.Reference) C = GetCommands().find(D => D.Tag == C.Reference);
	if (C == null) {
		ElementValue("InputChat", CommandsKey + "invalid " + TextGet("CommandNoSuchCommand"));
		return;
	}
	if (C.Prerequisite && C.Prerequisite.call(C) == false) {
		ElementValue("InputChat", CommandsKey + "invalid " + TextGet("CommandPrerequisiteFailed"));
		return;
	}
	C.Action.call(C, low.substring(C.Tag.length + 2), msg, parsed);
	if (C.Clear == null || C.Clear) {
		ElementValue("InputChat", "");
		ElementFocus("InputChat");
	}
}

/**
 * Tries to complete the message to a command or print help about it
 * @param {string} msg - InputChat content
 */
function CommandAutoComplete(msg) {
	const low = msg.toLowerCase();
	if (!low || !low.startsWith(CommandsKey) || low.length <= CommandsKey.length) return;
	if (low.substr(CommandsKey.length).startsWith(CommandsKey)) return;

	const [key, ...forward] = low.replace(/\s{2,}/g, ' ').split(' ');
	const CS = GetCommands().filter(C => (CommandsKey + C.Tag).indexOf(key) == 0);
	if (CS.length == 0) return;

	if (CS.length == 1) {
		if (key != (CommandsKey + CS[0].Tag)) {
			ElementValue("InputChat", CommandsKey + CS[0].Tag + " ");
			ElementFocus("InputChat");
		} else if (CS[0].AutoComplete) {
			CS[0].AutoComplete.call(CS[0], forward, low, msg);
		}
		return;
	} if (forward.length > 0) return;

	let complete = low;
	for (let I = low.length - CommandsKey.length; ; ++I) {
		const TSI = CS.map(C => C.Tag[I]);
		if (TSI.some(TI => TI == null)) break;
		if (new Set(TSI).size != 1) break;
		complete += TSI[0];
	}

	if (low.length != complete.length) {
		ElementValue("InputChat", complete);
		ElementFocus("InputChat");
	} else {
		CommandPrintHelpFor(CS, 5000);
	}
}

/**
 * @type {ICommand[]}
 */
const CommonCommands = [
	{
		Tag: 'dice',
		Action: args => {
			let DiceNumber = 0;
			let DiceSize = 0;

			// The player can roll X dice of Y faces, using XdY.  If no size is specified, a 6 sided dice is assumed
			if (/(^\d+)[dD](\d+$)/.test(args)) {
				const Roll = /(^\d+)[dD](\d+$)/.exec(args);
				DiceNumber = (!Roll) ? 1 : parseInt(Roll[1]);
				DiceSize = (!Roll) ? 6 : parseInt(Roll[2]);
				if ((DiceNumber < 1) || (DiceNumber > 100)) DiceNumber = 1;
			}
			else if (/(^\d+$)/.test(args)) {
				const Roll = /(^\d+)/.exec(args);
				DiceNumber = 1;
				DiceSize = (!Roll) ? 6 : parseInt(Roll[1]);
			}

			// If there's at least one dice to roll
			if (DiceNumber > 0) {
				if ((DiceSize < 2) || (DiceSize > 100)) DiceSize = 6;
				let CurrentRoll = 0;
				const Result = [];
				let Total = 0;
				while (CurrentRoll < DiceNumber) {
					let Roll = Math.floor(Math.random() * DiceSize) + 1;
					Result.push(Roll);
					Total += Roll;
					CurrentRoll++;
				}
				if (DiceNumber > 1) {
					Result.sort((a, b) => a - b);
				}

				const Dictionary = new DictionaryBuilder()
					.sourceCharacter(Player)
					.text("DiceType", DiceNumber.toString() + "D" + DiceSize.toString())
					.if(DiceNumber > 1)
					.text("DiceResult", Result.toString() + " = " + Total.toString())
					.endif()
					.if(DiceNumber=== 1)
					.text("DiceResult", Total.toString())
					.endif()
					.build();
				ServerSend("ChatRoomChat", { Content: "ActionDice", Type: "Action", Dictionary: Dictionary });
			}
		}
	},
	{
		Tag: 'coin',
		Action: () => {
			const Heads = Math.random() >= 0.5;

			const Dictionary = new DictionaryBuilder()
				.sourceCharacter(Player)
				.textLookup("CoinResult", Heads ? "Heads" : "Tails")
				.build();
			ServerSend("ChatRoomChat", { Content: "ActionCoin", Type: "Action", Dictionary: Dictionary });
		}
	},
	{
		Tag: '/',
		Action: () => { /* This Action will never be called */ }
	},
	{
		Tag: 'safeword',
		Action: () => ChatRoomSafewordChatCommand(),
	},
	{
		Tag: 'friendlistadd',
		Action: args => ChatRoomListManipulation(Player.FriendList, true, args),
	},
	{
		Tag: 'friendlistremove',
		Action: args => ChatRoomListManipulation(Player.FriendList, false, args),
	},
	{
		Tag: 'ghostadd',
		Action: args => ChatRoomListManipulation(Player.GhostList, true, args),
	},
	{
		Tag: 'ghostremove',
		Action: args => ChatRoomListManipulation(Player.GhostList, false, args),
	},
	{
		Tag: 'whitelistadd',
		Action: args => ChatRoomListManipulation(Player.WhiteList, true, args),
	},
	{
		Tag: 'whitelistremove',
		Action: args => ChatRoomListManipulation(Player.WhiteList, false, args),
	},
	{
		Tag: 'blacklistadd',
		Action: args => ChatRoomListManipulation(Player.BlackList, true, args),
	},
	{
		Tag: 'blacklistremove',
		Action: args => ChatRoomListManipulation(Player.BlackList, false, args),
	},
	{
		Tag: 'showblacklist',
		Action: () => ChatRoomSendLocal(TextGet('CommandBlacklist') + JSON.stringify(Player.BlackList)),
	},
	{
		Tag: 'showwhitelist',
		Action: () => ChatRoomSendLocal(TextGet('CommandWhitelist') + JSON.stringify(Player.WhiteList)),
	},
	{
		Tag: 'showghostlist',
		Action: () => ChatRoomSendLocal(TextGet('CommandGhostlist') + JSON.stringify(Player.GhostList)),
	},
	{
		Tag: 'showfriendlist',
		Action: () => ChatRoomSendLocal(TextGet('CommandFriendlist') + JSON.stringify(Player.FriendList)),
	},
	{
		Tag: 'openfriendlist',
		Action: () => {
			ElementToggleGeneratedElements(CurrentScreen, false);
			FriendListReturn = { Screen: CurrentScreen , Module: CurrentModule, IsInChatRoom: true };
			CommonSetScreen("Character", "FriendList");
		},
	},
	{
		Tag: 'ban',
		Prerequisite: () => ChatRoomPlayerIsAdmin(),
		Action: args => ChatRoomAdminChatAction("Ban", args),
	},
	{
		Tag: 'unban',
		Prerequisite: () => ChatRoomPlayerIsAdmin(),
		Action: args => ChatRoomAdminChatAction("Unban", args),
	},
	{
		Tag: 'kick',
		Prerequisite: () => ChatRoomPlayerIsAdmin(),
		Action: args => ChatRoomAdminChatAction("Kick", args),
	},
	{
		Tag: 'promote',
		Prerequisite: () => ChatRoomPlayerIsAdmin(),
		Action: args => ChatRoomAdminChatAction("Promote", args),
	},
	{
		Tag: 'demote',
		Prerequisite: () => ChatRoomPlayerIsAdmin(),
		Action: args => ChatRoomAdminChatAction("Demote", args),
	},
	{
		Tag: 'me',
		Action: (_, msg) => ChatRoomSendEmote(msg),
	},
	{
		Tag: 'action',
		Action: (_, msg) => ChatRoomSendEmote(msg),
	},
	{
		Tag: 'invalid',
		Action: () => { },
	},
	{
		Tag: 'help',
		Action: args => CommandHelp(args),
	},
	{
		Tag: 'afk',
		Action: () => {
			const expression = WardrobeGetExpression(Player).Emoticon != "Afk" ? "Afk" : null;
			CharacterSetFacialExpression(Player, "Emoticon", expression);
		}
	},
	{
		Tag: 'expr',
		Action: args => {
			if (args.trim() == "") {
				ChatRoomFocusCharacter(Player);
				DialogFindSubMenu("SavedExpressions");
			} else if (/^[0-5]$/.test(args)) {
				let ExprNum = parseInt(args);
				if (ExprNum == 0) {
					CharacterResetFacialExpression(Player);
				} else {
					DialogFacialExpressionsLoad(ExprNum - 1);
				}
			}
		}
	},
	{
		Tag: 'blush',
		Action: args => {
			if (args.trim() == "") {
				ChatRoomFocusCharacter(Player);
				DialogFindSubMenu("Expression");
				DialogFindFacialExpressionMenuGroup("Blush");
				return;
			}
			/** @type {(null | ExpressionNameMap["Blush"])[]} */
			let BlushLevels = [null, "Low", "Medium", "High", "VeryHigh", "Extreme"];
			/** @type {null | ExpressionName} */
			let NewExpression = null;
			let AcceptCmd = false;
			if (/^[0-5]$/.test(args)) {
				AcceptCmd = true;
				let BlushNum = parseInt(args);
				NewExpression = BlushLevels[BlushNum];
			} else if (/^(b(?:lue)?)$/.test(args)) {
				AcceptCmd = true;
				NewExpression = "ShortBreath";
			} else if (/^(\+|-)$/.test(args)) {
				AcceptCmd = true;
				const Blush = InventoryGet(Player, "Blush");
				let CurrentBlush = null;
				if (Blush && Blush.Property && Blush.Property.Expression) {
					CurrentBlush = Blush.Property.Expression;
				}
				let Level = 0;
				for (let i = 0; i < BlushLevels.length; i++) {
					if (CurrentBlush == BlushLevels[i]) {
						Level = i;
						break;
					}
				}
				if (args == "+") {
					Level++;
				} else {
					Level--;
				}
				Level = Math.max(0, Level);
				Level = Math.min(BlushLevels.length - 1, Level);
				NewExpression = BlushLevels[Level];
			}
			if (AcceptCmd) {
				CharacterSetFacialExpression(Player, "Blush", NewExpression);
				// Also save in GUI
				if (DialogFacialExpressions.length == 0) {
					DialogFacialExpressionsBuild();
				}
				DialogFacialExpressions.find(FE => FE.Group == "Blush").CurrentExpression = NewExpression;
			}
		}
	},
	{
		Tag: 'eyes',
		Action: args => {
			if (args.trim() == "") {
				ChatRoomFocusCharacter(Player);
				DialogFindSubMenu("Expression");
				DialogFindFacialExpressionMenuGroup("Eyes");
				return;
			}
			let AcceptCmd = false;
			/** @type {ExpressionName} */
			let NewExpression;
			let TargetLeft = false;
			let TargetRight = false;
			let Cmds;
			if (/^(r(?:ight)?|l(?:eft)?|b(?:oth)?)$/.test(args)) {
				AcceptCmd = true;
				if (args[0] == "r" || args[0] == "b") TargetRight = true;
				if (args[0] == "l" || args[0] == "b") TargetLeft = true;
				let LeftClosed = InventoryGet(Player, "Eyes").Property.Expression == "Closed";
				let RightClosed = InventoryGet(Player, "Eyes2").Property.Expression == "Closed";
				let Close = (TargetLeft && !LeftClosed);
				Close = Close || (TargetRight && !RightClosed);
				NewExpression = Close ? "Closed" : "Open";
			} else if ((Cmds = /^(c(?:lose)?|o(?:pen)?) *(r(?:ight)?|l(?:eft)?|b(?:oth)?)?$/.exec(args)) != null) {
				AcceptCmd = true;
				let ActionCmd = Cmds[1];
				let TargetCmd = Cmds[2];
				NewExpression = (ActionCmd[0] == "c") ? "Closed" : "Open";
				if (!TargetCmd || TargetCmd[0] == "r" || TargetCmd[0] == "b") {
					TargetRight = true;
				}
				if (!TargetCmd || TargetCmd[0] == "l" || TargetCmd[0] == "b") {
					TargetLeft = true;
				}
			} else if (/^(default|dazed|shy|sad|horny|lewd|verylewd|heart|<3|heartpink|lewdheart|lewdheartpink|dizzy|@@|daydream|><|shylyhappy|\^\^|angry|èé|surprised|éè|scared)$/.test(args)) {
				AcceptCmd = true;
				if (args == "default") NewExpression = null;
				else if (args == "dazed") NewExpression = "Dazed";
				else if (args == "shy") NewExpression = "Shy";
				else if (args == "sad") NewExpression = "Sad";
				else if (args == "horny") NewExpression = "Horny";
				else if (args == "lewd") NewExpression = "Lewd";
				else if (args == "verylewd") NewExpression = "VeryLewd";
				else if (args == "heart" || args == "<3") NewExpression = "Heart";
				else if (args == "heartpink") NewExpression = "HeartPink";
				else if (args == "lewdheart") NewExpression = "LewdHeart";
				else if (args == "lewdheartpink") NewExpression = "LewdHeartPink";
				else if (args == "dizzy" || args == "@@") NewExpression = "Dizzy";
				else if (args == "daydream" || args == "><") NewExpression = "Daydream";
				else if (args == "shylyhappy" || args == "^^") NewExpression = "ShylyHappy";
				else if (args == "angry" || args == "èé") NewExpression = "Angry";
				else if (args == "surprised" || args == "éè") NewExpression = "Surprised";
				else if (args == "scared") NewExpression = "Scared";
			}
			if (!AcceptCmd) {
				return;
			}
			if (NewExpression == "Open" || NewExpression == "Closed") {
				if (NewExpression == "Open") {
					// Restore opened eye expression set from GUI
					let DialogCurrentExpr = DialogFacialExpressions.find(FE => FE.Group == "Eyes");
					if (DialogCurrentExpr) {
						NewExpression = DialogCurrentExpr.CurrentExpression;
					} else {
						NewExpression = null;
					}
				}
				if (TargetLeft && TargetRight) {
					CharacterSetFacialExpression(Player, "Eyes", NewExpression);
				} else if (TargetLeft) {
					CharacterSetFacialExpression(Player, "Eyes1", NewExpression);
				} else if (TargetRight) {
					CharacterSetFacialExpression(Player, "Eyes2", NewExpression);
				}
			} else {
				// Change eye expression
				// Save new expression in GUI because close will erase it
				let DialogCurrentExpr = DialogFacialExpressions.find(FE => FE.Group == "Eyes");
				if (!DialogCurrentExpr) {
					DialogFacialExpressionsBuild();
					DialogCurrentExpr = DialogFacialExpressions.find(FE => FE.Group == "Eyes");
				}
				DialogCurrentExpr.CurrentExpression = NewExpression;
				// Apply new expression only to eyes that are opened
				let LeftClosed = InventoryGet(Player, "Eyes").Property.Expression == "Closed";
				let RightClosed = InventoryGet(Player, "Eyes2").Property.Expression == "Closed";
				if (!LeftClosed) CharacterSetFacialExpression(Player, "Eyes1", NewExpression);
				if (!RightClosed) CharacterSetFacialExpression(Player, "Eyes2", NewExpression);
			}
		}
	},
	{
		Tag: 'bot',
		Action: (_, msg) => {
			for (const { ID, MemberNumber } of ChatRoomCharacter)
				if (ID != 0 && MemberNumber >= 0)
					ServerSend("ChatRoomChat", { Content: "ChatRoomBot " + msg.substring(4), Type: "Hidden", Target: MemberNumber });
		}
	},
	{
		Tag: "craft",
		Action: () => {
			document.getElementById("InputChat").style.display = "none";
			document.getElementById("TextAreaChatLog").style.display = "none";
			ChatRoomChatHidden = true;
			CraftingShowScreen(true);
		},
	},
	{
		Tag: "forbiddenwords",
		Action: () => {

			// No forbidden words if not owned
			if (CurrentScreen != "ChatRoom") return;
			if (!Player.IsOwned()) return;

			// Gets the forbidden words list from the log
			let ForbiddenList = [];
			for (let L of Log)
				if ((L.Group == "OwnerRule") && L.Name.startsWith("ForbiddenWords"))
					ForbiddenList = L.Name.substring("ForbiddenWords".length, 10000).split("|");
			if (ForbiddenList.length <= 1) return true;
			ForbiddenList.splice(0, 1);

			// Shows the list in the chat window
			ChatRoomMessage({Type: "LocalMessage",  Content: ForbiddenList.join(", "), Sender: Player.MemberNumber});

		},
	},
	{
		Tag: "wheel",
		Action: () => {
			if (!InventoryAvailable(Player, "WheelFortune", "ItemDevices")) return;
			document.getElementById("InputChat").style.display = "none";
			document.getElementById("TextAreaChatLog").style.display = "none";
			ChatRoomChatHidden = true;
			WheelFortuneEntryModule = CurrentModule;
			WheelFortuneEntryScreen = CurrentScreen;
			WheelFortuneBackground = ChatRoomData.Background;
			WheelFortuneCharacter = Player;
			CommonSetScreen("MiniGame", "WheelFortune");
		},
	},
	{
		Tag: "release",
		Action: args => {
			let MemberNumber = parseInt(args);
			if ((typeof MemberNumber == "number") && !isNaN(MemberNumber) && (MemberNumber >= 0))
				ServerSend("AccountOwnership", { MemberNumber: MemberNumber, Action: "Release" });
		},
	}
];
