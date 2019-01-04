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

interface IKeyInfo {
  key: string;
  name: string;
}

const isMac = navigator.platform.indexOf("Mac") !== -1;
const key1Values: IKeyInfo[] = isMac
  ? [{ key: "MacCtrl", name: "ctrl" }, { key: "Alt", name: "alt" }, { key: "Ctrl", name: "cmd" }]
  : [{ key: "Ctrl", name: "Ctrl" }, { key: "Alt", name: "Alt" }];

const key2Values: IKeyInfo[] = [...key1Values, { key: "Shift", name: isMac ? "shift" : "Shift" }];
const key3FunctionValues: IKeyInfo[] = [
  { key: "F1", name: "F1" }, { key: "F2", name: "F2" }, { key: "F3", name: "F3" },
  { key: "F4", name: "F4" }, { key: "F5", name: "F5" }, { key: "F6", name: "F6" },
  { key: "F7", name: "F7" }, { key: "F8", name: "F8" }, { key: "F9", name: "F9" },
  { key: "F10", name: "F10" }, { key: "F11", name: "F11" }, { key: "F12", name: "F12" }
];

const key3Values: IKeyInfo[] = [
  { key: "A", name: "A" }, { key: "B", name: "B" }, { key: "C", name: "C" },
  { key: "D", name: "D" }, { key: "E", name: "E" }, { key: "F", name: "F" },
  { key: "G", name: "G" }, { key: "H", name: "H" }, { key: "I", name: "I" },
  { key: "J", name: "J" }, { key: "K", name: "K" }, { key: "L", name: "L" },
  { key: "M", name: "M" }, { key: "N", name: "N" }, { key: "O", name: "O" },
  { key: "P", name: "P" }, { key: "Q", name: "Q" }, { key: "R", name: "R" },
  { key: "S", name: "S" }, { key: "T", name: "T" }, { key: "U", name: "U" },
  { key: "V", name: "V" }, { key: "W", name: "W" }, { key: "X", name: "X" },
  { key: "Y", name: "Y" }, { key: "Z", name: "Z" },
  { key: "0", name: "0" }, { key: "1", name: "1" }, { key: "2", name: "2" },
  { key: "3", name: "3" }, { key: "4", name: "4" }, { key: "5", name: "5" },
  { key: "6", name: "6" }, { key: "7", name: "7" }, { key: "8", name: "8" },
  { key: "9", name: "9" },
  ...key3FunctionValues,
  { key: "Comma", name: "," }, { key: "Period", name: "." }, { key: "Home", name: "Home" },
  { key: "End", name: "End" }, { key: "PageUp", name: "Page Up" }, { key: "PageDown", name: "Page Down" },
  { key: "Space", name: "Space" }, { key: "Insert", name: "Insert" }, { key: "Delete", name: "Delete" },
  { key: "Up", name: "Up" }, { key: "Down", name: "Down" }, { key: "Left", name: "Left" },
  { key: "Right", name: "Right" }
];

function decodeShortcut(shortcut: string | undefined): [string, string, string] {
  if (!shortcut) {
    return ["", "", ""];
  }

  const components = shortcut.split("+");

  if (components.length === 1) {
    return ["", "", components[0]];
  }

  if (components.length === 2) {
    return [components[0], "", components[1]];
  }

  if (components.length === 3) {
    return [components[0], components[1], components[2]];
  }

  throw new Error("Invalid shortcut value");
}

function saveShortcut(cmd: browser.commands.Command) {
  const key1Select = e<HTMLSelectElement>(cmd.name + "-key-1");
  const key2Select = e<HTMLSelectElement>(cmd.name + "-key-2");
  const key3Select = e<HTMLSelectElement>(cmd.name + "-key-3");
  const indicator = e<HTMLSpanElement>(cmd.name + "-key-indicator");

  if (!key3Select.value) {
    indicator.className = "is-invalid";
    return;
  }

  let shortcut = [key3Select.value];

  if (key2Select.value) {
    shortcut.unshift(key2Select.value);
  }

  if (key1Select.value) {
    shortcut.unshift(key1Select.value);
  }

  const encodedShortcut = shortcut.join("+");

  browser.commands.update({ ...cmd, shortcut: encodedShortcut || undefined })
    .then(() => indicator.className = "is-valid", () => indicator.className = "is-invalid");
}

function clearOptions(e: HTMLSelectElement) {
  while (e.options.length > 0) {
    e.options.remove(0);
  }

  const emptyOption = document.createElement("option");
  e.options.add(emptyOption);
}

function addOptions(e: HTMLSelectElement, keyInfos: IKeyInfo[]) {
  for (const keyInfo of keyInfos) {
    const option = document.createElement("option");
    option.value = keyInfo.key;
    option.text = keyInfo.name;
    e.options.add(option);
  }
}

function updateSelection(
  key1Select: HTMLSelectElement, key2Select: HTMLSelectElement, key3Select: HTMLSelectElement) {
  const previousKey2Value = key2Select.value;
  const previousKey3Value = key3Select.value;
  if (key1Select.value) {
    clearOptions(key2Select);
    addOptions(key2Select, key2Values.filter(x => x.key !== key1Select.value));

    clearOptions(key3Select);
    addOptions(key3Select, key3Values);
  } else {
    clearOptions(key2Select);

    clearOptions(key3Select);
    addOptions(key3Select, key3FunctionValues);
  }

  // Try restoring values; will fail silently if not present as option
  key2Select.value = previousKey2Value;
  key3Select.value = previousKey3Value;
}

browser.commands.getAll().then(cmds => {
  for (let i = 0; i < cmds.length; i++) {
    const cmd = cmds[i];

    if (!isPresetName(cmd.name)) {
      continue;
    }

    const [key1, key2, key3] = decodeShortcut(cmd.shortcut);

    const key1Select = e<HTMLSelectElement>(cmd.name + "-key-1");
    const key2Select = e<HTMLSelectElement>(cmd.name + "-key-2");
    const key3Select = e<HTMLSelectElement>(cmd.name + "-key-3");

    addOptions(key1Select, key1Values);
    key1Select.value = key1;

    updateSelection(key1Select, key2Select, key3Select);
    key2Select.value = key2;

    updateSelection(key1Select, key2Select, key3Select);
    key3Select.value = key3;

    key1Select.addEventListener("change", () => {
      updateSelection(key1Select, key2Select, key3Select);
      saveShortcut(cmd);
    });

    key2Select.addEventListener("change", () => {
      updateSelection(key1Select, key2Select, key3Select);
      saveShortcut(cmd);
    });

    key3Select.addEventListener("change", () => saveShortcut(cmd));
  }
});