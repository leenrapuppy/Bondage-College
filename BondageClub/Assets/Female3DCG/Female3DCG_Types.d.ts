interface AssetGroupDefinition {
	Asset: (AssetDefinition | string)[];
	Group: string;
	ParentGroup?: string;
	Category?: 'Appearance' | 'Item';
	Default?: boolean;
	IsRestraint?: boolean;
	AllowNone?: boolean;
	AllowColorize?: boolean;
	AllowCustomize?: boolean;
	Random?: boolean;
	Color?: string[];
	ParentSize?: string;
	ParentColor?: string;
	Clothing?: boolean;
	Underwear?: boolean;
	BodyCosplay?: boolean;
	Hide?: AssetGroupName[];
	Block?: AssetGroupItemName[];
	Zone?: [number, number, number, number][];
	SetPose?: string[];
	AllowPose?: string[];
	AllowExpression?: string[];
	Effect?: EffectName[];
	MirrorGroup?: string;
	RemoveItemOnRemove?: { Group: string, Name: string, Type?: string }[];
	Priority?: number;
	Left?: number;
	Top?: number;
	FullAlpha?: boolean;
	Blink?: boolean;
	InheritColor?: string;
	FreezeActivePose?: string[];
	PreviewZone?: [number, number, number, number];
	DynamicGroupName?: string;
	MirrorActivitiesFrom?: string;
}

interface AssetDefinition {
	Name: string,
	ParentItem?: string;
	ParentGroup?: string | null;
	Enable?: boolean;
	Visible?: boolean;
	Wear?: boolean;
	/** Applying that asset triggers the following activity */
	Activity?: string;
	AllowActivity?: string[];
	AllowActivityOn?: string[];
	BuyGroup?: string;
	PrerequisiteBuyGroups?: string[];
	Effect?: EffectName[];
	Bonus?: string;
	Block?: AssetGroupItemName[];
	Expose?: string[];
	Hide?: AssetGroupName[];
	HideItem?: string[];
	HideItemExclude?: string[];
	Require?: string[];
	SetPose?: string[];
	AllowPose?: string[];
	HideForPose?: string[];
	PoseMapping?: { [index: string]: string};
	AllowActivePose?: string[];
	WhitelistActivePose?: string[];
	Value?: number;
	Difficulty?: number;
	SelfBondage?: number;
	SelfUnlock?: boolean;
	ExclusiveUnlock?: boolean;
	Random?: boolean;
	RemoveAtLogin?: boolean;
	Time?: number;
	LayerVisibility?: boolean;
	RemoveTime?: number;
	RemoveTimer?: number;
	MaxTimer?: number;
	Priority?: number;
	Left?: number;
	Top?: number;
	Height?: number;
	Zoom?: number;
	Alpha?: AlphaDefinition[];
	Prerequisite?: string | string[];
	Extended?: boolean;
	AlwaysExtend?: boolean;
	AlwaysInteract?: boolean;
	AllowLock?: boolean;
	IsLock?: boolean;
	PickDifficulty?: number | null;
	OwnerOnly?: boolean;
	LoverOnly?: boolean;
	ExpressionTrigger?: { Name: string, Group: string, Timer: number }[];
	RemoveItemOnRemove?: { Name: string, Group: string, Type?: string }[];
	AllowEffect?: EffectName[];
	AllowBlock?: AssetGroupItemName[];
	AllowType?: string[];
	DefaultColor?: string | string[];
	Opacity?: number;
	MinOpacity?: number;
	MaxOpacity?: number;
	Audio?: string;
	Category?: string[];
	Fetish?: string[];
	ArousalZone?: string;
	IsRestraint?: boolean;
	BodyCosplay?: boolean;
	OverrideBlinking?: boolean;
	DialogSortOverride?: DialogSortOrder;
	DynamicDescription?: (C: Character) => string;
	DynamicPreviewImage?: (C: Character) => string;
	DynamicAllowInventoryAdd?: (C: Character) => boolean;
	DynamicExpressionTrigger?: (C: Character) => ExpressionTrigger[] | null | undefined;
	DynamicName?: (C: Character) => string;
	DynamicGroupName?: string;
	DynamicActivity?: (C: Character) => string | null | undefined;
	DynamicAudio?: (C: Character) => string;
	CharacterRestricted?: boolean;
	AllowRemoveExclusive?: boolean;
	InheritColor?: string;
	DynamicBeforeDraw?: boolean;
	DynamicAfterDraw?: boolean;
	DynamicScriptDraw?: boolean;
	HasType?: boolean;
	AllowLockType?: string[];
	AllowColorize?: boolean;
	AllowColorizeAll?: boolean;
	AvailableLocations?: string[];
	OverrideHeight?: AssetOverrideHeight;
	FreezeActivePose?: string[];
	DrawLocks?: boolean;
	AllowExpression?: string[];
	MirrorExpression?: string;
	FixedPosition?: boolean;
	CustomBlindBackground?: any;
	Layer?: AssetLayerDefinition[];
	Archetype?: string;
	FuturisticRecolor?: boolean;
	FuturisticRecolorDisplay?: boolean;
	Attribute?: string[];
	HideItemAttribute?: string[];
	PreviewIcons?: string[];
}

interface AssetLayerDefinition {
	Name?: string;
	AllowColorize?: boolean;
	CopyLayerColor?: string;
	ColorGroup?: string;
	HideColoring?: boolean;
	AllowTypes?: string[];
	HasType?: boolean;
	Visibility?: string;
	ParentGroup?: string | null,
	AllowPose?: string[];
	Priority?: number;
	InheritColor?: string;
	Alpha?: AlphaDefinition[],
	Left?: number;
	Top?: number;
	HideAs?: { Group: string, Asset: string };
	FixedPosition?: boolean;
	HasImage?: boolean;
	Opacity?: number;
	MinOpacity?: number;
	MaxOpacity?: number;
	LockLayer?: boolean;
	MirrorExpression?: string;
	HideForPose?: string[];
	PoseMapping?: { [index: string]: string };
	AllowModuleTypes?: string[];
	ModuleType?: string[];
}
