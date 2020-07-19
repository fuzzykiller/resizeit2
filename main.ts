/*
Copyright 2019 Daniel Betz

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const defaultSettings: IPresets = {
  "preset-1": {
    width: 800,
    height: 600,
    x: 0,
    y: 0,
    restorePosition: false,
  },
  "preset-2": {
    width: 1024,
    height: 768,
    x: 0,
    y: 0,
    restorePosition: false,
  },
  "preset-3": {
    width: 1280,
    height: 720,
    x: 0,
    y: 0,
    restorePosition: false,
  },
  "preset-4": {
    width: 768,
    height: 1024,
    x: 0,
    y: 0,
    restorePosition: false,
  },
};

// Set default presets
browser.storage.local.get("presets").then((result) => {
  if (result.presets) {
    return;
  }

  browser.storage.local.set({ presets: JSON.stringify(defaultSettings) }).catch(() => { /* ignore */ });
}, () => { /* ignore */ });

// Handle user command
function handleCommand(command: string) {
  browser.storage.local.get("presets")
    .then((x) => getNewState(command as PresetName, x))
    .then((newState) =>
      browser.windows.getCurrent()
        .then((w) => updateWindow(w, newState)), () => { /* ignore */ });
}

// Handle message from popup
function handleMessage(message: unknown): void {
  if (typeof message !== "string") {
    return;
  }

  handleCommand(message);
}

function getNewState(presetName: PresetName, settings: browser.storage.StorageObject) {
  if (!settings.presets) {
    return undefined;
  }

  const presets = JSON.parse(settings.presets as string) as IPresets;
  const preset = presets[presetName];

  if (!preset) {
    return undefined;
  }

  const newState: IWindowUpdateInfo = {
    width: preset.width,
    height: preset.height,
  };

  if (preset.restorePosition) {
    newState.left = preset.x;
    newState.top = preset.y;
  }

  return newState;
}

function updateWindow(window: browser.windows.Window, newState?: IWindowUpdateInfo) {
  if (!window.id || !newState) {
    return;
  }

  browser.windows.update(window.id, newState).catch(() => { /* ignore */ });
}

browser.commands.onCommand.addListener(handleCommand);
browser.runtime.onMessage.addListener(handleMessage);
