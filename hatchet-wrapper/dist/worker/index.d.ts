import Hatchet from '@hatchet-dev/typescript-sdk';
import { WorkflowBuilder } from '../workflow/index.js';
import '../index-K0sIm-zQ.js';
import 'zod';

declare class WorkerBuilder {
    private workerId;
    private workflows;
    private hatchetInstance;
    constructor({ hatchetInstance, workerId }: {
        hatchetInstance: Hatchet;
        workerId: string;
    });
    addWorkflow(workflowBuilder: WorkflowBuilder<any, any>): WorkerBuilder;
    private build;
    start(): Promise<void>;
}

export { WorkerBuilder };
