'use strict';

(function _() {
	const {
		integrateRoomToWorld,
		setPlayerGameData,
		readPlayerGameData,
	} = __vash_utils;
	let securityGuy = null;

	const MEMBERSHIP_PRICE = 50;
	const MEMBERSHIP_PROPERTY_KEY = 'Lewdgambler.isMember';
	const Background = 'LewdgamblerEntrance';

	const Load = () => {
		// Default load
		if (securityGuy == null) {
			securityGuy = CharacterLoadNPC('NPC_Lewdgambler_Security');
			securityGuy.Name = 'Security';
			CharacterNaked(securityGuy);
			InventoryWear(securityGuy, 'CorsetShirt', 'Cloth', 'Default');
			InventoryWear(securityGuy, 'ShortPencilSkirt', 'ClothLower', 'Default');
			InventoryWear(securityGuy, 'Pantyhose1', 'Socks', 'Default');
			InventoryWear(securityGuy, 'GarterBelt2', 'Garters', 'Default');
			InventoryWear(securityGuy, 'Heels3', 'Shoes', '#202020');
		}
	};

	const Run = () => {
		DrawCharacter(securityGuy, 750, 0, 1);
		DrawCharacter(Player, 250, 0, 1);
		if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, '', 'White', 'Icons/Exit.png', TextGet("Leave"));
	};

	const Click = () => {
		if (MouseIn(250, 0, 500, 1000)) CharacterSetCurrent(Player);
		if (MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(securityGuy);
		if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen('Room', 'MainHall');
	};

	const MembershipStatus = (requestedStatus) => {
		const result = readPlayerGameData(MEMBERSHIP_PROPERTY_KEY) == requestedStatus;
		return result;
	};

	const HasMoneyForMembership = () =>
		Player.Money >= MEMBERSHIP_PRICE;

	const BuyMembership = () => {
		if (HasMoneyForMembership()) {
			CharacterChangeMoney(Player, -MEMBERSHIP_PRICE);
			setPlayerGameData('Lewdgambler.isMember', '1');
		}
	};

	const GoToHall = () =>
		CommonSetScreen('Room', 'LewdgamblerGameBiddingDuel');
		// CommonSetScreen('Room', 'LewdgamblerHall');

	integrateRoomToWorld('LewdgamblerEntrance', {
		Background, Load, Run, Click, BuyMembership, MembershipStatus, HasMoneyForMembership, GoToHall,
	});
})();
