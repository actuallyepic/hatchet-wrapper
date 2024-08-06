import Hatchet, { Workflow, Worker } from "@hatchet-dev/typescript-sdk";
import { WorkflowBuilder } from "src/workflow";

export class WorkerBuilder {
    private workerId: string;
    private workflows: Workflow[] = [];
    private hatchetInstance: Hatchet;

    constructor({ hatchetInstance, workerId }: { hatchetInstance: Hatchet, workerId: string }) {
        this.hatchetInstance = hatchetInstance;
        this.workerId = workerId;
    }

    addWorkflow(workflowBuilder: WorkflowBuilder<any, any>): WorkerBuilder {
        const workflow = workflowBuilder.build();
        this.workflows.push(workflow);
        return this;
    }

    private async build(): Promise<Worker> {
        const worker = await this.hatchetInstance.worker(this.workerId);
        for (const workflow of this.workflows) {
            await worker.registerWorkflow(workflow);
        }
        return worker;
    }

    async start(): Promise<void> {
        const worker = await this.build();
        await worker.start();
    }
}