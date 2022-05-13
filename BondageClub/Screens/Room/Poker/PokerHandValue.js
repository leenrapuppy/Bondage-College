"use strict";
/* eslint-disable */

// Sort the current hand from highest to lowest
function PokerHandValueSortHand(Hand) {
	let swapped = true;
	let j = 0;

	while (swapped) {

		swapped = false;
		j++;

		for (let i = 0; i < 7 - j; i++)
			if (((Hand[i] - 1) % 13) + 2 < ((Hand[i + 1] - 1) % 13) + 2) {
				let tmp = Hand[i];
				Hand[i] = Hand[i + 1];
				Hand[i + 1] = tmp;
				swapped = true;
			}

	}
}

// Validate if the current hand is a straight flush (value 9)
function PokerHandValueStraightFlush(Hand) {
	let Value = 0;
	let HighF = [0, 0, 0, 0];
	let CountF = [0, 0, 0, 0];

	// Find the flush
	for (let X = 0; X < 7; X++) {

		// Keep the highest card of each suite
		if (HighF[Math.floor((Hand[X] - 1) / 13)] == 0) HighF[Math.floor((Hand[X] - 1) / 13)] = ((Hand[X] - 1) % 13) + 2;

		// Count the number of cards for each suite
		CountF[Math.floor((Hand[X] - 1) / 13)]++;

	}

	// If 5 cards or more, we keep the highest card of the flush
	let FlushColor = -1;
	for (let X = 0; X < 4; X++)
		if (CountF[X] >= 5)
			FlushColor = X;

	// If we have a flush, we need to match flush cards with the straight cards
	if (FlushColor > -1) {

		// The first card of the straight
		let Straight = 0;
		let StraightValue = 0;
		let Val = ((Hand[0] - 1) % 13) + 2;
		let High = ((Hand[0] - 1) % 13) + 2;
		if (Math.floor(FlushColor) == Math.floor((Hand[0] - 1) / 13)) Straight = 1;
		if (Straight == 0) Val++;

		// Search for a straight flush
		for (let X = 1; X < 7; X++) {

			// If we follow the straight flush (current value -1)
			if ((((Hand[X] - 1) % 13) + 2 == Val - 1) && (FlushColor == Math.floor((Hand[X] - 1) / 13))) {
				Straight++;
				Val--;
			}

			// Check for a wheel straight (5 to ACE)
			if ((Straight == 4) && (High == 5) && (HighF[FlushColor] == 14))
				Straight = 5;

			// If we have 5 straight card, we accept it
			if ((StraightValue == 0) && (Straight >= 5))
				StraightValue = High;

			// If the value is below the straight, we reset the first card
			if (((Hand[X] - 1) % 13) + 2 < Val - 1) {

				// Reset the straight
				Val = ((Hand[X] - 1) % 13) + 2;
				High = ((Hand[X] - 1) % 13) + 2;
				if (Math.floor(FlushColor) == Math.floor((Hand[X] - 1) / 13))
					Straight = 1;
				else
					Straight = 0;
				if (Straight == 0) Val++;

			}

		}

		// Since we have a straight, check for a straight flush
		if (StraightValue > 0)
			if (StraightValue == 14)
				Value = 10;
			else
				Value = 9 + (StraightValue / 100);

	}

	return Value;
}

// Validate if the current hand is a four of a kind (value 8)
function PokerHandValueFourOfAKind(Hand) {
	let Count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let Value = 0;
	let High4 = 0;
	let High1 = 0;
	let Used = [false, false, false, false, false, false, false];

	// Count the occurrence of each cards
	for (let X = 0; X < 7; X++)
		Count[((Hand[X] - 1) % 13) + 2]++;

	// Try to find a four of a kind
	for (let X = 0; X < 15; X++)
		if (Count[X] == 4)
			High4 = X;

	// If we found it
	if (High4 > 0) {

		// Remove all used cards
		for (let X = 0; X < 7; X++)
			if (High4 == ((Hand[X] - 1) % 13) + 2)
				Used[X] = true;

		// Fetch the last highest card
		High1 = 0;
		for (let X = 0; X < 7; X++)
			if ((Used[X] == false) && (((Hand[X] - 1) % 13) + 2 > High1))
				High1 = ((Hand[X] - 1) % 13) + 2;

		Value = 8 + (High4 / 100) + (High1 / 10000);

	}

	return Value;
}

