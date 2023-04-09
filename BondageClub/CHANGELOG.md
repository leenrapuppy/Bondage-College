# Bondage Club - Changelog

This changelog follows the format outlined in [keepachangelog.com](https://keepachangelog.com/), with some slight differences. The change categories we use are:

* Added - for new features
* Removed - for now removed features
* Changed - for changes in existing functionality
* Fixed - for any bug fixes
* Technical - for any changes not visible to players
* Beta Fixes - for any fixes that occur during the beta/hotfix period

**Note to contributors:** To avoid merge conflicts, please don't update this file yourself in your PRs - one of the developers will update the changelog with your change before your PR is merged.

* Changelog last updated: 2023-04-09
* Last recorded PR: [#4081](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4081)
* Last recorded commit hash: `13cf5b93aa16e4cdfb0a6154991f2cba67149265`

## [R91]

### [Added]
* Ben987 - Added a new scenario to the Movie Studio: "Open House"
* Miisha - Provided Czech translation for Bondage College – Chapter 4, 5 & 6 ([#4020](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4020), [#4045](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4045), [#4054](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4054))
* Da'Inihlus - Updated the Traditional Chinese translation ([#4025](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4025))
* Sepia Oulomenohn - Added three new assets by Shion11's: a swip cap (Hat & Mask), a padded face-mask (third mouth group), and an inflatable gag mask (Hood), as well as some "tight" variants to some hoods (Accent, Collar, Zipper, Latex Dog Mask, Kitty Hood, Latex Habit, Latex Open Mouth plug hood) ([#4064](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4064))
* kotax - New: Brainwash captured Pandora Infiltrator NPCs in your private room ([#4068](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4068))
* Bluesilv - Added Jockstraps, Briefs and a Flat chastity cage for male characters ([#4067](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4067))
* Bluesilv - Modified the straitjacket and Sci-fi pleasure panties for male usage ([#4071](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4071))
* wildsj - Added garter belt with straps as clothing item ([#4072](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4072))
* shion11 - Added a new Latex Dog Mask with more options than the hood of the same style ([#4073](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4073))
* tui - Added a light-colored variant of the Cross Skirt ([#4079](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4079))
* shion11 - Added a Latex Bunny hood ([#4078](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4078))
* MAKeevchanin - Updated the Russian translation

### [Removed]

### [Changed]
* KyraObscura - Updated the Fishnet option of the Custom Latex Hood to be more visible ([#4021](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4021))
* Rama - Renamed the `Coffee Mug` to simply `Mug` ([#4032](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4032))
* Estsanatlehi - Changed layers on the Strict Leather Pet Crawler so that its locks wouldn't change color ([#4036](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4036))
* Rama - Changed the lover's vibrator to allow all lovers to configure it ([#4038](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4038))
* Estsanatlehi - Improved the login screen by moving buttons around and adding flag icons to the language selector ([#4022](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4022))
* Estsanatlehi - Fixed an issue with the Cupholder's tip option, a casing issue with the teddy bear, as well as added two options to the oval tag that had layers for them ([#4060](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4060))
* Estsanatlehi - Fixed the OTN pluggag's strap peeking through character with short or hidden hair ([#4066](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4066))
* Estsanatlehi - Renamed and retyped the suits' gloves so they match their label ([#4069](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4069))

### [Fixed]
* Rama - Fixed lock properties not being properly initialized ([#4031](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4031))
* Rama - Fixed the broken `BeforeSortLayers` character hooks ([#4033](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4033))
* Estsanatlehi - Fixed grammar on tightening/loosening items ([#4034](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4034))
* Rama - Specified the text font for the pet post ([#4037](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4037))
* Rama - Fixed an issue that would have prevented lockpicking in some edge cases ([#4039](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4039))
* Rama - Added safety-checks over color data to prevent harmful behavior ([#4040](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4040))
* Rama - Enforced that a character's active pose is always a string array ([#4041](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4041))
* Rama - Made sure that the crafted `Puzzling` property always yields at least 1 lock pick attempt ([#4044](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4044))
* Rama - Fixed a couple of bugs with expression syncing not handling correctly nulls (a.k.a use the default) ([#4046](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4046), [#4049](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4049))
* Rama - Fixed the MedicalInjector activity prerequisite which made its activity unusable ([#4047](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4047))
* Rama - Made full sensory deprivation still let whispers go through ([#4048](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4048))
* Rama - Made the crafted `Painful` property set the `Masochism` fetish. This makes it possible for items to change fetishes depending on a type ([#4028](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4028))
* Rama - Made the initial color of crafted items default to what's set in the asset itself ([#4042](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4042))
* kotax - Fixed the "Kidnapped" mission of the Pandora Infiltration being broken ([#4051](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4051))
* Miisha - Fixed syntax issues in the Nursery's dialog ([#4052](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4052))
* kotax - Added a new "Wear maid uniform" button in the Maid's Quarters for quick maid dress up, as well as labels to describe what those buttons do ([#4053](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4053))
* Estsanatlehi - Fix a bug that prevented progress to be made in GGTS ([#4056](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4056))
* Rama - Fixed a broken `AllExceptPlayerDialog` check for setting layer visibilities. This corrects a visual issue with the futuristic crate loosing its lid in some cases ([#4057](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4057))
* Rama - Fixed `ModularItemConfig.ChangeWhenLocked` being ignored. This would have allowed characters to interact with locked items even when they shouldn't have been able to. ([#4058](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4058))
* Rama - Fixed a crash by avoid a recursive call when an item was removed by someone while the extended UI for it would be open ([#4059](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4059))
* Estsanatlehi - Fixed the wedding girls' appearance not getting reset when the ceremony completes ([#4061](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4061), [#4065](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4065))
* Rama - Fixed the lovers timer padlock `Init` function being broken ([#4062](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4062))
* Leo Schwab - Changed the key-up handler of the crafting screen to not cause performance issues when typing text ([#4076](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4076))
* kotax - Made sure the curfew status for Jennifer and Sidney gets imported correctly from their Bondage College storyline ([#4080](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4080))

### [Technical]
* Rama - Changed the vibrating archetype to use more of the extended item API ([#3999](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3999))
* Miisha - Cleaned up code handling activities and clothing changes in the Private room ([#4043](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4043))
* Rama - Added abstract-ish `ExtendedItemData` and `ExtendedItemConfig` interfaces to merge common features ([#4063](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4063))
* Rama - Standardized the specification and creation of script hooks ([#4070](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4070))
* Rama - Converted `ExtendedItemOption` into an abstract-ish base interface ([#4075](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4075))
* Rama - Avoided server pushes when calling `....Init()` inside the property sanitization workflow ([#4077](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4077))
* Rama - Refactored `ExtendedItemMapChatTagToDictionaryEntry` to use the dictionary builder ([#4082](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4082))
* Estsanatlehi - Changed the CI config to protect against whitespace issues in the asset definition files ([#4081](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4081))

## [R90]

### [Added]
* Ben987 - Added a new Tighten / Loosen mechanic to some specific assets, as well as some minigame changes
* Ellie - Asset: Cheerleader Outfit by Titania ([#3944](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3944))
* Estsanatlehi - Add dialog to trigger a break up with someone ([#3937](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3937))
* Estsanatlehi - Support gendered dialogs ([#3952](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3952))
* Miisha - Bondage College pages translator cheats ([#3925](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3925))
* Miisha - Czech translation for B. College – Chapters 1 – 3 and common (999) ([#3955](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3955))
* KyraObscura & Leah - Lipstick Marks ([#3970](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3970), [#3973](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3973))
* bananarama92 - ENH: Add a new coffee emoticon ([#3982](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3982))
* Estsanatlehi - Allow setting each layer's priority with OverridePriority ([#3987](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3987))
* KyraObscura - New Custom Latex Hood Module Options and Override Priority Update ([#3992](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3992))
* KyraObscura - Cheek Studs and Facial Piercing Combinations ([#3994](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3994))
* bananarama92 - ENH: Add the new `Coffee Mug` handheld ([#3995](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3995))
* Estsanatlehi - Add a new set of steel items courtesy of Constantan ([#4016](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4016))

### [Removed]

### [Changed]
* MAKeevchanin - Updated the Russian translation
* Nikky - Hide folding screen on wardrobe screen ([#3956](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3956))
* Ben987 - Hide the Wheel of Fortune when in the wardrobe
* KyraObscura - Add 'metal' layer to Harness Ball Gag XL in all gag slots ([#3958](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3958))
* KyraObscura - Piercing Set Update ([#3959](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3959))
* KyraObscura - Increase Visibility of Navel Bar ([#3971](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3971))
* KyraObscura - Character Perspective Left-Right Labelling for Kyra's Stuff ([#3990](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3990))
* KyraObscura - Bolero SJ Colour Update ([#3991](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3991))
* KyraObscura - Fixed the Socks Orientation in Different Poses ([#4035](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4035))

### [Fixed]
* Ben987 - Fixed the Student Outfit missing some layers
* Ben987 - Fixed a crash in InventoryPrerequisiteConflictingGags if a gag had no prerequisite property
* Ben987 - Fixed a crash in ServerParseColor if a null color was processed
* Ben987 - Added support for the recently-introduced groups to Owner's Block Appearance rules
* Ben987 - Fixed a freeze when tabbing out of the Slave Auction
* Ben987 - Fixed Kneel button in the Timed Cell
* Ben987 - Fixed a bug with the Pandora's Prison Maid not being reset properly
* bananarama92 - BUG: 3 more smaller misc bug fixes ([#3933](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3933))
* Estsanatlehi - Fix lover's lock removal logic ([#3936](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3936))
* Estsanatlehi - Small dialog fixes ([#3945](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3945))
* Estsanatlehi - Make sure the sensory-deprivation doesn't go overboard ([#3932](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3932))
* Miisha - Fix(College): Cleanup of code, fixes minor bug ([#3950](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3950))
* bananarama92 - BUG: Fix a number of invalid asset prerquisites ([#3968](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3968))
* bananarama92 - BUG: Fix expressions not applying when equiping items and fix non-existent expression names ([#3966](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3966))
* Estsanatlehi - Fix substitution failure for a character that left ([#3963](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3963))
* bananarama92 - BUG: Fix various color-layer & -group related bugs ([#3962](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3962))
* Estsanatlehi - Fix another issue with ChangeWhenLocked ([#3960](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3960))
* Estsanatlehi - Use a callback to handle post-struggle dialog updates ([#3961](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3961))
* bananarama92 - BUG: Ensure that the festival fox mask can only be bought once ([#3972](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3972))
* Estsanatlehi - Fix a bug with the kennel letting item activities go through ([#3976](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3976))
* Estsanatlehi - Fix a crash if the Sarah character hasn't been initialized ([#3980](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3980))
* Ellie - Bugfix: Fixes the positioning of the Latex Corset lock image ([#3981](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3981))
* Estsanatlehi - Fix a bug where the wand could still be used over chastity ([#3988](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3988))
* KyraObscura - Custom Latex Hood 404 Fix ([#3989](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3989))
* bananarama92 - BUG: Fix the option-stringification callback of `ExtendedItemRequirementCheckMessageMemo` ([#3993](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3993))
* Estsanatlehi - Fix a crash on `/eyes` when the eyes don't have properties ([#4004](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4004))
* bananarama92 - BUG: Fix an invalid asset prerequisite ([#4005](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4005))
* bananarama92 - BUG: Ensure that `ExtendedItemExit` always sets subscreens to `null` ([#4006](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4006))
* bananarama92 - BUG: Fix the return module when exiting the wheel of fortune customization menu ([#4015](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4015))
* Estsanatlehi - Protect against having no assets in metadata when playing audio ([#4018](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4018))

### [Technical]
* bananarama92 - MAINT: Let `Character.CanTalk()` use `SpeechGetTotalGagLevel()` under the hood ([#3951](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3951))
* Estsanatlehi - Make sure archetype mismatches get caught ([#3929](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3929))
* Estsanatlehi - Another batch of TS hardening fixes ([#3938](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3938))
* Estsanatlehi - Enable ESLint as part of CI and fix all its "simple" issues ([#3935](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3935))
* Estsanatlehi - TS: use array tags for better documentation ([#3953](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3953))
* Estsanatlehi - Refactor the "ChatRoomLeave" calls into a dedicated function ([#3954](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3954))
* Estsanatlehi - TS: Fix many issues in the single player rooms ([#3957](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3957))
* Estsanatlehi - Wrap the minigame exit function into a helper ([#3967](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3967))
* Estsanatlehi - Refactor CharacterAppearanceNextItem ([#3964](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3964))
* bananarama92 - CI,BUG: Expand the CI and fix two bugs discovered along the way ([#3913](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3913))
* bananarama92 - TYP: Improve `Scripts/*`-related type annotations ([#3965](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3965))
* bananarama92 - CI: Add a dedicated testing module and add tests for checking color layers and groups ([#3969](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3969))
* bananarama92 - CI: Check whether extended item options and modules are at least of length 1 ([#3975](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3975))
* Estsanatlehi - Remove all unsupported syntax uses ([#3977](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3977))
* Estsanatlehi - Streamline the GL context initialization and fix Graphics screen ([#3978](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3978))
* bananarama92 - ENH: Add a standardized set of extended item `...Init` functions for initializing item properties ([#3979](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3979))
* Estsanatlehi - Fix all current ESLint issues ([#3983](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3983))
* Estsanatlehi - Document LayerVisibility and cleanup the hooks' handling ([#3984](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3984))
* Estsanatlehi - TS fixes ([#3985](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3985))
* Estsanatlehi - Bigger changes to appease TS ([#3986](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3986))
* Estsanatlehi - Fix initialization order of Zone setup to prevent a crash ([#3996](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3996))
* Estsanatlehi - Fix small typing issue that broke CI ([#3997](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3997))
* Estsanatlehi - Bug fixes from the TS changes ([#3998](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3998), [#4000](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4000), [#4002](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4002), [#4003](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4003))
* bananarama92 - BUG: Fix `InventoryFuturisticTrainingBeltCheckPunishSpeech` potentially returning `undefined` ([#4001](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4001))

### [Beta fixes]
* Estsanatlehi - Fixed a null-is-also-object crash in the new per-layer priority override code ([#4023](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4023))
* Estsanatlehi - Fixed test for touch events in Firefox and Safari ([#4024](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4024))
* KyraObscura - Allow Maids to Remove Lipstick Mark ([#4026](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4026))
* Rama - BUG: Fix the default initialization value of `ArousalSettings.VFXVibrator` ([#4027](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4027))
* Estsanatlehi - Rename the PetSuit inventory previews ([#4029](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/4029))

## [R89]

### [Added]
* KyraObscura - Added a new Cropped Hoodie ([#3851](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3851)), options for smaller ears ([#3866](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3866)), and a lockable Navel Bar ([#3871](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3871))
* Estsanatlehi - Added back the removed "pulled leashes" graphics and made them automatic ([#3873](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3873))
* Ellie - Added Titania's new Dominatrix Leotard asset in the Bra group ([#3888](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3888))
* Estsanatlehi - Added an "Open Changelog" option to the Main Hall, and made the tips cycle every few seconds. Also added a few new tips from Natsuki ([#3861](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3861))
* KyraObscura - Added new groups for Left Sock, Right Sock, Jewelry, and Piercings. This also added the ability for a module/option to require another asset to be enabled, thanks to Estsanatlehi ([#3890](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3890), [#3886](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3886), [#3897](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3897))
* Estsanatlehi - Added status effect icons on items and options for blindness, deafness and gag-level ([#3838](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3838))
* Ayesha - Added a Vibrating Egg for males' glans ([#3870](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3870))
* bananarama92 - Allowed other people read-only access to one's wheel of fortune customization menu ([#3901](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3901))
* Nina - Added a new Festival Fox Mask from Fillia/Nina ([#3884](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3884))
* Nikky - Added a new Folding Screen item in the Device group ([#3904](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3904))
* Ben987 - Added Tighten/Loosen options for many rope items


### [Removed]

### [Changed]
* Fareeha - Improved the Traditional Chinese translation ([#3864](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3864))
* Ayesha - Changed the HeavyLatexCorset so it can be used by males ([#3868](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3868))
* KyraObscura - Added layers to more hair for better depth ([#3872](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3872))
* KyraObscura - Consolidated options on the Custom Latex Hood ([#3869](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3869))
* Estsanatlehi - Changed the handheld rope items' default color ([#3883](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3883))
* Gnarp - Added ItemBoots as target for the Caress activity ([#3895](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3895))
* KyraObscura - Consolidated eyebrows 2-6 into a modular item ([#3899](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3899))
* KyraObscura - Updated the School Hospital background ([#3903](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3903))
* MAKeevchanin - Updated the Russian translation
* Ben987 - Stopped the Wheel of Fortune from using blocked items
* Ben987 - Added Pet Bondage & Web Bondage to the Wheel of Fortune
* Ben987 - Bondage Brawl - Add a hint if the key isn't found
* Ben987 - Fixed invalid Log entries in the College Cafeteria - Thanks lojan!
* Ben987 - Disable the Wheel of Fortune's Roleplay mode on Hardcore/Extreme
* Ben987 - Added a "Force Spin" dialog option for owners having a Wheel of Fortune


### [Fixed]
* bananarama92 - Fixed the `DynamicGroupName` of the latex respirator ([#3859](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3859))
* Estsanatlehi - Fixed the Lucky Wheel so it draws correctly when inverted ([#3863](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3863))
* Estsanatlehi - Added back a few checks to stop the obedience belt from crashing ([#3865](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3865))
* Estsanatlehi - Fixed a crash when using a non-item-based activity on an NPC ([#3867](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3867))
* Estsanatlehi - Fixed a bug where locked modules could still be changed ([#3874](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3874))
* Estsanatlehi - Fixed ChatRoomData default value by initializing it to null ([#3878](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3878))
* Estsanatlehi - Fixed a crash in the Cafe when the maid tried to increase the inflatable dildo's vibe ([#3881](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3881))
* Gnarp - Fixed a layer name of the hogtie stocks ([#3885](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3885))
* Ellie - Fixed a bug with name substitution when swapping characters around ([#3887](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3887))
* bananarama92 - Changed the love chastity belt's text so it can only be modified by the owner ([#3889](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3889))

### [Technical]
* Estsanatlehi - Cleaned up the Poker minigame ([#3877](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3877))
* Ellie - Changed asset groups with AllowNone: false to use preview images ([#3891](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3891))
* Ellie - Tightened a couple things in asset properties ([#3892](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3892))
* bananarama92 - Improved type-checking on `Log`-related functions ([#3893](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3893))
* bananarama92 - Changed `Typed` item option names to always be equivalent to their `Property.Type` values ([#3894](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3894))
* Estsanatlehi - Remove unused function and add missing parameters to calls ([#3876](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3876))
* Estsanatlehi - Added socket.io to our deps, and declare io so it gets typechecked ([#3880](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3880))
* Estsanatlehi - Added a couple helpers for Ellie's ItemScript for easier manipulation ([#3857](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3857))
* klorpa - Provided a bunch of spelling and spacing fixes ([#3882](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3882))
* Estsanatlehi - Merged ParentColor with InheritColor ([#3875](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3875))
* Estsanatlehi - Centralized account-checking regexes and simplified the code. That fixes an issue with password resets. ([#3855](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3855))
* Estsanatlehi - Overhauled the struggle minigames' handling ([#3845](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3845))
* bananarama92 - Added annotations for many global variables and constants ([#3898](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3898))

### [Beta Fixes]
* bananarama92 - Fixed an issue with the futuristic vibrator not respecting the `DisableAdvancedVibes` setting ([#3906](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3906))
* Estsanatlehi - Fixed a bug when choosing random options for randomly-generated restraints on NPCs ([#3907](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3907))
* Estsanatlehi - Explicitly disabled Node types from being pulled ([#3908](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3908))
* Ellie - Fixed a couple issues with the new Dominatrix Leotard ([#3909](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3909))
* KyraObscura - Reduced Priority for the Cropped Hoodie's Front Layers ([#3910](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3910))
* Estsanatlehi - Fixed a crash with `NotVisibleOnScreen` if the asset doesn't exist ([#3911](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3911))
* Estsanatlehi - Added the missing tooltips for the status effect icons ([#3912](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3912))
* Nikky - Fixed the priority of the new Folding screen ([#3914](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3914))
* Estsanatlehi - Fixed another problem with locks and option switching ([#3915](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3915))
* Estsanatlehi - Fixed a dialog typo ([#3916](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3916))
* KyraObscura - Made item slots accessible while wearing Cropped Hoodie ([#3917](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3917))
* Da'Inihlus - Provided an updated Traditional Chinese translation ([#3918](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3918), [#3926](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3926))
* Estsanatlehi - Reverted "Merge ParentColor with InheritColor" as it caused incorrect coloring in some cases ([#3919](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3919))
* bananarama92 - Fixed a couple group and dialog-related mismatches ([#3920](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3920))
* bananarama92 - Added some validation to the Wheel of Fortune to ignore unknown options ([#3921](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3921))
* Miisha - Fixed an error in email validation which could prevent creation of new accounts ([#3922](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3922))
* Luna - Removed some extraneous properties from the 2nd Pet post ([#3923](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3923))
* bananarama92 - Provided 3 fixes for some small issues ([#3927](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3927))
* Estsanatlehi - Fix a couple issues where the leash could break ([#3928](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3928))
* KyraObscura - Fixed the archetype on the 2nd Navel Bar ([#3930](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3930))

### [Hotfix]
* Estsanatlehi - Stopped a crash on dynamic leashes if the asset is missing an AllowEffect property ([#3940](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3940))
* Estsanatlehi - Fixed a bunch of problems with Struggling ([#3939](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3939), [#3941](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3941), [#3946](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3946), [#3947](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3947), [#3948](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3948), [#3949](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3949))
* Ellie - Changed the way layers are sorted to fix visual issues with the new Socks slots ([#3942](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3942))
* Ellie - Refined item-hiding & alpha masks for the Dominatrix Leotard ([#3943](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3943))

## [R88]

### [Added]
* Da'Inihlus - Added a new Gradient Pantyhose ([#3799](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3799))
* Da'Inihlus - Added a kick activity on most body groups ([#3800](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3800))
* Luna, Ace & Estsanatlehi - Added a roleplay-based lucky wheel. ([#3813](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3813), [#3827](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3827), [#3831](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3831))
* Ben987 - Added an automated Wheel of fortune. See the new `/wheel` chat command for setup.
* KyraObscura - Added a new Custom Latex Hood ([#3817](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3817))
* KyraObscura - Added a new Cat Mask Harness ([#3818](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3818))
* KyraObscura - Added a new Cross Skirt, made by Leah ([#3826](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3826))

### [Removed]
* Estsanatlehi - Removed leftovers from the held/taken leash ([#3825](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3825))

### [Changed]
* KyraObscura - Refitted hair accessories and hats to handle both short and long hair ([#3798](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3798), [#3812](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3812))
* KyraObscura - Added a layer to HairFront37, giving it a bit of volume, and cleaned up a couple other hair ([#3821](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3821))
* KyraObscura - Added another layer to the Custom Latex Hood ([#3829](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3829))
* Livie53 - Changed the Combo Harness to allow head activities and make some gags layerable over it ([#3805](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3805))
* bananarama92 - Allow crafting of non-lock items from the `ItemMisc` group (a.k.a signs and plushies) ([#3823](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3823))

### [Fixed]

* Sepia Oulomenohn - Fixed an issue where 'All Gags Visible' would't work on hood variants ([#3802](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3802))
* Ellie - Fixed a rate-limiting trigger caused by picking multiple Kinky Dungeon starting scenarios ([#3797](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3797))
* Gnarp - Fixed the layer coloring of the hogtie stocks ([#3811](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3811))
* Ellie - Fix an issue with the new ItemScript causing the nakedness check to fail ([#3814](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3814))
* bananarama92 - Fixed `CommonStringSubstitute` getting stuck in an infinite loop ([#3815](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3815))
* bananarama92 - Fixed an incorrect chat prefix for the Transport Wooden Box ([#3816](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3816))
* bananarama92 - Fixed the various show-options of the futuristic straitjacket ([#3830](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3830))

### [Technical]
* bananarama92 - Overhauled the extended item's validation, fixing some issues ([#3796](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3796))
* bananarama92 - Added more validation for the futuristic gag around the `OriginalSetting` property ([#3808](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3808))
* Ellie - Added a cleaner way to build chat dictionaries ([#3806](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3806))
* bananarama92 - Converted the lovers chastity belt into a modular item ([#3822](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3822))
* bananarama92 - Fixed various CI failures ([#3824](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3824))
* bananarama92 - Converted the lovers vibrator into a vibrating item ([#3828](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3828))

### [Beta Fixes]
* Ben987 - Fixed a couple issues on the Wheel of Fortune
* bananarama92 - Consolidated the extended item handling of text input fields ([#3834](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3834))
* bananarama92 - Disabled blindness-related effects while in the crafting screen ([#3835](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3835))
* Ada - Updated to Kinky Dungeon 3.9 ([#3836](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3836))
* Da'Inihlus - Provided updates for the Chineses translation ([#3837](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3837))
* KyraObscura - Fixed the Bandana's short hair asset ([#3839](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3839))
* KyraObscura - Added a 'hide hair accessories' option to Custom Latex Hood ([#3840](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3840))
* KyraObscura - Decreased Opacity of the Custom Latex Hood's Transparent Panels ([#3841](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3841))
* KyraObscura - Fixed the layer order for the Custom Latex Hood ([#3842](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3842))
* KyraObscura - Decreased the priority of the Harness Cat Mask ([#3843](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3843))
* Estsanatlehi - Fixed a bug impacting an activity's arousal and sound effects ([#3844](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3844))
* KyraObscura - Fixed the Cat Mask Harness being to quick to add/remove ([#3847](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3847))
* KyraObscura - Fixed an alpha mask issue with the Cross Skirt ([#3849](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3849))
* Estsanatlehi - Fixed a bug that caused Kinky Dungeon's click sound to trigger on some keypresses, and an broken UI when running with a non-English language ([#3852](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3852))
* Estsanatlehi - Removed the WebGag from the random set of restraints ([#3853](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3853))
* Fareeha - Added a Traditional Chinese translation ([#3850](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3850))
* KyraObscura - Fixed some issues with the Custom Latex Hood's color groups and layers ([#3848](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3848))
* Estsanatlehi - Removed dialogs specific to the SilkStraps ([#3854](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3854))
* Ellie - Fixed an infinite loop when sanitizing invalid ItemScript changes ([#3856](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3856))
* Estsanatlehi - Added a missing label for the inverted suspension rope ([#3858](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3858))


## [R87]

### [Added]
* Ben987 - Lucky Wheel - Missing Preview Image (PR not found)
* Sepia Oulomenohn - Added a new latex respirator to the 3rd mouth group ([#3754](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3754))
* Bluesilv - Added a buttoned shirt item for males ([#3773](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3773))
* Ben987 - Added support for a player-provided list of words to censor
* Ben987 - Lots of updates to the NPC Private Room: no more spurious Pandora kidnappings, collars can be changed, Asylum punishment, get engaged with owner, subs, or regular NPCs, NPC marriage & wedding
* Bluesilv - Added Sleepsack, fixed a ButtonShirt capitalization issue ([#3784](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3784))
* Luna - Added Slave Rags clothing ([#3776](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3776))


### [Removed]

* Nothing this release

### [Changed]
* Estsanatlehi - Changed the bed to allow more poses ([#3728](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3728))
* Estsanatlehi - Added a tickling activity to the duster gag ([#3730](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3730))
* Estsanatlehi - Enabled spanking with the cushion when held ([#3746](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3746))
* Ellie - Fixes item-hiding, visual issues and 404s errors with the Pet Suit ([#3748](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3748), [#3749](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3749))
* KyraObscura - Fixed problems with the back hair now that the head is smaller ([#3755](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3755), [#3762](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3762))
* KyraObscura - Tweak the orientation on the new eyebrows ([#3756](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3756))
* Estsanatlehi - Splitted the Pet Suit into layers ([#3757](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3757))
* Estsanatlehi - Added Kneeling Spread variant for the Wired Egg ([#3758](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3758))
* Da'Inihlus - Updated chinese translation ([#3760](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3760))
* KyraObscura - Cleaned up the newly added hairstyles ([#3764](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3764))
* Bluesilv - Made more assets available for males with the creator's permission. ([#3768](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3768))
* KyraObscura - Updated most of the gags' strap to the new head shape ([#3771](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3771))
* MAKeevchanin - Updated Russian Translations
* Da'Inihlus - Chinese translation ([#3788](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3788))

### [Fixed]
* Ben987 - Fixed a crash with the HighSecurityPadlock
* bananarama92 - Fixed the colors of crafted items resetting if they're extended items without an archetype ([#3721](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3721))
* Estsanatlehi - Fixed the missing sound effects on the Kennel ([#3738](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3738))
* bananarama92 - Reverted the Emoticon group being marked as an extended item ([#3740](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3740))
* Estsanatlehi - Fixed crafted medical injectors turning into lotions on login ([#3741](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3741))
* Estsanatlehi - Fixed a bunch of forgotten checks for handhelds in singleplayer ([#3742](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3742))
* Estsanatlehi - Fixed naming of the gendered groups in the UI ([#3743](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3743))
* Ellie - Fixed a couple of chat message substitution issues, notably item swaps, locking items, and timed locks changes ([#3750](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3750))
* Ellie - Silence a few AssetCheck warnings ([#3751](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3751))
* bananarama92 - Fixed a slew of issues with crafted items when they're extended assets ([#3774](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3774))

### [Technical]
* bananarama92 - Converted lots of the old-style assets to the new architecture ([small locker - #3665](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3665), [inflatable dildo/buttplug - #3739](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3739), [assets with opacity - #3744](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3744), [sci-fi pleasure panties - #3747](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3747), [manual shock items - #3752](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3752), [transport jacket, futuristic bra, halo, clit and dildo belt - #3753](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3753), [futuristic gags - #3761](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3761), [auto-shock collar - #3766](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3766))
* bananarama92 - Changed the crafting validation of `Type` and `Color` properties to be less strict ([#3735](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3735))
* bananarama92 - Refactored the modular item button draw-functions to use `ExtendedItemDrawButton` and added extended item permission support ([#3677](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3677))
* bananarama92 - Added `AssetDefinitionProperties` and improved `Item.Property` documentation & annotations ([#3736](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3736))
* Ellie - Implemented stricter validation and scripted item permissions ([#3745](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3745))
* Ellie - Improved dictionary typing & timer lock cleanup ([#3767](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3767))
* Ellie - Added the ability to hide and show layers based on equipped asset attributes ([#3772](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3772))


### [Beta Fixes]

* Estsanatlehi - Fix a crashing bug with the vibes ([#3777](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3777))
* Estsanatlehi - Fix a pronoun misuse on gag kisses ([#3778](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3778))
* Estsanatlehi - Remove the penis layer from the cock ring ([#3779](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3779))
* Sepia Oulomenohn - Fixed typo and added requested module for respirator ([#3780](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3780))
* bananarama92 - Fixed the extended item menu not opening after equipping typed items ([#3781](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3781))
* bananarama92 - Changed `CraftingBackground` back to a `var` ([#3782](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3782))
* bananarama92 - Ensure that out-of-bounds indices do not raise when setting the type of Modular crafted items ([#3783](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3783))
* bananarama92 - BUG: Check whether `DialogFocusItem` is actually set in `ModularItemParseCurrent` ([#3785](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3785))
* bananarama92 - BUG: Always check whether extended item table lookups are successful ([#3786](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3786))
* bananarama92 - BUG: Add missing `DEST_CHAR_NAME` chat tags ([#3787](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3787))
* bananarama92 - BUG: Mark the `Shoes`-based variant of the futuristic heels as non-lockable ([#3789](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3789))
* Luna - Properly disable Slave Rags on males ([#3790](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3790))
* Sepia Oulomenohn - A couple minor bug fixes to the Latex Respirator ([#3791](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3791))
* KyraObscura - Re-Add Layer Name for HairFront45 ([#3792](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3792))
* Luna - Fixed problems with XLarge poses and Slave Rags. Also added Suspension pose ([#3793](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3793))
* Bluesilv - Fixed Sleepsack not slowing on leaving room. ([#3794](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3794))
* bananarama92 - Fixed incorrect dialog + image paths for the full latex suit wand ([#3795](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3795))

### [Hotfixes]
* Estsanatlehi - Fixed the clit ring causing a crash ([#3804](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3804))
* bananarama92 - Fixed an incorrect futuristic gag usage of `DialogFocusItem` ([#3803](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3803))
* bananarama92 - Fixed the denial mode of the scifi pleasure panties failing to prevent orgasms ([#3807](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3807))
* bananarama92 - Fixed a crash when opening shock-related screens ([#3809](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3809))
* bananarama92 - Fixed speech-detection failing to punish gag actions ([#3810](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3810))
* Ben987 - Fixed a dead-end in the Private Room NPC's dialog


## [R86]

### [Added]
* Ayesha - Males Release 1 ([#3678](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3678))
* Luna - Added the PetSign to the Misc slot ([#3666](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3666))
* Ada - Kinky Dungeon 3.81 ([#3676](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3676))
* Ben - Added a Private Bed & "/release" command
* Ayesha & Kyra - Added a bunch of new assets! (hairs, eyebrows and lips) ([#3706](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3706))


### [Removed]

* Nothing this release

### [Changed]
* bananarama92 - Added proper support for auto typing crafted extended items that lack an archetype ([#3656](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3656))
* bananarama92 - Added crafting auto-typing support for extended items of the `Vibrating` archetype ([#3658](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3658))
* Estsanatlehi - Made handheld items real assets ([#3663](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3663))
* MAKeevchanin - Updated russian translation ([#3672](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3672))
* bananarama92 - Added the ability for crafted items to specify their `OverridePriority` ([#3674](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3674))
* Da'Inihlus - Updated the chinese translation ([#3673](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3673), [#3700](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3700))


### [Fixed]
* bananarama92 - Re-enabled crafting auto types for most futuristic items ([#3648](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3648))
* bananarama92 - Fixed a bug of being unable to color crafted items equiped on other people ([#3653](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3653))
* Estsanatlehi - Reenable crafting addons (ropes and blankets) ([#3655](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3655))
* bananarama92 - Fixed a broken `Asset.Prerequisite` check ([#3660](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3660))
* bananarama92 - Added validation for `Item.Craft` ([#3662](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3662))

### [Technical]
* Estsanatlehi - Added a few documentation comments ([#3650](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3650))
* bananarama92 - Improved crafting-related type annotations ([#3659](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3659))
* bananarama92 - Converted the futuristic harness into a typed item ([#3661](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3661))
* bananarama92 - Converted more vibrators to the `Vibrating` archetype ([#3667](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3667))
* Estsanatlehi - Added eslint-plugin-compat ([#3668](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3668))
* bananarama92 - Added an archetype to three more extended items ([#3669](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3669))
* bananarama92 - Converted the collar name tags into Typed items ([#3670](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3670))
* bananarama92 - Added archetypes to three more extended items ([#3675](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3675))

### [Beta Fixes]

* Estsanatlehi - Fixed inventory bleeding through on blocked groups ([#3680](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3680))
* bananarama92 - Disallowed `Type = ""` for crafted extended items ([#3682](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3682))
* Estsanatlehi - Fixed the petsuit Hide and Blocks ([#3679](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3679))
* bananarama92 - Fixed the crafting auto-type pagination button being broken ([#3683](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3683))
* Nina - Removed gendered assets from the not-bought shop list ([#3684](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3684))
* bananarama92 - Filtered `ItemMisc` assets when constructing `CraftingItemSelected` objects ([#3685](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3685))
* Nina - Fixed how pronouns are substituted in messages ([#3686](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3686))
* Nina - Added support for expression prerequisities for the penis expression ([#3687](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3687))
* Nina - Fixed a few issues with pronouns in the Private Bed room ([#3688](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3688))
* Nina - Fixed an issue with Auto-Join and the split chatroom spaces ([#3690](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3690))
* bananarama92 - Fix an issue with crafted items `OverridePriority` ([#3691](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3691))
* bananarama92 - Added missing extended item asset options for the male body ([#3692](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3692))
* Estsanatlehi - Fixed missing handheld graphics by checking and merging layers ([#3693](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3693))
* Ben987 - Fixes for the new Private Bed area
* Ayesha - Updated difficulties for the Chastity Cage ([#3695](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3695))
* Estsanatlehi - Fixed a bug where arousal wouldn't be taken into account ([#3696](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3696))
* MAKeevchanin - Updated the russian translation ([#3697](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3697))
* Ayesha - Changed the penis asset plus a couple fixes ([#3701](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3701))
* bananarama92 - Fixed some issues with crafted typed assets ([#3703](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3703))
* Estsanatlehi - Fixed an issue with chat tag replacements ([#3704](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3704))
* Estsanatlehi - Changed how the male activities are handled ([#3702](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3702))
* dynilath - Fixed dialog pronouns substitutions ([#3705](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3705))
* Ada - Fixed a few missing assets for the full latex bra in the yoked pose ([#3708](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3708))
* Estsanatlehi - Fixed male orgasms on activities ([#3709](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3709))
* Estsanatlehi - Removed many of the Hide properties on the petsuit ([#3710](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3710))
* Estsanatlehi - Fixed a crash if the character disappears from the room ([#3711](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3711))
* Ayesha - Fixed a 404 on the new mouth assets ([#3712](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3712))
* Estsanatlehi - Fixed the missing audio effect on spanks ([#3714](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3714))
* Estsanatlehi - Silenced a warning by removing a duplicate line ([#3715](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3715))
* Estsanatlehi - Marked the FacialHair group as a non-default group ([#3717](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3717))
Bondage-College/-/merge_requests/3716))
* Estsanatlehi - Added fixups to preserve the owned handhelds information ([#3718](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3718))
* Ayesha - Fixes for the new eyebrows and mouth ([#3719](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3719), [#3722](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3722))
* Estsanatlehi - Fixed prounouns on the lock details screen ([#3723](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3723))
* Ayesha - Fixes the kitty gags in the other 2 slots ([#3724](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3724))
* Estsanatlehi - Fixed copy-paste error on the penis slot's label ([#3725](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3725))
* Estsanatlehi - Removed the reverse activities for now ([#3726](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3726))
* Estsanatlehi - Hid hand-related groups for the Petsuit ([#3727](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3727))
* Estsanatlehi - Fixed a crash with the shock messages ([#3729](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3729))
* Estsanatlehi - Hotfixed missing penetrate activities ([#3732](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3732))
* Ayesha - Hotfixed some of the male items not hiding genitalia correctly ([#3733](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3733))
* Nina - Hotfixed recreated rooms so they appear in the F-only space ([#3734](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3734))

## [R85]

### [Added]

* Ben987 - Added more owner rules to block items, prevent accessing specific rooms and forbid chosen words
* Luna - Added a Ballgag option to the Bridle Gag ([#3616](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3616), [#3633](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3633))
* Evilwumpus - Added a GGTS task for inflatable ball/panel gags ([#3624](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3624))
* bananarama92 - Added support for bodies with arbitrary colors ([#3625](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3625))
* bananarama92 - Changed blindness effect to be cumulative ([#3629](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3629))
* Luna - Added new Rings items ([#3634](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3634), [#3642](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3642), [#3647](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3647), [#3651](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3651))
* Ada - Updated Kinky Dungeon to 3.71 ([#3623](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3623), [#3632](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3632))

### [Removed]

* Nothing this release

### [Changed]

* Ben987 - Limited the Shibari Dojo training to one per hour
* Estsanatlehi - Cleaned up rope sound effects ([#3627](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3627))
* MAKeevchanin - Updated Russian translations ([#3636](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3636), [#3652](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3652))
* Da'Inihlus - Updated Chinese translations ([#3646](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3646))

### [Fixed]

* Estsanatlehi - Removed allowed-check when updating the crafting dummy ([#3612](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3612))
* Nina - Fixed missing effects on the Bamboo and Muzzle Gag ([#3613](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3613))
* Estsanatlehi - Added a description to the new /craft command ([#3614](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3614))
* bananarama92 - Fixed three bugs related to the hood-based Smooth Latex Mask ([#3615](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3615))
* bananarama92 - Fixed a visual oddity with VR goggles when combined with the `thin` property ([#3617](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3617))
* bananarama92 - Fixed crafting failures related to dynamic group names ([#3618](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3618))
* Estsanatlehi - Fixed visual bug with the suspended pet crawler ([#3621](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3621))
* Estsanatlehi - Fixed the visual issues with the pet suit ([#3622](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3622))
* bananarama92 - Fixed chat join audio notifications not getting suppressed when in full sensory deprivation ([#3619](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3619))
* bananarama92 - Changed `Character.CanTalk` to account for crafted properties ([#3626](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3626))
* Estsanatlehi - Fixed a bug with the pose menu not reflecting the available poses ([#3628](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3628))
* Estsanatlehi - Fixed a bug with the gavel detection in the movie studio ([#3635](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3635))
* bananarama92 - Used the incorrect syntax instead of `Map.get` ([#3638](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3638))
* bananarama92 - Fixed `InventoryWearCraft` failing to parse the type strings of modular items ([#3640](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3640))
* Luna - Fixed a few problems with the Ponygag ([#3641](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3641), [#3649](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3649))
* bananarama92 - Reenabled gagged actions while wearing `small` gags ([#3644](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3644))


### [Technical]

* Estsanatlehi - Refactored ChatRoomMessage ([#3592](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3592), [#3643](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3643), [#3645](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3645))
* Estsanatlehi - Added typedefs for the dynamic drawing callbacks ([#3620](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3620))
* bananarama92 - Added support for custom `UpperBody` overlays ([#3630](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3630))
* Estsanatlehi - Fixed CI breakage ([#3631](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3631))
* Estsanatlehi - Added the two new hand groups to the known groups ([#3639](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3639))

## [R84]

### [Added]
* Gnarp - Added a new Rope ball-gag ([#3597](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3597))
* bananarama92 - Added a hood-based variant of the Smooth Latex Mask ([#3604](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3604))
* Estsanatlehi - Added a few missing sound effects ([#3601](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3601))
* Estsanatlehi - Added Kneeling Spread & AllFours support for the Strict Pet Crawler ([#3606](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3606))


### [Removed]

* Nothing this release

### [Changed]
* Estsanatlehi - Ported over the crafting enhancements from BCE back into the game ([#3593](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3593))
* Estsanatlehi - Merged some of the clit piercings into one ([#3600](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3600))

### [Fixed]
* Estsanatlehi - Corrected a syntax error in the maid intro dialog that led to server disconnects ([#3594](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3594))
* Nina - Restored Magic Trail's minimum fade modifier ([#3595](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3595))
* Estsanatlehi - Fixed incorrect variable being set when handing over your spanking toys ([#3596](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3596))
* Estsanatlehi - Changed the Latex Dog Hood to hide the Mask group ([#3598](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3598))
* Estsanatlehi - Fixed the obedience belt trying to load the default lock layer ([#3602](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3602))
* Estsanatlehi - Fixed the Vacbeds triggering stimulation events ([#3605](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3605))
* Luna - FIX: PetPost. Added draw locks, locks now usable when chain leash is applied. ([#3607](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3607))
* Estsanatlehi - Fixed crash with the padded mittens ([#3609](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3609))
* Estsanatlehi - Split Egged from the remote-needed function ([#3599](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3599))

### [Technical]

* Da'Inihlus - Updated the chinese translation ([#3603](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3603))
* Estsanatlehi - Updated russian activity translations ([#3608](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3608))

### [Beta Fixes]
* Estsanatlehi - Reverted !3599, which prevented many vibrating items to be controlled ([#3610](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3610))


## [R83]

### [Added]

* Luna - Added several new Stitches items and variations ([#3543](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3543))
* Kehhaja/Nina - Added a new Biker Gloves asset ([#3551](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3551))
* Luna - Added several new sticker options to the Pet Sign ([#3556](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3556))
* Timeline - Added several Chinese translations ([#3566](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3566), [#3585](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3585))
* Da'Inihlus - Added/fixed several Chinese translations ([#3574](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3574), [#3590](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3590))
* Karamel - Added several new variations for the Nylon Rope items ([#3576](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3576))
* Estsanatlehi - Added stimulation messages to the clit leash ([#3589](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3589))

### [Removed]

* Nothing this release

### [Changed]

* sqrt10pi - Reworked some of the UI interactions around the sexual activities menu ([#3562](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3562))
* Tama-chan - Made several enhancements to the chatroom filtering functionality ([#3577](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3577), [#3580](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3580))
* Estsanatlehi - Changed the behaviour of the nickname screen to permit an empty nickname (exiting the screen with the nickname input empty will reset you nickname to your character name) ([#3587](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3587))

### [Fixed]

* Ellie - Fixed the wiki link in the browser console safety message ([#3554](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3554))
* Estsanatlehi - Fixed several bugs with the obedience belt ([#3557](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3557), [#3565](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3565))
* Estsanatlehi - Fixed some missing assets for the Ornate Cuffs in the hogtied pose ([#3552](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3552))
* meshwork100 - Fixed several typos & mistakes in the Chinese translations ([#3563](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3563), [#3571](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3571))
* Tama-chan - Several typo/grammatical fixes and phrasing reworks to English text ([#3575](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3575))
* Ellie - Fixed a loophole that allowed players to crash other players' games via console ([#3578](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3578))
* zR1OQicz - Fixed an issue with color handling in the magic puzzle minigame ([#3579](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3579))

### [Technical]

* Demopans - Converted the old Git contribution guide into markdown and added it to the game repository ([#3555](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3555))
* Technical changes, fixes and improvements:
  * Estsanatlehi - [#3559](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3559), [#3560](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3560), [#3561](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3561), [#3568](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3568), [#3569](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3569), [#3570](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3570), [#3573](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3573), [#3584](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3584)
  * Da'Inihlus - [#3567](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3567)

### [Beta Fixes]

* Estsanatlehi - Fixed the missing name for the stitches in the butt slot ([#3583](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3583))
* Karamel - Changed the assets for the nylon rope arms item to render under breasts on the XLarge body ([#3586](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3586))
* sqrt10pi - Reverted the change to the sexual activities/restraints UI following community feedback ([#3588](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3588))


## [R82]

### [Added]

* Luna - Added new Stitches items for the mouth and vulva slots ([#3500](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3500))
* Kyra/T-Bone Shark - Added several new items ([#3508](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3508))
  * Single & double bun back hairstyles
  * Two new front hairstyles
  * Gradient Sunglasses
  * Baseball Cap (forward & back variants)
* Ayesha - Added a new torso zone for bondage items and added two new locking swimsuit items to the torso zones ([#3522](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3522))
* answork01 -  Several updates and fixes to Chinese translations  ([#3524](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3524))
* Karamel - Added a new "Knotted" variation to the Cloth Gag ([#3526](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3526))
* Emily R/Ayesha - Added 3 new chatroom backgrounds ([#3527](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3527))
* RedStacey/Ayesha - Added Fur Scarf Gag & Blindfold items ([#3528](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3528))
* Da'Inihlus - Added several Chinese translations ([#3529](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3529), [#3538](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3538), [#3549](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3549))
* Karamel - Added new audio variations for tape and metal cuff items ([#3530](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3530))
* Luna - Added a new Pet Sign item ([#3533](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3533))
* Shion/Ayesha - Added a new Latex Open Mouth Plug Hood item ([#3534](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3534))
* Nythaleath/Estsanatlehi - Added a new Obedience Belt item ([#3539](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3539))

### [Removed]

* Nothing this release

### [Changed]

* Nina - Clothing can now be favorited in Extreme difficulty  ([#3521](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3521))
* Luna - Updated front hairs 22, 22b, 23 & 23b to allow gradient colouring ([#3513](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3513))
* Da'Inihlus - Changed several items which trigger on speech to work with non-English languages ([#3531](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3531))
* gatetrek - Updated the Chain Clamps item with new graphics, variants and multi-color support ([#3535](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3535))
* Estsanatlehi - Updated the Metal & Leather Chastity Belt preview images to reflect the new assets ([#3540](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3540))
* Nina - Changed notifications so that chatroom join notifications are no longer received when in full sensory deprivation ([#3550](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3550))

### [Fixed]

* Estsanatlehi - Fixed a crash that could occur on login for some players ([#3532](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3532))
* Estsanatlehi - Fixed an issue where item duplicates could appear in the inventory screen ([#3548](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3548))

### [Technical]

* Technical changes, fixes and improvements:
  * Estsanatlehi - [#3525](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3525), [#3536](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3536), [#3537](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3537), [#3542](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3542)

### [Beta Fixes]

* Luna - Fixed an issue with the layer names for some of the new hairs ([#3544](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3544))
* Estsanatlehi - Fixed several bugs with the Obedience Belt ([#3545](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3545))
* Luna - Fixed several issues with the Pet Post ([#3546](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3546))
* Estsanatlehi - Fixed an issue where mittens that can be chained to a harness wouldn't recognise the harness in the new torso slot ([#3547](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3547))


## [R81]

### [Added]

* Nina - Added several new variable height suspension options for the Hemp Rope ([#3417](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3417))
* T-Bone Shark - Added two new handheld items: a Medical Injector and a Potion Bottle ([#3419](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3419))
* Luna - Added a new back hair and front hair with gradient colour support ([#3420](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3420))
* Emily R - Added a new Catsuit Collar item (clothing accessory & necklace) ([#3423](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3423))
* Shion/Estsanatlehi/Ada - Added two new hood items: Kitty Hood & Latex Dog Hood ([#3436](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3436), [#3474](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3474))
* Tsubasahane - Added & fixed several Chinese translations ([#3451](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3451))
* DekuWang - Added Chinese translations for the Asylum entrance ([#3459](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3459))
* Titania/Ellie - Added 10 new items ([#3465](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3465), [#3424](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3424), [#3461](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3461))
  * Crop Top (clothing)
  * Laurel Top (clothing)
  * See-through Top (clothing)
  * Asymmetric Skirt
  * Elegant Skirt
  * Ruffled Skirt
  * Bondage Skirt
  * Bondage Bra (arm restraint)
  * Monoheel (foot restraint)
  * Body Chain Necklace
* Ellie - Added an icon in most extended item screens to indicate whether or not the item is locked ([#3467](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3467))
* Luna - Added multi-color & lock support to the Wooden Rack ([#3457](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3457), [#3475](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3475))
* Aeren - Added multi-color support to the Pleated Skirt ([#3477](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3477))
* Anonymous-WghrYkBGUjBt - Added Chinese translations for Bondage Poker ([#3476](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3476), [#3479](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3479))
* Luna - Added a new Head Harness mask item ([#3478](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3478))
* Gnarp - Added several new pose variations to the Wooden Cuffs items ([#3483](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3483))
* Karamel - Added multi-color support and audio to the Sturdy Leather Belts items ([#3482](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3482))
* Gnarp - Added a new hogtie variation to the Leather Cuffs (arm restraint) ([#3486](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3486))
* Da'Inihlus - Added several Chinese translations ([#3485](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3485), [#3493](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3493), [#3512](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3512))
* Gelmezon - Added Chinese translations for the Asylum meeting room, Asylum therapy room and Maid Cafe ([#3484](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3484))
* Lanarux - Added lots of Russian translations ([#3490](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3490))
* Ada - Updated Kinky Dungeon to 3.42 - see the [Kinky Dungeon changelog](Screens/MiniGame/KinkyDungeon/Changelog.txt) ([#3499](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3499))
* RedStacey/Estsanatlehi - Add a Jacket asset ([#3496](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3496))

### [Removed]

* Estsanatlehi - Removed the Leather Whip, Leather Crop, and Vibrating Wand items (these have now been superseded by their handheld toy counterparts) ([#3446](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3446))

### [Changed]

* Sekkmer - updated the player title screen to allow pagination and display your current title ([#3470](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3470))
* Nina - Changed room search so that rooms with a name exactly matching your search term will always be visible, regardless of room filter settings ([#3492](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3492))

### [Fixed]

* Anonymous-WghrYkBGUjBt - Fixed some Chinese translation errors ([#3472](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3472))
* Aeren - Fixed an issue where some letters would get double-garbled with the Nursery Milk equipped ([#3464](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3464))
* Estsanatlehi - Fixed a missing lock asset on the Leather Chastity Belt ([#3480](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3480))
* Estsanatlehi - Fixed an issue where character nicknames would not be displayed for extended item updates ([#3481](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3481))
* Estsanatlehi - Fixed an issue where handheld items could not be used on the vulva slot ([#3489](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3489))
* Ellie - Fixed an issue where players with no owner/lovers could get stuck in owner/lover locks ([#3505](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3505))
* Estsanatlehi - Fixed an issue where skills could overlap on the player's informatino sheet ([#3511](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3511))

### [Technical]

* Ellie - Overhauled `AllowLock` behaviour to permit lockable item variations ([#3450](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3450), [#3454](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3454))
* Technical changes, fixes and improvements:
  * Ellie - [#3418](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3418)
  * Jomshir - [#3473](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3473), [#3460](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3460)
  * Estsanatlehi - [#3448](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3448), [#3452](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3452), [#2987](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2987), [#3487](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3487), [#3507](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3507)

### [Beta Fixes]

* Luna - Fixed a bug where the Heavy Head Harness variant would not display ([#3494](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3494))
* Ellie - Fixed an issue where hair would render inside the Asymmetric Skirt ([#3495](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3495))
* Estsanatlehi - Fixed bugs where the Poker & Bondage Brawl games would crash ([#3497](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3497))
* Estsanatlehi - Updated the Kitty and Latex Dog Hood to hide hair accessories & ears ([#3498](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3498))
* Luna - Fixed several issues with the Wooden Rack ([#3501](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3501))
* Estsanatlehi - Fixed an error that could occur on variable height items ([#3502](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3502))
* T-Bone Shark - Fixed a missing message when using the Medical Injector ([#3506](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3506))
* Estsanatlehi - Fixed several issus with the new image caching functionality ([#3510](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3510))
* Luna - Changed the Head Harness straps to render underneath front hair ([#3514](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3514))
* Nina - Fixed an issue where owner locks would disappear when on a trial ([#3518](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3518))


## [R80]

### [Added]

* gatetrek/EmilyFox - Added 9 new items ([#3343](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3343))
  * Harem Pants 2 (lower clothing)
  * Thong 2 (panties)
  * String Thong (panties)
  * Micro Thong (panties)
  * Harem Stockings (socks)
  * Harem Gloves (gloves)
  * 3 new front hairstyles
* Luna - Added the Bridle Gag to the second and third mouth slots ([#3368](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3368), [#3397](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3397))
* remiliacn - Added several Chinese translations and corrections ([#3372](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3372), [#3389](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3389), [#3404](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3404), [#3411](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3411), [#3433](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3433), [#3443](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3443))
* Anonymous-WghrYkBGUjBt - Add Chinese translations for several minigames ([#3374](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3374))
* EliseRoland - Added Chinese translations for the store ([#3377](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3377))
* Luna - Added two new items ([#3380](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3380), [#3386](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3386), [#3412](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3412))
  * Wooden Rack item (devices)
  * Dildocorn Horn (hair accessory)
* Kirsty/Ace - Added a new Combo Harness item (neck) ([#3392](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3392))
* Leah/T-Bone Shark - Added an OTN variant to the Silk Scarf gag and added a new Scarf Blindfold item ([#3395](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3395))
* SepiaOulomenohn - Added three new items ([#3396](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3396))
  * Boned Neck Corset (neck)
  * Latex Sheath Gag (mouth)
  * Mouthfeature Gag (mouth)
* Ellie - Added new blur and tint visual effects to the game ([#3399](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3399), [#3416](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3416))
  * Tint effects have been added to the Futuristic Mask, Interactive Visor, Pantyhose (head items), GP-9 Gas Mask and Techno Helmet
  * Tint and blur effects have been added to the Cloth Blindfold and the newly-added Slime items
* Gnarp/Ace - Added a new One-Way Glass Head Box item (hood) ([#3402](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3402), [#3437](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3437))
* Titania/Ace - Added a new Latex Bunny Girl Bodysuit item (bra) ([#3406](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3406))
* Titania/Ellie - Added a new Poncho item (clothing accessory) ([#3408](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3408))
* Cecilia/Ellie - Added a new set of slime-themed restraint items (feet, legs, thighs, arms, gag, blindfold, hood) ([#3405](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3405))

### [Removed]

* Nothing this release

### [Changed]

* Estsanatlehi - Moved the Wooden Horse to the devices slot ([#3364](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3364))
* fleisch11 - Added an arrow to indicate doors in the Bondage Brawl minigame ([#3383](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3383))
* Karamel - Updated the assets for the Nylon Rope items ([#3390](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3390))
* Ada - Updated Kinky Dungeon to 3.32 - see the [Kinky Dungeon changelog](Screens/MiniGame/KinkyDungeon/Changelog.txt) ([#3401](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3401), [#3442](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3442), [#3456](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3456))

### [Fixed]

* Ellie - Fixed several issues with Latin & Cyrillic garbling ([#3369](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3369))
* Estsanatlehi - Fix an issue with DOM-handling that could cause crashes in some areas of the game ([#3358](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3358), [#3376](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3376))
* Nina - Fixed an issue where owner rules and items would persist after breaking an owner relationship ([#3365](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3365))
* VCode - Fixed a Chinese translation error in the GGTS dialog ([#3371](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3371))
* Anonymous-WghrYkBGUjBt - Fixed several Chinese translation errors in the Maid Quarters ([#3373](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3373))
* remiliacn - Fixed an issue where dialog buttons could be blank for Chinese language users ([#3362](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3362))
* remiliacn - Fixed some Chinese translation errors ([#3379](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3379))
* Nina - Fixed a bug where item permissions could be bypassed for certain items ([#3378](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3378))
* Estsanatlehi - Fixed a few minor item errors ([#3388](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3388))
* Karamel - Fixed a few issues in the Gambling Hall and changed the way Street to Roissy dice are displayed to make game progress easier to read ([#3394](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3394))
* Estsanatlehi - Fixed an issue where item sounds would be played in chatrooms when in other screens, even with the "Play item sounds in chatrooms" preference off ([#3398](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3398))
* Nina - Fixed a longstanding issue where player appearance would get reset when editing it ([#3407](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3407))
* Karamel - Fixed an issue where some translation files weren't getting loaded ([#3409](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3409))
* Ellie - Fixed a minor grammatical error in the chat messages for the Kigurumi Mask ([#3413](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3413))
* Ellie - Fixed an issue where players could reach level 11 in Bondage Brawl, causing the game to crash ([#3415](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3415))
* Ellie - Fixed an issue where the effects of some items wouldn't load properly on first equip ([#3438](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3438))
* Nina - Fixed an issue where the Plug Gag, Dildo Plug Gag, Harness OTN Plug Gag and Funnel Gag would only permit penetration after changing to another variation and back ([#3431](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3431))
* Nina - Fixed an issue where certain items were twice as difficult as they were supposed to be ([#3426](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3426))
* Ace - Fixed an issue where returning to a chatroom from the friendlist when entering it from a beep notification would stop the chat from automatically scrolling ([#3441](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3441))
* Ellie - Fixed a bug where the clothing versions of the Leather Corset Top and Steampunk Corset Top would disappear in several poses ([#3422](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3422))
* Luna - Fixed an issue with the Bridle Gag where the post would render behind some items ([#3421](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3421))
* remiliacn - Fixed an issue where OOC using the full-width left parenthesis character (`（`) could bypass OOC being blocked when gagged ([#3449](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3449))
* anniclub - Fixed a piece of missing chat message when picking the "Light" option on the Inflatable Strait Leotard ([#3458](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3458))

### [Technical]

* Nina - Added a new Variable Height archetype to the asset system ([#3357](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3357), [#3387](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3387))
* Technical changes, fixes and improvements:
  * Estsanatlehi - [#3370](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3370)
  * Jomshir - [#3361](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3361)
  * remiliacn - [#3391](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3391)
  * Ellie - [#3393](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3393), [#3414](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3414)
  * Nina - [#3463](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3463)

### [Beta Fixes]

* Emily R/Ellie - Slightly reduced the strength of the tint effect on the GP-9 Gas Mask ([#3435](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3435))
* Estsanatlehi - Fixed a bug causing crashes in account creation ([#3434](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3434))
* SepiaOulomenohn - Changed the Boned Neck Corset to permit locking, permitted penetration activities and added muffling options to the Latex Sheath Gag  ([#3432](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3432))
* Luna - Fixed several minor issues with the Wooden Rack ([#3430](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3430), [#3440](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3440))
* Ellie - Adjusted the list of items hidden by the Slime restraint in the thigh slot ([#3429](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3429))
* Ellie - Fixed a bug where the original Harem Pants would disappear in the kneeling pose ([#3428](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3428))
* Estsanatlehi - Fixed a bug where lines of text in the profile sheets for NPCs could overlap with each other ([#3427](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3427))
* Ellie - Fixed a bug where the Panty Line layer in the new Harem Pants was not visible ([#3425](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3425))
* Estsanatlehi - Fixed a bug where the "(Back to rules.)" option would appear twice in the owner rules menu ([#3447](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3447))
* Ellie - Fixed a bug where some items would cause "Invalid appearance update" warning messages in the console when modified ([#3453](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3453))
* Ellie - Fixed an issue where the slime girl would clip through wing items ([#3455](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3455))
* Ellie - Fixed a bug where adjusting the height of the suspended hogtie on the chains would cause locks on them to disappear ([#3466](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3466))


## [R79]

### [Added]

* WWWWWWWWWWWWWWWWWWWWang - Added Chinese translation for Player and NPC Collaring, NPC Slave Auction, Player Mistress, intro with Sarah, and Maid Quarters ([#3303](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3303), [#3306](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3306), [#3307](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3307), [#3342](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3342))
* Anonymous-WghrYkBGUjBt - Added Chinese translations for various player activities and dialog ([#3334](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3334))
* remiliacn - Added Chinese translations for some common items and GGTS ([#3337](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3337), [#3350](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3350))
* Nythaleath/Ayesha - Added a new Hybrid Chastity Belt item ([#3283](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3283))
* Shion/Ayesha - Added four new hoods ([#3286](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3286))
  * Accent Hood
  * Collar Hood
  * Zipper Hood
  * Latex Habit Hood
* Estsanatlehi - Added spanking and whipping sounds ([#3288](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3288))
* Estsanatlehi - Added new vibrator sound effects ([#3297](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3297))
* Karamel - Added `/blush` and `/eyes` chat commands ([#3299](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3299))
* Karamel - Added `/expr` chat command to clear/load facial expression ([#3282](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3282))
* Evals/Luna - Added a new Cow Hood item ([#3292](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3292))
* Luna - Added two new items ([#3284](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3284))
  * Bridle Gag
  * Unicorn Horn (hair accessory)

### [Removed]

* Nothing this release

### [Changed]

* Ada - Updated Kinky Dungeon to 2.92 - see the [Kinky Dungeon changelog](Screens/MiniGame/KinkyDungeon/Changelog.txt) ([#3305](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3305), [#3338](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3338))
* Nythaleath/Ayesha - Updated Metal and Leather Chastity Belt assets ([#3283](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3283))
* Estsanatlehi - Updated the Ceiling Chain, Rope, and suspension items such as hemp rope to allow kneeling spread when appropriate ([#3280](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3280))
* Sidious - Updated AFK detection to ignore scrolling ([#3291](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3291))
* Karamel - Updated the Cloth Gag and Cloth Blindfold's assets and sounds ([#3287](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3287))
* SepiaOulomenohn - Updated the Smooth Latex Mask to have coverage options ([#3314](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3314))
* remiliacn - Updated the Futuristic Vibrator to allow CJK commands ([#3316](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3316))

### [Fixed]

* Estsanatlehi - Fixed chat command autocomplete triggering twice under some circumstances ([#3313](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3313))
* Sidious - Changed the rate-limiting error message to be more descriptive ([#3290](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3290))
* Sidious - Fixed a rate-limiting error in the nursery when asking for more restraints ([#3310](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3310))
* Sidious - Fixed a crash when inspecting a combo lock while your blindness level changed ([#3276](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3276))
* Estsanatlehi - Fixed an issue where the remote control menu button would not appear for some eligible items ([#3335](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3335))

### [Technical]

* Technical changes, fixes and improvements:
  * Nina - [#3275](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3275)
  * Aeren - [#3279](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3279)
  * Estsanatlehi - [#3294](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3294), [#3295](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3295), [#3288](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3288), [#3327](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3327), [#3340](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3340), [#3296](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3296)
  * remiliacn - [#3308](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3308), [#3312](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3312)
  * Sidious - [#3329](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3329)
  * Ellie - [#3347](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3347)

### [Beta Fixes]

* Nina - Added transparency to Bridle Gag and Unicorn Horn preview images ([#3326](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3326))
* remiliacn - Fixed long Chinese language text not wrapping properly ([#3325](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3325))
* Luna - Improved the multi-color support for the Bridle Gag ([#3324](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3324))
* Estsanatlehi - Restored the Vacbed Hairback hiding ([#3323](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3323))
* Estsanatlehi - Fixed the Bridle Gag's Pentacle Panel option not showing up ([#3321](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3321))
* Estsanatlehi - Fixed a missing dialog in the Bridle Gag options ([#3320](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3320))
* Estsanatlehi - Fixed item application playing sounds when setting was disabled ([#3319](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3319))
* Nina - Fixed an issue where you could not cancel private room security ([#3317](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3317))
* Estsanatlehi - Fixed an issue with the text on the Blinders menu of the Bridle Gag ([#3330](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3330))
* Sidious - Fixed an issue where the Latin letter c would get double-garbled and Cyrillic с would not get garbled ([#3331](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3331))
* Estsanatlehi - Fixed a bug preventing sounds from playing on targets of activities ([#3332](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3332))
* Luna - Fixed several issues with the Bridle Gag ([#3341](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3341), [#3346](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3346), [#3351](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3351))
* SepiaOulomenohn/Shion - Fixed several issues with the Habit ([#3348](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3348))

## [R78]

### [Added]

* Luna - Added 4 new front hairstyles ([#3266](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3266), [#3269](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3269))
* Natsuki - Added two new restaurant backgrounds for chatrooms ([#3265](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3265))
* SepiaOulomenohn - Added 3 new items ([#3254](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3254), [#3264](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3264), [#3267](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3267), [#3274](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3274))
  * Medical Patches (head)
  * Smooth Latex Mask (head)
  * Glitter (clothing accessory & mask)
* Ayesha - Added a new sleeveless Slim Latex Leotard item (bra & suit slots) ([#3255](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3255), [#3268](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3268))
* Gnarp - Added two new necklace items ([#3232](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3232))
  * Rope Necklace
  * Tattoo Choker

### [Removed]

* Nothing this release

### [Changed]

* Gnarp - Updated the ceiling rope ([#3238](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3238))
* Pjara Yuzu - Updated the Chinese translations ([#3249](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3249))
* Karamel - Extended the allowed maid uniforms ([#3260](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3260))
* Karamel - Updated the maid cafe to allow access to bound maids for refills ([#3261](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3261))

### [Fixed]

* Nina - Fixed an issue where the steampunk and leather corsets could have a hole ([#3273](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3273))
* Estsanatlehi - Fixed a bug where steel ankle cuffs had a missing tag for the chain attached variant ([#3246](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3246))
* Estsanatlehi - Fixed an issue with non-text keys triggering the typing status indicator ([#3248](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3248))
* Sidious - Fixed a crash in the game's renderer ([#3250](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3250))
* Estsanatlehi - Fixed a bug in magic battles that could softlock the game ([#3257](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3257))
* Estsanatlehi - Fixed a bug that prevented reclothing in the photo room ([#3259](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3259))
* Estsanatlehi - Fixed a number of bugs in the Stables ([#3241](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3241))
  * Not accounting for the player's money before subtracting
  * The player's initial outfit getting overwritten under certain conditions
  * A dialog bug meaning you could join the Trainer's Guild ($500) multiple times
  * The dialog talking about a bridle when you stopped the training as a Trainer
* Nina - Fixed an issue where some clothing could prevent the removal of an already equipped item ([#3262](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3262))
* Karamel - Fixed an issue where the cafe maid would not handle multi-layered gags correctly ([#3270](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3270))
* Estsanatlehi - Fixed an issue with the positioning of the steel ankle cuffs ([#3271](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3271))

### [Technical]

* Technical changes, fixes and improvements:
  * Ellie - [#3247](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3247)
  * Estsanatlehi [#3253](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3253), [#3256](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3256), [#3252](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3252)
  * Sidious [#3258](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3258)

### [Beta Fixes]

* None


## [R77]

### [Added]

* Ada - Kinky Dungeon update - see the [Kinky Dungeon changelog](Screens/MiniGame/KinkyDungeon/Changelog.txt) ([#3184](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3184), [#3218](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3218), [#3220](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3220), [#3227](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3227))
* Estsanatlehi - Players can now access their wardrobe from the dialogue menu when clicking themselves ()
* Karamel - Added multi-color support to the Maid & Maid Exposed outfits, Frilled Sleep Mask, and Maid Collar ([#3195](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3195))
* Verity - Added a new Harness OTN Plug Gag item ([#3205](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3205))
* Sidious - Added a new chat notification option for mentions of your character name ([#3197](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3197))
* Verity - Reworked the assets for the Kitty gags & blindfold, added multi-color support to them, and added a new Kitty Muzzle Gag item ([#3206](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3206), [#3215](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3215))
* Estsanatlehi - Sexual activities in the menu now have more specific labels to indicate what they actually do ([#3207](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3207))
* Sidious - Changed the vibrator remote button to display with an explanation tooltip when the player cannot use vibrators for any reason ([#3210](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3210))
* Sidious - Added previous buttons to the wardrobe saved slot menus ([#3221](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3221))

### [Removed]

* Nothing this release

### [Changed]

* Karamel - Changed the appearance of the dust assets in the Maid Quarters cleaning minigame, and allowed players to do the cleaning and serving when already bound (if wearing the maid outfit) ([#3180](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3180))
* Verity - Renamed the Kitty Mask Gag to the Kitty Mask, and removed the gag effect from it ([#3213](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3213))
* Estsanatlehi - Reworked the player dialogue menu when clicking on yourself ([#3193](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3193), [#3196](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3196))
  * Players can now access their wardrobe, view their profile, and access the "Character actions" submenu from the menu
  * Adjusting bondage/evasion skills, using your safeword, taking a picture, and playing Kinky Dungeon (when wearing a headset) have now been moved to the "Character actions" submenu when clicking on yourself
* Sidious - Room-level block categories are now saved for room recreation ([#3226](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3226))

### [Fixed]

* Nina - Fixed an issue where the Pet Bowl would change position according to the character's pose rather than staying on the floor ([#3188](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3188))
* Sidious - Fixed a bug where some chatroom visual settings would not get restored after entering and leaving sensory deprivation (colors, member numbers & enter/leave messages) ([#3192](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3192))
* Sidious - Fixed a bug where the Dental Gag in open mode had no gag effect when locked ([#3194](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3194))
* Estsanatlehi - Fixed an issue where the Bondage Harness & Full Bondage Harness items in the Panties slot would disappear in the legs closed pose ([#3203](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3203))
* Nina - Fixed an issue with some bras and corsets clipping through the Blouse item ([#3202](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3202))
* Sidious - Fixed an issue where changing a private room to public would not be saved properly on chatroom recreation ([#3201](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3201))
* Nina - Fixed an issue where the Bed & Crib could only be added if a character could close their legs ([#3200](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3200))
* Nina - Fixed an issue where the College chess game didn't strip skirts ([#3198](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3198))
* Verity - Cleaned up some visual artifacts in several emoticons ([#3208](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3208))
* Estsanatlehi - Fixed a bug where making a player admin in a LARP room could break the game for them ([#3199](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3199))
* Estsanatlehi - Fixed a bug where you would always be able to ask for a Pandora Padlock, regardless of whether or not you met the criteria ([#3214](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3214))
* Sidious - Fixed a bug where the speed of the smooth zoom feature in chatrooms was dependent on frame rate ([#3219](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3219))
* Estsanatlehi - Fixed a crash that could occur when entering an already running LARP room ([#3224](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3224))
* Estsanatlehi - Fixed the alignment of most lower suit items in the legs spread pose ([#3225](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3225))
* Verity - Fixed a visual issue with the player body in the handcuffed pose ([#3244](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3244))
* Estsanatlehi - Fixed some issues with the Automatic Shock Collar & Shock Unit ([#3242](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3242))
* Sidious - Fixed a crash when entering the College in a colored skirt ([#3243](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3243))

### [Technical]

* Technical changes, fixes and improvements:
  * Estsanatlehi - [#3103](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3103), [#3216](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3216)
  * Nina - [#3204](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3204)
  * Sidious - [#3223](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3223), [#3230](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3230)

### [Beta Fixes]

* Sidious - Fixed an issue where the new character status could get displayed under the wrong characters when in VR ([#3229](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3229))
* Sidious - Fixed the wardrobe status icon not displaying when accessed via the character dialogue option ([#3231](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3231))
* Nina - Fixed a bug where the game could crash in single-player areas ([#3237](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3237))
* Estsanatlehi - Fixed names for the chain layer on the Futuristic leg & ankle cuffs ([#3236](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3236))
* Estsanatlehi - Fixed the Witch Skirt disappearing in some poses ([#3235](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3235), [#3240](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3240))
* Estsanatlehi - Fixed a visual issue with the Reverse Bunny Suit ([#3234](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3234))

## [R76]

### [Added]

* Ayesha - Added a new Medical Bed item, which can be obtained (as either a nurse or a patient) from the Asylum ([#3126](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3126))
* Ayesha - Added multicolor support to the Thin Leather Straps ([#3133](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3133))
* fleisch11 - Added "previous" button in item inventory ([#3147](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3147), [#3150](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3150))
* Estsanatlehi - Added option to spread legs with the Frogtie variant of the HempRope ([#3153](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3153))
* Ada - Kinky Dungeon update - see the [Kinky Dungeon changelog](Screens/MiniGame/KinkyDungeon/Changelog.txt) ([#3139](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3139), [#3168](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3168), [#3169](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3169), [#3170](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3170), [#3173](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3173), [#3174](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3174), [#3176](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3176), [#3178](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3178), [#3179](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3179))

### [Removed]

* Nothing this release

### [Changed]

* Ayesha - Improved Heart-Link Choker asset ([#3127](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3127))
* Nina - Split College uniform into the uniform and skirt in separate slots ([#3136](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3136))
* Estsanatlehi - Changed suitcase messages to better identify players ([#3129](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3129))
* Estsanatlehi - Allowed most previously hidden clothes to show while on Sybian ([#3148](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3148))

### [Fixed]

* Ellie - Fixed a typo in Asylum dialog ([#3146](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3146))
* Ellie - Fixed issue with Stockings in the Kneeling Spread pose ([#3145](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3145))
* Estsanatlehi - Removed stray pixel from the Scarf ([#3144](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3144))
* Estsanatlehi - Allowed to kneel spread with short collar rope/chain ([#3141](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3141))
* Estsanatlehi - Added missing label for the Futuristic Crate "Lid" layer ([#3149](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3149))
* Jomshir - Fixed beep notification disappearing quickly or not disappearing at all ([#3152](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3152))
* Jomshir - Fixed multiple possible crashes ([#3143](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3143), [#3142](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3142), [#3155](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3155), [#3156](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3156), [#3157](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3157), [#3181](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3181))
* Estsanatlehi - Fixed missing text for Fantasy block category ([#3158](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3158))
* Nina - Fixed missing character name when using Zipties ([#3159](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3159))
* Nina - Fixed some conflicting item combinations with Leg Spreader ([#3162](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3162))
* Nina - Fixed crash in chat search for new accounts ([#3166](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3166))
* Nina - Fixed getting stuck during room recreation ([#3167](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3167))
* Nina - Fixed zones without activities being displayed in preferences ([#3171](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3171))
* klorpa - Fixed several spelling mistakes across the game ([#3172](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3172))

### [Technical]

* Jomshir - Code cleanup ([#3154](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3154), [#3160](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3160), [#3161](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3161), [#3177](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3177))
* Nina - Added `OverrideAssetEffect` property to ignore base item effects ([#3164](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3164))
* Nina - Deduplicated assets in Hair & Hat slots ([#3165](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3165))

### [Beta Fixes]

* Nothing... yet

## [R75]

### [Added]

* Yuki - Added two new items ([#3096](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3096), [#3106](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3106))
  * Empty Glass (handheld item)
  * Filled Glass (handheld item)
  * Pet Nose (mask item)
* Nina - Improved the room filtering functionality (via the "Filter Rooms" button) to permit players to filter out rooms based on a list of terms (e.g. hide all rooms with "afk" in the name) ([#3102](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3102))
* Titania/Ellie - Added 3 new items ([#3109](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3109), [#3116](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3116))
  * Fuzzy Boots
  * Fuzzy Dress
  * Snowman (devices item)
* Emily R - Added a new Scarf item (cloth accessory) ([#3117](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3117))
* Titania/Ellie - Added a new set of tentacle items and restraints (tail strap/butt plug, garter, arm/leg/ankle restraints, gag & blindfold) ([#3119](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3119))
  * Players can now block "Fantasy" items when creating/administrating chatrooms. Currently this includes the new tentacle items, as well as the existing web items
* Natsuki - Added a new Plastic Wrap Roll handheld item ([#3121](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3121))

### [Removed]

* Nothing this release

### [Changed]

* Aeren - Modified the behaviour of the Catsuit to no longer hide nipple piercings ([#3097](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3097))
* Yuki - Changed the Bondage Bouquet to render underneath handheld items ([#3095](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3095))
* Manilla - Changed the Gagged Kiss activity to allow it to be used when the target zone is blocked ([#3094](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3094))
* Estsanatlehi - Changed the Frog-tie Straps to allow them to be used in the kneeling spread pose ([#3104](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3104))
* Ellie - Relaxed the restrictions on activities that are used on the alternate mouth and neck slots to permit activities that are usually available on the standard mouth/neck slots ([#3111](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3111))
* klorpa - Modified the spelling of certain words across the game for consistency ([#3028](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3028))
* Alfi - Modified the Nursery to permit a wider range of diaper items to be worn ([#3114](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3114))
* Ayesha - Increased the difficulties of the Thin Leather Strap variations ([#3128](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3128))

### [Fixed]

* Ellie - Fixed a bug where the Sleeveless Catsuit would disappear when wearing mittens ([#3099](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3099))
* Estsanatlehi - Fixed a bug where penetration activities could be used through gags ([#3098](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3098))
* Nina - Re-added the heavy blindness effect to the Ventless Locker (which was removed when the old locker items were merged) ([#3093](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3093))
* Nina - Fixed an issue where the `/ghostadd` command would not automatically add a player to the blacklist ([#3082](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3082))
* Ellie - Fixed a bug where owners could be unable to remove lover locks from their subs ([#3100](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3100))
* Ellie - Fixed an issue where lover rules would not show up in the active rules menu ([#3101](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3101))
* Ellie - Fixed an issue where the Sleeveless Wedding Dress would cause visual issues in the kneeling spread pose ([#3107](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3107))
* Ellie - Fixed a bug where mittens would prevent players from using the "Pet" activity ([#3110](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3110))
* Ellie - Fixed a bug where attempting to unlock the Password Padlock could cause errors ([#3115](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3115))
* Alfi - Fixed a dead end in the Nursery dialogue ([#3114](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3114))
* Jomshir - Fixed crashes that could occur when clicking in the Lover Chastity Belt's extended item screen ([#3113](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3113))
* Ada - Fixed a crash that could occur when spectating in the Kinky Dungeon minigame ([#3118](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3118))
* Estsanatlehi - Fixed a crash that could occur during chatroom background selection ([#3130](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3130))
* Emily R - Fixed the Latex Boxtie Armbinder, Armbinder Jacket and Bolero Straightjacket hiding parts of certain items ([#3132](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3132))
* Nina - Fixed an issue where the Admiral Top's shirt would disappear in the over-the-head pose for players with the small body size ([#3134](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3134))

### [Technical]

* Ellie - The extended item framework now permits a new archetype for vibrating items ([#3081](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3081))
* Technical changes, fixes and improvements:
  * Ellie - [#3072](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3072), [#3073](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3073)
  * Emily R - [#3108](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3108)
  * Jomshir - Code cleanup ([#3112](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3112))

### [Beta Fixes]

* Nina - Changed the character limit on the chatroom filter input from 20 to 200 characters ([#3123](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3123))
* Ellie - Fixed some errors in the changelog ([#3122](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3122))
* Ellie - Fixed a missing dialogue error when exiting the menu for the Futuristic Training Belt ([#3124](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3124))
* Ellie - Adjusted the difficulty and self bondage requirements for the Snowman ([#3125](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3125))
* Estsanatlehi - Fixed conflicting pose issue between the HempRope & FrogtieStrap ([#3137](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3137))
* Natsuki - Resized Plastic roll ([#3138](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3138))
* Jomshir - Re-added the heavy blindness effect to the Small Ventless Locker ([#3140](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3140))

## [R74]

### [Added]

* Rui - Added a new Scissors handheld item ([#3008](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3008))
* Ada - Updated the Futuristic Chastity Belt and added a new model for it ([#3029](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3029))
* Ada - Added several new lock-related features to the Futuristic Collar ([#3033](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3033))
* Ada - Added two new items ([#3035](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3035))
  * Sleeveless Catsuit (Upper Suit)
  * Catsuit Panties (Suit Lower)
* Estsanatlehi - Added multicolor support to the Clit Ring ([#3038](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3038))
* Nina - Added a trail to the cursor in Magic Puzzle battles (not available on mobile devices) ([#3037](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3037))
* Kaede/Daddy Daubeny - Added a new Fishnet Gloves item ([#3040](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3040))
* Emily R - Added "Hair in"/"Hair out" options to the Open Face Hood ([#3041](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3041))
* Estsanatlehi - Enabled mouth activities on the 2nd and 3rd mouth slots ([#2995](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2995))
* Titania/Ellie - Added four new items ([#3043](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3043), [#3057](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3057))
  * Bee Wings
  * Pixie Wings
  * Cyber Wings
  * Lampshade Hood
* Aeren - Added a version of the Steampunk Corset to the Corset clothing slot ([#3047](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3047), [#3053](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3053))
* Emily R - Added multicolor support to the Sneakers Light and Sneakers Dark shoe items ([#3056](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3056))

### [Removed]

* Nothing this release

### [Changed]

* Nina - Removed the trailing hyphen in the friend list when a friend is in an unknown private room ([#3039](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3039))
* Aeren - Modified the coloring behavior of the Fur Gloves and Fur Socks ([#3050](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3050))
* Estsanatlehi - Overhauled the kneeling spread pose (used for the Sybian) ([#3042](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3042))
* Ellie - Modified most hoods to address some clipping issues with other head items ([#3054](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3054))
  * This change also removed the restriction on the Sensory Deprivation Hood, Sealed Leather Hood and Open Hair Latex Hood, so that all three can now be used when hogtied or in the all fours pose
* Ada - Increased the difficulty of Irish 8 Cuffs ([#3067](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3067))

### [Fixed]

* Ada - Fixed an issue where the Futuristic Crate's pleasure module could phase through chastity belts ([#3031](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3031))
* Ada - Fixed a potential crash in the Futuristic Chastity Belt ([#3032](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3032))
* Ellie - Fixed a bug where timer lock unlock messages would randomly appear in chatrooms (thanks to Sidious for identifying the issue) ([#3034](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3034))
* Ellie - Fixed a bug where characters' hands would disappear in several poses when wearing a Catsuit, Seamless Catsuit or Pilot Suit ([#3045](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3045))
* Aeren - Tidied up some stray pixels in the Steampunk Wings assets ([#3046](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3046))
* Sidious/Estsanatlehi - Fixed a typo in one of the chatroom messages for the Sci-Fi Pleasure Panties ([#3051](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3051))
* Aeren - Fixed some clipping issues for certain items in combination with the Super Thick ABDL Diapers ([#3052](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3052))
* Ellie - Fixed a bug where the hands for the Asian and Black body types became disconnected from the body in the all fours pose ([#3054](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3054))
* Ellie - Fixed an issue where chastity piercings were impossible to remove ([#3055](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3055))
* Ada - Fixed a bug where Futuristic items could be modified by a non-Futuristic collar under certain circumstances ([#3059](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3059))
* Ada - Fixed missing chat messages for the Futuristic Ball Gag ([#3071](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3071))
* Ellie - Fixed several 404 errors that could occur when mounted on the Wooden Horse ([#3062](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3062))
* Ellie - Fixed some minor graphical artefacts on the Display Frame ([#3063](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3063))
* Ellie - Fixed a bug where the Techno Collar could emit `(MISSING PLAYER DIALOG: TriggerShock-1)` messages ([#3086](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3086))

### [Technical]

* Technical changes, fixes and improvements:
  * Estsanatlehi - [#3014](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3014), [#3020](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3020), [#3021](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3021)
  * Ellie - [#3024](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3024), [#3044](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3044), [#3060](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3060)
  * Aeren - [#3048](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3048), [#3049](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3049)

### [Beta Fixes]

* Ellie - Fixed an issue where open-backed chastity belts would prevent anal toys from being used ([#3064](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3064))
* Ada - Fixed the positioning of some Sleeveless Catsuit assets ([#3065](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3065))
* Jomshir - Fixed broken images on the Heavy Latex Corset ([#3068](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3068))
* Ellie - Fixed a bug where the Kigurumi Mask would hide blindfolds when in latex mode ([#3069](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3069))
* Ada - Fixed a bug where the Futuristic Collar would set the time on timer locks too high ([#3070](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3070))
* Ada - Added the Catsuit Panties to the panties slot ([#3075](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3075))
* Estsanatlehi - Fixed leg cuffs and boots appearing in the wrong place in the kneeling spread pose ([#3076](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3076), [#3079](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3079))
* Emily R - Fixed missing chatroom messages and menu issues with the Open Face Hood ([#3077](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3077), [#3085](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3085))
* Ellie - Fixed clipping issues on the large Sleeveless Catsuit in the boxtie pose ([#3080](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3080))
* Ellie - Fixed missing assets for the arms DuctTape item in the legs spread and Wooden Horse poses ([#3089](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3089))
* Ellie - Fixed an issue where the Futuristic Chastity Belt wouldn't allow vulva access for activities when the front was open ([#3088](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3088))
* Ellie - Fixed a bug where the Metal Leg Spreader wouldn't set characters' poses properly on first equip ([#3087](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3087))
* Ada - Fixed some missing chatroom messages for the Futuristic Chastity Belt ([#3092](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3092))
* Ellie - Fixed some missing dialogue in the arousal preferences screen ([#3090](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3090))

## [R73]

### [Added]

* Miku/Ace - Added a new V glasses item ([#2985](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2985))
* Sidious/Estsanatlehi - Adds settings to the Futuristic Vibrator to restrict the players whose voices it will respond to ([#2979](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2979))
* Ace - Added lower quality animation options to the graphics preferences ([#2958](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2958))
* Titania/Ace - Added a new animated Steampunk Wings item ([#2934](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2934))
* Titania/Rui - Added a new Net item (devices slot) ([#2993](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2993))
* Tsubasahane - Added Chinese translations for several parts of the game ([#2998](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2998))
* Estsanatlehi - Enabled the tickle activity on the neck zone ([#2999](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2999))

### [Removed]

* Nothing this release

### [Changed]

* Ada - Made lock picking only take one try when false set pins reset ([#2927](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2927))
* Aeren - Extended most suit items with gloved/non-gloved options ([#2972](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2972))
* diaperand - Tweaked some of the wording on the relog screen ([#2992](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2992))
* Estsanatlehi - Modified the Round Piercings to permit multi-coloring ([#2991](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2991), [#2996](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2996))
* Natsuki - Increased the payout of daily jobs, kidnapping contracts, maid jobs and the shop modeling job ([#2988](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2988))
* Ace - Made several enhancements to the chatroom creation screen ([#2922](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2922))

### [Fixed]

* Atasly - Fixed some graphical issues with the See-through Zipsuit and the preview image for the Safeword Padlock ([#2986](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2986))
* diaperand - Made some grammar fixes to the Nursery dialogue ([#2990](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2990), [#2989](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2989))
* Dordimar/Rui - Fixed several graphical errors with the Bows Dress ([#2994](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2994), [#3006](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3006), [#3025](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3025))
* Estsanatlehi - Fixed a clipping issue with back hairs 18 & 19 ([#3000](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3000))
* Ada - Fixed a few minor graphical issues with the Futuristic Chastity Belt ([#3003](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3003))
* Ellie - Fixed an issue where the language of the "Enter your username and password" text would be displayed in the wrong language ([#3007](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3007))
* Ellie - Fixed some errors in the chatroom messages for the Futuristic Straitjacket ([#3010](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3010))
* Ada - Fixed a bug where the Futuristic Mask wasn't properly disabling some mouth activities ([#3013](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3013))

### [Technical]

* Technical changes, fixes and improvements:
  * Nina - [#2975](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2975), [#2977](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2977)
  * Ace - [#2957](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2957), [#2962](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2962)
  * Ellie - [#2936](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2936), [#2931](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2931)
  * Sekkmer/Jomshir - [#1512](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1512)

### [Beta Fixes]

* Tsubasahane - Chinese translation fixes & edits ([#3005](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3005), [#3019](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3019))
* Ellie - Fixed an issue where certain item combinations could cause 404s in the console ([#3009](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3009))
* Rui - Fixed an issue where some items would clip through the new Net item when in suspension mode ([#3011](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3011))
* Aeren - Fixed several issues with the newly extended suit items ([#3012](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3012), [#3015](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3015))
* Estsanatlehi - Fixed a 404 error in the Round Piercings ([#3016](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3016))
* Ellie/Nina - Fixed a bug where characters could appear to never fully render ([#3022](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3022))
* Ellie - Fixed a bug where characters' faces would disappear when hogtied and wearing a Catsuit or Pilot Suit ([#3027](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/3027))

## [R72]

### [Added]

> ![Information](./Icons/Information.svg) There is a new page on [Player Safety](https://gitgud.io/BondageProjects/Bondage-College/-/wikis/Player-Safety) in the game's wiki,
containing safety & security tips for players. We'd encourage all players to give it a read.

* Daddy Daubeny - Added 2 new items ([#2846](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2846)
  , [#2864](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2864))
    * Bib (Cloth Accessory)
    * Pacifier Gag
* Titania/Aeren - Added 7 new items ([#2848](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2848)
  , [#2856](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2856)
  , [#2867](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2867)
  , [#2887](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2887)
  , [#2923](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2923))
    * Grand Mage Dress (Clothing item)
    * 3 different flower crown items (Hat item)
    * Bulky Diaper & Poofy Diaper (Panties/Pelvis items)
    * Doll Box (Devices item)
* Rui - Added a new item: Bra Style 4 ([#2852](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2852))
* Natsuki - Added a new "Open Mummy" variation for the Duct Tape head item ([#2861](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2861))
* Aeren - Added a new Face Paint item ([#2844](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2844), [#2901](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2901))
* Natsuki - Added a new "Cut out" variation for the Duct Tape legs
  item ([#2866](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2866))
* Ada - Several futuristic item additions and improvements ([#2871](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2871)
  , [#2925](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2925))
    * New options for the Futuristic Crate
    * Added a new Futuristic Mask item
    * New options for the Futuristic Muzzle
* Titania/Ace - Added 7 new items ([#2875](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2875)
  , [#2876](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2876)
  , [#2903](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2903)
  , [#2882](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2882)
  , [#2884](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2884))
    * Pig Nose (Nose item)
    * Gag Necklace (Necklace item)
    * Bandana (Hat item)
    * Hula Skirt (Cloth Lower item)
    * Coconut Bra (Bra item)
    * Flower Garland (Necklace item)
    * Tutu (Cloth Lower item)
* lunamoon/Ace - Added 2 new items ([#2877](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2877))
    * Crotchless Latex Panties 2
    * Bow Panties
* Ada - Added graphical preferences to center players in chatrooms and to smoothly zoom chatrooms when players enter/leave ([#2874](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2874))
* Ace - Added multicolor support for the Foxy Mask in the hood slot ([#2895](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2895))
* Verity - Added two new Mobile Phone handheld items ([#2902](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2902), [#2929](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2929))
* Ace - Clicking on a worn piece of clothing in the wardrobe will now open its extended options menu if it has
  one ([#2898](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2898))
* Jomshir - Added the ability for owners to release their
  submissives ([#2537](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2537)
  , [Server #91](https://github.com/Ben987/Bondage-Club-Server/pull/91))
    * To release a submissive, you need to first remove any collar they might be wearing
* Ace - Added an icon to items to indicate when they are a limited permission item that you have access
  to ([#2905](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2905))
* Ada - Added a new multiplayer minigame that can be accessed from the Kidnapper's League ([#2878](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2878))
* Ayesha - Added 2 new items ([#2881](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2881), [#2896](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2896))
  * Techno Collar
  * Techno helmet
* Ace - Added the ability to view blocked categories from the chatroom admin screen, even for
  non-admins ([#2885](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2885))
* Ace - Several friend list/beep improvements ([#2886](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2886)
  , [#2893](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2893)
  , [Server #103](https://github.com/Ben987/Bondage-Club-Server/pull/103))
  , [#2930](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2930)
    * Ability to click on beeps to open them
    * New `/openfriendlist` chat command to open the friend list
    * Beeps can now show up as a chat message to help prevent missed beeps (can be toggled via chat preferences)
    * Option to hide room names from beeps
* Ace - Added previews to saved expressions ([#2904](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2904))
* Akita/Aeren - Added 10 new back hair variants ([#2908](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2908))
* Titania/Aeren - Added 2 new front hair variants ([#2908](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2908))
* Dordimar/Ace - Added multicolor support to the Bows Dress and the Summer Flower
  Dress ([#2912](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2912))
* Cecilia/Ellie - Added new all fours options to the Pet Suit & Pet Suit
  Exposed ([#2892](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2892)
  , [#2921](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2921))
* Ace - Added labels to private rooms so that they are marked as private, even when revealed to
  owners/lovers ([#2897](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2897)
  , [Server #104](https://github.com/Ben987/Bondage-Club-Server/pull/104))
* Ace - Room recreation now preserves the room's ban list ([#2914](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2914)
  , [#2916](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2916)
  , [Server #106](https://github.com/Ben987/Bondage-Club-Server/pull/106))
* Aeren - Added a new large variant of the Double Ended
  Dildo ([#2915](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2915))
* Ada - Added a new screen flash visual effect to shocks - controlled by the screen flash graphics
  preference ([#2918](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2918))
* Ada - Added a screen glow when wearing a vibrating item (configurable in graphics
  preferences) ([#2919](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2919))
* RedStacey/Ace - Added 2 new items ([#2924](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2924))
    * Fur Straitjacket (Arms item)
    * Fur Blanket Wrap (Devices item)
* Nina - Added a message to notify players when they can't use an item due to room blocking rules ([#2948](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2948))

### [Removed]

* Nothing this release

### [Changed]

* Daddy Daubeny - Moved the Teddy Bear Set to the Miscellaneous slot (players will need to re-buy the item) ([#2863](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2863))
* Ayesha - Modified the Vibrating Clit Egg to be a little bigger, and added multi-coloring ([#2865](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2865))
* Verity - Renamed the "Handheld Toys" item to "Handheld Items" ([#2900](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2900))
* Natsuki - Tweaked several money sources to increase the money players can earn from them ([#2872](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2872))
* Aeren - Improved some of the chat room messages for the Latex Strait Leotard ([#2907](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2907))
* Verity - Modified the shopkeeper's dialogue to refer to "items for hands" rather than "hand restraints" ([#2970](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2970))
* Estsanatlehi - Renamed the handheld rope coil items ([#2981](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2981))
  * "Rope Coil (Long)" is now "Long Coiled Rope"
  * "Rope Coil (Short)" is now "Short Coiled Rope"

### [Fixed]

* Nina - Fixed an issue where poker would report "One Pair" when it should be "High Card" ([#2860](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2860))
* Ada - Fixed a bug where the Futuristic Training Belt would not turn off properly ([#2862](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2862))
* Nina - Fixed a bug where players would receive a notification when someone with the same name as their owner entered
  the room ([#2890](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2890))
* Nina - Fixed an issue where all asterisks were getting stripped from chat
  messages ([#2891](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2891))
* Nina - Fixed an issue with the arousal meter glow sometimes rendering in the wrong
  place ([#2894](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2894))
* Jomshir - Fixed an issue where text boxes would appear transparent on Android
  Chrome ([#2906](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2906))
* Ace - Fixed a crash that could occur when taking a photo with a popup blocker
  enabled ([#2883](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2883))
* Ace - Fixed a bug where names would not be hidden in activities when in sensory
  deprivation ([#2910](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2910))
* Ace - Fixed an issue which could sometimes cause the color picker to
  crash ([#2911](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2911))
* T-Bone Shark - Fixed some missing layer names for the Dildo Plug Gag & Futuristic Earphones, and fixed several
  chatroom action typos ([#2917](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2917))
* Jomshir - Fixed an issue where shared settings (e.g. item permissions, whitelist/blacklist changes) would not properly
  take effect immediately ([Server #97](https://github.com/Ben987/Bondage-Club-Server/pull/97))
* Ace - Fixed a bug where lovers would incorrectly be labelled as submissives in the friend
  list ([Server #99](https://github.com/Ben987/Bondage-Club-Server/pull/99))
* Ace - Fixed an issue where players would sometimes appear to repeatedly join/leave a
  chatroom ([Server #107](https://github.com/Ben987/Bondage-Club-Server/pull/107))
* Ace - Fixed a bug where clothing changes inside the wardrobe would be visible to other players in a chatroom ([#2951](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2951))
* Ace - Fixed a crash in the color picker that could occur when the item being colored was removed by someone else ([#2935](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2935))
* Ada - Fixed an issue with the Futuristic Training Belt's speech recognition functionality ([#2964](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2964))
* Nina - Fixed a bug where helping someone to kneel would reset their arm position to the default ([#2978](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2978))
* Nina - Fixed the grammar for the chatroom messages of several items ([#2976](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2976))

### [Technical]

* Ellie - Added a new npm script to run all Github checks locally [#2889](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2889)
  * Contributors with Node.js & npm installed can run checks locally by navigating to `BondageClub/Tools/Node` and running `npm run checks` (after running an `npm install` if necessary)
* Technical changes, fixes & improvements:
    * fleisch11 - [#2868](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2868)
    * Ace - [#2869](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2869)
      , [#2870](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2870)
      , [#2880](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2880)
      , [#2909](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2909)
      , [#2879](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2879)
      , [#2913](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2913)
      , [Server #108](https://github.com/Ben987/Bondage-Club-Server/pull/108)
      , [#2933](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2933)
      , [#2932](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2932)
    * Ada - [#2873](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2873)
      , [#2926](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2926)
    * Ellie - [#2888](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2888)
      , [#2920](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2920)
    * Jomshir - [Server #98](https://github.com/Ben987/Bondage-Club-Server/pull/98)
    * TessaTech - [Server #93](https://github.com/Ben987/Bondage-Club-Server/pull/93)

### [Beta Fixes]

* Aeren - Fixed a 404 error for the Grand Mage Dress ([#2938](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2938))
* Daddy Daubeny - Fixed a bug where all 3 versions of the Pacifier Gag needed to be bought individually from the shop ([#2941](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2941))
* Ace - Fixed a bug where the spiral backgrounds from the Techno Helmet and VR Headset would appear as room background options ([#2943](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2943))
* Ada - Fixed some incorrect dialogue for the Kidnapper's League NPC ([#2945](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2945))
* Verity - Fixed an issue with the handheld icon no showing up for the phone ([#2929](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2929))
* Verity - Fixed an issue where the handheld item rename wasn't working properly ([#2952](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2952))
* Ada - Balance adjustments for the new suitcase minigame ([#2947](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2947))
* Ada - Fixed an issue with the new minigame where the $ icon would only appear over a player if they were bound ([#2946](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2946))
* Ada - Fixed an issue where the chatroom camera function wouldn't work properly with the new chatroom centering option ([#2955](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2955))
* Ada - Fixed a crash in the new minigame ([#2954](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2954))
* Ada - Fixed a 404 error on the Futuristic Muzzle when locked ([#2953](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2953))
* Ellie - Fixed some clipping issues with the new Pet Suit options ([#2949](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2949))
* Ace - Fixed an issue with the Grand Mage Dress assets when hogtied ([#2944](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2944))
* Ace - Fixed a missing asset for the large Double Ended Dildo option ([#2942](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2942))
* Ace - Fixed a bug which could cause crashes when opening extended clothing in the wardrobe ([#2939](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2939))
* Ace - Fixed a missing chatroom message for the Futuristic Muzzle ([#2937](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2937))
* Ace - Fixed an issue where clicking on room names the friend list wouldn't work ([#2956](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2956))
* Daddy Daubeny - Graphical improvements to the Bib ([#2959](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2959))
* Ace - Fixed a 404 error for the Bib ([#2960](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2960))
* Ace - Changed the Fur Blanket Wrap to show feet/footwear ([#2961](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2961))
* Ada - Fixed a bug where the setting Futuristic Crate's intensity to low would turn it off ([#2965](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2965))
* Ellie - Fixed a bug where the pet suit in the all fours position would not hide gloves ([#2966](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2966))
* Ada - Fixed grammatical errors in the Futuristic Crate's chatroom messages ([#2967](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2967))
* Ada - Increased some of the cooldowns for the Futuristic Training Belt ([#2968](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2968))
* Ada - Fixed some missing lock icons on the Futuristic Bra ([#2969](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2969))
* Ada - Fixed a typo in the suitcase minigame ([#2971](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2971))
* Titania/Ace - Tutu asset fixes ([#2982](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2982))
* Nina - Renamed another reference to handheld toys ([#2974](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2974))
* Estsanatlehi - Fixed a crash when using the Techno Collar's shock module ([#2984](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2984))

## [R71]

### [Added]

* Ace/Dordimar - Added multi-coloring support to the Witch Hat ([#2756](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2756))
* Emily R - Added a "No shine" variant of Swimsuit style 1 ([#2760](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2760))
* Emily R - Added new Lingerie Shop and Red Sci-Fi Room backgrounds ([#2760](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2760))
* Ada - Added new graphics preferences for arousal screen filters ([#2767](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2767))
* gatetrek - Added 4 new items ([#2782](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2782), [#2786](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2786))
  * Laced Latex Top
  * Latex Laced Suit
  * Band 1 (bracelet)
  * High Thigh Boots
* Ace/Evals - Added a new Nipple Stretchers item ([#2781](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2781))
* Verity - Added a new Floral Panties 2 item ([#2769](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2769))
* Ace - Added support for different tag shapes to the Custom Collar Tag ([#2787](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2787))
* Ace - Added support for the hogtied pose to neck restraints (leashes, chains, etc.) ([#2790](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2790))
* Nina - Improved the favorite icons (and item ordering) to indicate whether the player or target (or both) have favorited an item ([#2794](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2794))
* Emily R - Added 6 new items ([#2783](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2783), [#2760](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2760), [#2833](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2833))
  * handheld Key item (hands)
  * Spiked Wristbands (bracelet)
  * Antennae (hair accessory)
  * Cat-Eye Glasses
  * Back hair Style 47
  * Lace Armbands (bracelet)
* RedStacey - Added 2 new items ([#2800](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2800))
  * Fur Coat
  * Fur Bolero
* Ace/Rui - Added a new animated Fuck Machine item ([#2785](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2785))
* Ayesha - Added a new Dragon Tail Strap item ([#2802](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2802))
* Ada - Kinky Dungeon update - see the [Kinky Dungeon changelog](Screens/MiniGame/KinkyDungeon/Changelog.txt) ([#2809](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2809), [#2816](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2816), [#2822](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2822), [#2824](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2824), [#2829](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2829))
* Natsuki - Added 2 new latex collar items ([#2831](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2831))
* Ada - Added new word-banning functions to the Futuristic Training Belt ([#2834](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2834))
* Emily R - Added multicolor support to the Student Black dress ([#2835](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2835))
* Verity - Added a new pouting mouth expression ([#2845](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2845))

### [Removed]

* Nothing this release

### [Changed]

* wildsj - Split the Duct Tape pet wrap variant into separate leg and arm variants ([#2757](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2757))
* Ada - Modified sensory deprivation so that player names show up if you are able to see them in VR ([#2766](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2766))
* Ada - Changed the formatting of shop item prices from "xyz$" to "$xyz" ([#2771](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2771))
* fleisch11 - Changed the formatting of item prices in NPC dialogues to be consistent with shop prices ([#2777](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2777))
* Ace - Changed the way NPC outfits are generated to allow for more variety ([#2764](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2764))
* Ada - Modified the Futuristic Training Belt to trigger based on the original chat message (rather than after stutter/garbling has been applied) ([#2789](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2789))
* Elda - Modified most bras to allow nipple piercing items to be visible underneath them ([#2793](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2793))
* Nina - Changed the wardrobe to support numbers in wardrobe slot names ([#2795](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2795))
* Ace - Reworked the Gas Mask to work in line with other similar items ([#2778](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2778))
* Sekkmer - Reworked the chat commands system and made several improvements to the `/help` command ([#2798](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2798), [#2805](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2805))
* Ace - Changed the Lovers Timer Padlock to allow owners to change the settings (provided they are allowed by lover rules) ([#2804](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2804))
* Kimei - Changed the Ceiling Chain so that it cannot be changed when locked (unless the player can unlock it) ([#2810](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2810))
* Elda - Modified the Duct Tape arms item to allow nipple piercing items to be visible underneath it ([#2836](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2836))
* Ace - Updated the chat message for the Duct Tape pet wrap in the arms slot ([#2839](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2839))

### [Fixed]

* Ace - Fixed some layering issues with the Latex Strait Leotard ([#2752](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2752))
* Ace - Fixed an issue where chatroom name garbling wouldn't work after a name change ([#2753](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2753))
* Ace - Fixed an issue with the chat admin screen remembering blocked category changes after cancelling ([#2759](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2759))
* Jomshir - Fixed a bug with some character dialogues in the private room ([#2765](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2765))
* Fixed an issue where the Futuristic Vibrator would crash some older browsers ([#2780](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2780))
* Ace - Fixed issues where players would have to buy the same item multiple times in the shop for some items ([#2774](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2774))
* Ace - Fixed an issue where the Suspension Cuffs allowed players to walk around ([#2772](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2772))
* Ace - Fixed an issue where bracelets would become invisible when wearing mittens ([#2768](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2768))
* Ace - Fixed an issue which allowed players to use console to add indefinite timers to the Futuristic Training Belt ([#2788](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2788))
* Ace - Fixed a few minor issues with several futuristic items ([#2796](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2796))
* Ace - Fixed a couple of issues with the Bit Gag ([#2797](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2797), [#2799](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2799))
* Ace - Fixed an issue where nipple clamps would render over the wedding dresses ([#2784](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2784))
* Ace - Fixed some missing color picker layer names, and added French translations for layer names ([#2803](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2803))
* Natsuki - Fixed a missing asset for the Plastic Wrap when kneeling ([#2811](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2811), [#2814](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2814))
* Ace - Fixed an issue where some maid items would never get removed from the player's inventory when they should ([#2813](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2813))
* Kimei - Fixed some 404 errors with the Vacbed Deluxe when locked ([#2830](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2830))

### [Technical]

* Jomshir - Changed the asset check (used for Github PR checks) to use TypeScript for improved type checking ([#2776](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2776))
* Technical changes, fixes and improvements:
  * Jomshir - [#2775](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2775), [#2821](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2821), [#2826](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2826), [#2827](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2827)
  * Ace - [#2763](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2763), [#2773](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2773), [#2762](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2762), [#2791](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2791), [#2779](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2779), [#2801](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2801), [#2825](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2825)
  * Sekkmer - [#2807](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2807), [#2819](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2819), [#2823](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2823)
  * Natsuki - [#2832](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2832)

### [Beta Fixes]

* Ace - Fixed a bug with the Fuck Machine not being dismountable ([#2837](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2837))
* Ace - Fixed a bug where the `/me` command wouldn't work when MU-style emotes are enabled ([#2838](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2838))
* Ayesha - Removed some potentially offensive dialog from Bondage Poker ([#2840](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2840))
* Ace - Fixed an issue where the some item combinations with the Fuck Machine which could make some items unremovable ([#2841](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2841))
* Natsuki - Fixed an oversight in the Inflated Latex Collar which prevented players from being able to nod their head ([#2842](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2842))
* Ace - Fixed the text for the Arousal Screen Filter preference where it would display "undefined" for some players ([#2843](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2843))
* Ada - Fixed a bug with Kinky Dungeon where it would not save the game state when leaving VR ([#2847](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2847))
* Ace - Fixed an issue with some missing layer names for the Gas Mask ([#2851](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2851))
* Ada - Fixed a bug where the game would load the wrong tileset when spectating kinky dungeon ([#2850](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2850))
* Ace - Fixed some 404 errors for the Custom Collar Tag lock ([#2853](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2853))
* Ada - Fixed a Kinky Dungeon crash ([#2855](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2855))
* Ace - Fixed a typo in private room dialogue where 2$50 should have been $250 ([#2857](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2857))
* Ada - Fixed a crash when spectating Kinky Dungeeon ([#2858](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2858))
* Kimei - Fixed an issue in the new chat commands where "Friendlist" was showing up as "Blacklist" ([#2859](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2859))

## [R70]

### [Added]

* Leila - Added functionality to remember chatroom input box text when disconnecting and relogging ([#2599](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2599))
* Ayesha - Added a new back hair style ([#2588](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2588))
* Emily R - Added multi-coloring and closed-crotch variants for the Cute Bikini and Demonique Bikini ([#2578](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2578))
* Aeren - Added extended options to the Strait Leotard to allow it to hide certain items ([#2585](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2585), [#2587](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2587))
* Aeren - Added a new "Mask Style" option to the Kigurumi Mask ([#2602](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2602))
* Ada - Deny mode on vibrators can now trigger ruined orgasms ([#2590](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2590))
* Ada - Several futuristic items now use remotes, and added a new Futuristic Training Belt item ([#2606](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2606), [#2609](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2609))
* Nina - Added a preference that allows players to prevent items from affecting their facial expression ([#2596](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2596))
* Kimei - Added buttons to the chatroom admin screen to allow players to quickly add their owner/lovers to the admin list ([#2581](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2581))
* gatetrek - Added 4 new items ([#2616](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2616))
    * Full Latex Bra
    * 2 leather garter belt items
    * Flower Bra
* Natsuki - Added a new Nylon Collar item ([#2607](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2607))
* Ada - Added a preference to the arousal preferences screen to disable advanced vibrator modes ([#2610](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2610))
* Ace - Added 2 new items ([#2614](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2614), [#2720](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2720))
    * Suspension Cuffs
    * Nipple Piercing Chain
* Ada - Added a new Futuristic Crate item ([#2620](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2620), [#2622](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2622))
* TuxyQ - Added a chat preference to allow `:` to be used for emotes ([#2591](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2591))
* Emily R/Rui - Added 3 new variations to the Serving Tray ([#2630](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2630))
* Ellie - Added a chat preference for font size ([#2632](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2632))
* Leila - Added a favorite color selection tool to the color picker ([#2634](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2634))
* Ace - Added a new Garters item slot ([#2629](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2629))
* Ace/gatetrek/Natsuki - Added new Cane/Crop mouth items ([#2628](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2628))
* Ace/Rui - Added a new Broom handheld item ([#2624](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2624))
* Ace - Added the ability to set items as favorites ([#2619](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2619), [Server #95](https://github.com/Ben987/Bondage-Club-Server/pull/95))
* gatetrek/EmilyFox - Added new Harem Pants/Harem Bra/Face Veil items ([#2642](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2642))
* Gnarp - Added a new Classic T-Shirt item with 8 different designs ([#2643](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2643))
* Verity - Added a new Blouse item ([#2645](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2645))
* Natsuki/Myna - Added 3 new Yacht-themed chatroom backgrounds ([#2647](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2647))
* Gnarp - Added a new eyes expression ([#2654](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2654))
* Lara - Added the Foxy Harness Gag to the second and third mouth slots ([#2655](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2655))
* Emily R - Added two new styles for the Chinese Long Dress ([#2657](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2657))
* Ace - Added new Antialiasing and Power Consumption graphical preferences for players with supported devices ([#2651](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2651))
* Rui - Added a new Short Plaid Skirt item ([#2664](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2664))
* Ace/Sybil - Added new Hitching Post and Kennel items ([#2667](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2667), [#2670](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2670), [#2682](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2682))
* Ace/Anonymous - Added a new Patterned Diaper item ([#2672](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2672))
* RedStacey - Added new Fur Headband and Fur Scarf items ([#2674](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2674))
* Manilla - Added support for the Rest Head activity to the breasts zone ([#2677](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2677))
* Ace/Myna - Added two new office-themed backgrounds ([#2679](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2679))
* Nina - Improved the item icon system, and added icons for lover-only/owner-only items ([#2680](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2680))
* Manilla - Added a new Key collar accessory ([#2687](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2687))
* Emily R - Added 2 new chatroom backgrounds ([#2691](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2691))
* Natsuki - Added a new Bracelet clothing slot and 3 new bracelets ([#2690](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2690))
* Rui - Added a new Gothic Collar item ([#2713](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2713))
* Ada - Added an extra Futuristic Bra variation ([#2723](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2723))

### [Removed]

* Nothing this release

### [Changed]

* Kimei - Changed the Ceiling Chain to allow it to be locked ([#2600](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2600))
* gatetrek - Graphical improvements for the Prison Lockdown Gag ([#2582](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2582))
* Nina - The "Show character in previews" wardrobe button state is now stored between browser sessions ([#2572](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2572))
* Jomshir/Claudia - Updates the chatroom admin icon with a sharper version ([#2571](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2571))
* Nina - Item permissions for "strong" locks can now be partially changed on extreme difficulty ([#2569](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2569))
* Kimei - Updated the `/afk` chat command to now toggle the AFK emoticon on and off ([#2631](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2631))
* Ace - Changed the wardrobe button in the appearance screen to display a more informative message for players that haven't purchased it ([#2625](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2625))
* Ada - Changed the "Disable examining when blind" preference to allow players to examine others when in the VR headset's virtual world ([#2575](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2575))
* Ada - Added a new immersion preference which allows players to only see other adjacent players in chatrooms when partially blind ([#2576](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2576))
* Ellie - Changed NPCs to allow them to select item variations when using items ([#2649](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2649))
* Lara - Improved the responsiveness of the Futuristic Vibrator ([#2683](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2683))
* Ada - Improved the responsiveness of several futuristic items ([#2694](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2694))
* Ada - Increased the number of times players can attempt locks with a lent lockpick ([#2696](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2696))
* Ace - Updated the Shock Collar animation to trigger a red light when the shock collar is activated ([#2712](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2712))
* Nina - UI improvements around sensory deprivation preferences ([#2734](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2734))
* Nina - Changed the behavior of the item permission screen to stay in permission mode when selecting another item slot ([#2737](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2737))

### [Fixed]

* Ellie - Fixed some missing chat messages when selecting tightness of the Collar Cuffs ([#2605](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2605))
* Ace - Fixed a bug where a certain dialogue in random club slave encounters could send players back to club management rather than the main hall ([#2604](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2604))
* Ace - Fixed a 404 error that occurred when the Clit Ring was locked ([#2603](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2603))
* Nina - Fixed a graphical issue in the dizzy eyes expression ([#2601](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2601))
* Ellie - Fixed an incorrect layer name for the Gas Mask rebreather in the color picker ([#2598](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2598))
* Nina - Modified the Bed so that items like pet suits and high heels no longer cause it to change position ([#2573](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2573))
* Kimei - Fixed a 404 error that occurred when the Pig Nose Hook was locked ([#2608](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2608))
* Nina - Fixed an issue where notifications would not trigger on friends joining a chatroom ([#2612](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2612))
* Kimei - Grammatical fixes for the Love Chastity Belt's chat messages ([#2613](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2613))
* Ace - Fixed an issue where anklets would render above wedding dresses ([#2617](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2617))
* Ace - Fixed an issue with the font size of the Light 2/Dark 2 chat themes on mobile devices ([#2611](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2611))
* Ace - Fixed an issue with the cushion when used in combination with suspension or certain other items ([#2615](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2615))
* Jomshir - Several fixes for a variety of items ([#2621](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2621))
* Emily R - Improved the Nurse Uniform to better fit characters in the over-the-head pose ([#2638](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2638))
* Ace - Fixed an issue where password managers could bypass the maximum character lengths in account creation ([#2636](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2636))
* Nina - Fixed a bug where the chatroom hide icon state would reset after entering submenus like the wardrobe ([#2633](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2633))
* Ellie - Fixed a bug that could cause crashes when being restrained by the maid in the Cafe ([#2627](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2627))
* Leila - Fixed several issues in the color picker ([#2639](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2639))
* Ace - Fixed an issue where the automatic shock unit could cause crashes ([#2644](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2644))
* Ace - Fixed a few issues with missing item chat messages ([#2646](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2646))
* Ellie - Added a mitigation for WebGL context lost errors (users should no longer need to refresh after receiving these errors) ([#2650](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2650))
* Ellie/Nina - Fixed a bug where NPCs would not be use several gag types ([#2653](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2653), [#2661](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2661))
* Ace - Fixed some 404 errors for missing catsuit zips ([#2673](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2673))
* Ada - Fixed a couple of issues with chatroom recreation ([#2693](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2693))
* Ace - Fixed a 404 error for the Futuristic Bra in the all fours pose ([#2706](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2706))
* Ace - Fixed an issue with the Wired Egg which prevented it from working properly ([#2709](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2709))
* Ace - Fixed an issue where certain assets for the Barefoot Sandals would not render ([#2718](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2718))
* Ace - Fixed an issue where the Collar Ropes would not render in several poses ([#2721](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2721))
* Nina - Fixed non-transparent areas of the Breast Binder's preview image ([#2727](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2727))
* Ace - Fixed a 404 error for the Bit Gag when locked ([#2730](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2730))
* Nina - Fixed several spelling mistakes across the game ([#2735](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2735))
* Nina - Improved several NPCs to better respect players' blocked item settings ([#2742](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2742))
* Ace - Fixed an issue where handheld items could fail to render or be incorrectly named when wearing some mittens ([#2742](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2742))

### [Technical]

* Ellie - Added validation to prevent players from adding certain impossible item combinations to others via console ([#2618](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2618))
* Ace - Performance optimizations for text drawing ([#2640](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2640))
* Ellie - Improvements to the API for typed extended items for better scripting/code suport ([#2637](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2637))
* Technical changes, fixes & improvements:
    * Ellie - [#2595](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2595), [#2597](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2597), [#2623](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2623), [#2622](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2626), [#2652](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2652)
    * Ada - [#2574](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2574)
    * Ace- [#2635](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2635), [#2656](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2656), [#2658](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2658), [#2659](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2659), [#2660](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2660), [#2662](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2662), [#2668](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2668), [#2669](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2669), [#2671](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2671), [#2675](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2675), [#2676](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2676), [#2678](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2678), [#2681](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2681), [#2684](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2684), [#2685](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2685), [#2688](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2688), [#2689](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2689), [#2731](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2731), [#2732](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2732)
    * Jomshir - [#2648](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2648), [#2663](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2663), [#2665](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2665), [#2666](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2666), [#2715](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2715), [#2716](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2716), [#2717](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2717)

### [Beta Fixes]

* Ace - Fixed the non-transparent background for the Key collar accessory preview image ([#2697](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2697))
* Nina - Allowed favorite items to be set on worn items and for players on extreme difficulty ([#2699](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2699))
* Nina - Fixed a bug that could cause crashes in the menu for several items ([#2700](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2700))
* Nina - Fixed a bug where favorite items that could not be used were not being greyed out in players' inventories ([#2701](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2701))
* gatetrek - Fixed a typo in the Harem Pants ([#2702](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2702))
* Nina - Fixed an issue where some items would clip through the Futuristic Crate ([#2703](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2703))
* Ace - Fixed an issue where handheld toys would clip with the Hitching Post ([#2704](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2704))
* Ellie - Adjusted font size settings so that "Medium" aligns with the previous default font size ([#2705](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2705))
* Nina - Fixed an issue where parts of the color picker would not update when selecting a color ([#2708](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2708))
* Ace - Adjusted the Kennel so that the door can always be opened ([#2710](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2710))
* Ace - Added a dialogue option in the shop to view the available garters ([#2711](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2711))
* Ada - Fixed a couple of issues with the Futuristic Training Belt ([#2714](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2714), [#2719](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2719), [#2749](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2749), [#2758](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2758))
* Ada - Fixed an issue where the Futuristic Crate would muffle players more than intended ([#2724](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2724))
* Nina - Fixed an issue where players would sometimes not be able to sell bracelets or garters back to the shop ([#2725](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2725))
* Natsuki - Fixed a bug where players would not be able to modify bracelets on other players ([#2726](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2726))
* Natsuki - Fixed some missing bracelet assets in the over-the-head pose ([#2729](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2729))
* Nina - Fixed an issue with manual color picker input ([#2733](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2733))
* Ellie - Fixed a bug where NPC-added items wouldn't render immediately ([#2736](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2736))
* Ada - Fixed a bug where the Futuristic Training Belt would not update properly when another player changed it ([#2738](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2738))
* Jomshir - Fixed a bug with text not loading properly on the relog screen ([#2739](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2739))
* Ada - Fixed some more clipping on the Futuristic Crate ([#2740](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2740))
* Ada - Fixed an issue with layer coloring for the Futuristic Chastity Bra ([#2743](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2743))
* Verity - Improved the preview image for the Blouse ([#2745](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2745))
* Ace - Fixed an issue with chastity belts which would allow players to modify them when locked ([#2746](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2746))
* RedStacey - Adjusted the positioning of the Fur Scarf ([#2748](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2748))
* Verity - Fixed some 404 errors with the Blouse ([#2751](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2751))
* Ada - Fixed an issue with ruined orgasms not working properly ([#2754](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2754))
* Ace - Fixed an issue where NPCs would use some item variants that could cause soft locks ([#2755](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2755))
* Ace - Fixed some missing text in the extended menu of the Futuristic ankle & leg cuffs ([#2761](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2761))
* Ace - Fixed some crashes that could occur in the Cafe ([#2770](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2770))

## [R69]

### [Added]

* Manilla - Added a new gagged kiss activity ([#2488](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2488))
* Sandrine - Added multicolor support to the Admiral Skirt, Pajama pants and Tennis skirt ([#2482](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2482), [#2475](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2475), [#2466](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2466))
* Leila - Added handling to the Futuristic Vibrator to support multiple commands in a single chat message ([#2458](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2458))
* Ellie - Added a Serving Tray item (visually identical to the Maid Tray), available to members of the Maid Sorority ([#2460](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2460))
* Natsuki - Added a "Detached" variation of the Bit Gag ([#2495](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2495))
* Jomshir/Claudia - Added a new set of steel ankle & arm cuffs and a steel collar ([#2493](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2493), [#2492](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2492), [#2491](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2491))
* Nina - Added multicolor support to the Admiral Top ([#2490](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2490))
* gatetrek - Added lots of new items ([#2467](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2467), [#2497](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2497), [#2541](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2541), [#2546](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2546))
    * Leather Straps (clothing accessory)
    * Leather Breast Binder (bra clothing/breast item)
    * Ankle Strap Shoes (shoes)
    * Shoe Style 4 (shoes)
    * Ribbons (torso, mouth)
    * Flower Panties (panties)
    * Summer Dress (clothing)
* Akita/gatetrek - Added a new Pet Tape variation for the Duct Tape arms item ([#2461](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2461))
* Nina - Added the ability to vary the height of the suspension hogtie variation of the Hemp Rope item ([#2483](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2483))
* Ada - Kinky Dungeon update - see the [Kinky Dungeon changelog](Screens/MiniGame/KinkyDungeon/Changelog.txt) ([#2428](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2428))
* Sandrine - Added a new Dental Gag item ([#2499](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2499))
* Ayesha - Added a set of new Silk Straps items (pelvis item, bra clothing, panties clothing, torso item) ([#2509](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2509), [#2511](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2511), [#2513](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2513), [#2515](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2515))
* Jomshir/Claudia - Updated the Floor/Ceiling Shackles graphics to work better with the new steel item set ([#2508](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2508))
* Manilla - Added stepping activities to the breasts, butt, neck, head and nose zones ([#2512](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2512))
* Nina - Added a new Animation Quality preference in Graphics preferences - currently only affects a handful of items ([#2532](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2532))
* Manilla - Added a "rest head" activity for resting heads in laps ([#2534](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2534))
* Ayesha - Added new Thin Leather Straps arm and torso items ([#2535](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2535), [#2540](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2540))
* Epona/Elda - Added a new Wet Floor Sign item ([#2543](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2543))
* Natsuki - Added a new Clear Vacbed item ([#2552](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2552))
* Ada - Made the Futuristic Heels also available as a clothing item in the shoes slot ([#2553](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2553))
* TessaTech - Added a new Vacuum Bed Deluxe item ([#2551](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2551), [#2555](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2555))
* Ada - Added some additional keywords that will trigger Futuristic item automatic shocks when used in emotes ([#2563](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2563))

### [Removed]

* Nothing this release

### [Changed]

* Nina - Made some UI improvements to the pagination buttons in extended item screens ([#2484](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2484))
* Sandrine - Modified the Vacbed to permit sexual activities on most zones ([#2500](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2500))
* Leila - Improvements to scroll position handling when resizing the browser window (chat should stay scrolled after resizing) ([#2523](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2523))
* fleisch11 - Modified the Bolero Straitjacket and the Prison Lockdown Suit to work better with some collars ([#2527](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2527))
* Jomshir - Modified chatroom interactions to remove the delay between clicking on another player and being able to interact with them ([#2529](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2529))
* Kimei - Modified the Blackout Lenses to no longer hide masks or glasses ([#2545](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2545))

### [Fixed]

* Ellie - Fixed an issue where stockings in the lower suit slot would block vulva access ([#2487](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2487))
* Ellie - Fixed an issue where some item updates would not persist after relogging ([#2485](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2485))
* Ellie - Fixed a bug where the "Remove item when the lock timer runs out" checkbox on timer locks wouldn't actually remove the item ([#2474](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2474))
* Ellie - Fixed an exploit which allowed console users to break other players' accounts and crash games when inspecting another player ([#2494](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2494))
* Jomshir - Fixed some clipping issues with the Ceiling Shackles ([#2508](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2508))
* Verity - Fixed some graphical issues with the preview images for several items ([#2507](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2507))
* Ada - Fixed some graphical issues with the Futuristic Mittens ([#2506](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2506))
* Rui - Added a missing asset for the Sleep Top ([#2502](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2502))
* Natsuki - Fixed some graphical issues with the preview images for several items ([#2516](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2516))
* Natsuki - Fixed an alignment issue between the upper and lower bodies in the "over the head" pose (the X-Cross pose) ([#2514](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2514))
* Sandrine - Fixed an issue where the Short Pencil Skirt would incorrectly hide several leg items ([#2530](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2530))
* Sekkmer - Fixed an issue that would sometimes make the login page credits disappear ([#2533](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2533), [#2539](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2539))
* Ellie - Fixed a bug where calling the maids for help in a chatroom wouldn't work under certain circumstances ([#2549](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2549))
* Ellie - Fixed a bug where item difficulty could increase indefinitely when switching between item variants ([#2567](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2567))
* Nina - Fixed a bug where players on extreme difficulty could use permissions mode for extended item variants ([#2570](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2570))
* Ellie - Fixed a few typos [#2583](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2583)
* Ellie - Fixed an issue with the Seamless Open Crotch Strait Dress not hiding skirts ([#2584](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2584))

### [Technical]

* Jomshir - Made some major optimizations to character drawing for suspended characters, and when blindfolded ([#2528](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2528))
* Sekkmer - Optimized character account updates to reduce server traffic ([#2297](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2297), [#2531](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2531))
* Ada - Added a new `/bot` chatroom command which sends a hidden chat message to players in a chatroom ([#2554](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2554))
* Technical changes, fixed & improvements:
    * Nina - [#2472](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2472)
    * Ellie - [#2477](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2477), [#2510](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2510)
    * Leila - [#2498](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2498)
    * Verity - [#2501](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2501)
    * Jomshir - [#2504](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2504), [#2519](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2519), [#2526](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2526)
    * Sandrine - [#2503](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2503), [#2517](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2517), [#2520](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2520), [#2524](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2524), [#2536](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2536), [#2538](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2538), [#2542](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2542), [#2548](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2548)

### [Beta Fixes]

* Ellie - Fixed a bug where players could use the Thin Leather Straps torso item through clothing ([#2557](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2557))
* Ada - Fixed some issues with the Kinky Dungeon spectator mode ([#2558](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2558))
* Ellie - Fixed a bug where inspecting the Bondage Bench on someone could cause errors ([#2556](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2556))
* Ellie - Fixed an issue with the Web arms item where its extended menu wouldn't work ([#2559](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2559))
* Ellie - Fixed an issue where certain items would not be hidden when combined with items that should hide them ([#2560](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2560))
* TessaTech - Fixed several issues with the Vacuum Bed Deluxe ([#2561](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2561))
* Ellie - Fixed an issue with the Sturdy Leather Belts arms item where its extended menu wouldn't work ([#2562](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2562))
* Nina - Fixed an issue where some skirts would appear to cause a seam between the player's hands and arms ([#2564](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2564))
* Ada - Fixed a bug with Kinky Dungeon persistence ([#2566](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2566))
* Jomshir - Fixed an issue where the Vacuum Bed Deluxe could be changed to the legs spread pose when a character's legs couldn't open ([#2568](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2568))
* gatetrek - Tweaked the Ankle Strap Shoes so that they render above jeans & fixed a typo in the extended menu for the Silk Straps torso item ([#2577](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2577))
* Sandrine - Modified the Dental Gag so it cannot be changed while locked (unless the player can unlock it) ([#2580](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2580))
* Jomshir - Fixed a crash that could prevent certain players from logging in whilst committed to the Asylum ([#2592](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2592))
* Jomshir - Fixed an issue which would cause the Ceiling Shackles to use display the wrong image when suspended ([#2586](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2586))
* Ellie - Fixed an issue that could cause crashes when interacting with extended items ([#2593](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2593))

## [R68]

### [Added]

* Manilla - Added new "Step" and "Giggle" activities ([#2344](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2344), [#2350](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2350))
* Natsuki - Added a new Hotel Bedroom chatroom background ([#2343](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2343))
* Verity - Added a new Bodice item ([#2328](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2328))
* fleisch11/Ayesha - Added a new Blanket Hood item ([#2327](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2327))
* Aeren - Added an earless variation of the Bunny Mask Filigrane item ([#2325](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2325))
* Nina - Added a new "behind hair" option to the Elf Ears ([#2349](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2349))
* Leila - Added a shock trigger to the Futuristic Vibrator ([#2354](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2354))
* Ada - Kinky Dungeon update - see the [Kinky Dungeon changelog](Screens/MiniGame/KinkyDungeon/Changelog.txt) ([#2356](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2356), [#2390](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2390), [#2404](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2404), [#2412](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2412), [#24147](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2417), [#2418](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2418), [#2425](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2425))
* Manilla - Added three new items ([#2360](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2360))
    * Clit Ring
    * Locking Vibrating Butt Plug
    * Tennis Ball (mouth item) ([#2394](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2394))
* Ada - Added a new "Custom Avatar" mode to the VR headset, which hides player restraints and allows players to dress themselves (if not restrained) ([#2342](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2342))
* Nina - Added the ability to filter notifications by message type (messages, whispers, activities) in player notification preferences ([#2364](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2364))
* Ada - Added an immersion preference to garble chatroom names and descriptions when blind ([#2363](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2363))
* Anna/Sandrine - Added a new Short Pencil Skirt item ([#2375](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2375))
* Sandrine - Added support for advanced vibrator modes to the Sybian and the Vibrating Spreader Dildo Bar ([#2379](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2379), [#2396](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2396))
* Manilla - Added support for the wiggle activity to the hand and feet groups ([#2377](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2377))
* Nina - Added a notification preference to display the notification count in the game's browser icon (favicon) ([#2384](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2384))
* fleisch11 - Added a graphics preference to allow the removal of blindfolds to trigger a temporary screen flash ([#2385](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2385))
* Ada - Added body size-specific assets to the Sci-Fi Pleasure Panties ([#2397](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2397))
* Ada - Added a new chat preference to allow shrink non-dialogue chat entries ([#2396](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2396))
* Emily R - Added a new School Hallway background, and made 5 existing backgrounds available in chatrooms ([#2339](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2339))
* Natsuki - Added a new set of Plastic Wrap bondage items ([#2398](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2398))
* Ada - Added a new set of opacity options to the Kigurumi Mask ([#2414](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2414))
* Ellie - Made the Futuristic Muzzle and Cage Muzzle available in all mouth slots ([#2416](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2416))
* Ada - Added a new Futuristic Heels item ([#2421](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2421))
* Ada - Added shiny options to the Futuristic Bra ([#2421](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2421))
* Nina - Added a "Show all zones" button for when the player is displayed too high to have access to all body zones ([#2442](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2442))
* gatetrek - Added a new set of ribbon-themed bondage & clothing items ([#2444](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2444))

### [Removed]

* Nothing this release

### [Changed]

* Ada - Changed the Kinky Dungeon minigame to be persistent, so you can leave the game and return to it without resetting progress ([#2331](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2331))
* Manilla - Modified most blindfolds to allow nose slot access when worn ([#2314](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2314))
* Nina - Hitting the escape key inside a preference subscreen now takes players back to the preference menu ([#2380](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2380))
* Ada - Changed the "Hide others' messages" immersion preference so that it now also applies to the "Hide names" sensory deprivation level ([#2403](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2403))
* Tyrsen - Changed the Latex Posture Collar gag to apply a gagging effect ([#2411](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2411))
* Nina - Rearranged and improved the behavior of some immersion preference screen controls ([#2420](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2420))
* Ada - Changed player leashing behavior to prevent players from leaving a chatroom if someone is holding onto their leash ([#2426](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2426))
* Sandrine - Updated the difficulties of some leg items ([#2452](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2452))
* Ada - Updated the graphics on several Futuristic items ([#2455](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2455))

### [Fixed]

* Jomshir - Fixed a crash in the friend list when opening the beep log after receiving a beep from someone that isn't in a chatroom ([#2346](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2346))
* Ellie - Fixed an issue with the Tongue Strap Gag where adding a lock would prevent the gag color from being applied properly ([#2345](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2345))
* Nina - Fixed an issue where players could not add member numbers to the high security padlock key list ([#2348](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2348))
* Ellie - Fixed an issue where loading wardrobe outfits would overwrite player expressions ([#2347](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2347))
* Ellie - Fixed a minor graphical issue with the Pearl Necklace ([#2352](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2352))
* Ellie - Fixed an issue where players could remove lover/owner locks from others using the console ([#2355](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2355))
* Sandrine - Added a missing chatroom entry for the arm zipties item ([#2376](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2376))
* fleisch11 - Cleaned up the taped hands body asset ([#2399](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2399))
* Ellie - Fixed an issue with text contrast against the background in some minigames ([#2408](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2408))
* Ada - Fixed an issue where players could get stuck on the chat search screen after attempting to rejoin a full chatroom ([#2427](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2427))
* Aeren - Cleaned up some visual artifacts in the style 1 & 2 swimsuits ([#2443](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2443))
* Ellie - Fixed an issue where semi-transparent items (notably the Fairy Wings & Halo) would cause graphical glitches for some users ([#2450](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2450))
* gatetrek - Fixed a bug with the Metal Leg Spreader which allowed it to be applied with items that forced the player's legs closed ([#2467](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2467))
* Ellie - Fixed a bug where player poses would not get updated properly after loading a wardrobe outfit ([#2470](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2470))
* Nina - Fixed an issue where multiple players inspecting the extended menus for certain items could cause appearance desyncs ([#2471](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2471))
* Ada - Increased the size of the combination input for the Safeword Padlock ([#2478](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2478))

### [Technical]

* Jomshir - Added a lint check to the code using ESLint - pull requests will now be checked against ESLint and linting errors will be highlighted ([#2286](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2286))
* fleisch11 - Added a check to prevent players from accidentally adding invalid skills/reputations via the console ([#2382](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2382), [#2386](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2386))
* Technical changes, fixes and improvements:
    * Ellie - [#2337](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2337), [#2333](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2333), [#2323](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2323), [#2383](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2383), [#2351](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2351), [#2388](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2388), [#2402](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2402), [#2407](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2407), [#2413](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2413), [#2415](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2415), [#2422](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2422), [#2423](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2423), [#2424](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2424), [#2429](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2429)
    * Nina - [#2308](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2308), [#2438](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2438)
    * Ada - [#2365](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2365), [#2447](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2447), [#2446](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2446)
    * Jomshir - [#2361](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2361), [Server #88](https://github.com/Ben987/Bondage-Club-Server/pull/88), [#2374](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2374), [#2373](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2373), [#2372](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2372), [#2371](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2371), [#2370](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2370), [#2369](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2369), [#2368](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2368), [#2367](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2367), [#2366](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2366), [#2378](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2378), [#2392](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2392), [#2393](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2393), [#2410](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2410)
    * TessaTech - [Server #89](https://github.com/Ben987/Bondage-Club-Server/pull/89), [Server #86](https://github.com/Ben987/Bondage-Club-Server/pull/86), [Server #85](https://github.com/Ben987/Bondage-Club-Server/pull/85), [Server #84](https://github.com/Ben987/Bondage-Club-Server/pull/84), [#2279](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2279), [#2278](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2278), [#2277](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2277), [#2273](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2273), [#2276](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2276), [Server #80](https://github.com/Ben987/Bondage-Club-Server/pull/80), [Server #83](https://github.com/Ben987/Bondage-Club-Server/pull/83)
    * Sekkmer/Jomshir - [#1476](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1476)
    * Sandrine - [#2391](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2391), [#2401](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2401)
    * Sekkmer - [Server #90](https://github.com/Ben987/Bondage-Club-Server/pull/90)

### [Beta Fixes]

* Ada - Modified the post-blindness flash to gradually fade out ([#2433](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2433))
* Ada - Fixed some graphical issues with the Futuristic Heels ([#2434](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2434))
* Nina - Fixed an issue with popup notifications that would cause crashes ([#2436](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2436))
* Ada - Several Kinky Dungeon fixes ([#2437](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2437), [#2448](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2448), [#2453](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2453), [#2456](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2456), [#2457](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2457), [#2480](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2480), [#2481](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2481))
* Leila - Added missing audio to the Futuristic Vibrator shock functionality  ([#2439](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2439))
* Manilla - Fixed an issue where players could equip/remove the clit ring through clothes ([#2440](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2440))
* Nina - Fixed an issue where the extended menu for the Bunny Mask Filigrane would cause crashes ([#2441](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2441))
* Ada - Fixed an issue with the item coloring functionality of the Futuristic Collar, and allowed it to color the Sci-Fi Pleasure Panties ([#2445](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2445))
* Ada - Modified the leashing system to break a player's leash when the leash holder disconnects ([#2449](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2449))
* Ellie - Fixed a bug where locking some gags would cause them to lose their gagging effect ([#2454](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2454))
* Natsuki - Modified the Plastic Wrap assets to be more form-fitting ([#2459](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2459))
* Ada - Fixed an issue with the Futuristic Vibrator not respecting players' gags ([#2462](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2462))
* Ada - Fixed a source of crashes in the Futuristic Collar ([#2463](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2463))
* Manilla - Fixed a bug where the breast & pelvis ribbons could be applied through clothes ([#2465](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2465))
* Nina - Fixed a bug which meant that NPCs would never make moves in chess ([#2473](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2473))
* Ada - Fixed an issues where owner/lover locks on leashes would make them impossible to user ([#2476](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2476))
* Ada - Fixed a bug where some items would trigger vibrator stimulation messages despite not being vibrators ([#2479](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2479))

## [R67]

### [Added]

* Nina - Added the ability to sell unwanted items back to the shop for half of the original purchase price ([#2245](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2245))
* Aeren - Added a new Sci-Fi Pleasure Panties item ([#2240](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2240))
* Natsuki - Added 2 new items ([#2235](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2235))
    * Pig Nose Hook
    * Nipple Plate Clamps
* Natsuki - Added a new "with blanket" option to the Pet Bed ([#2196](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2196))
* Nina - Added a new room block rule for arousal activities ([#2202](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2202))
* Brian Acker - Added several enhancements to the arrest scenario in the Cops & Robbers/Bad Girls feature ([#2170](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2170))
* Emily R - Added multicolor support to the Bunny Girl accessories, and support for hiding the collar/cuffs ([#2250](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2250))
* Nina - Added support for advanced item previews to more item slots ([#2195](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2195))
* Ada - Added a new single player Arcade room, and a Devious Dungeon minigame where players can earn money ([#2189](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2189), [#2261](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2261), [#2262](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2262), [#2294](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2294), [#2295](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2295))
* fleisch11/Ayesha - Added a new Wrapped Blanket item ([#2256](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2256))
* Ellie - Added enhanced lock interactions to the Combination Padlock when the player is blind or bound ([#2257](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2257))
* Ayesha - Added multicolor support to the leather arm/leg/ankle cuffs ([#2258](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2258))
* Jomshir/Claudia - Added a new Large Dildo item in the mouth slot ([#2268](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2268))
* Buizel333 - Added 3 new rear hairstyles ([#2270](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2270))
* Ada - Added a new Padded Blindfold item ([#2269](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2269))
* fleisch11 - Added the ability to save/load up to 5 facial expression presets from the expression menu ([#2265](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2265))
* Jomshir - Added a display of your position in the queue to the login screen when logging in whilst the server is under heavy load ([#2259](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2259))
* Emily R - Added a new Cushion item ([#2280](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2280))
* fleisch11 - Added a new exposed variant of the duct tape arms item ([#2282](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2282), [#2287](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2287))
* Ellie - Added support for the Wiggle activity to the nose and ear groups ([#2289](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2289))
* Jomshir - Added a "Reply" button when reading beep messages, and allows players to click on player names in their received beeps to directly search for the room that the beep was sent from (if the friend list was opened from the chat search screen) ([#2299](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2299))

### [Removed]

* Nothing this release

### [Changed]

* Nina - Changed the item selection menu messaging to indicate when you have no items in a particular group, rather than always saying "You cannot access your items" ([#2248](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2248))
* Nina - Changed the Metal Cuffs so that they default to the hands behind back position when applied by NPCs ([#2247](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2247))
* Nina - Changed the chess minigame so that there is now a 50% chance that the player will play as black ([#2231](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2231))
* Ada - Modified the VR Headset item to allow players to play the new Kinky Dungeon minigame when wearing one ([#2271](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2271))
* Ada - Changed the VR Headset's "Virtual World" option to allow players to see and whisper to other players that are also in the Virtual World ([#2283](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2283))
* fleisch11 - Modified NPCs so that they react to being put in chastity belts other than the metal one ([#2296](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2296))
* Ada - Renamed some sensory deprivation settings ([#2321](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2321))
    * "Total" is now "Heavy"
    * "Total (no whispers)" is now "Total"

### [Fixed]

* Nina - Fixed a navigation issue when using the escape key to leave the appearance menu ([#2249](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2249))
* Verity - Fixed an alignment issue with the 17/17b front hairs ([#2246](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2246))
* Jomshir - Fixed potential crashes with items that allow text customization ([#2239](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2239))
* fleisch11 - Fixed some graphical issues on the Inflatable Body Bag, Prison Lockdown Suit, Leg Binder and Seamless Leg Binder ([#2254](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2254))
* Nina - Fixed an issue where the arousal meter on NPCs wasn't working ([#2260](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2260))
* Ellie - Fixed a 404 error when wearing a locked Full Bondage Harness pelvis item ([#2288](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2288))
* Ada - Fixed an issue where a missing text message is displayed after the stand up/kneel minigame ([#2291](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2291))
* Ada - Fixed an issue with the VR Headset for players on light sensory deprivation settings ([#2290](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2290), [#2293](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2293))
* Ellie - Fixed a longstanding issue where the player's expression wouldn't get reset to default after expression changes triggered by items ([#2322](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2322))
* Sekkmer - Fixed an issue with the handling of chatroom enter/leave messages ([#2329](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2329))
* Ellie - Fixed an issue where the player's expression could get automatically reset to default after a manual expression change ([#2332](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2332))

### [Technical]

* Ellie - Rework of multiplayer appearance update validation for better consistency and reliability ([#2186](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2186), [#2255](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2255), [#2264](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2264))
* Ellie - Added a new framework for typed extended items - currently being piloted on the Latex Boxtie/Butterfly/Seamless leotards ([#2263](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2263))
* Sekkmer/Jomshir - Changed the way darkened background images are handled in several places in the game to remove the need for separate assets ([#2184](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2184))
* TessaTech - Split several server calls out into finer grained messages to reduce traffic ([#2272](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2272), [#2274](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2274), [#2275](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2275) [#2292](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2292), [Server #79](https://github.com/Ben987/Bondage-Club-Server/pull/79), [Server #81](https://github.com/Ben987/Bondage-Club-Server/pull/81), [Server #82](https://github.com/Ben987/Bondage-Club-Server/pull/82))
* Jomshir - Added login queueing functionality in order to improve server reliability after a server crash/restart ([Server #78](https://github.com/Ben987/Bondage-Club-Server/pull/78))
* Jomshir - Added support for socket.io rooms, which should improve the multiplayer reliability and performance ([Server #75](https://github.com/Ben987/Bondage-Club-Server/pull/75))
* Technical changes, fixes and improvements:
    * Ellie - [#2216](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2216), [#2212](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2212), [#2227](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2227), [#2251](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2251), [#2252](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2252), [#2266](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2266), [#2267](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2267)
    * Jomshir - [#2244](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2244)
    * Sekkmer - [Server #87](https://github.com/Ben987/Bondage-Club-Server/pull/87)

### [Beta Fixes]

* Ellie - Fixed some issues with the behavior of the extended item menu for the Bunny Girl Accessories item ([#2301](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2301))
* Ellie - Fixed issues with missing assets in the Kinky Dungeon minigame ([#2302](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2302))
* Ellie - Fixed a bug where appearance changes (in extended items or via the wardrobe) incorrectly get reverted in some cases ([#2304](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2304), [#2322](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2322), [#2326](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2326), [#2330](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2330))
* Nina - Fixed an issue where the text on the custom and electronic collar tags would occasionally revert to "Tag" ([#2305](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2305))
* Nina - Fixed several issues with the Sci-Fi Pleasure Panties ([#2306](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2306))
* Nina - Fixed an issue where timer locks would display NaN time remaining ([#2307](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2307))
* Nina - Fixed an issue with the ordering of multi-colorable item layers in the color picker ([#2309](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2309))
* Nina - Fixed a bug where "Dress Back Up" option was not working in kidnap battles ([#2310](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2310))
* Jomshir - Fixed an issue with whitelists that could result in player appearance desynchronization for limited items ([#2303](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2303))
* Nina - Fixed an issue where getting kicked from a chatroom whilst playing the Kinky Dungeon minigame would cause chatrooms to stop working ([#2315](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2315))
* Aeren - Fixed an issue with a duplicated click handler for the Pleasure Panties extended menu ([#2316](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2316))
* Ellie - Fixed an issue with appearance validation rollback ([#2317](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2317))
* Ellie - Fixed a bug where interacting with combination padlocks while wearing Futuristic Mittens in glove mode would prevent players from being able to manipulate the lock properly ([#2318](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2318))
* Ellie - Fixed an issue where the pet bed was not displaying chat messages when switching between blanket/no blanket ([#2320](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2320))
* Jomshir - Reverted a change to the friend list that sorted friends in alphabetical order ([#2335](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2335))
* Nina - Fixed an issue with the password screen of the Sci-Fi Pleasure Panties ([#2336](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2336))
* Jomshir - Reinstated the order of friends in the friend list ([#2335](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2335))
* Ellie - Fixed an issue with the removal of temporary expression changes ([#2332](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2332))
* Ellie - Fixed an issue where changes to certain items would get reverted when they shouldn't ([#2330](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2330))
* Sekkmer - Fixed an issue with the parsing of certain chatroom messages ([#2329](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2329))
* Ellie - Fixed some issues where appearance validation was allowing incorrect changes through ([#2326](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2326))
* Ellie - Fixed an issue where players would be unable to modify some timer lock properties ([#2341](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2341))
* Nina - Fixed an issue where selecting the "Wear the latex corset option" wouldn't work in the movie studio ([#2340](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2340))
* Ellie - Fixed a typo in the changelog ([#2338](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2338))

## [R66]

### [Added]

* Nina - Added a confirmation dialog when exiting the club ([#2142](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2142))
* Ada - Added stimulation messages for gags ([#2136](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2136))
* Ada - Added the ability to purchase lockpicks from the patient in the Asylum meeting hall ([#2132](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2132))
* Nina - Added a new Pole item ([#2126](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2126))
* Verity/Nina - Added a new front hairstyle ([#2124](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2124))
* Verity/Ellie - Added a new Long Skirt item ([#2147](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2147))
* Natsuki/Ayesha - Added new long/medium/short collar rope items ([#2059](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2059))
* Ada - Added two new struggle minigames ([#1990](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1990), [#2150](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2150), [#2165](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2165), [#2167](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2167), [#2183](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2183))
* Ada - Added three new items ([#2151](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2151), [#2163](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2163), [#2166](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2166))
    * Safeword Padlock
    * Electronic Tag
    * VR Headset
* Emily R - Added two new items ([#2144](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2144), [#2159](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2159))
    * Deluxe Mistress Boots
    * Camisole
* Emily R - Added 2 new front hairstyles and on new back hairstyle ([#2154](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2154))
* Jomshir - The Main Hall maid will now direct players to the changelog when first logging in on a new version ([#2052](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2052), [#2160](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2160))
* Emily R - Added multi-coloring support to the Gas Mask ([#2156](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2156))
* Ada - Added a new minigame for standing up/kneeling down when wearing leg restraints that would normally prevent it ([#1673](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1673))
* Jomshir - Added the ability to send messages with beeps ([#2158](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2158), [Server #69](https://github.com/Ben987/Bondage-Club-Server/pull/69))
* Natsuki - Added a new Bandanna necklace item ([#2169](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2169))
* Emily R - Added the ability to swap the eyepatch to the other eye ([#2177](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2177))
* Emily R - Added an option to extend the width of the metal leg spreader ([#2177](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2177))
* Ada - Added a restriction preference to bypass some NPC punishments ([#2175](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2175))
* Nina - Added several enhancements to the notification system, including optional desktop popups ([#2182](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2182))
* Nina - Added an improved view for player hair selection to allow the player to preview hairstyles ([#2185](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2185), [#2187](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2187))
* TessaTech - Added an "In front of body" variation of the metal cuffs ([#2194](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2194))
* Jomshir - Added a manual refresh button to the friend list ([#2233](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2233))

### [Removed]

* Nothing this release

### [Changed]

* Ada - Changed Futuristic Earphones so that they are now hidden by most hoods ([#2141](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2141))
* Nina - Improved the messaging when players try to auto-rejoin rooms that no longer exist ([#2139](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2139))
* Ada - Changed the chatroom message on the Futuristic vibrator when its mode is changed by a voice command ([#2135](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2135))
* Ellie - Modified the Vampire Coffin and Cryogenic Capsule so that they are now easy to escape from when open, even if locked ([#2146](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2146))
* Ada - Softened the punishment for calling the maids for help. They now use timer padlocks and no long block wardrobe access ([#2148](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2148))
* Ada - Changed the futuristic gags and shock collars to now trigger on certain emotes and activities ([#2149](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2149))
* Jomshir - Improvements to the chatroom player move interface ([#2047](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2047))
* Natsuki - Changed the neck rope to look slightly looser ([#2155](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2155))
* Ada - Modified the slowdown logic so that the Pencil Skirt no longer slows players down ([#2172](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2172))
* Nina - Changed the wardrobe to remember outfit names when modifying outfits ([#2191](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2191))
* Ben - Removed automatic refresh from the friend list due to performance issues

### [Fixed]

* Ada - Fixed an issue where players couldn't give others keys when wearing some non-restraining items ([#2134](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2134))
* Ada - Fixed some logic around lock-outs on futuristic items ([#2145](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2145))
* Ada - Fixed an issue where lockpicking remaining tries could be negative under certain circumstances ([#2164](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2164))
* Nina - Fixed an issue with the incorrect volume being used for some audio ([#2168](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2168))
* Ada - Fixed the input tab order in the password padlock ([#2176](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2176))
* Ada - Fixed some issues with arousal effects whilst in the lockpicking screen ([#2178](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2178))
* Ellie - Fixed an issue with leather armbinder locks appearing in the wrong place under certain circumstances ([#2179](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2179))
* Sekkmer - Fixed an issue with text overlap ([78bc29](https://github.com/Ben987/Bondage-College/commit/78bc293148e33f45f753f9ae647e7c51355b1f23))
* 4i0 - Fixed a typo in LARP ([#2188](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2188))
* Nina - Fixed an issue where player interaction options in chatrooms would overflow the height of the screen ([#2190](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2190))
* Ellie - Fixed an issue where the collar cuffs would prevent activities on the neck zone ([#2236](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2236))

### [Technical]

* Jomshir - Created a new item saving format to reduce server message sizes ([#2137](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2137), [Server #68](https://github.com/Ben987/Bondage-Club-Server/pull/68) [#2138](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2138))
* Technical changes, fixes and improvements:
    * Ellie - [#2119](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2119), [#2062](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2062)
    * Nina - [#2061](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2061), [#2161](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2161), [#2181](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2181)
    * Jomshir - [#2153](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2153), [#2129](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2129), [#2162](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2162), [Server 70](https://github.com/Ben987/Bondage-Club-Server/pull/70), [Server 71](https://github.com/Ben987/Bondage-Club-Server/pull/71), [#2171](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2171), [#2173](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2173), [#2180](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2180), [#2228](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2228)

### [Beta Fixes]

* Nina - Fixed an issue where notifications would still show up for messages when the player had message-hiding turned on in sensory deprivation ([#2197](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2197))
* Nina - Fixed an issue where the wooden sign would render above enclosing items like the wooden box ([#2198](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2198))
* Nina - Fixed an issue where the tie/untie chatroom messages for the Pole item were the wrong way around ([#2199](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2199))
* TessaTech - Fixed an issue where the behind back pose for the metal cuffs would add too much difficulty ([#2200](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2200))
* Nina - Fixed an issue where being kicked or leashed out of a chatroom could cause the game text to be misaligned ([#2201](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2201))
* Ada - Increased the frequency of gag-related stimulation messages from 10% to 30% ([#2203](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2203))
* Ellie - Fixed an issue where the "Virtual World" background would not render properly in the VR Headset ([#2204](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2204))
* Ada - Tweaked the stand up/kneel minigame so that it is slightly harder to stand up than to kneel ([#2206](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2206))
* Emily R - Fixed an issue where the new Camisole would render above several items that it shouldn't ([#2207](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2207))
* Ada - Fixed an issue where the Electronic Tag was not being colored by the Futuristic Collar ([#2208](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2208))
* Nina - Fixed an issue where the Deluxe Mistress Boots would cut holes out of the bed and other items ([#2209](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2209))
* Jomshir - Fixed an issue where new players would be shown the changelog on account creation ([#2211](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2211))
* DoberBit - Changed the Futuristic Gag to trigger for Cyrillic characters ([#2210](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2210))
* Ellie - Fixed an issue where the automatic shock unit would cause crashes when triggering ([#2213](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2213))
* Nina - Fixed some issues with notifications disappearing before being viewed, and notifications not working immediately after creating a new account ([#2214](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2214))
* Emily R - Fixed inconsistencies in the gagging effects of the Respirator Mask in the various gag slots ([#2215](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2215))
* Ada - Fixed an issue with the Futuristic Collar where remote blocking could be changed when the player was locked out, even if the open permissions setting was blocked ([#2217](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2217))
* TessaTech - Fixed an issue where adding the metal cuffs to a lover with no owner could cause the game to crash ([#2218](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2218))
* Nina - Fixed an issue where socks and shoes would appear in the incorrect pose when the player was hogtied or suspension hogtied whilst wearing a wide leg spreader ([#2220](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2220))
* Ben - Decreased the hourly rate for club slaves from $80 to $50, increased the weekly pay for club Mistresses from $100 to $150
* Ada - Fixed an issue with the VR Headset where the "Virtual World" background would only display on the top row in chatrooms with more than 5 players ([#2222](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2222))
* Ada - Fixed an issue with several leg-binding items no longer applying the slow effect ([#2223](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2223))
* Nina - Fixed an issue where the VR Headset's custom backgrounds would not be dimmed when the player's eyes were close ([#2224](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2224))
* Nina - Fixed an issue where suspension items would allow the player to kneel ([#2225](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2225))
* Nina - Fixed an issue with the bondage chess minigame where the player's clothes were being removed and items were being added when they shouldn't ([#2226](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2226))
* Nina - Fixed an issue with the chess minigame where players could move a piece during their opponent's turn, causing the game to crash ([#2230](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2230))
* Ellie - Fixed an issue where feet restraints would clip over the long skirt ([#2232](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2232))
* Nina - Fixed an issue where the top half of a chatroom would appear too dark when blindfolded/blinking ([#2234](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2234))
* Ada - Fixed an issue where the Futuristic Collar's "copy colors to items" feature would overwrite the light coloring on the futuristic gag items ([#2237](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2237))
* Nina - Fixed an issue with the handling of extended clothing items that could cause crashes ([#2241](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2241))
* Nina - Fixed an issue where some clothing items would be displayed incorrectly with certain pose combinations ([#2242](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2242))
* Ellie - Fixed an issue where the extended item menu for the Eyepatch could cause crashes ([#2243](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2243))

## [R65]

### [Added]

* Jomshir/Aeren - Extended player bios to officially support up to 10,000 characters, and increased the maximum length of chat messages to 1,000 characters ([#1967](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1967))
> ![Warning](./Icons/Warning.svg) **Important Note:** After migrating to the beta, switching back to R64 will cause your bio to appear garbled - subsequently changing your bio in R64 _will_ break your bio - please do not do this! You can still edit your bio in the beta without any issues.
* wildsj - Added a new Hollow Butt Plug item ([#1947](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1947))
* Emily R - Added a new option to the Vacbed to allow hair/accessories to be visible ([#1940](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1940), [#1984](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1984))
* Ellie - Added 5 new backgrounds ([#1932](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1932))
* Ada - Added a new Timer Password Padlock ([#1925](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1925))
* Sandrine - Refactored all remaining "simple" vibrators to use the new advanced vibrator modes ([#1918](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1918), [#1916](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1916), [#1915](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1915), [#1913](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1913), [#1911](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1911), [#1910](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1910), [#1909](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1909), [#1908](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1908), [#1903](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1903), [#1914](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1914))
* Ayesha - Added ceiling rope & ceiling chain items ([#1899](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1899))
* Ada - Added a new feature to the Futuristic Collar to allow it to prevent remotes from being used on the wearer ([#1890](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1890))
* Ellie - Added support for variable opacity & custom text to the Wooden Box and Transport Box ([#1931](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1931), [#2026](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2026))
* Ada - Added seven new items ([#1963](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1963), [#2018](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2018), [#2023](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2023), [#2021](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2021), [#2028](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2028), [#2037](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2037), [#2054](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2054))
    * Grill
    * Spatula handheld toy
    * Futuristic Earphones
    * Futuristic Ballgag
    * Futuristic Vibrator
    * Kigurumi Mask
    * Futuristic Straitjacket
* wildsj - Added multicolor support to the Latex Strait Leotard, allowing it to be colored in the style of a bunny suit ([#1922](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1922))
* Nina - Added chatroom and beep notifications, displayed in the browser tab title (configurable from player preferences) ([#1904](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1904), [#2049](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2049))
* Ada - Added lockpicking functionality to some locks ([#1675](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1675), [#1965](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1965), [#1972](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1972), [#1964](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1964), [#1980](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1980), [#1986](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1986), [#1988](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1988), [#2001](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2001), [#2016](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2016))
    * Lockpicking requires a lockpick, which you can obtain from the shop
    * You have to set the pins of the lock in the right order by clicking them
    * You have a limited number of chances before you have to start over, but the pin order stays the same regardless of how many times you reset
    * Pins are likely to false set, but they have a chance to reset as you try to pick other pins, thus obfuscating the correct order
* Jomshir/Claudia - Added a Floor Shackles item & added suspension support to the Ceiling Shackles ([#1968](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1968), [#1976](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1976))
* Ayesha - Added 10 new handheld toys ([#1960](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1960))
* Ellie - Added a new Halo cosplay item ([#1954](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1954))
* Nina - Added a color picker button to the clothing selection subscreen ([#1973](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1973))
* fleisch11 - Added controller support to the game (configurable in player preferences) ([#1835](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1835), [#2003](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2003), [#2006](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2006), [#2048](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2048))
* Natsuki - Added a new Pet Bed item ([#1978](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1978))
* Jomshir/Claudia - Added a new "Above Head" variation to the Wrist Shackles ([#1982](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1982))
* Ada - Added events when plugged/vibed, configurable from immersion preferences ([#1985](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1985), [#1997](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1997), [#2000](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2000))
    * Events can display chat messages (only visible to the player) and cause the screen to flash
* Nina - Added the ability for players to configure their item permissions even when a zone is currently blocked ([#1998](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1998))
* Jomshir/Claudia - Added a new Pet Bowl item with custom text support ([#2008](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2008))
* Ellie - Added pantyhose and stocking items to the Suit Lower slot ([#2009](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2009))
* Nina - Added left/right scroll buttons to the character appearance screen ([#1979](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1979), [#2011](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2011))
* Nina - Added a new visibility button to chatrooms to allow icons, arousal meters and player names to be hidden ([#2013](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2013))
* Nina - Added a new camera button to chatrooms to allow players to take a snapshot of the current chatroom ([#2014](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2014), [#2050](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2050))
* Ada - Added a new immersion preference to hide chatroom activities and actions when in sensory deprivation ([#2020](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2020), [#2042](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2042))
    * If your sensory deprivation level is set to "Total" or higher, this will also hide chat messages unless they involve you
* Ada - Added a new "Noise-Cancelling" option to earbuds and headphones ([#2019](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2019))
* Firefly - added multi-coloring support to the crib, along with several other improvements ([#2027](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2027))
* Aeren - Added extended item support to player wardrobes ([#2015](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2015))
* Ellie - Added multi-coloring to the blackout lenses, as well as better support for blinking/winking ([#2025](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2025))
* Ada - Added support for colorable locks to all Futuristic items ([#2041](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2041))
* Cecilia/Ellie - Added a new Transport Jacket item ([#2046](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2046))

### [Removed]

* Nothing in this release

### [Changed]

* Nina - Changed the positioning of names in chatrooms to prevent letters with descenders (e.g. "g", "j", "q", "y") from being cut off ([#1945](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1945))
* wildsj - Tweaked the positions of several tail/butt plug items to make more sense ([#1943](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1943))
* Sandrine - Changed the wooden sign so that it now displays above most items ([#1926](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1926))
* Ada - Changed the Futuristic Harnesses so that they will now render above the Futuristic Bra ()
* Nina - Changed the behavior of combination & password padlocks in extreme mode ([#1904](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1904))
    * These locks will now be usable by people on an extreme mode player's whitelist
* Ada - Changed the Hemp Rope crotch rope so that the "Over Panties" option no longer appears to sink into the panties ([#1983](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1983))
* Ada - Changed arousal meter visual effects to be more responsive ([#1987](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1987))
* Nina - Changed the dress icons in the Shibari Dojo, Gambling Hall and Asylum therapy rooms to better indicate that they redress the player ([#1996](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1996))
* Ellie - Modified the Wooden Box to better support the kneeling pose ([#1992](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1992))
* Nina - Changed the arm Hemp Rope and Chain items to default to the basic wrist tie (NPCs will still use the boxtie) ([#1995](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1995))
* Ada - Reduced the shock cooldown on the Futuristic Chastity Belt ([#2017](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2017))
* Nina - Changed the Wooden Sign to stop it from defying gravity when suspended ([#2038](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2038))
* Ada Changed sensory deprivation to replace names with "Someone" in emotes ([#2043](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2043))
* Ada - Combined the Futuristic Harnesses into a single item, and changed them to now render above the Futuristic Bra ([#1961](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1961), [#2041](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2041))
* Ada - Added the "Copy Colors" feature to the Futuristic Harness ([#2017](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2017))

### [Fixed]

* Ellie - Added resource retry logic, which should substantially reduce the chances of seeing "MISSING VALUE FOR TAG" and similar errors ([#1948](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1948))
* Emily R - Fixed some visual issues with the Flippers in combination with most full-body items ([#1940](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1940))
* Ellie - Fixed some graphical issues with the medium collar chain ([#1952](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1952))
* Sandrine - Changed the "up" button for kneeling/hogtied characters to line up with the expression menu buttons ([#1935](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1935))
* Ellie - Fixed an issue which would allow non-owners/lovers to add owner/lover padlocks to others via the console ([#1959](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1959))
* Ellie - Fixed a visual issue with the lock asset for the Futuristic Arm Cuffs in the yoked pose ([#1957](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1957))
* Ayesha - Reinstated default colors to several collars ([#1893](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1893))
* Ellie - Fixed an issue where players could not break up with a lover whose account no longer existed ([Server #63](https://github.com/Ben987/Bondage-Club-Server/pull/63))
* Ellie - Fixed an issue where changes to owner/lover rules would not be displayed in the target player's chat log ([#1966](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1966))
* tickler2000 - Fixed an issue where handheld toys sometimes displaying the same preview image for every toy ([#1977](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1977))
* Ellie - Fixed a bug where bed restraints would not be removed on relog with the bed, soft-locking the player ([#1975](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1975))
* Nina - Fixed an issue where the bed spread eagle variation of the legs hemp rope would prevent players from using their arms ([#1974](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1974))
* Emily R - Fixed some graphical issues with the Padded Mittens, Paw Mittens, Body Suits and Reverse Bunny Suits ([#2002](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2002))
* Ellie - Fixed an issue where limited permissions weren't being respected for handheld toys ([#2012](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2012))
* Ada - Fixed an issue with the Futuristic Collar which meant that anyone could change permissions on the collar ([#2024](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2024))
* Nina - Fixed an issue with the chatroom messages on the Tight Straitjacket ([#2036](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2036))
* Jomshir - Fixed a rendering issue when moving between rooms on devices with a slower connection ([#2032](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2032))
* Ellie - Fixed a bug where the expression reset button was resetting players' mouth color ([#2053](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2053))
* Ellie - Fixed an issue where players could not add/remove time from the Owner Timer Padlock ([#2056](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2056))

### [Technical]

* Jomshir - Added an asset-checking script to help identify and fix asset definition errors ([#1955](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1955), [#1962](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1962))
* Ellie - Added support for variable item opacity, and new slider controls ([#1931](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1931))
* Ellie - Added functionality to allow assets to be reused across items to reduce game bandwidth & memory usage ([#1936](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1936), [#1969](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1969))
* Nina - Reworked the menu buttons in the character appearance screen ([#1970](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1970))
* Jomshir - Optimized the handling of in-game text ([#1981](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1981), [#2030](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2030))
* Ellie - Reworked custom text functionality on several items into a series of utility functions to make it easier for contributors to add custom text to items ([#2022](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2022))
* Sekkmer - Added several optimizations to the game's drawing functions ([#1507](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1507))
* Jomshir - Reworked the chess minigame to address several issues, including the game causing disconnects on slower devices ([#2035](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2035))
* Ellie - Reworked the High Security Straitjacket's code into common functions to allow contributors to easily add other modular items ([#2045](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2045))
* Nina - Added new functionality to allow assets to be positioned absolutely rather than relative to the character ([#2084](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2084))
* Lots of technical changes, fixes and improvements:
  * Nina - [#1940](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1940), [#1923](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1923), [#1994](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1994), [#2007](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2007)
  * Ellie - [#1953](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1953), [#1989](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1989), [#1999](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1999), [#2005](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2005), [#2004](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2004), [#2010](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2010), [#2033](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2033), [#2031](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2031), [#2044](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2044), [#2051](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2051), [#2057](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2057)
  * Jomshir - [Server #64](https://github.com/Ben987/Bondage-Club-Server/pull/64), [#1958](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1958), [#1991](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1991), [Server #65](https://github.com/Ben987/Bondage-Club-Server/pull/65), [#2040](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2040)
  * Sekkmer - [#2034](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2034)
  * Ada - [#2055](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2055)

### [Beta Fixes]

* Jomshir - [Server #66](https://github.com/Ben987/Bondage-Club-Server/pull/66), [#2081](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2081), [#2083](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2083), [#2090](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2090), [#2094](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2094), [#2099](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2099), [#2112](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2112)
* Nina - [#2063](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2063), [#2064](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2064), [#2067](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2067), [#2069](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2069), [#2071](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2071), [#2084](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2084), [#2088](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2088), [#2089](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2089), [#2085](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2085), [#2087](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2087), [#2092](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2092), [#2095](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2095), [#2096](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2096), [#2097](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2097), [#2102](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2102), [#2104](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2104), [#2114](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2114), [#2116](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2116), [#2117](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2117), [#2125](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2125), [#2130](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2130)
* Ellie - [#2065](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2065), [#2066](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2066), [#2073](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2073), [#2074](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2074), [#2076](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2076), [#2082](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2082), [#2093](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2093), [#2098](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2098), [#2105](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2105), [#2106](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2106), [#2107](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2107), [#2108](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2108), [#2109](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2109), [#2113](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2113), [#2118](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2118), [#2122](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2122), [#2127](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2127), [#2131](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2131), [#2133](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2133)
* Sekkmer - [#2068](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2068)
* Ada - [#2070](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2070), [#2072](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2072), [#2077](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2077), [#2078](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2078), [#2080](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2080), [#2100](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2100), [#2103](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2103), [#2110](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2110), [#2120](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2121), [#2140](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2140)
* Natsuki - [#2079](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2079), [#2086](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2086), [#2091](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2091)
* TessaTech - [#2143](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/2143)

## [R64]

### [Added]

* Rui - Added several new items ([#1808](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1808), [#1814](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1814), [#1815](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1815), [#1805](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1805))
    * Latex Ankle Shoes
    * Strict Leather Pet Crawler
    * Elegant Heart Necklace
    * Noble Corset
* Emily R - Added a new whisper emoticon ([#1807](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1807))
* Rui - Moved corset clothing items into a new dedicated corset slot ([#1804](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1804))
    * Unfortunately this means that any corsets you previously owned in the bra slot will need to be purchased again
* Gnarp - Added spread eagle variations to the arm and feet hemp rope items, available when on a bed ([#1796](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1796))
* Nina - Added the ability to scroll to the bottom of the chat in a chatroom by pressing the `Esc` key ([#1792](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1792))
* Ada - Extended the ball gag, harness ball gag, and wiffle gag with additional visual options ([#1788](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1788))
* Ace - Added the ability to customize the degree of blindness that occurs when both eyes are closed ([#1784](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1784))
* Ada - Added several more new items ([#1756](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1756), [#1757](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1757), [#1758](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1758))
    * Futuristic Chastity Panties
    * Futuristic Breast Harness
    * Futuristic Harness
* Emily R - Added 3 new items ([#1817](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1817), [#1843](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1843), [#1857](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1857), [#1891](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1891))
    * Funnel Gag
    * Headphones
    * Flippers
* Nina - Allowed the pose menu to be used inside the photography room, and the ability to pose the photography room NPC ([#1764](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1764), [#1772](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1772))
* Sekkmer/Ellie - Added the ability for owners to add lover locks to subs with lovers ([#1387](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1387))
    * Players can now enforce some rules upon their lover(s), similar to owner rules
    * Lover rule: prevent/allow a lover from using lover locks on themselves - allowed by default
    * Lover rule: prevent/allow a lover's owner from using lover locks on her - allowed by default
* Ace - Added the ability inside your private room to choose the background of your private room or the main hall ([#1786](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1786))
* Cecilia/Ellie - Added two new items ([#1778](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1778), [#1860](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1860))
    * A set of medical bed restraints, which can be obtained (as either a nurse or a patient) from the Asylum
    * Vac-Cube
* Saya - Added the ability for players to change the game font through their graphical preference page ([#1799](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1799))
* Ada - Added functionality to allow room owners to block the use of player leashing within their rooms ([#1831](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1831))
* Aeren - Added 16 new player titles and tweaked the unlock requirements for certain titles ([#1713](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1713))
* Ada - Added an immersion preference that allows players to be returned to their previous chatroom upon relogging ([#1670](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1670), [#1836](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1836), [#1837](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1837), [#1839](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1839))
* Ayesha - Added a new Transport Box item ([#1795](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1795))
* Emily R - Added multicolor support to the Leather Hood ([#1843](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1843))
* Nina - Added a new graphics preference which will flip rooms vertically when the player is suspended upside down ([#1846](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1846))
* wildsj - Added multicolor support to the Harness Pacifier ([#1849](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1849))
* Jomshir - Added a new Ceiling Shackles item ([#1851](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1851))
* Ellie - Added the ability to add custom text to the Canvas Hood ([#1861](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1861))
* Ellie - Added new alternative light & dark chatroom themes ([#1862](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1862))
* Nina - Added multicolor support to the Kitty Butt Plug and the Fox Tails butt plug ([#1863](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1863))
* Leah - Added a new "Outside Cells" background for the Asylum ([#1884](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1884))
* Ellie - Added a "Reset to default" button to the color picker ([#1898](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1898))

### [Removed]

* Nothing this release

### [Changed]

* Sandrine - Most extended items have now been modified so that incompatible types are displayed in red ([#1511](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1511))
* Jomshir - Offline friends will no long appear in the first tab, but can still be seen in the third tab, where the delete buttons are ([#1773](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1773))
* Ada - Changed the post-struggle cooldown of the Futuristic Chastity Belt's shock function from 30 seconds to 15 ([#1834](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1834))
* tickler2000 - Extended the range of activities available on 18 items ([#1838](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1838), [#1848](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1848))
* Ellie - Coloring of blush, fluids and emoticons has been moved from the appearance menu to the expression menu ([#1853](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1853))
    * The left/right wink buttons in the expression menu have been merged into a single wink/blink button that cycles through the wink/blink combinations

### [Fixed]

* Wultir - Fixed an issue where being enclosed would not prevent you from being leashed out of a room ([#1810](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1810))
* Ellie - Fixed an issue with the login credits scrolling too fast at higher framerates ([#1809](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1809))
* Nina - Fixed an issue where a game crash on the login screen would cause your character's appearance to be randomized on next login ([#1789](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1789))
* Ellie - Fixed an issue that would cause the friends list not to work for new players until a relog ([#1816](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1816))
* Nina - Fixed a bug where the "( Character Actions )" dialogue option would not always show up when it should ([#1820](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1820))
* Sandrine - Fixed an issue with the magic club where equipping the adult baby harness with mitten chain could leave characters in an inconsistent state ([#1037](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1037))
* Ace - Fixed an issue where players' preferences would not get initialised until after visiting the preferences page ([#1743](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1743))
* Wultir - Fixed an issue where players with owner/lover locked leashes could be leashed out of rooms by non-owners/lovers ([#1801](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1801))
* Ace - Fixed some edge case issues in the pose system which would allow incorrect poses under certain conditions ([#1806](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1806))
* Ada - Fixed some graphical issues with lock icons on the Futuristic Ankle Cuffs ([#1832](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1832))
* Ellie - Fixed clipping issues with the Open Crotch Straitdress when worn over lower body clothing ([#1829](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1829))
* Nina - Fixed an issue when players get banned/kicked from a chatoom whilst in another screen ([#1841](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1841))
* Ellie - Fixed an issue with the Deny and Edge vibrator modes not working in combination with some items ([#1842](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1842))
* Nina - Fixed the longstanding issue of tails not being visible in the hogtied/all fours poses ([#1847](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1847), [#1868](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1868), [#1878](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1878))
* Jomshir - Fixed an issue where disconnects would sometimes result in the relog screen not working properly ([#1856](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1856))
* Nina - Fixed a bug where the photography studio NPC wouldn't pose correctly when telling her to relax her arms ([#1858](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1858))
* Nina - Fixed an error at the end of the stable exam ([#1864](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1864))
* Nina - Fixed some visual issues with the Magic Show's Water Torture Cell ([#1866](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1866))
* Nina - Fixed some missing text in the Halloween Monster and Familiar sets ([#1867](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1867))
* Nina - Fixed an exploit that allowed players to circumvent OOC being blocked ([#1900](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1900))
* Nina - Fixed an issue where players could sometimes not access the College despite wearing the correct clothes ([#1921](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1921))

### [Technical]

* Sandrine - Added a major performance enhancement to extended item screens ([#1511](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1511))
* Nina - Reworked the game's height system, allowing the creation of items that extend outside the character canvas. This will enable the creation of several exciting new items and features in this release and future releases ([#1844](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1844))
* Lots of technical changes, fixes and improvements:
    * Ellie - [#1798](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1798), [#1813](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1813), [#1821](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1821), [#1823](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1823), [#1830](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1830), [#1827](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1827), [#1854](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1854), [#1855](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1855)
    * Ada - [#1812](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1812), [#1790](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1790)
    * Sandrine - [#1818](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1818)
    * Rui - [#1822](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1822)
    * Nina - [#1825](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1825), [#1840](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1840), [#1845](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1845), [#1865](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1865)
    * Ace - [#1791](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1791)
    * tickler2000 - [#1850](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1850)

### [Beta Fixes]

* Ellie - [#1870](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1870), [#1871](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1871), [#1872](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1872), [#1882](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1882), [#1886](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1886), [#1897](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1897), [#1898](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1898), [#1901](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1901), [#1905](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1905), [#1906](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1906), [#1907](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1907), [#1919](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1919), [#1920](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1920), [#1924](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1924), [#1934](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1934), [#1937](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1937), [#1938](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1938), [#1939](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1939), [#1942](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1942)
* Ada - [#1874](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1874), [#1875](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1875), [#1876](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1876), [#1877](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1877), [#1880](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1880), [#1887](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1887), [#1902](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1902), [#1917](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1917), [#1927](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1927), [#1946](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1946), [#1950](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1950)
* Nina - [#1878](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1878), [#1879](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1879), [#1881](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1881), [#1883](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1883), [#1892](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1892), [#1894](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1894), [#1900](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1900), [#1912](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1912), [#1921](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1921), [#1944](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1944), [#1941](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1941)
* Jomshir - [#1889](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1889)
* Sandrine - [#1933](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1933)

## [R63]

### [Added]

* Verity/Nina - Added new Rope/Gag/Lock emoticons ([#1679](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1679))
* Ada - Added the option to open the front of the Futuristic Chastity Belt ([#1682](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1682))
* wildsj - Added multi-color support to the Puffy Dress ([#1678](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1678))
* Jomshir - Reworked the facial expression menu to make selecting facial expressions easier ([#1683](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1683))
* Sandrine - Added multi-color support to the Bit Gag ([#1697](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1697))
* Ada - Several improvements to the Futuristic Panel Gag ([#1687](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1687), [#1689](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1689)):
    * It now deflates one level at a time instead of all at once
    * Players can now change the deflation timer on the gag
    * Players can now manually pump the gag up by one inflation level
* Emily R - Added multi-color support to the Chinese Long dress and the Boots items ([#1699](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1699), [#1728](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1728))
* Ben - Added multiple difficulty modes that modify the multiplayer experience with varying degrees of strictness
    * Difficulty can be changed from the new "Difficulty" player preference screen
* Ada - Added a function to the Futuristic Collar to allow it to copy its colors to other worn futuristic items ([#1662](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1662))
* Sandrine - Added a dimming effect to chatrooms when a player has both of their eyes closed ([#1702](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1702))
* Evals/Ace - Added 2 new items ([#1703](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1703), [#1727](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1727))
    * Gwen Hood
    * Iron Cage Muzzle Gag
* Ada - Added the ability for players to be leashed into a different chatroom by friends when receiving a beep. This can be toggled on/off in the player's immersion preferences ([#1693](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1693))
* Jomshir - Reworked the friend list ([#1677](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1677))
    * Friends are now categorized by type, and offline friends will now be displayed
* Ben - Changed the friend list so that it now automatically refreshes every 30 seconds
* Emily R - Added 2 new items ([#1711](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1711), [#1734](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1734))
    * Heavy Latex Corset
    * Reindeer Hairband
* Aeren - Added a garterless option for the Latex Corset ([#1569](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1569))
* Ada - Added a 2 new items ([#1718](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1718), [#1715](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1715))
    * Pilot Panties
    * Futuristic Mittens
* Ada - Added an "Over Panties" option to the crotch rope ([#1716](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1716))
* Ada - Added a new Password Lock ([#1663](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1663))
    * Passwords can be up to 8 letters long, and the user can include a password hint
* Jomshir - Added an icon indicating when a player is a chatroom admin ([#1724](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1724))
* Ace - Added two new piercings - the Barbell Piercing and the Crossed Straight Piercing ([#1726](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1726))
* Gnarp - Added default colors to the bed and covers items ([#1729](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1729))
* Ada - The user of a Futuristic Collar can now allow other players to modify other futuristic items on the same player ([#1731](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1731))
* Ayesha - Added 2 new items ([#1732](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1732))
    * Barefoot Sandals
    * Left & Right Anklets
* Gnarp - Added multi-color support to the Rhinestone Sandals ([#1738](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1738))
* Ayesha - Added multi-color support to the nipple Taped Vibrating Eggs and the Latex Armbinder ([#1739](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1739))

### [Removed]

* Nothing this release

### [Changed]

* Ada - Changed the Futuristic Collar to now also lock itself when clicking "Lock" ([#1674](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1674))
* Ada - Changed whispers so that they are now blocked if you have disabled OOC when gagged ([#1671](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1671))
* Ada - Changed the password prompts on futuristic items to make them clearer ([#1686](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1686))
* Emily R - Modified the Snorkel to improve its positioning and coloring ([#1694](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1694))
* Ada - Modified the way chatrooms are rendered when the player is blind and the "Disable examining people when blind" preference is selected ([#1691](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1691))
* Ada - Modified the Futuristic Chastity Belt to also trigger outside of chatrooms ([#1690](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1690))
* Ada - Changed the Futuristic Chastity Bra to allow it to display a higher maximum heartrate ([#1701](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1701))
* Sandrine - Changed the Nursery so that it now recognises the player as being diapered if they are wearing any diaper items, and not just the default Diaper ([#1704](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1704))
* Wultir - Removed the item zone grid from players when coloring an item ([#1708](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1708))
* Ada - Changed the player arousal indicator to disappear when arousal reaches 0 ([#1712](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1712))
* Ada - Edited the Bolero Straitjacket and the Armbinder Jacket to improve coloring ([#1719](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1719))
* Wultir - Changed the Maid Quarters so that players can now do maid work in the exposed version of the maid outfit ([#1714](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1714))
* Ace - Changed posture collar items to block the nod/wiggle activities on the head ([#1794](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1794))

### [Fixed]

* Nina - Fixed a bug where players could no longer access the College, even with the correct uniform ([#1676](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1676))
* Ada - Fixed an issue with chatroom messages from the Automatic Shock Collar/Unit and Futuristic Panel Gag getting filtered by the automatic message filter ([#1680](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1680))
* Ada - Changed the Automatic Shock Collar and Futuristic Panel Gag to not get triggered by whispers ([#1681](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1681))
* Ada - Fixed an issue where the lock icon for the Futuristic Ankle Cuffs would be positioned incorrectly in the spread eagle pose ([#1685](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1685))
* Wultir - Fixed an issue causing activities to not show up under certain circumstances ([#1696](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1696))
* Ada - Fixed a duplicate dialogue option for the main hall maid when wearing an owner-locked item ([#1695](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1695))
* Ada - Fixed an issue where the Futuristic Collar would allow players to add a Mistress Lock to someone without needing to own one ([#1707](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1707))
* Wultir - Fixed an issue where ignored chatrooms would not be displayed in the chatroom filter when they were not on the first page of chatrooms ([#1720](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1720))
* Ellie - Fixed a rare issue which would cause the player to not be visible after entering a chatroom after relogging ([#1723](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1723))
* Ellie - Fixed a potential exploit where console users could crash other players' games ([#1733](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1733))
* Wultir - Fixed an error with the Shock Collar/Unit when the players shock themselves ([#1736](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1736))

### [Technical]

* Minor technical changes, fixes and improvements:
    * Ada - [#1684](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1684), [#1700](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1700), [#1705](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1705), [#1709](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1709), [#1710](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1710), [#1717](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1717), [#1722](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1722), [#1725](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1725), [#1730](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1730)
    * Sandrine - [#1706](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1706)
    * Wultir - [#1721](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1721)
    * Ace - [#1737](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1737)

### [Beta Fixes]

* Ace - [#1741](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1741), [#1745](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1745), [#1754](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1754), [#1759](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1759), [#1763](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1763), [#1765](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1765), [#1768](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1768), [#1769](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1769), [#1771](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1771), [#1767](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1767), [#1774](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1774), [#1779](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1779), [#1787](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1787), [#1803](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1803)
* Ada - [#1742](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1742), [#1744](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1744), [#1746](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1746), [#1747](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1747), [#1755](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1755), [#1760](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1760), [#1761](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1761), [#1802](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1802)
* Ellie - [#1749](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1749), [#1750](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1750), [#1753](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1753), [#1776](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1776), [#1781](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1781), [#1783](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1783)
* Emily R - [#1780](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1780)
* Jomshir - [#1748](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1748), [#1793](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1793)
* Nina - [#1751](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1751), [#1766](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1766), [#1770](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1770), [#1775](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1775), [#1777](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1777), [#1782](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1782)
* Wultir - [#1762](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1762), [#1785](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1785)

## [R62]

### [Added]
* Ada - Added several new items ([#1582](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1582), [#1588](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1588), [#1592](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1592), [#1589](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1589), [#1600](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1600), [#1608](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1608))
    * A new Pilot Suit
    * An Automatic Shock Collar and Automatic Shock Unit
    * New Futuristic Heels, Collar, Armbinder, Arm/Leg/Ankle Cuffs
* Ben - Added the ability to block item categories from rooms
* Victor Reed - Added a new Cryogenic Capsule item ([#1553](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1553))
* Emily R - Added several new items ([#1556](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1556), [#1640](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1640))
    * A Foam Sword handheld toy
    * New Latex Elbow Gloves
    * A new Open Face Hood item
* Ace - Added the variants of the Cow Tail and Bunny Tail items to the tail strap slot ([#1549](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1549))
* Ace - Added new import/export color buttons to the color picker to allow players to copy/paste color codes (feature may not be available in some older browsers) ([#1550](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1550))
* Wultir - Added the new vibrator modes to the taped clit & nipple eggs ([#1597](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1597))
* Ada - Added several new activities ([#1598](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1598), [#1628](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1628))
    * Moan/Whimper/Shout/Groan/Talk into Gag
    * Kiss on Gag
    * Wiggle
    * Nod
    * Sit
    * Struggle
* Nina - Overhauled the main player preferences page ([#1599](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1599))
* Ada - Added a "Request maid service" button to the main hall. The feature can be turned on in your General preferences ([#1564](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1564), [#1606](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1606))
* Ben - Added a leveling system to LARP, along with the ability to set longer turn timers
* Ada - Added the ability to temporarily suspend the main hall maid (available from the Maid Quarters) ([#1530](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1530))
* Ada - Added a new graphical indicator for when a character is being vibed - can be changed or turned off in Graphical preferences ([#1559](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1559))
* Ada - Added new Immersion preferences ([#1627](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1627))
    * A preference to prevent OOC chat when gagged
    * A preference to lock the Immersion preferences screen when the player is bound
    * A new "Total (no whispers)" sensory deprivation setting
* jomshir98 - Added a new "Light" sensory deprivation setting where player names will be visible and the blindfolds/hoods will never completely black out the screen ([#1635](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1635))
* Emily R/Nina - Added a new GP-9 Gas Mask item ([#1638](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1638), [#1639](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1639))
* Ben - Added some more story paths to the Movie Studio
* Emily R - Added a new latex room chatroom background, available in both normal chatrooms and the Asylum ([#1640](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1640))
* Nina - Added multi-color support to the Striped Socks and the College Uniform ([#1644](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1644), [#1643](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1643))
* Buizel - Added 21 new back hair styles ([#1660](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1660))

### [Removed]
* Ben - Removed the futuristic items from the random NPC pool
* Ben - Fixed an issue where players could not remove their NPC owner after auctioning themselves

### [Changed]
* Ada - Overhauled most of the futuristic items with several new features ([#1580](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1580), [#1586](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1586), [#1581](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1581), [#1604](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1604), [#1602](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1602), [#1607](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1607))
* Sandrine - Fixed and reworked difficulties on several gags for consistency ([#1590](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1590))
* Sandrine - Adjusted the difficulties on the Inflatable Strait Leotard. The maximum inflation level will now prevent players from leaving rooms ([#1570](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1570))
* Aeren - Renamed several dresses (these dresses will _not_ be filtered out by the ABDL filter)
    * Puffy Baby Dress -> Puffy Dress
    * Bows Baby Dress -> Bows Dress
    * Flower Baby Dress -> Summer flower dress
    * Shiny Baby Dress -> Shiny dress
* Nina - Changed the Open Hair Latex Hood to support multi-coloring (hair will default to the player's front hair color) ([#1613](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1613))
* Ayesha - Changed the vibrating dildo, Leather Choker and Leather Collar to support multi-coloring ([#1616](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1616), [#1622](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1622))
* Ben - Prevented players from manually equipping items when playing in a movie in the Movie Studio
* jomshir98 - Changed whispers to allow speech garbling ([#1620](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1620))
    * Added a new chat command `/ooc` to trigger OOC chat
    * Added chat preferences to trigger OOC chat with '(' and to automatically add '(' to the start of whispers
* Ben - LARP rooms will now show up in the regular chatroom search and rooms can be toggled between regular and LARP
* Ada - Moved some player preferences into a new Immersion preferences screen ([#1627](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1627)))

### [Fixed]
* Ada - Fixed an issue where the Interactive Visor prevented players from changing clothes whilst untinted ([#1583](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1583))
* Ellie - Fixed a bug where players were unable to change their skin color ([#1584](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1584))
* Ace - Fixed an issue that prevented players from kneeling when wearing the Concealing Cloak ([#1587](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1587))
* Ellie - Fixed some issues with gag effects on the Futuristic Panel Gags ([#1585](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1585))
* Ellie - Fixed an issue where the rope toe tie would play a lock sound when applied ([#1591](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1591))
* Victor Reed - Fixed an issue with the chatroom message for the Coffin [#1553](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1553)
* Ellie - Fixed an issue where typing certain colors into the color picker input would cause the color picker to crash ([#1603](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1603))
* Nina - Fixed an issue where helping someone to kneel wouldn't work under certain conditions ([#1609](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1609))
* Nina - Fixed an issue where chains would clip through the Strait Dress ([#1610](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1610))
* Nina - Fixed some visual issues with the Bolero Straitjacket ([#1611](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1611))
* Aeren/Rui - Fixed some visual issues with the Succubus Heart Tails ([#1612](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1612))
* Ben - Fixed some issues with LARP when players disconnect
* Nina - Fixed an issue where the handheld toys item would appear in the player's inventory, despite not owning any toys ([#1617](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1617))
* Nina - Changed the handheld toys so that both the player and target character's handheld toys are available to use ([#1604](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1604))
* Nina - Fixed an issue where vibrators set to "Edge" on certain zones would allow players to orgasm ([#1623](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1623))
* Nina - Fixed an issue with the Metal Leg Spreader and the Wooden leg cuffs when the target player was kneeling ([#1624](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1624))
* Ellie - Fixed an issue where changing the vibrator settings on the Mermaid Tail would cause its locks to fall off ([#1633](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1633))
* Nina - Fixed an issue where unlocking a gag would break the gag's speech garbling effect ([#1637](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1637))

### [Technical]
* Many technical changes, fixes and improvements:
    * Ellie - [#1591](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1591)
    * Ada - [#1593](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1593), [#1594](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1594), [#1596](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1596), [#1595](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1595), [#1631](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1631)
    * Nina - [#1613](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1613), [#1614](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1614), [#1615](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1615), [#1625](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1625), [#1634](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1634)
    * Sandrine - [#1449](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1449)

### [Beta fixes]

* Nina - [#1642](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1642), [#1649](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1649), [#1653](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1653), [#1655](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1655), [#1656](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1656), [#1658](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1658), [#1659](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1659), [#1665](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1665)
* Emily R - [#1646](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1646)
* Ellie - [#1647](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1647), [#1657](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1657), [#1664](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1664)
* jomshir98 - [#1648](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1648), [#1654](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1654)
* Ada - [#1650](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1650), [#1651](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1651), [#1652](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1652), [#1661](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1661)

## [R61]

### [Added]
* Ace - New custom collar tag ([#1324](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1324), [#1478](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1478))
* Ace - The key and lock necklaces can now be worn over clothes or tucked in via the 👆 icon in the wardrobe ([#1294](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1294))
* Ruu/Poi - 15 new room backgrounds ([#1383](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1383))
* Ellie - 5 new advanced vibrator modes on several vibrators ([#1327](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1327))
    *  New chat preference to hide automated messages that don't involve you in chatrooms (from automatic vibrator updates)
* Ellie - Added a blinking light to the shock collar ([#1325](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1325))
* Rui - Added several new items ([#1373](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1373), [#1445](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1445))
    * A new leather bolero clothing item
    * A new studded harness item, available in both the torso item and bra slots
* Ace - Made a version of the leather corset top available in the bra slot ([#1373](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1373), [#1445](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1445))
* Ace - Added the ability to view locked wardrobe groups (so you can view other peoples' hair etc. in a read-only mode) ([#1362](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1362))
* gatetrek - Added several new assets ([#1366](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1366), [#1426](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1426))
    * A pair of jean shorts
    * Cow print bra, panties, socks, gloves, and cow ears
    * A new cow tail butt plug
    * A pleated skirt
    * 2 new front hairstyles
    * A new set of eyes
    * 2 new tags for the oval collar tag
* Amiciaderune - Added the ability to edit the color of blush, emoticons and fluids from the wardrobe ([#1311](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1311))
* Ace - Added a new pose menu to allow players to change their pose without needing restraints ([#1336](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1336))
* Ace - Added the ability for players to view their current owner rules ([#1336](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1336))
* Nina - Added a new "Randomize clothes" button to the wardrobe to allow players to randomize only their clothing ([#1331](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1331))
* Natsuki, Sandrine - Added several new items ([#1378](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1378))
    * A mermaid tail item (with built in vibrator)
    * A clam shell bra
    * A snorkel mask
* Gnarp - Added several new items ([#1427](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1427), [#1471](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1471), [#1509](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1509))
    * A pair of Rhinestone Sandals
    * Long and short leggings, with multi-color support
    * Sets of wooden cuffs for the wrists and ankles
* Ben - Added the ability for player subs to turn the tables on their NPC owner
* Ayesha - Added 2 new handheld items ([#1433](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1433), [#1446](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1446))
    * A shock wand
    * A lotion bottle
* Ben - Added the ability for a player's NPC subs to turn the tables and enslave the player if they aren't already owned
* Ellie - Added a new multi-coloring screen to allow players to apply multiple colors to items where supported ([#1368](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1368))
* Ayesha, Ellie, Nina - Migrated many existing items to make use of the multi-coloring system ([#1392](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1392), [#1505](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1505), [#1518](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1518))
    * [Full list of items that support multi-coloring](https://gist.github.com/elliesec/76eabcb4c79f937a7ca182a35f4394b9)
* Ace - Added the option for owners to remove the slave collar from their subs ([#1333](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1333))
* Ace - Added more fine-grained permissions to the wardrobe ([#1399](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1399))
    * Added an online preference to allow other players to change your whole appearance
    * Added an online preference to prevent other players from changing or removing cosplay items (ears, tail, wings)
* Nina - Added a new multi-color button to indicate when an item supports multi-coloring ([#1447](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1447))
* Sekkmer - Added a chatroom preference to preserve whitespace in chat ([#1459](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1459))
    * You can now use Shift + Enter in the chat box to send multi-line chat messages
* Ace - Added a permission system for extended items ([#1465](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1465))
    * Individual item type permissions can be set for most extended items in the game - not supported by all items yet
* Ellie - Added a new chatroom preference for coloring activities in the chat ([#1486](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1486))
* Ace - Added lots of French translations ([#1488](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1488))
* Natsuki - Added a new Inflatable Strait Leotard restraint ([#1342](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1342))
* Emily - Added 5 new chatroom backgrounds ([#1513](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1513), [#1533](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1533))
* Ben - Added the new Movie Studio room
* Emily - Added several new items ([#1517](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1517), [#1533](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1533))
    * A pair of clear sunglasses
    * A futuristic visor
    * Two bondage bustiers
    * A cape
    * A new pair of latex panties
* Ace - Added confirmation text for enabling/disabling your safeword ([#1522](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1522))
* Ada - Added several new items ([#1520](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1520), [#1526](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1526), [#1532](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1532), [#1534](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1534), [#1535](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1535))
    * A futuristic panel gag
    * A leather strap body harness
    * An interactive version of Emily's futuristic visor
    * A futuristic chastity belt & chastity bra
* Victor Reed - Added several new Halloween-themed items and background ([#1454](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1454))
* Ellie - Added this changelog ([#1473](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1473))!
* Ace, Gnarp - Added a new wooden sign item with customisable text ([#1477](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1477))
* Nina - Added a ruler to the handheld toys ([#1497](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1497))

### [Removed]
* Rui - Removed the deafness effect from the Pony Hood ([#1377](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1377))

### [Changed]
* Rui - Reduced the severity of the blindness effect on the Pony Hood ([#1377](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1377))
* Nina - Improvements to the extended item screen layout ([#1388](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1388))
* Ellie - Split the Chat Preferences into a Chat Preferences page, and an Online Preferences page ([#1327](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1327))
* Sandrine - Changed NPCs so that they will respect the player's preferences when removing cosplay items ([#1332](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1332))
* Aeren - Change the seamless suits to expose the same slots as their zipped counterparts ([#1475](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1475))
* Gnarp, Ayesha - Updated the bed with new and improved assets ([#1464](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1464))

### [Fixed]
* Ace - Fix for the red currently worn indicator in the wardrobe not updating ([#1291](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1291))
* Ace - Fix for incorrect hitboxes in the Asylum therapy game ([#1363](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1363))
* Ace - Fix to lock validation on NPCs ([#1380](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1380))
* Rui - Fix for incorrect fetish on the pencil skirt ([#1377](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1377))
* Ace - Fix for an incorrect chatroom message on the Old Gas Mask ([#1381](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1381))
* Ace - Fix for rooms with a member count over their size limit not showing up as greyed out ([#1428](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1428))
* Ace - Fixed an issue where character refreshes would boot the player out of the lock inventory screen ([#1411](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1411))
* Ace - Fix for text overflowing the boundaries of a chat message ([#1437](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1437))
* Ace - Fixed several issues in the club management screen around collar changing ([#1364](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1364))
* Ace - Fix for "ghost legs" when wearing catsuits ([#1419](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1419))
* Ellie - Fixed a bug where Bondage College NPCs would have random head colors ([#1448](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1448))
* Wultir - Fixed an issue where the nursery nurse would not correctly equip mittens on the player ([#1450](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1450))
* Wultir - Fixed an error occurring when talking to the cafe maid without a tray while on the drink serving job ([#1451](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1451))
* Sekkmer - Fix for `<` and `>` characters appearing in chat as `&gt` and `&lt` when the character stutters ([#1458](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1458))
* Nina - Fixed an issue where some NPCs would not randomize correctly ([#1468](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1468))
* Ben - Fixed an issue where the player would automatically redress on exiting the kidnappers league, even if unable to change
* Ace - Fixed an issue where ring, spider and lips gags would cause the player's mouth to disappear in mouth slots 2 & 3 ([#1496](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1496))
* Ellie - Fixed an issue where the chat activities would not regain color after leaving sensory deprivation ([#1486](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1486))
* Ace - Fixed an issue where dildo spreader bars would allow the character to kneel ([#1500](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1500))
* Nina - Fixed several issues with gag layering logic ([#1379](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1379))
* Ace - Fixed fetish controls being visible when sexual activities were disabled ([#1523](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1523))
* Ace - Fixed an issue where HTML form controls for some screens would not be removed when having an orgasm ([#1527](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1527))
* Ace - Added missing assets for Hair Ribbon 2 in the suspension pose ([#1529](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1529))
* Ada - Prevented random kidnappers from removing lover-locked items ([#1531](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1531))
* Ace - Fix for online maid drinks mission softlocked when the dray was lost ([#1568](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1568))
* Ace - Fix for the chatroom search pages not resetting when doing a new search ([#1566](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1566))
* Nina - Fix for the list of friends being drawn in the wrong position for rooms in the last row ([#1558](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1558))
* Wultir - Fix for the afk emote not always being set as expected ([#1557](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1557))

### [Technical]
* Ace - New dynamic asset framework ([#1324](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1324))
    * New online preference to disable dynamic assets on others (should assist users on slower machines)
* Sekkmer - Removed the `ItemHidden` asset group ([#1355](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1355))
* Ace - Rework of the game's audio system ([#1346](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1346))
* Ace - Rework of the active pose system ([#1336](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1336))
* Nina - Improvements to asset randomization functionality to better respect blocked/limited items where possible ([#1331](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1331))
* Ellie - Added support for item layers to be colored individually ([#1368](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1368))
* Ellie - Removed the `StraitDressOpen` and `Bolero` poses (now handled with advanced alpha masks) ([#1495](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1495))
* Many technical changes, fixes and improvements:
    * Nina - [#1371](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1371), [#1326](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1326), [#1415](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1415), [#1416](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1416), [#1463](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1463), [#1504](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1504), [#1493](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1493)
    * Sekkmer - [#1384](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1384), [#1385](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1385), [#1386](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1386), [#1460](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1460), [#1508](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1508)
    * Sandrine - [#1343](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1343), [#1370](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1370), [#1390](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1390), [#1408](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1408), [#1393](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1393), [#1409](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1409), [#1397](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1397), [#1391](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1391), [#1394](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1394), [#1407](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1407), [#1443](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1443), [#1436](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1436), [#1461](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1461), [#1438](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1438), [#1440](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1440), [#1439](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1439), [#1441](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1441), [#1442](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1442), [#1452](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1452), [#1453](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1453)
    * Ace - [#1367](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1367), [#1365](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1365), [#1351](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1351), [#1369](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1369), [#1374](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1374), [#1398](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1398), [#1362](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1362), [#1395](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1395), [#1396](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1396), [#1400](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1400), [#1410](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1410), [#1405](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1405), [#1403](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1403), [#1401](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1401), [#1429](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1429), [#1414](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1414), [#1402](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1402), [#1382](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1382), [#1425](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1425), [#1424](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1424), [#1423](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1423), [#1431](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1431), [#1404](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1404), [#1412](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1412), [#1413](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1413), [#1418](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1418), [#1420](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1420), [#1421](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1421), [#1422](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1422), [#1455](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1455), [#1456](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1456), [#1457](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1457), [#1430](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1430), [#1467](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1467), [#1417](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1417), [#1487](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1487), [#1469](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1469), [#1470](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1470), [#1491](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1491), [#1499](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1499), [#1466](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1466), [#1498](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1498), [#1503](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1503), [#1502](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1502), [#1501](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1501), [#1521](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1521)
    * Ellie - [#1389](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1389), [#1479](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1479), [#1490](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1490), [#1514](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1514)
    * Aeren - [#1510](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1510)

### [Beta fixes]
* Nina - [#1536](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1536),  [#1561](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1561),  [#1552](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1552),  [#1555](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1555),  [#1554](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1554)
* Ellie - [#1543](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1543),  [#1565](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1565),  [#1562](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1562),  [#1546](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1546), [#1578](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1578)
* Wultir - [#1551](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1551)
* Ace -  [#1538](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1538), [#1539](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1539),  [#1540](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1540),  [#1541](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1541),  [#1542](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1542),  [#1544](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1544),  [#1545](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1545),  [#1548](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1548),  [#1563](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1563),  [#1567](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1567),  [#1572](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1572), [#1579](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1579)
* Firefly - [#1575](https://gitgud.io/BondageProjects/Bondage-College/-/merge_requests/1575)
