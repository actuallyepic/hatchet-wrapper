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

// src/worker/index.ts
var worker_exports = {};
__export(worker_exports, {
  WorkerBuilder: () => WorkerBuilder
});
module.exports = __toCommonJS(worker_exports);
var WorkerBuilder = class {
  workerId;
  workflows = [];
  hatchetInstance;
  constructor({ hatchetInstance, workerId }) {
    this.hatchetInstance = hatchetInstance;
    this.workerId = workerId;
  }
  addWorkflow(workflowBuilder) {
    const workflow = workflowBuilder.build();
    this.workflows.push(workflow);
    return this;
  }
  async build() {
    const worker = await this.hatchetInstance.worker(this.workerId);
    for (const workflow of this.workflows) {
      await worker.registerWorkflow(workflow);
    }
    return worker;
  }
  async start() {
    const worker = await this.build();
    await worker.start();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WorkerBuilder
});
//# sourceMappingURL=index.js.map