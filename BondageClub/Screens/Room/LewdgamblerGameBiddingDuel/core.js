"use strict";

/* eslint-disable semi */
window.__lewdgambler_biddingGame = (function _() {
	const {
		pipe,
		complement,
		sum,
		anyPass,
	} = __vash_utils;

	const STAGE = {
		INITIAL: 'INITIAL',
		ROUND_START: 'ROUND_START',
		BIDDING: 'BIDDING',
		CHEAT_DECISION: 'CHEAT_DECISION',
		WIN_DECISION: 'WIN_DECISION',
		LOOSE_ACCEPTANCE: 'LOOSE_ACCEPTANCE',
		PLAYER_WON: 'PLAYER_WON',
		PLAYER_LOST: 'PLAYER_LOST',
	}

	const CHEAT_CHANCE = 0.15
	const BLUFF_CHANCE = 0.15
	const MAX_RESTRAIN_LEVEL = 3

	const RESTRAIN = {
		HEAD_STUFFING: 'stuffing',
		HEAD_CLEAVE: 'cleave',
		HEAD_BLINDFOLD: 'blindfold',
		FEET_TIED: 'tied-feet',
		FEET_BOOTS: 'boots',
		FEET_LOCKED: 'locked-feet',
		HANDS_HANDCUFFS: 'handcuffs',
		HANDS_TIED_BEHIND: 'armbinder',
		HANDS_MITTENS: 'mittens',
	}

	const BID_ZONE = {
		HEAD: 'head',
		HANDS: 'hands',
		LEGS: 'legs',
	}

	const DECISION = {
		CHEAT_SKIP: 'CHEAT_SKIP',
		CHEAT_HANDS: 'CHEAT_HANDS',
		CHEAT_HEAD: 'CHEAT_HEAD',
		CHEAT_FEET: 'CHEAT_FEET',
		ESCAPE_HANDS: 'ESCAPE_HANDS',
		ESCAPE_HEAD: 'ESCAPE_HEAD',
		ESCAPE_FEET: 'ESCAPE_FEET',
		RESTRAIN_HANDS: 'RESTRAIN_HANDS',
		RESTRAIN_HEAD: 'RESTRAIN_HEAD',
		RESTRAIN_FEET: 'RESTRAIN_FEET',
	}

	const RESTRAIN_STATS = {
		[RESTRAIN.HEAD_STUFFING]: {
			zone: BID_ZONE.HEAD,
			level: 1,
		},
		[RESTRAIN.HEAD_CLEAVE]: {
			zone: BID_ZONE.HEAD,
			level: 2,
		},
		[RESTRAIN.HEAD_BLINDFOLD]: {
			zone: BID_ZONE.HEAD,
			level: 3,
		},
		[RESTRAIN.FEET_TIED]: {
			zone: BID_ZONE.LEGS,
			level: 1,
		},
		[RESTRAIN.FEET_BOOTS]: {
			zone: BID_ZONE.LEGS,
			level: 2,
		},
		[RESTRAIN.FEET_LOCKED]: {
			zone: BID_ZONE.LEGS,
			level: 3,
		},
		[RESTRAIN.HANDS_HANDCUFFS]: {
			zone: BID_ZONE.HANDS,
			level: 1,
		},
		[RESTRAIN.HANDS_TIED_BEHIND]: {
			zone: BID_ZONE.HANDS,
			level: 2,
		},
		[RESTRAIN.HANDS_MITTENS]: {
			zone: BID_ZONE.HANDS,
			level: 3,
		},
	}

	const BID_STATUS = {
		WIN: 'win',
		LOOSE: 'loose',
		DRAW: 'draw',
	}

	const INITIAL_STATE = {
		ownPale: 0,
		winnerPale: 0,
		otherPale: 0,
		stage: STAGE.INITIAL,
		ownRestrains: {
			[BID_ZONE.HEAD]: 0,
			[BID_ZONE.HANDS]: 0,
			[BID_ZONE.LEGS]: 1,
		},
		otherRestrains: {
			[BID_ZONE.HEAD]: 0,
			[BID_ZONE.HANDS]: 0,
			[BID_ZONE.LEGS]: 1,
		},
		ownBids: {
			[BID_ZONE.HEAD]: 0,
			[BID_ZONE.HANDS]: 0,
			[BID_ZONE.LEGS]: 0,
		},
		otherBids: {
			[BID_ZONE.HEAD]: 0,
			[BID_ZONE.HANDS]: 0,
			[BID_ZONE.LEGS]: 0,
		},
	}

	const randomInt = (min, max) =>
		Math.floor(Math.random() * (max  + 1 - min) + min)

	const checkRestrain = restrainName => restrains => {
		const { zone, level } = (RESTRAIN_STATS[restrainName] || {})
		return (restrains[zone] || 0) >= level
	}

	const hasRestrain = restrainName => state =>
		checkRestrain(restrainName)(state.ownRestrains);
	const hasRestrains = restrains => state =>
		restrains.some(restrainName => hasRestrain(restrainName)(state))

	const hasOtherRestrain = restrainName => state =>
		checkRestrain(restrainName)(state.otherRestrains);
	const hasOtherRestrains = restrains => state =>
		restrains.some(restrainName => hasOtherRestrain(restrainName)(state))

	// @TODO: add some intelligence here
	const rollBid = pale => {
		const max = Math.floor(pale / 3)
		return {
			[BID_ZONE.HEAD]: randomInt(0, max),
			[BID_ZONE.HANDS]: randomInt(0, max),
			[BID_ZONE.LEGS]: randomInt(0, max),
		}
	}

	const bidsTotal = bids => sum(Object.values(bids))

	const canRestrain = zone => state => (state.otherRestrains[zone] || 0) < MAX_RESTRAIN_LEVEL
	const canOtherRestrain = zone => state => (state.ownRestrains[zone] || 0) < MAX_RESTRAIN_LEVEL
	const canEscape = zone => state => {
		if (zone === BID_ZONE.LEGS && hasRestrains([RESTRAIN.FEET_LOCKED])(state)) {
			return false
		}

		return state.ownRestrains[zone] > 0
	}
	const canOtherEscape = zone => state => {
		if (zone === BID_ZONE.LEGS && hasOtherRestrains([RESTRAIN.FEET_LOCKED])(state)) {
			return false
		}

		return state.otherRestrains[zone] > 0
	}
	const canLeave = complement(hasRestrains([RESTRAIN.FEET_TIED]))
	const canCheat = complement(hasRestrains([RESTRAIN.HANDS_HANDCUFFS]))
	const canBluff = complement(hasRestrains([RESTRAIN.HEAD_STUFFING]))
	const canRemoveBid = zone => state => state.ownBids[zone] > 0
	const canAddBid = state => state.ownPale - bidsTotal(state.ownBids) > 0
	const isWinner = hasOtherRestrains([RESTRAIN.HEAD_BLINDFOLD, RESTRAIN.HANDS_MITTENS])
	const isLooser = hasRestrains([RESTRAIN.HEAD_BLINDFOLD, RESTRAIN.HANDS_MITTENS])
	const hasWinner = anyPass([isWinner, isLooser])
	const dropBids = state => ({
		...state,
		ownBids: { [BID_ZONE.HEAD]: 0, [BID_ZONE.HANDS]: 0, [BID_ZONE.LEGS]: 0 },
		otherBids: { [BID_ZONE.HEAD]: 0, [BID_ZONE.HANDS]: 0, [BID_ZONE.LEGS]: 0 },
	})
	const bidForOther = state => ({
		...state,
		otherBids: rollBid(state.otherPale),
	})
	const addBid = zone => state => ({
		...state,
		ownBids: {
			...state.ownBids,
			[zone]: state.ownBids[zone] + 1,
		},
	})
	const removeBid = zone => state => ({
		...state,
		ownBids: {
			...state.ownBids,
			[zone]: state.ownBids[zone] - 1,
		},
	})

	const cheat = zone => state => {
		const cheatSucceed = Math.random() < CHEAT_CHANCE
		if (!cheatSucceed) {
			return state
		}
		const ownZoneBid = state.ownBids[zone]
		const otherZoneBid = state.otherBids[zone]
		const diff = otherZoneBid - ownZoneBid
		const ownBidSum = bidsTotal(state.ownBids)
		const addedBid = Math.min(state.ownPale - ownBidSum, diff + 1)

		return {
			...state,
			ownBids: {
				...state.ownBids,
				[zone]: ownZoneBid + addedBid,
			},
		}
	}

	const bluff = zone => state => {
		const bluffSucceed = Math.random() < BLUFF_CHANCE
		if (!bluffSucceed) {
			return state
		}

		const currentBid = state.otherBids
		const paleLeft = state.otherPale - bidsTotal(state.otherBids)
		const addedBid = randomInt(0, paleLeft)

		return {
			...state,
			otherBids: {
				...state.otherBids,
				[zone]: currentBid + addedBid,
			},
		}
	}

	const compareBids = zone => state => {
		const ownBid = state.ownBids[zone]
		const otherBid = state.otherBids[zone]

		if (ownBid === otherBid) return BID_STATUS.DRAW
		if (ownBid > otherBid) return BID_STATUS.WIN
		return BID_STATUS.LOOSE
	}

	const getBidsStatuses = state => ({
		[BID_ZONE.HEAD]: compareBids(BID_ZONE.HEAD)(state),
		[BID_ZONE.HANDS]: compareBids(BID_ZONE.HANDS)(state),
		[BID_ZONE.LEGS]: compareBids(BID_ZONE.LEGS)(state),
	})

	const getBidRoundStatus = state => {
		const statuses = getBidsStatuses(state)
		const winsAmount = Object.values(statuses)
			.filter(x => x === BID_STATUS.WIN).length
		const lossesAmount = Object.values(statuses)
			.filter(x => x === BID_STATUS.LOOSE).length

		if (winsAmount > lossesAmount) {
			return BID_STATUS.WIN
		} else if (winsAmount < lossesAmount) {
			return BID_STATUS.LOOSE
		}

		return BID_STATUS.DRAW
	}

	const applyZoneBid = zone => state => {
		const ownBid = state.ownBids[zone]
		const otherBid = state.otherBids[zone]
		const zoneStatus = compareBids(zone)(state)

		switch (zoneStatus) {
			case BID_STATUS.DRAW: {
				return {
					...state,
					ownPale: Math.max(0, state.ownPale - ownBid),
					otherPale: Math.max(0, state.otherPale - otherBid),
					winnerPale: state.winnerPale + otherBid + ownBid,
				}
			}
			case BID_STATUS.WIN: {
				return {
					...state,
					ownPale: Math.max(0, state.ownPale - ownBid),
					otherPale: Math.max(0, state.otherPale - otherBid + ownBid),
					winnerPale: state.winnerPale + otherBid,
				}
			}
			case BID_STATUS.LOOSE: {
				return {
					...state,
					ownPale: Math.max(0, state.ownPale - ownBid + otherBid),
					otherPale: Math.max(0, state.otherPale - otherBid),
					winnerPale: state.winnerPale + ownBid,
				}
			}
			default: return state
		}
	}

	const recalculatePales = state => Object.values(BID_ZONE)
		.reduce((acc, zone) => applyZoneBid(zone)(acc), state)

	const applyBids = pipe(
		recalculatePales,
		dropBids,
	)

	const restrain = zone => state => ({
		...state,
		otherRestrains: {
			...state.otherRestrains,
			[zone]: state.otherRestrains[zone] + 1,
		},
	})

	const otherRestrain = zone => state => ({
		...state,
		ownRestrains: {
			...state.ownRestrains,
			[zone]: state.ownRestrains[zone] + 1,
		},
	})

	const escape = zone => state => ({
		...state,
		ownRestrains: {
			...state.ownRestrains,
			[zone]: state.ownRestrains[zone] - 1,
		},
	})

	const otherEscape = zone => state => ({
		...state,
		otherRestrains: {
			...state.otherRestrains,
			[zone]: state.otherRestrains[zone] - 1,
		},
	})

	const rollLooseDecision = state => {
		const bidsStatus = getBidsStatuses(state)

		const wins = {
			[BID_ZONE.HANDS]: bidsStatus[BID_ZONE.HANDS] === BID_STATUS.LOOSE,
			[BID_ZONE.HEAD]: bidsStatus[BID_ZONE.HEAD] === BID_STATUS.LOOSE,
			[BID_ZONE.LEGS]: bidsStatus[BID_ZONE.LEGS] === BID_STATUS.LOOSE,
		}

		const options = [
			wins[BID_ZONE.HANDS]
				&& canOtherEscape(BID_ZONE.HANDS)(state)
				&& DECISION.ESCAPE_HANDS,
			wins[BID_ZONE.HEAD]
				&& canOtherEscape(BID_ZONE.HEAD)(state)
				&& DECISION.ESCAPE_HEAD,
			wins[BID_ZONE.LEGS]
				&& canOtherEscape(BID_ZONE.LEGS)(state)
				&& DECISION.ESCAPE_FEET,
			wins[BID_ZONE.HANDS]
				&& canOtherRestrain(BID_ZONE.HANDS)(state)
				&& DECISION.RESTRAIN_HANDS,
			wins[BID_ZONE.HEAD]
				&& canOtherRestrain(BID_ZONE.HEAD)(state)
				&& DECISION.RESTRAIN_HEAD,
			wins[BID_ZONE.LEGS]
				&& canOtherRestrain(BID_ZONE.LEGS)(state)
				&& DECISION.RESTRAIN_FEET,
		].filter(Boolean)

		const decisionIndex = randomInt(0, options.length - 1)
		return options[decisionIndex]
	}

	const getCheatDecisions = state => canCheat(state)
		? [DECISION.CHEAT_HANDS, DECISION.CHEAT_HEAD, DECISION.CHEAT_FEET, DECISION.CHEAT_SKIP]
		: [DECISION.CHEAT_SKIP]

	const getWinDecisions = state => {
		const bidsStatus = getBidsStatuses(state)

		const wins = {
			[BID_ZONE.HANDS]: bidsStatus[BID_ZONE.HANDS] === BID_STATUS.WIN,
			[BID_ZONE.HEAD]: bidsStatus[BID_ZONE.HEAD] === BID_STATUS.WIN,
			[BID_ZONE.LEGS]: bidsStatus[BID_ZONE.LEGS] === BID_STATUS.WIN,
		}

		return [
			wins[BID_ZONE.HANDS]
				&& canEscape(BID_ZONE.HANDS)(state)
				&& DECISION.ESCAPE_HANDS,
			wins[BID_ZONE.HEAD]
				&& canEscape(BID_ZONE.HEAD)(state)
				&& DECISION.ESCAPE_HEAD,
			wins[BID_ZONE.LEGS]
				&& canEscape(BID_ZONE.LEGS)(state)
				&& DECISION.ESCAPE_FEET,
			wins[BID_ZONE.HANDS]
				&& canRestrain(BID_ZONE.HANDS)(state)
				&& DECISION.RESTRAIN_HANDS,
			wins[BID_ZONE.HEAD]
				&& canRestrain(BID_ZONE.HEAD)(state)
				&& DECISION.RESTRAIN_HEAD,
			wins[BID_ZONE.LEGS]
				&& canRestrain(BID_ZONE.LEGS)(state)
				&& DECISION.RESTRAIN_FEET,
		].filter(Boolean)
	}

	const setStage = stage => state => ({ ...state, stage })
	const setPileSize = pileSize => state => ({
		...state,
		ownPale: pileSize,
		otherPale: pileSize,
	})

	const switchStageAfterBids = state => {
		const roundStatus = getBidRoundStatus(state)
		const newStage = roundStatus === BID_STATUS.DRAW
			? STAGE.ROUND_START
			: roundStatus === BID_STATUS.WIN
				? STAGE.WIN_DECISION
				: STAGE.LOOSE_ACCEPTANCE

		return setStage(newStage)(state)
	}

	const applyOwnDecision = decision => state => {
		switch (decision) {
			case DECISION.RESTRAIN_HEAD:
				return restrain(BID_ZONE.HEAD)(state)
			case DECISION.RESTRAIN_HANDS:
				return restrain(BID_ZONE.HANDS)(state)
			case DECISION.RESTRAIN_FEET:
				return restrain(BID_ZONE.LEGS)(state)
			case DECISION.ESCAPE_HEAD:
				return escape(BID_ZONE.HEAD)(state)
			case DECISION.ESCAPE_HANDS:
				return escape(BID_ZONE.HANDS)(state)
			case DECISION.ESCAPE_FEET:
				return escape(BID_ZONE.LEGS)(state)
			default: return state
		}
	}

	const applyOtherDecision = state => {
		const decision = rollLooseDecision(state)

		switch (decision) {
			case DECISION.RESTRAIN_HEAD:
				return otherRestrain(BID_ZONE.HEAD)(state)
			case DECISION.RESTRAIN_HANDS:
				return otherRestrain(BID_ZONE.HANDS)(state)
			case DECISION.RESTRAIN_FEET:
				return otherRestrain(BID_ZONE.LEGS)(state)
			case DECISION.ESCAPE_HEAD:
				return otherEscape(BID_ZONE.HEAD)(state)
			case DECISION.ESCAPE_HANDS:
				return otherEscape(BID_ZONE.HANDS)(state)
			case DECISION.ESCAPE_FEET:
				return otherEscape(BID_ZONE.LEGS)(state)
			default: return state
		}
	}

	const roundEnd = state => {
		const newStage = isWinner(state)
			? STAGE.PLAYER_WON
			: isLooser(state)
				? STAGE.PLAYER_LOST
				: STAGE.ROUND_START

		return pipe(
			setStage(newStage),
			applyBids,
		)(state)
	}

	return {
		BID_ZONE,
		DECISION,
		INITIAL_STATE,
		RESTRAIN,
		STAGE,
		addBid,
		applyBids,
		applyOtherDecision,
		applyOwnDecision,
		bidForOther,
		bluff,
		canAddBid,
		canBluff,
		canLeave,
		canRemoveBid,
		cheat,
		escape,
		getBidRoundStatus,
		getCheatDecisions,
		getWinDecisions,
		removeBid,
		restrain,
		roundEnd,
		setPileSize,
		setStage,
		switchStageAfterBids,
		checkRestrain,
		hasWinner,
	}
})();
