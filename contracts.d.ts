interface IPreset {
    width: number;
    height: number;
    x: number;
    y: number;
    restorePosition: boolean;
    restoreOnStart?: boolean;
}

interface IPresets {
    "preset-1": IPreset;
    "preset-2": IPreset;
    "preset-3": IPreset;
    "preset-4": IPreset;
}

type PresetName = keyof IPresets;

interface IWindowUpdateInfo {
    width: number;
    height: number;
    left?: number;
    top?: number;
}
