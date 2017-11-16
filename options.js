/*
Copyright 2017 Daniel Betz

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

function e(id) {
  return document.getElementById(id);
}

function getPresets() {
  return browser.storage.local.get("presets").then(result => {
    if (!result.presets) {
      location.reload();
      throw new Error("Couldn't get presets");
    }

    return JSON.parse(result.presets);
  });
}

function saveChanges() {
  getPresets().then(presets => {
    for (let i = 1; i <= 4; i++) {
      const presetName = "preset-" + i;
      const preset = presets[presetName];

      let elem;
      elem = e(presetName + "-width");
      if (elem.validity.valid) preset.width = +elem.value;

      elem = e(presetName + "-height");
      if (elem.validity.valid) preset.height = +elem.value;

      preset.restorePosition = e(presetName + "-pos").checked;

      elem = e(presetName + "-left");
      elem.disabled = !preset.restorePosition;
      if (elem.validity.valid) preset.x = +elem.value;

      elem = e(presetName + "-top");
      elem.disabled = !preset.restorePosition;
      if (elem.validity.valid) preset.y = +elem.value;
    }

    browser.storage.local.set({ "presets": JSON.stringify(presets) });
  });
}

function insertCurrentSizeAndPosition(presetName) {
  browser.windows.getCurrent().then(currentWindow => {
    e(presetName + "-width").value = currentWindow.width;
    e(presetName + "-height").value = currentWindow.height;
    e(presetName + "-left").value = currentWindow.left;
    e(presetName + "-top").value = currentWindow.top;

    saveChanges();
  });
}

getPresets().then(presets => {
  for (let i = 1; i <= 4; i++) {
    const presetName = "preset-" + i;
    const preset = presets[presetName];
    e(presetName + "-width").value = preset.width;
    e(presetName + "-height").value = preset.height;
    e(presetName + "-pos").checked = preset.restorePosition;
    e(presetName + "-left").value = preset.x;
    e(presetName + "-left").disabled = !preset.restorePosition;
    e(presetName + "-top").value = preset.y;
    e(presetName + "-top").disabled = !preset.restorePosition;

    e(presetName + "-width").addEventListener("change", saveChanges);
    e(presetName + "-height").addEventListener("change", saveChanges);
    e(presetName + "-pos").addEventListener("change", saveChanges);
    e(presetName + "-left").addEventListener("change", saveChanges);
    e(presetName + "-top").addEventListener("change", saveChanges);

    e(presetName + "-current").addEventListener("click", insertCurrentSizeAndPosition.bind(null, presetName));
  }
});