// Validate if the current hand is a full house (value 7)
function PokerHandValueFullHouse(Hand) {
	let Used = [false, false, false, false, false, false, false];
	let Value = 0;
	let High3 = 0;
	let High2 = 0;

	// Scan first for a three of a kind
	for (let X = 0; X < 5; X++)
		for (let Y = X + 1; Y < 6; Y++)
			if (((Hand[X] - 1) % 13) + 2 == ((Hand[Y] - 1) % 13) + 2)
				for (let Z = Y + 1; Z < 7; Z++)
					if (((Hand[X] - 1) % 13) + 2 == ((Hand[Z] - 1) % 13) + 2)
						if (High3 < ((Hand[X] - 1) % 13) + 2)
							High3 = ((Hand[X] - 1) % 13) + 2;

	if (High3 > 0) {

		// Remove the used cards
		for (let X = 0; X < 7; X++)
			if (High3 == ((Hand[X] - 1) % 13) + 2)
				Used[X] = true;

		// Scan for the highest pair
		for (let X = 0; X < 6; X++)
			for (let Y = X + 1; Y < 7; Y++)
				if ((((Hand[X] - 1) % 13) + 2 == ((Hand[Y] - 1) % 13) + 2) && (Used[X] == false) && (Used[Y] == false))
					if (High2 < ((Hand[X] - 1) % 13) + 2)
						High2 = ((Hand[X] - 1) % 13) + 2;

		// The hand value is 7 + the value of the 3 of a kind / 100 + the value of the pair / 10000
		if (High2 > 0)
			Value = 7 + (High3 / 100) + (High2 / 10000)

	}

	return Value;
}

// Validate if the current hand is a flush (value 6)
function PokerHandValueFlush(Hand) {
	let Value = 0;
	let High = [0, 0, 0, 0];
	let Count = [0, 0, 0, 0];

	for (let X = 0; X < 7; X++) {

		// Keep the highest card of each suite
		if (High[Math.floor((Hand[X] - 1) / 13)] == 0) High[Math.floor((Hand[X] - 1) / 13)] = ((Hand[X] - 1) % 13) + 2;

		// Count the number of cards for each suite
		Count[Math.floor((Hand[X] - 1) / 13)]++;

	}

	// If 6 cards or more, we keep the highest card of the flush
	for (let X = 0; X < 4; X++)
		if (Count[X] >= 5)
			Value = 6 + (High[X] / 100);

	return Value;
}

// Validate if the current hand is a straight (value 5)
function PokerHandValueStraight(Hand) {
	let Value = 0;
	let Val = ((Hand[0] - 1) % 13) + 2;
	let High = ((Hand[0] - 1) % 13) + 2;
	let Straight = 1;

	// The first card of the straight
	for (let X = 1; X < 7; X++) {

		// If we follow the straight (current value -1)
		if (((Hand[X] - 1) % 13) + 2 == Val - 1) {
			Straight++;
			Val--;
		}

		// Check for a wheel straight (5 to ACE)
		if ((Straight == 4) && (High == 5) && (((Hand[0] - 1) % 13) + 2 == 14))
			Value = 5 + (High / 100);

		// If we have 5 straight card, we accept it
		if ((Value == 0) && (Straight >= 5))
			Value = 5 + (High / 100);

		// If the value is below the straight, we reset the first card
		if (((Hand[X] - 1) % 13) + 2 < Val - 1) {
			Straight = 1;
			Val = ((Hand[X] - 1) % 13) + 2;
			High = ((Hand[X] - 1) % 13) + 2;
		}

	}

	return Value;
}

