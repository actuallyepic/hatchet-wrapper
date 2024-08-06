import { Workflow } from '@hatchet-dev/typescript-sdk';
import { I as InputDefinition, S as StepBuilder, a as InputSource } from '../index-K0sIm-zQ.mjs';
export { D as DeepKeyOf, b as StepDefinition, c as StepInputs } from '../index-K0sIm-zQ.mjs';
import z from 'zod';

declare class WorkflowBuilder<PreviousSteps extends Record<string, any> = {}, WorkflowInputSchema extends z.ZodTypeAny = z.ZodUnknown> {
    private id;
    private description;
    private event?;
    private steps;
    workflowInputSchema: WorkflowInputSchema;
    constructor({ id, description, event, workflowInputSchema }: {
        id: string;
        description: string;
        event?: string;
        workflowInputSchema: WorkflowInputSchema;
    });
    addStep<T extends Record<string, InputDefinition<any>>, StepName extends string, R>(stepName: StepName, stepBuilder: StepBuilder<T, R>, inputSources: {
        [K in keyof T]: InputSource<PreviousSteps, WorkflowInputSchema>;
    }): WorkflowBuilder<PreviousSteps & Record<StepName, R>, WorkflowInputSchema>;
    build(): Workflow;
}

export { InputDefinition, InputSource, WorkflowBuilder };
