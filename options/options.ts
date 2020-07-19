/*
Copyright 2020 Daniel Betz

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

async function getPresets() {
  const result = await browser.storage.local.get(presetsKey);
  const savedPresets = result[presetsKey];
  if (typeof savedPresets !== "string") {
    location.reload();
    throw new Error("Couldn't get presets");
  }
  
  return JSON.parse(savedPresets) as IPresets;
}

function saveChanges() {
  getPresets().then((presets) => {
    for (const presetName of presetNames) {
      const preset = presets[presetName];

      let elem: HTMLInputElement;
      elem = e(presetName + "-width");
      if (elem.validity.valid) {
        preset.width = elem.valueAsNumber;
      }

      elem = e(presetName + "-height");
      if (elem.validity.valid) {
        preset.height = elem.valueAsNumber;
      }

      preset.restorePosition = e(presetName + "-pos").checked;

      elem = e(presetName + "-left");
      elem.disabled = !preset.restorePosition;
      if (elem.validity.valid) {
        preset.x = elem.valueAsNumber;
      }

      elem = e(presetName + "-top");
      elem.disabled = !preset.restorePosition;
      if (elem.validity.valid) {
        preset.y = elem.valueAsNumber;
      }

      preset.restoreOnStart = e(presetName + "-startup").checked;
    }

    return browser.storage.local.set({ [presetsKey]: JSON.stringify(presets) });
  }, () => { /* ignore */ });
}

function insertCurrentSizeAndPosition(presetName: PresetName) {
  browser.windows.getCurrent().then((currentWindow) => {
    e(presetName + "-width").valueAsNumber = currentWindow.width || 1024;
    e(presetName + "-height").valueAsNumber = currentWindow.height || 768;
    e(presetName + "-left").valueAsNumber = currentWindow.left || 0;
    e(presetName + "-top").valueAsNumber = currentWindow.top || 0;

    saveChanges();
  }, () => { /* ignore */ });
}

getPresets().then((presets) => {
  for (const presetName of presetNames) {
    const preset = presets[presetName];
    e(presetName + "-width").valueAsNumber = preset.width;
    e(presetName + "-height").valueAsNumber = preset.height;
    e(presetName + "-pos").checked = preset.restorePosition;
    e(presetName + "-left").valueAsNumber = preset.x;
    e(presetName + "-left").disabled = !preset.restorePosition;
    e(presetName + "-top").valueAsNumber = preset.y;
    e(presetName + "-top").disabled = !preset.restorePosition;
    e(presetName + "-startup").checked = !!preset.restoreOnStart;

    e(presetName + "-width").addEventListener("change", saveChanges);
    e(presetName + "-height").addEventListener("change", saveChanges);
    e(presetName + "-pos").addEventListener("change", saveChanges);
    e(presetName + "-left").addEventListener("change", saveChanges);
    e(presetName + "-top").addEventListener("change", saveChanges);
    e(presetName  + "-startup").addEventListener("change", saveChanges);

    e<HTMLButtonElement>(presetName + "-current")
      .addEventListener("click", () => insertCurrentSizeAndPosition(presetName));
  }

  e("startup-none").addEventListener("change", saveChanges);
}, () => { /* ignore */ });