// Validate if the current hand is a three of a kind (value 4)
function PokerHandValueThreeOfAKind(Hand) {
	let Value = 0;
	let Used = [false, false, false, false, false, false, false];

	// Scan for three of a kind
	for (let X = 0; X < 5; X++)
		for (let Y = X + 1; Y < 6; Y++)
			if (((Hand[X] - 1) % 13) + 2 == ((Hand[Y] - 1) % 13) + 2)
				for (let Z = Y + 1; Z < 7; Z++)
					if (((Hand[X] - 1) % 13) + 2 == ((Hand[Z] - 1) % 13) + 2) {
						Value = 4 + ((((Hand[X] - 1) % 13) + 2) / 100)
						Used[X] = true;
						Used[Y] = true;
						Used[Z] = true;
					}

	// If we found 3 of a kind, get the 2 highest other cards
	if (Value >= 4)
		for (let C = 1; C <= 2; C++) {

			// Fetch the highest card
			let High = 0;
			let Pos = 0;
			for (let X = 0; X < 7; X++)
				if ((Used[X] == false) && (((Hand[X] - 1) % 13) + 2 > High)) {
					High = ((Hand[X] - 1) % 13) + 2;
					Pos = X;
				}

			// Clear that card and it's value will be added to the decimals
			Used[Pos] = true;
			if (C == 1) Value = Value + (High / 10000);
			if (C == 2) Value = Value + (High / 1000000);

		}

	return Value;
}

// Validate if the current hand is a two pairs (value 3)
function PokerHandValueTwoPairs(Hand) {
	let HighPair = 0;
	let LowPair = 0;
	let Value = 0;
	let Used = [false, false, false, false, false, false, false];

	// Scan for two pairs
	for (let X = 0; X < 6; X++)
		for (let Y = X + 1; Y < 7; Y++)
			if ((((Hand[X] - 1) % 13) + 2 == ((Hand[Y] - 1) % 13) + 2) && (Used[X] == false) && (Used[Y] == false)) {

				// Assign the highest pair and lowest pair
				if (((Hand[X] - 1) % 13) + 2 > HighPair) {
					LowPair = HighPair;
					HighPair = ((Hand[X] - 1) % 13) + 2;
				}
				else {
					if (((Hand[X] - 1) % 13) + 2 > LowPair)
						LowPair = ((Hand[X] - 1) % 13) + 2;
				}

				Used[X] = true;
				Used[Y] = true;

			}

	// If we found two pairs, get last highest other card
	if ((HighPair > 0) && (LowPair > 0)) {

		// Fetch the highest card
		let High = 0;
		for (let X = 0; X < 7; X++)
			if ((Used[X] == false) && (((Hand[X] - 1) % 13) + 2 > High))
				High = ((Hand[X] - 1) % 13) + 2;

		// Clear that card and it's value will be added to the decimals
		Value = 3 + (HighPair / 100) + (LowPair / 10000) + (High / 1000000);

	}

	return Value;
}

// Validate if the current hand is a one pair (value 2)
function PokerHandValueOnePair(Hand) {
	let Value = 0;
	let Used = [false, false, false, false, false, false, false];

	// Scan for a pair
	for (let X = 0; X < 6; X++)
		for (let Y = X + 1; Y < 7; Y++)
			if (((Hand[X] - 1) % 13) + 2 == ((Hand[Y] - 1) % 13) + 2) {
				Value = 2 + (((Hand[X] - 1) % 13) + 2) / 100
				Used[X] = true;
				Used[Y] = true;
			}

	// If we found a pair, get the 3 highest other cards
	if (Value >= 2) {

		// For each 3 cards
		let Pos = 0;
		for (let C = 1; C <= 3; C++) {

			// Fetch the highest card
			let High = 0;
			for (let X = 0; X < 7; X++)
				if ((Used[X] == false) && (((Hand[X] - 1) % 13) + 2 > High)) {
					High = ((Hand[X] - 1) % 13) + 2;
					Pos = X;
				}

			// Clear that card and it's value will be added to the decimals
			Used[Pos] = true;
			if (C == 1) Value = Value + (High / 10000);
			if (C == 2) Value = Value + (High / 1000000);
			if (C == 3) Value = Value + (High / 100000000);

		}

	}

	return Value;
}

