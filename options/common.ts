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

/* eslint-disable @typescript-eslint/no-unused-vars */

const presetNames = ["preset-1", "preset-2", "preset-3", "preset-4"] as const;
const presetsKey = "presets";
const handleNewWindowsKey = "handleNewWindows";

function e<TElement extends HTMLElement = HTMLInputElement>(id: string) {
  return document.getElementById(id) as TElement;
}

function isPresetName(s: unknown): s is PresetName {
  if (typeof s !== "string") {
    return false;
  }

  return s === "preset-1" || s === "preset-2" || s === "preset-3" || s === "preset-4";
}
