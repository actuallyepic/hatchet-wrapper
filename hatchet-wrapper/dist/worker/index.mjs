// src/worker/index.ts
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
export {
  WorkerBuilder
};
//# sourceMappingURL=index.mjs.map