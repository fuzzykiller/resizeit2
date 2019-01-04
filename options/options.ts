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

/// <reference path="../contracts.d.ts" />
/// <reference path="../web-ext-types.d.ts" />
/// <reference path="common.ts" />

function getPresets() {
  return browser.storage.local.get("presets").then(result => {
    if (!result.presets) {
      location.reload();
      throw new Error("Couldn't get presets");
    }

    return JSON.parse(result.presets as string) as IPresets;
  });
}

function saveChanges() {
  getPresets().then(presets => {
    for (let i = 0; i < 4; i++) {
      const presetName = presetNames[i];
      const preset = presets[presetName];

      let elem: HTMLInputElement;
      elem = e(presetName + "-width");
      if (elem.validity.valid) preset.width = elem.valueAsNumber;

      elem = e(presetName + "-height");
      if (elem.validity.valid) preset.height = elem.valueAsNumber;

      preset.restorePosition = e(presetName + "-pos").checked;

      elem = e(presetName + "-left");
      elem.disabled = !preset.restorePosition;
      if (elem.validity.valid) preset.x = elem.valueAsNumber;

      elem = e(presetName + "-top");
      elem.disabled = !preset.restorePosition;
      if (elem.validity.valid) preset.y = elem.valueAsNumber;
    }

    browser.storage.local.set({ "presets": JSON.stringify(presets) });
  });
}

function insertCurrentSizeAndPosition(presetName: PresetName) {
  browser.windows.getCurrent().then(currentWindow => {
    e(presetName + "-width").valueAsNumber = currentWindow.width || 1024;
    e(presetName + "-height").valueAsNumber = currentWindow.height || 768;
    e(presetName + "-left").valueAsNumber = currentWindow.left || 0;
    e(presetName + "-top").valueAsNumber = currentWindow.top || 0;

    saveChanges();
  });
}

getPresets().then(presets => {
  for (let i = 0; i <= 4; i++) {
    const presetName = presetNames[i];
    const preset = presets[presetName];
    e(presetName + "-width").valueAsNumber = preset.width;
    e(presetName + "-height").valueAsNumber = preset.height;
    e(presetName + "-pos").checked = preset.restorePosition;
    e(presetName + "-left").valueAsNumber = preset.x;
    e(presetName + "-left").disabled = !preset.restorePosition;
    e(presetName + "-top").valueAsNumber = preset.y;
    e(presetName + "-top").disabled = !preset.restorePosition;

    e(presetName + "-width").addEventListener("change", saveChanges);
    e(presetName + "-height").addEventListener("change", saveChanges);
    e(presetName + "-pos").addEventListener("change", saveChanges);
    e(presetName + "-left").addEventListener("change", saveChanges);
    e(presetName + "-top").addEventListener("change", saveChanges);

    e(presetName + "-current").addEventListener("click", () => insertCurrentSizeAndPosition(presetName));
  }
});
