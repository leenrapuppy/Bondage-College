"use strict";
var CurrentTime = 0;
var TimerRunInterval = 20;
var TimerLastTime = 0;
var TimerLastCycleCall = 0;
var TimerLastArousalProgress = 0;
var TimerLastArousalProgressCount = 0;
var TimerLastArousalDecay = 0;

/**
 * Returns the current time from the local computer clock
 * @returns {number} - Returns the number of milliseconds
 */
function TimerGetTime() {
	return new Date().getTime();
}

/**
 * Returns a string of the time remaining on a given timer
 * @param {number} T - Time to convert to a string in ms
 * @returns {string} - The time string in the DD:HH:MM:SS format (Days and hours not displayed if it contains none)
 */
function TimerToString(T) {
	var D = Math.floor(T / 86400000).toString();
	var H = Math.floor((T % 86400000) / 3600000).toString();
	var M = Math.floor((T % 3600000) / 60000).toString();
	var S = Math.floor((T % 60000) / 1000).toString();
	if (S.length == 1) S = "0" + S;
	if (M.length == 1) M = "0" + M;
	if (H.length == 1) H = "0" + H;
	return ((D != "0") ? D + ":" : "") + (((D != "0") || (H != "00")) ? H + ":" : "") + M + ":" + S;
}

/**
 * Returns a string of the time remaining on a given timer (Hours and minutes only)
 * @param {Date} T - Time to convert to a string in ms
 * @returns {string} - The time string in the HH:MM format
 */
function TimerHourToString(T) {
	var M = T.getMinutes().toString();
	var H = T.getHours().toString();
	if (M.length == 1) M = "0" + M;
	return H + ":" + M;
}

/**
 * Check if we must remove items from characters. (Expressions, items being removed, locks, etc.)
 * @returns {void} - Nothing
 */
function TimerInventoryRemove() {

	// Cycles through all items items for all offline characters (player + NPC)
	for (let C = 0; C < Character.length; C++)
		if (Character[C].IsPlayer() || Character[C].IsNpc())
			for (let A = 0; A < Character[C].Appearance.length; A++) {
				const item = Character[C].Appearance[A];
				if ((item.Property != null) && (item.Property.RemoveTimer != null))
					if ((typeof item.Property.RemoveTimer == "number") && (item.Property.RemoveTimer <= CurrentTime)) {
						const Lock = InventoryGetLock(item);
						const ShouldRemoveItem = item.Property.RemoveItem;

						// Remove any lock or timer
						ValidationDeleteLock(item.Property, false);

						// If we're removing a lock and we're in a chatroom, send a chatroom message
						if (Lock && ServerPlayerIsInChatRoom()) {

							const Dictionary = new DictionaryBuilder()
								.destinationCharacterName(Character[C])
								.focusGroup(item.Asset.Group.Name)
								.asset(Lock.Asset, "LockName")
								.build();
							ServerSend("ChatRoomChat", {Content: "TimerRelease", Type: "Action", Dictionary});
						}

						// If we must remove the linked item from the character or the facial expression
						const group = item.Asset.Group;
						if (ShouldRemoveItem && group.IsItem())
							InventoryRemove(Character[C], group.Name);
						else if (group.IsAppearance() && group.AllowExpression != null)
							CharacterSetFacialExpression(Character[C], group.Name, null);
						else
							CharacterRefresh(Character[C]);

						// Sync with the server and exit
						if (Character[C].ID == 0) ChatRoomCharacterUpdate(Character[C]);
						else ServerPrivateCharacterSync();
						return;

					}
			}

}

/**
 * Sets a remove timer in seconds for a specific item part / body part
 * @param {Character} C - Character for which we are removing an item
 * @param {AssetGroupName} AssetGroup - Group targeted by the removal
 * @param {number} Timer - Seconds it takes to remove the item
 * @returns {void} - Nothing
 */
function TimerInventoryRemoveSet(C, AssetGroup, Timer) {
	for (let E = 0; E < C.Appearance.length; E++)
		if (C.Appearance[E].Asset.Group.Name == AssetGroup) {
			if (C.Appearance[E].Property == null) C.Appearance[E].Property = {};
			C.Appearance[E].Property.RemoveTimer = Math.round(CurrentTime + Timer * 1000);
			break;
		}
	CharacterRefresh(C);
	ChatRoomCharacterItemUpdate(C, AssetGroup);
}

