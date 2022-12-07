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
		return this._addCharacterReference("SourceCharacter", character);
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
	 * @returns {this}
	 */
	targetCharacter(character) {
		return this._addCharacterReference("TargetCharacter", character);
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
			return this._addEntry({Tag: "FocusAssetGroup", FocusGroupName: groupName})
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
			return this._addEntry({Tag: tag, Text: text});
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
			return this._addEntry({Tag: tag, TextToLookUp: lookupText});
		}
		return this;
	}

	/**
	 * Adds a dictionary entry to the builder
	 * @param {ChatMessageDictionaryEntry} entry - The dictionary entry to add
	 * @returns {this}
	 * @protected
	 */
	_addEntry(entry) {
		this._entries.push(entry);
		return this;
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
			return this._addEntry({
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
		}
		return this;
	}
}
