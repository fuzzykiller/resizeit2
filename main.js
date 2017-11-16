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

const defaultSettings = {
  "preset-1": {
    "width": 800,
    "height": 600,
    "x": 0,
    "y": 0,
    "restorePosition": false
  },
  "preset-2": {
    "width": 1024,
    "height": 768,
    "x": 0,
    "y": 0,
    "restorePosition": false
  },
  "preset-3": {
    "width": 1280,
    "height": 720,
    "x": 0,
    "y": 0,
    "restorePosition": false
  },
  "preset-4": {
    "width": 768,
    "height": 1024,
    "x": 0,
    "y": 0,
    "restorePosition": false
  }
};

browser.storage.local.get("presets").then(result => {
  if (result.presets) return;
  
  browser.storage.local.set({ "presets": JSON.stringify(defaultSettings) });
});

function handleCommand(command) {
  browser.storage.local.get("presets").then(result => {
    const presets = JSON.parse(result.presets);
    const preset = presets[command];
    if (!preset) throw new Error("Couldn't get preset");
    
    const newState = {
      "width": preset.width,
      "height": preset.height
    };
    
    if (preset.restorePosition) {
      newState.left = preset.x;
      newState.top = preset.y;
    }
    
    return newState;
  }).then(newState => {
    if (!newState) return;

    browser.windows.getCurrent().then(currentWindow => 
    browser.windows.update(currentWindow.id, newState));
  });
}

browser.commands.onCommand.addListener(handleCommand);