/**
 * Random trigger for the NPC owner in a private room. If possible, when triggered it will beep the player anywhere in the club, the player has 2 minutes to get back to her
 * @returns {void} - Nothing
 */
function TimerPrivateOwnerBeep() {
	if ((Player.Owner != "") && (Player.Ownership == null) && (CurrentScreen != "Private") && (CurrentScreen != "PrivateBed") && (CurrentScreen != "ChatRoom") && (CurrentScreen != "InformationSheet") && (CurrentScreen != "FriendList") && (CurrentScreen != "Cell") && PrivateOwnerInRoom())
		if ((Math.floor(Math.random() * 500) == 1) && !LogQuery("OwnerBeepActive", "PrivateRoom") && !LogQuery("OwnerBeepTimer", "PrivateRoom") && !LogQuery("LockOutOfPrivateRoom", "Rule") && !LogQuery("Committed", "Asylum")) {
			ServerBeep = {
				Timer: CommonTime() + 15000,
				Message: DialogFindPlayer("BeepFromOwner"),
			};
			LogAdd("OwnerBeepActive", "PrivateRoom");
			LogAdd("OwnerBeepTimer", "PrivateRoom", CurrentTime + 120000);
			FriendListBeepLog.push({ MemberName: Player.Owner, ChatRoomName: DialogFindPlayer("YourRoom"), Sent: false, Time: new Date(), Private: false });
		}
}


/**
 * Main timer process
 * @returns {void} - Nothing
 */