// Allocate the highest card value for the leading 5 cards (value 1)
function PokerHandValueHighestCards(Hand) {
	let Pos = 0;
	let Value = 1;
	let Used = [false, false, false, false, false, false, false];

	// For each 5 cards
	for (let C = 1; C <= 5; C++) {

		// Fetch the highest card
		let High = 0;
		for (let X = 0; X < 7; X++)
			if ((Used[X] == false) && (((Hand[X] - 1) % 13) + 2 > High)) {
				High = ((Hand[X] - 1) % 13) + 2;
				Pos = X;
			}

		// Clear that card and it's value will be added to the decimals
		Used[Pos] = true;
		if (C == 1) Value = Value + (High / 100);
		if (C == 2) Value = Value + (High / 10000);
		if (C == 3) Value = Value + (High / 1000000);
		if (C == 4) Value = Value + (High / 100000000);
		if (C == 5) Value = Value + (High / 10000000000);

	}

	return Value;
}

// Return a decimal to express the hand value
function PokerHandValueCalcHandValue(C1, C2, GameType, CurrentMode, TableCards) {
	let Value = 0;

	// In a two cards game, the value is the card * 10000 for a pair or the highest card * 100 + lowest card
	if (GameType == "TwoCards") {
		C1 = ((C1 - 1) % 13) + 2;
		C2 = ((C2 - 1) % 13) + 2;
		if (C1 == C2) Value = C1 * 10000;
		else if (C1 > C2) Value = (C1 * 100) + C2;
		else Value = (C2 * 100) + C1;
	}

	// In a Texas Hold 'em game, the value before the decimal is the type of hand (straight, flush), after the decimals are the highest remaining cards
	if (GameType == "TexasHoldem") {

		// Allocate the full hand to calculate it's value
		let Hand = [-1, -1, -1, -1, -1, -1, -1];
		Hand[0] = C1;
		Hand[1] = C2;
		if ((CurrentMode == "FLOP") || (CurrentMode == "TURN") || (CurrentMode == "RIVER") || (CurrentMode == "RESULT")) Hand[2] = TableCards[0];
		if ((CurrentMode == "FLOP") || (CurrentMode == "TURN") || (CurrentMode == "RIVER") || (CurrentMode == "RESULT")) Hand[3] = TableCards[1];
		if ((CurrentMode == "FLOP") || (CurrentMode == "TURN") || (CurrentMode == "RIVER") || (CurrentMode == "RESULT")) Hand[4] = TableCards[2];
		if ((CurrentMode == "TURN") || (CurrentMode == "RIVER") || (CurrentMode == "RESULT")) Hand[5] = TableCards[3];
		if ((CurrentMode == "RIVER") || (CurrentMode == "RESULT")) Hand[6] = TableCards[4];

		// Sort the hand from highest to lowest before beginning
		PokerHandValueSortHand(Hand);

		// Try all possible hand rankings from Royal flush to highest cards
		Value = PokerHandValueStraightFlush(Hand); // 9 for SF or 10 for royal
		if (Value < 1) Value = PokerHandValueFourOfAKind(Hand); // 8
		if (Value < 1) Value = PokerHandValueFullHouse(Hand); // 7
		if (Value < 1) Value = PokerHandValueFlush(Hand); // 6
		if (Value < 1) Value = PokerHandValueStraight(Hand); // 5
		if (Value < 1) Value = PokerHandValueThreeOfAKind(Hand); // 4
		if (Value < 1) Value = PokerHandValueTwoPairs(Hand); // 3
		if (Value < 1) Value = PokerHandValueOnePair(Hand); // 2
		if (Value < 1) Value = PokerHandValueHighestCards(Hand); // 1

	}

	return Value;
}

// Return a text version of a decimal hand value
function PokerHandValueTextHandValue(Value) {
	if (PokerGame == "TwoCards") {
		if (Value >= 10000) return "OnePair";
		return "HighestCards";
	}
	if (PokerGame == "TexasHoldem") {
		if (Value < 2) return "HighestCards";
		else if (Value < 3) return "OnePair";
		else if (Value < 4) return "TwoPairs";
		else if (Value < 5) return "ThreeOfAKind";
		else if (Value < 6) return "Straight";
		else if (Value < 7) return "Flush";
		else if (Value < 8) return "FullHouse";
		else if (Value < 9) return "FourOfAKind";
		else if (Value < 10) return "StraightFlush";
		else if (Value < 11) return "RoyalFlush";
		return "HighestCards";
	}
}
