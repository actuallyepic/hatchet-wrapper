import { Context, Workflow } from "@hatchet-dev/typescript-sdk";
import { DeepKeyOf, InputDefinition, InputSource, StepDefinition, StepInputs } from "../_types";
export type { DeepKeyOf, InputDefinition, InputSource, StepDefinition, StepInputs } from "../_types";

import z from "zod";
import { StepBuilder } from "src/step";

export class WorkflowBuilder<PreviousSteps extends Record<string, any> = {}, WorkflowInputSchema extends z.ZodTypeAny = z.ZodUnknown> {
    private id: string;
    private description: string;
    private event?: string;
    private steps: Array<{
        name: string,
        parents: string[],
        run: (ctx: Context<any, any>) => Promise<any>
    }> = [];
    workflowInputSchema: WorkflowInputSchema;

    constructor({ id, description, event, workflowInputSchema }: { id: string, description: string, event?: string, workflowInputSchema: WorkflowInputSchema }) {
        this.id = id;
        this.description = description;
        this.event = event;
        this.workflowInputSchema = workflowInputSchema;
    }

    addStep<T extends Record<string, InputDefinition<any>>, StepName extends string, R>(
        stepName: StepName,
        stepBuilder: StepBuilder<T, R>,
        inputSources: { [K in keyof T]: InputSource<PreviousSteps, WorkflowInputSchema> }
    ): WorkflowBuilder<PreviousSteps & Record<StepName, R>, WorkflowInputSchema> {
        const step = stepBuilder.build();

        const parents = Object.values(inputSources)
            .filter((source): source is { type: 'stepOutput', stepName: keyof PreviousSteps & string, path: DeepKeyOf<PreviousSteps[keyof PreviousSteps & string]> } =>
                source.type === 'stepOutput'
            )
            .map(source => source.stepName);

        // Runtime check for valid parent step names
        const invalidParents = parents.filter(parent => !this.steps.some(s => s.name === parent));
        if (invalidParents.length > 0) {
            throw new Error(`Invalid parent step(s): ${invalidParents.join(', ')}`);
        }

        this.steps.push({
            name: stepName,
            parents: [...new Set(parents)],
            run: async (ctx: Context<any, any>) => {
                const inputs: Record<string, any> = {};
                for (const [inputName, source] of Object.entries(inputSources)) {
                    let inputValue: unknown;
                    if (source.type === 'workflowInput') {
                        const workflowInput = this.workflowInputSchema.parse(ctx.workflowInput());
                        inputValue = source.path.split('.').reduce((acc: any, part) => acc && acc[part], workflowInput);
                    } else if (source.type === 'stepOutput') {
                        const stepOutput = ctx.stepOutput(source.stepName as string);
                        inputValue = source.path.split('.').reduce((acc: any, part) => acc && acc[part], stepOutput);
                    }
                    const inputDef = step.inputDefinitions[inputName];
                    if (!inputDef) { throw new Error(`Input "${inputName}" not defined for step "${stepName}"`); }
                    const schema = inputDef.schema;
                    try {
                        inputs[inputName] = schema.parse(inputValue);
                    } catch (error) {
                        if (error instanceof z.ZodError) {
                            throw new Error(`Validation failed for step "${stepName}", input "${inputName}": ${error.errors.map(e => e.message).join(', ')}`);
                        }
                        throw error;
                    }
                }
                return step.run(inputs as StepInputs<T>, ctx);
            },
        });
        return this as WorkflowBuilder<PreviousSteps & Record<StepName, R>, WorkflowInputSchema>;
    }

    build(): Workflow {
        return {
            id: this.id,
            description: this.description,
            ...(this.event ? { on: { event: this.event } } : {}),
            steps: this.steps,
        };
    }
}