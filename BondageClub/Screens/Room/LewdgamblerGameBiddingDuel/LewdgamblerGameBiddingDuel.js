'use strict';

(function _() {
	const {
		integrateRoomToWorld,
		pipe,
	} = __vash_utils;

	const {
		INITIAL_STATE,
		BID_ZONE,
		STAGE,
		addBid,
		bidForOther,
		canAddBid,
		canRemoveBid,
		removeBid,
		setPileSize,
		setStage,
		switchStageAfterBids,
		applyOtherDecision,
		roundEnd,
		restrain,
		escape,
		hasWinner,
	} = __lewdgambler_biddingGame;

	let opponentGuy = null;
	const Background = 'LewdgamblerRoomGameTable';
	const PILE_SIZE = 25;

	const lockWithTimer = (character, groupName) => {
		const currentItem = InventoryGet(character, groupName);
		if (!currentItem.Property || !currentItem.Property.LockedBy) {
			InventoryLock(character, currentItem, {
				Asset: AssetGet("Female3DCG", "ItemMisc", "TimerPadlock"),
			});
		}
	};

	const releaseCharacter = (character) => {
		InventoryRemove(character, 'ItemFeet');
		InventoryRemove(character, 'ItemBoots');
		InventoryRemove(character, 'ItemArms');
		InventoryRemove(character, 'ItemHands');
		InventoryRemove(character, 'ItemMouth');
		InventoryRemove(character, 'ItemMouth2');
		InventoryRemove(character, 'ItemHead');
	};

	const applyEndgameStateTransition = (state, updatedState) => {
		const isWinningTransition = !hasWinner(state) && hasWinner(updatedState);
		if (!isWinningTransition) return;

		if (updatedState.stage === STAGE.PLAYER_LOST) {
			CharacterSetCurrent(opponentGuy);
			CharacterLoadCSVDialog(opponentGuy, 'Screens/Room/LewdgamblerGameBiddingDuel/Dialog_NPC_LewdgamblerBiddingGame_Loose');
			releaseCharacter(opponentGuy);
		}

		if (updatedState.stage === STAGE.PLAYER_WON) {
			CharacterSetCurrent(opponentGuy);
			CharacterLoadCSVDialog(opponentGuy, 'Screens/Room/LewdgamblerGameBiddingDuel/Dialog_NPC_LewdgamblerBiddingGame_Win');
			releaseCharacter(Player);
		}
	};

	const applyRestrains = (character, restrains) => {
		if (restrains[BID_ZONE.LEGS] > 0) {
			InventoryWear(character, 'Irish8Cuffs', 'ItemFeet');
		} else {
			InventoryRemove(character, 'ItemFeet');
		}

		if (restrains[BID_ZONE.LEGS] > 1) {
			InventoryWear(character, 'BalletWedges', 'ItemBoots');
		} else {
			InventoryRemove(character, 'ItemBoots');
		}

		if (restrains[BID_ZONE.LEGS] > 2) {
			lockWithTimer(character, 'ItemFeet');
			lockWithTimer(character, 'ItemBoots');
		} else {
			InventoryUnlock(character, 'ItemFeet');
			InventoryUnlock(character, 'ItemBoots');
		}

		if (restrains[BID_ZONE.HANDS] > 0) {
			InventoryWear(character, 'CollarCuffs', 'ItemArms');
		} else {
			InventoryRemove(character, 'ItemArms');
		}

		if (restrains[BID_ZONE.HANDS] > 1) {
			lockWithTimer(character, 'ItemArms');
		} else {
			InventoryUnlock(character, 'ItemArms');
		}

		if (restrains[BID_ZONE.HANDS] > 2) {
			InventoryWear(character, 'PolishedMittens', 'ItemHands');
		} else {
			InventoryRemove(character, 'ItemHands');
		}

		if (restrains[BID_ZONE.HEAD] > 0) {
			InventoryWear(character, 'ClothGag', 'ItemMouth');
		} else {
			InventoryRemove(character, 'ItemMouth');
		}

		if (restrains[BID_ZONE.HEAD] > 1) {
			InventoryWear(character, 'MuzzleGag', 'ItemMouth2');
		} else {
			InventoryRemove(character, 'ItemMouth2');
		}

		if (restrains[BID_ZONE.HEAD] > 2) {
			InventoryWear(character, 'LeatherBlindfold', 'ItemHead');
		} else {
			InventoryRemove(character, 'ItemHead');
		}
	};

	let gameState = INITIAL_STATE;
	const check = selector => selector(gameState);
	const setState = update => {
		const updatedState = update(gameState);
		applyRestrains(Player, updatedState.ownRestrains);
		applyRestrains(opponentGuy, updatedState.otherRestrains);
		applyEndgameStateTransition(gameState, updatedState);
		gameState = updatedState;
	};

	const DrawCasinoButton = (top, left, w, h, text, hint) => {
		const hintText = hint ? TextGet(hint) : null;
		return DrawButton(top, left, w, h, text.toString(), '#61a66f', '', hintText, false, 'White', '#53885d');
	};

	const Load = () => {
		if (opponentGuy == null) {
			opponentGuy = CharacterLoadNPC('');
		}
		setState(() => INITIAL_STATE);
		setState(setStage(STAGE.ROUND_START));
		setState(setPileSize(PILE_SIZE));
	};

	const renderOwnBidValue = value => {
		if (gameState.stage === STAGE.ROUND_START) return '-';
		return value;
	};

	const renderOpponentBidValue = value => {
		if (gameState.stage === STAGE.ROUND_START) return '-';
		if (gameState.stage === STAGE.BIDDING) return '?';
		return value;
	};

	const renderOpponentBubble = text => {
		DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 1500, 16);
		DrawText(text, 1725, 53, "Black", "Gray");
	};

	const Run = () => {
		const {
			otherBids,
			otherPale,
			ownBids,
			ownPale,
			stage,
			winnerPale,
		} = gameState;

		// characters preview
		DrawCharacter(opponentGuy, 1500, 75, 0.9);
		DrawCharacter(Player, 50, 75, 0.9);

		// Bidding labels
		DrawTextFit(`${Player.Name} (${ownPale}$)`, 750, 295, 150, 'White', 'Black');
		DrawTextFit(`${opponentGuy.Name} (${otherPale}$)`, 750, 600, 150, 'White', 'Black');
		DrawTextFit('Head', 900, 80, 150, 'White', 'Black');
		DrawTextFit('Hands', 1075, 80, 150, 'White', 'Black');
		DrawTextFit('Feet', 1250, 80, 150, 'White', 'Black');

		// Player bidding zone
		DrawCasinoButton(855, 250, 90, 90, renderOwnBidValue(ownBids[BID_ZONE.HEAD]));
		DrawCasinoButton(1030, 250, 90, 90, renderOwnBidValue(ownBids[BID_ZONE.HANDS]));
		DrawCasinoButton(1205, 250, 90, 90, renderOwnBidValue(ownBids[BID_ZONE.LEGS]));

		// Opponent bidding zone
		DrawCasinoButton(855, 555, 90, 90, renderOpponentBidValue(otherBids[BID_ZONE.HEAD]));
		DrawCasinoButton(1030, 555, 90, 90, renderOpponentBidValue(otherBids[BID_ZONE.HANDS]));
		DrawCasinoButton(1205, 555, 90, 90, renderOpponentBidValue(otherBids[BID_ZONE.LEGS]));

		// Player bid controls for bidding stage
		if (stage === STAGE.BIDDING) {
			if (check(canAddBid)) DrawCasinoButton(855, 140, 90, 90, '+', "AddHead");
			if (check(canRemoveBid(BID_ZONE.HEAD))) DrawCasinoButton(855, 360, 90, 90, '-', "RemoveHead");
			if (check(canAddBid)) DrawCasinoButton(1030, 140, 90, 90, '+', "AddHands");
			if (check(canRemoveBid(BID_ZONE.HANDS))) DrawCasinoButton(1030, 360, 90, 90, '-', "RemoveHands");
			if (check(canAddBid)) DrawCasinoButton(1205, 140, 90, 90, '+', "AddFeet");
			if (check(canRemoveBid(BID_ZONE.LEGS))) DrawCasinoButton(1205, 360, 90, 90, '-', "RemoveFeet");
		}

		// Winner's pale nocice
		DrawTextFit(`Winner gains additional (${winnerPale}$)`, 875, 750, 400, 'White', 'Black');

		// Generic actions zone
		if (stage === STAGE.BIDDING) {
			renderOpponentBubble('I\'m done. Your move?');
			DrawButton(1010, 850, 200, 90, 'Confirm', 'White', '', TextGet("ConfirmBidding"));
		}

		if (stage === STAGE.ROUND_START) {
			renderOpponentBubble('Scared, you chicken?');
			DrawButton(1010, 850, 200, 90, 'Go on', 'White', '', TextGet("StartRound"));
			if (Player.CanWalk()) DrawButton(790, 850, 200, 90, 'Leave', 'White', '', TextGet("Leave"));
		}

		if (stage === STAGE.WIN_DECISION) {
			renderOpponentBubble('The round is yours');

			// Release actions zone
			DrawButton(75, 140, 400, 90, 'Release head', 'White', '', '');
			DrawButton(75, 250, 400, 90, 'Release hands', 'White', '', '');
			DrawButton(75, 360, 400, 90, 'Release feet', 'White', '', '');

			// Restrain actions zone
			DrawButton(1525, 140, 400, 90, 'Restrain head', 'White', '', '');
			DrawButton(1525, 250, 400, 90, 'Restrain hands', 'White', '', '');
			DrawButton(1525, 360, 400, 90, 'Restrain feet', 'White', '', '');
		}

		if (stage === STAGE.LOOSE_ACCEPTANCE) {
			renderOpponentBubble('Looser, huh.');
			DrawButton(75, 690, 400, 90, 'Do your job...', 'White', '', '');
		}
	};

	const Click = () => {
		const {
			stage,
		} = gameState;

		if (stage === STAGE.BIDDING) {
			// bids controls
			if (MouseIn(855, 140, 90, 90) && check(canAddBid)) setState(addBid(BID_ZONE.HEAD));
			if (MouseIn(855, 360, 90, 90) && check(canRemoveBid(BID_ZONE.HEAD))) setState(removeBid(BID_ZONE.HEAD));
			if (MouseIn(1030, 140, 90, 90) && check(canAddBid)) setState(addBid(BID_ZONE.HANDS));
			if (MouseIn(1030, 360, 90, 90) && check(canRemoveBid(BID_ZONE.HANDS))) setState(removeBid(BID_ZONE.HANDS));
			if (MouseIn(1205, 140, 90, 90) && check(canAddBid)) setState(addBid(BID_ZONE.LEGS));
			if (MouseIn(1205, 360, 90, 90) && check(canRemoveBid(BID_ZONE.LEGS))) setState(removeBid(BID_ZONE.LEGS));

			// proceed buttons
			if (MouseIn(1010, 850, 200, 90)) {
				// cheat should go here
				// setState(setStage(STAGE.CHEAT_DECISION));
				setState(switchStageAfterBids);
			}
		}

		if (stage === STAGE.ROUND_START) {
			// leave button
			if (MouseIn(790, 850, 200, 90)) {
				if (Player.CanWalk()) CommonSetScreen('Room', 'MainHall');
			}
			// proceed buttons
			if (MouseIn(1010, 850, 200, 90)) {
				setState(bidForOther);
				setState(setStage(STAGE.BIDDING));
			}
		}

		if (stage === STAGE.LOOSE_ACCEPTANCE) {
			// loose acceptance buttons
			if (MouseIn(75, 690, 400, 90)) {
				setState(pipe(
					applyOtherDecision,
					roundEnd,
				));
			}
		}

		if (stage === STAGE.WIN_DECISION) {
			// release buttons
			if (MouseIn(75, 140, 400, 90)) {
				setState(pipe(
					escape(BID_ZONE.HEAD),
					roundEnd,
				));
			}
			if (MouseIn(75, 250, 400, 90)) {
				setState(pipe(
					escape(BID_ZONE.HANDS),
					roundEnd,
				));
			}
			if (MouseIn(75, 360, 400, 90)) {
				setState(pipe(
					escape(BID_ZONE.LEGS),
					roundEnd,
				));
			}

			// restrain buttons
			if (MouseIn(1525, 140, 400, 90)) {
				setState(pipe(
					restrain(BID_ZONE.HEAD),
					roundEnd,
				));
			}
			if (MouseIn(1525, 250, 400, 90)) {
				setState(pipe(
					restrain(BID_ZONE.HANDS),
					roundEnd,
				));
			}
			if (MouseIn(1525, 360, 400, 90)) {
				setState(pipe(
					restrain(BID_ZONE.LEGS),
					roundEnd,
				));
			}
		}
	};

	const HandleLostGame = () => {
		// change to moving to casino hall so maids can't reach you
		CommonSetScreen('Room', 'MainHall');
		CharacterChangeMoney(Player, -PILE_SIZE);
		DialogLeave();
	};

	const HandleWonGame = () => {
		CommonSetScreen('Room', 'MainHall');
		CharacterChangeMoney(Player, PILE_SIZE * 2);
		DialogLeave();
	};

	integrateRoomToWorld('LewdgamblerGameBiddingDuel', {
		Background, Load, Run, Click, HandleLostGame, HandleWonGame,
	});
})();
