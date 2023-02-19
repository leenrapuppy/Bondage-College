"use strict";

/**
 * Build class for chat message dictionaries
 */
class DictionaryBuilder {
	/**
	 * Constructs a new DictionaryBuilder instance
	 */
	constructor() {
		/** @type {ChatMessageDictionaryEntry[]} */
		this._entries = [];
		/** @type {DictionaryBuilder[]} */
		this._children = [];
		this._targetIndex = 0;
	}

	/**
	 * Creates and enters a child {@link ConditionalDictionaryBuilder}, whose entries are only added if the provided
	 * condition is truthy.
	 * @param {boolean} condition - The condition to check
	 * @returns {ConditionalDictionaryBuilder} - The child {@link ConditionalDictionaryBuilder} instance
	 */
	if(condition) {
		const child = new ConditionalDictionaryBuilder(this, condition);
		this._children.push(child);
		return child;
	}

	/**
	 * Constructs a dictionary array from the data passed to this instance.
	 * @returns {ChatMessageDictionaryEntry[]} - The constructed dictionary
	 */
	build() {
		let entries = this._entries.slice();
		for (const child of this._children) {
			entries.push(...child.build());
		}
		return entries;
	}

	/**
	 * Adds a SourceCharacter dictionary entry
	 * @param {Character} character - The character which should be referenced by the SourceCharacter entry
	 * @returns {this}
	 */
	sourceCharacter(character) {
		this._addEntry({SourceCharacter: character.MemberNumber});
		return this;
	}

	/**
	 * Adds a DestinationCharacter dictionary entry
	 * @param {Character} character - The character which should be referenced by the DestinationCharacter entry
	 * @returns {this}
	 */
	destinationCharacter(character) {
		return this._addCharacterReference("DestinationCharacter", character);
	}

	/**
	 * Adds a DestinationCharacterName dictionary entry
	 * @param {Character} character - The character which should be referenced by the DestinationCharacterName entry
	 * @returns {this}
	 */
	destinationCharacterName(character) {
		return this._addCharacterReference("DestinationCharacterName", character);
	}

	/**
	 * Adds a TargetCharacter dictionary entry
	 * @param {Character} character - The character which should be referenced by the TargetCharacter entry
	 * @param {number} [index] - The target character index if there is more than one target character
	 * @returns {this}
	 */
	targetCharacter(character, index) {
		/** @type {TargetCharacterDictionaryEntry} */
		const entry = {TargetCharacter: character.MemberNumber};
		if (this._targetIndex) {
			entry.Index = this._targetIndex;
		}
		if (this._addEntry(entry)) {
			this._targetIndex++;
		}
		return this;
	}

	/**
	 * Adds a TargetCharacterName dictionary entry
	 * @param {Character} character - The character which should be referenced by the TargetCharacterName entry
	 * @returns {this}
	 */
	targetCharacterName(character) {
		return this._addCharacterReference("TargetCharacterName", character);
	}

	/**
	 * Adds a dictionary entry which identifies the focused group - the group that was acted upon to generate the message, if applicable.
	 * @param {AssetGroupName} groupName - The name of the focus group
	 * @returns {this}
	 */
	focusGroup(groupName) {
		if (groupName) {
			this._addEntry({Tag: "FocusAssetGroup", FocusGroupName: groupName});
		}
		return this;
	}

	/**
	 * Adds a dictionary entry which identifies an asset - usually the asset being changed, but the tag can be customized.
	 * @param {Asset} asset
	 */
	asset(asset, tag="AssetName") {
		if (asset) {
			this._addEntry({ Tag: tag, AssetName: asset.Name, GroupName: asset.Group.Name });
		}
		return this;
	}

	/**
	 * Adds a text dictionary entry. This is a straightforward dictionary entry where the provided tag will be directly
	 * replaced by the given text.
	 * @param {string} tag - The tag to replace
	 * @param {string} text - The text to replace the tag with
	 * @returns {this}
	 */
	text(tag, text) {
		if (tag && text) {
			this._addEntry({Tag: tag, Text: text});
		}
		return this;
	}

	/**
	 * Adds a text lookup dictionary entry. A text lookup will be performed on the provided lookup text, and the
	 * resulting value will be used to replace the associated tag.
	 * @param {string} tag - The tag to replace
	 * @param {string} lookupText - The text to look up and replace the tag with
	 * @returns {this}
	 */
	textLookup(tag, lookupText) {
		if (tag && lookupText) {
			this._addEntry({Tag: tag, TextToLookUp: lookupText});
		}
		return this;
	}

	/**
	 * Adds a shock intensity entry.
	 * @param {number} intensity - The intensity of the shock applied
	 * @returns {this}
	 */
	shockIntensity(intensity) {
		if (typeof intensity === "number" && !isNaN(intensity)) {
			this._addEntry({ ShockIntensity: intensity });
		}
		return this;
	}

	/**
	 * Marks the message as being automatically generated. Usually used by automated vibe changes.
	 * Those will get filtered out depending on the reciever's chat settings.
	 * @returns {this}
	 */
	markAutomatic() {
		this._addEntry({ Automatic: true });
		return this;
	}

	/**
	 * Adds a dictionary entry to the builder
	 * @param {ChatMessageDictionaryEntry} entry - The dictionary entry to add
	 * @returns {boolean} - True if the entry was successfully added, false otherwise
	 * @protected
	 */
	_addEntry(entry) {
		this._entries.push(entry);
		return true;
	}