function TimerProcess() {

	// At each 1700 ms, we check for timed events (equivalent of 100 cycles at 60FPS)
	if (TimerLastCycleCall + 1700 <= CommonTime()) {
		TimerInventoryRemove();
		TimerPrivateOwnerBeep();
		TimerLastCycleCall = CommonTime();
	}

	// Arousal/Activity events only occur in allowed rooms
	if (ActivityAllowed()) {

		// Arousal can change every second, based on ProgressTimer
		if ((TimerLastArousalProgress + 1000 < CurrentTime) || (TimerLastArousalProgress - 1000 > CurrentTime)) {
			TimerLastArousalProgress = CurrentTime;
			TimerLastArousalProgressCount++;
			for (let C = 0; C < Character.length; C++) {

				// If the character is having an orgasm and the timer ran out, we move to the next orgasm stage
				if ((Character[C].ArousalSettings != null) && (Character[C].ArousalSettings.OrgasmTimer != null) && (Character[C].ArousalSettings.OrgasmTimer > 0)) {
					if (Character[C].ArousalSettings.OrgasmTimer < CurrentTime) {
						if ((Character[C].ArousalSettings.OrgasmStage == null) || (Character[C].ArousalSettings.OrgasmStage <= 1)) ActivityOrgasmStart(Character[C]);
						else ActivityOrgasmStop(Character[C], 20);
					}
				} else {

					// Depending on the character settings, we progress the arousal meter
					if (PreferenceArousalAtLeast(Character[C], "Hybrid")) {

						// Activity impacts the progress slowly over time, if there's an activity running, vibrations are ignored
						if ((Character[C].ArousalSettings.ProgressTimer != null) && (typeof Character[C].ArousalSettings.ProgressTimer === "number") && !isNaN(Character[C].ArousalSettings.ProgressTimer) && (Character[C].ArousalSettings.ProgressTimer != 0)) {
							if (Character[C].ArousalSettings.ProgressTimer < 0) {
								Character[C].ArousalSettings.ProgressTimer++;
								ActivityTimerProgress(Character[C], -1);
								ActivityVibratorLevel(Character[C], 0);
							}
							else {
								Character[C].ArousalSettings.ProgressTimer--;
								ActivityTimerProgress(Character[C], 1);
								ActivityVibratorLevel(Character[C], 4);
							}
						} else if (Character[C].IsEgged()) {

							// If the character is egged, we find the highest intensity factor and affect the progress, low and medium vibrations have a cap
							let Factor = -1;
							for (let A = 0; A < Character[C].Appearance.length; A++) {
								let Item = Character[C].Appearance[A];
								let ZoneFactor = PreferenceGetZoneFactor(Character[C], Item.Asset.ArousalZone) - 2;
								if (InventoryItemHasEffect(Item, "Egged", true) && (Item.Property != null) && (Item.Property.Intensity != null) && (typeof Item.Property.Intensity === "number") && !isNaN(Item.Property.Intensity) && (Item.Property.Intensity >= 0) && (ZoneFactor >= 0) && (Item.Property.Intensity + ZoneFactor > Factor)){
									if ((Character[C].ArousalSettings.Progress < 95) || PreferenceGetZoneOrgasm(Character[C], Item.Asset.ArousalZone))
										Factor = Item.Property.Intensity + ZoneFactor;
								}
							}

							// Adds the fetish value to the factor
							if (Factor >= 0) {
								var Fetish = ActivityFetishFactor(Character[C]);
								if (Fetish > 0) Factor = Factor + Math.ceil(Fetish / 3);
								if (Fetish < 0) Factor = Factor + Math.floor(Fetish / 3);
							}

							// Kicks the arousal timer faster from personal arousal
							if ((Factor >= 4)) {ActivityVibratorLevel(Character[C], 4); if (TimerLastArousalProgressCount % 2 == 0)ActivityTimerProgress(Character[C], 1);}
							if ((Factor == 3)) {ActivityVibratorLevel(Character[C], 3); if (TimerLastArousalProgressCount % 3 == 0) ActivityTimerProgress(Character[C], 1);}
							if ((Factor == 2)) {ActivityVibratorLevel(Character[C], 2); if (Character[C].ArousalSettings.Progress <= 95 && TimerLastArousalProgressCount % 4 == 0) ActivityTimerProgress(Character[C], 1);}
							if ((Factor == 1)) {ActivityVibratorLevel(Character[C], 1); if (Character[C].ArousalSettings.Progress <= 65 && TimerLastArousalProgressCount % 6 == 0) ActivityTimerProgress(Character[C], 1);}
							if ((Factor == 0)) {ActivityVibratorLevel(Character[C], 1); if (Character[C].ArousalSettings.Progress <= 35 && TimerLastArousalProgressCount % 8 == 0) ActivityTimerProgress(Character[C], 1);}
							if ((Factor == -1)) {ActivityVibratorLevel(Character[C], 0);}

						}
					} else {
						ActivityVibratorLevel(Character[C], 0);
					}
				}
			}
		}

		// Arousal decays by 1 naturally every 12 seconds, unless there's already a natural progression from an activity
		if ((TimerLastArousalDecay + 12000 < CurrentTime) || (TimerLastArousalDecay - 12000 > CurrentTime)) {
			TimerLastArousalDecay = CurrentTime;
			for (let C = 0; C < Character.length; C++)
				if (PreferenceArousalAtLeast(Character[C], "Hybrid"))
					if ((Character[C].ArousalSettings.Progress != null) && (typeof Character[C].ArousalSettings.Progress === "number") && !isNaN(Character[C].ArousalSettings.Progress) && (Character[C].ArousalSettings.Progress > 0))
						if ((Character[C].ArousalSettings.ProgressTimer == null) || (typeof Character[C].ArousalSettings.ProgressTimer !== "number") || isNaN(Character[C].ArousalSettings.ProgressTimer) || (Character[C].ArousalSettings.ProgressTimer == 0)) {

							// If the character is egged, we find the highest intensity factor
							let Factor = -1;
							for (let A = 0; A < Character[C].Appearance.length; A++) {
								let Item = Character[C].Appearance[A];
								let ZoneFactor = PreferenceGetZoneFactor(Character[C], Item.Asset.ArousalZone) - 2;
								if (InventoryItemHasEffect(Item, "Egged", true) && (Item.Property != null) && (Item.Property.Intensity != null) && (typeof Item.Property.Intensity === "number") && !isNaN(Item.Property.Intensity) && (Item.Property.Intensity >= 0) && (ZoneFactor >= 0) && (Item.Property.Intensity + ZoneFactor > Factor))
									if ((Character[C].ArousalSettings.Progress < 95) || PreferenceGetZoneOrgasm(Character[C], Item.Asset.ArousalZone))
										Factor = Item.Property.Intensity + ZoneFactor;
							}

							// No decay if there's a vibrating item running
							if (Factor < 0) ActivityTimerProgress(Character[C], -1);

						}
		}

	}
}

/**
 * Returns a string of the time remaining on a given timer (Hours, minutes, seconds)
 * @param {number} s - Time to convert to a string in ms
 * @returns {string} -  The time string in the HH:MM:SS format
 */
function TimermsToTime(s) {

	// Pad to 2 or 3 digits, default is 2
	function pad(n, z) {
		z = z || 2;
		return ('00' + n).slice(-z);
	}

	// Returns the formatted value
	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;
	return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);

}
