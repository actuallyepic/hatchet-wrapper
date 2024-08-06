"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/workflow/index.ts
var workflow_exports = {};
__export(workflow_exports, {
  WorkflowBuilder: () => WorkflowBuilder
});
module.exports = __toCommonJS(workflow_exports);
var import_zod = __toESM(require("zod"));
var WorkflowBuilder = class {
  id;
  description;
  event;
  steps = [];
  workflowInputSchema;
  constructor({ id, description, event, workflowInputSchema }) {
    this.id = id;
    this.description = description;
    this.event = event;
    this.workflowInputSchema = workflowInputSchema;
  }
  addStep(stepName, stepBuilder, inputSources) {
    const step = stepBuilder.build();
    const parents = Object.values(inputSources).filter(
      (source) => source.type === "stepOutput"
    ).map((source) => source.stepName);
    const invalidParents = parents.filter((parent) => !this.steps.some((s) => s.name === parent));
    if (invalidParents.length > 0) {
      throw new Error(`Invalid parent step(s): ${invalidParents.join(", ")}`);
    }
    this.steps.push({
      name: stepName,
      parents: [...new Set(parents)],
      run: async (ctx) => {
        const inputs = {};
        for (const [inputName, source] of Object.entries(inputSources)) {
          let inputValue;
          if (source.type === "workflowInput") {
            const workflowInput = this.workflowInputSchema.parse(ctx.workflowInput());
            inputValue = source.path.split(".").reduce((acc, part) => acc && acc[part], workflowInput);
          } else if (source.type === "stepOutput") {
            const stepOutput = ctx.stepOutput(source.stepName);
            inputValue = source.path.split(".").reduce((acc, part) => acc && acc[part], stepOutput);
          }
          const inputDef = step.inputDefinitions[inputName];
          if (!inputDef) {
            throw new Error(`Input "${inputName}" not defined for step "${stepName}"`);
          }
          const schema = inputDef.schema;
          try {
            inputs[inputName] = schema.parse(inputValue);
          } catch (error) {
            if (error instanceof import_zod.default.ZodError) {
              throw new Error(`Validation failed for step "${stepName}", input "${inputName}": ${error.errors.map((e) => e.message).join(", ")}`);
            }
            throw error;
          }
        }
        return step.run(inputs, ctx);
      }
    });
    return this;
  }
  build() {
    return {
      id: this.id,
      description: this.description,
      ...this.event ? { on: { event: this.event } } : {},
      steps: this.steps
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WorkflowBuilder
});
//# sourceMappingURL=index.js.map