	/**
	 * Adds a character reference dictionary entry for the given character reference tag and character.
	 * @param {CharacterReferenceTag} tag - The character reference tag that should be added
	 * @param {Character} character - The character that should be referenced
	 * @returns {this}
	 * @private
	 */
	_addCharacterReference(tag, character) {
		if (character) {
			this._addEntry({
				Tag: tag,
				MemberNumber: character.MemberNumber,
				Text: CharacterNickname(character),
			});
		}
		return this;
	}
}

/**
 * A {@link DictionaryBuilder} class which adds its dictionary entries based on a boolean condition. If the condition
 * evaluates to truthy, then it will behave exactly like a {@link DictionaryBuilder}. However, if the condition
 * evaluates to falsy, then it will always build an empty array.
 */
class ConditionalDictionaryBuilder extends DictionaryBuilder {
	/**
	 * Constructs a new ConditionalDictionaryBuilder instance with the given parent and condition.
	 * @param {DictionaryBuilder} parent - The parent {@link DictionaryBuilder} instance
	 * @param {boolean} condition - The condition that should determine whether or not this builder adds entries.
	 */
	constructor(parent, condition) {
		super();
		/** @type {DictionaryBuilder} */
		this._parent = parent;
		/** @type {boolean} */
		this._condition = condition;
	}

	/**
	 * Returns the parent {@link DictionaryBuilder instance}. Used to effectively end input to this builder.
	 * @returns {DictionaryBuilder} - The parent builder
	 */
	endif() {
		return this._parent;
	}

	_addEntry(entry) {
		if (this._condition) {
			super._addEntry(entry);
			return true;
		}
		return false;
	}
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is TaggedDictionaryEntry}
 */
function IsTaggedDictionaryEntry(entry) {
	return CommonIsObject(entry) && !!entry.Tag && typeof entry.Tag === "string";
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is CharacterReferenceDictionaryEntry}
 */
function IsCharacterReferenceDictionaryEntry(entry) {
	return CommonIsObject(entry)
		&& (entry.Tag === "SourceCharacter"
			|| entry.Tag === "TargetCharacter"
			|| entry.Tag === "TargetCharacterName"
			|| entry.Tag === "DestinationCharacter"
			|| entry.Tag === "DestinationCharacterName")
		&& CommonIsNonNegativeInteger(entry.MemberNumber);
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is SourceCharacterDictionaryEntry}
 */
function IsSourceCharacterDictionaryEntry(entry) {
	return CommonIsObject(entry) && CommonIsNonNegativeInteger(entry.SourceCharacter);
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is TargetCharacterDictionaryEntry}
 */
function IsTargetCharacterDictionaryEntry(entry) {
	return CommonIsObject(entry)
		&& CommonIsNonNegativeInteger(entry.TargetCharacter)
		&& (entry.Index == null || CommonIsNonNegativeInteger(entry.Index));
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is FocusGroupDictionaryEntry}
 */
function IsFocusGroupDictionaryEntry(entry) {
	return CommonIsObject(entry)
		&& (!entry.Tag || entry.Tag === "FocusAssetGroup")
		&& !!entry.FocusGroupName && typeof entry.FocusGroupName === "string";
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is TextDictionaryEntry}
 */
function IsTextDictionaryEntry(entry) {
	return CommonIsObject(entry)
		&& !!entry.Tag && typeof entry.Tag === "string"
		&& !!entry.Text && (typeof entry.Text === "string" || typeof entry.Text === "number");
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is TextLookupDictionaryEntry}
 */
function IsTextLookupDictionaryEntry(entry) {
	return CommonIsObject(entry)
		&& !!entry.Tag && typeof entry.Tag === "string"
		&& !!entry.TextToLookUp && typeof entry.TextToLookUp === "string";
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is GroupReferenceDictionaryEntry}
 */
function IsGroupReferenceDictionaryEntry(entry) {
	return CommonIsObject(entry)
		&& !!entry.Tag && typeof entry.Tag === "string"
		&& !!entry.GroupName && typeof entry.GroupName === "string"
		&& !entry.AssetName;
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is AssetReferenceDictionaryEntry}
 */
function IsAssetReferenceDictionaryEntry(entry) {
	return CommonIsObject(entry)
		&& !!entry.Tag && typeof entry.Tag === "string"
		&& !!entry.GroupName && typeof entry.GroupName === "string"
		&& !!entry.AssetName && typeof entry.AssetName === "string";
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is ShockEventDictionaryEntry}
 */
function IsShockEventDictionaryEntry(entry) {
	return CommonIsObject(entry) && typeof entry.ShockIntensity === "number";
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is AutomaticEventDictionaryEntry}
 */
function IsAutomaticEventDictionaryEntry(entry) {
	return CommonIsObject(entry) && entry.Automatic === true;
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is ActivityCounterDictionaryEntry}
 */
function IsActivityCounterDictionaryEntry(entry) {
	return CommonIsObject(entry) && typeof entry.ActivityCounter === "number";
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is AssetGroupNameDictionaryEntry}
 * @deprecated
 */
function IsAssetGroupNameDictionaryEntry(entry) {
	return CommonIsObject(entry)
		&& !!entry.Tag && typeof entry.Tag === "string"
		&& !!entry.AssetGroupName && typeof entry.AssetGroupName === "string";
}

/**
 * @param {ChatMessageDictionaryEntry} entry
 * @returns {entry is ActivityNameDictionaryEntry}
 */
function IsActivityNameDictionaryEntry(entry) {
	return CommonIsObject(entry)
		&& !!entry.ActivityName && typeof entry.ActivityName === "string";
}
