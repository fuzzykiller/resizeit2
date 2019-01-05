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
  readonly key: string;
  readonly name: string;
}

function k(key: string, name?: string): IKeyInfo {
  return { key, name: name || key };
}

const isMac = navigator.platform.indexOf("Mac") !== -1;
const key1Values: ReadonlyArray<IKeyInfo> = isMac
  ? [k("MacCtrl", "ctrl"), k("Alt", "alt"), k("Ctrl", "cmd")]
  : [k("Ctrl"), k("Alt")];

const key2Values: ReadonlyArray<IKeyInfo> = [...key1Values, k("Shift", isMac ? "shift" : "Shift")];
const key3FunctionValues: ReadonlyArray<IKeyInfo> = [
  k("F1"), k("F2"), k("F3"),
  k("F4"), k("F5"), k("F6"),
  k("F7"), k("F8"), k("F9"),
  k("F10"), k("F11"), k("F12")
];

const key3Values: ReadonlyArray<IKeyInfo> = [
  k("A"), k("B"), k("C"),
  k("D"), k("E"), k("F"),
  k("G"), k("H"), k("I"),
  k("J"), k("K"), k("L"),
  k("M"), k("N"), k("O"),
  k("P"), k("Q"), k("R"),
  k("S"), k("T"), k("U"),
  k("V"), k("W"), k("X"),
  k("Y"), k("Z"),

  k("1"), k("2"), k("3"),
  k("4"), k("5"), k("6"),
  k("7"), k("8"), k("9"),
  k("0"),

  ...key3FunctionValues,

  k("Comma", ","),
  k("Period", "."),
  k("Home"),
  k("End"),
  k("PageUp", "Page Up"),
  k("PageDown", "Page Down"),
  k("Space"),
  k("Insert"),
  k("Delete"),
  k("Up"),
  k("Down"),
  k("Left"),
  k("Right")
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

function resetShortcut(cmdName: string) {
  browser.commands.reset(cmdName).then(() => location.reload());
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

  const shortcut = [key3Select.value];

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

function addOptions(e: HTMLSelectElement, keyInfos: ReadonlyArray<IKeyInfo>) {
  for (const keyInfo of keyInfos) {
    const option = document.createElement("option");
    option.value = keyInfo.key;
    option.text = keyInfo.name;
    e.options.add(option);
  }
}

function updateSelection(key1Select: HTMLSelectElement, key2Select: HTMLSelectElement, key3Select: HTMLSelectElement) {
  const previousKey2Value = key2Select.value;
  const previousKey3Value = key3Select.value;

  if (key1Select.value) {
    // First modifier selected: All values possible
    clearOptions(key2Select);
    addOptions(key2Select, key2Values.filter(x => x.key !== key1Select.value));

    clearOptions(key3Select);
    addOptions(key3Select, key3Values);
  } else {
    // First modifier empty: Only function keys valid
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

    const cmdName = cmd.name;

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

    e<HTMLButtonElement>(cmd.name + "-key-reset").addEventListener("click", () => resetShortcut(cmdName));
  }
});