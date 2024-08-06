"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/step/index.ts
var step_exports = {};
__export(step_exports, {
  StepBuilder: () => StepBuilder
});
module.exports = __toCommonJS(step_exports);
var StepBuilder = class _StepBuilder {
  name;
  inputDefinitions;
  runFunction;
  constructor(name) {
    this.name = name;
    this.inputDefinitions = {};
    this.runFunction = async () => {
      throw new Error("Run function not set");
    };
  }
  addInput(name, schema) {
    return Object.assign(this, {
      inputDefinitions: {
        ...this.inputDefinitions,
        [name]: { name, schema }
      }
    });
  }
  setRun(fn) {
    return Object.assign(new _StepBuilder(this.name), this, { runFunction: fn });
  }
  build() {
    return {
      name: this.name,
      inputDefinitions: this.inputDefinitions,
      run: this.runFunction
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StepBuilder
});
//# sourceMappingURL=index.js.map