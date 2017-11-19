export interface IPreset {
    width: number;
    height: number;
    x: number;
    y: number;
    restorePosition: boolean;
}

export interface IPresets {
    "preset-1": IPreset;
    "preset-2": IPreset;
    "preset-3": IPreset;
    "preset-4": IPreset;
}

export type PresetName = keyof IPresets;

export interface IWindowUpdateInfo {
    width: number;
    height: number;
    left?: number;
    top?: number;
}