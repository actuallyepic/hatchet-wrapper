import z from "zod";
import { HatchetContext, InputDefinition, StepInputs } from "../_types";
export type { HatchetContext, InputDefinition, StepInputs } from "../_types";

export class StepBuilder<T extends Record<string, InputDefinition<any>>, R> {
    public name: string;
    private inputDefinitions: T;
    private runFunction: (inputs: StepInputs<T>, ctx: HatchetContext) => Promise<R>;

    constructor(name: string) {
        this.name = name;
        this.inputDefinitions = {} as T;
        this.runFunction = async () => { throw new Error('Run function not set'); };
    }

    addInput<K extends string, S extends z.ZodTypeAny>(
        name: K,
        schema: S
    ): StepBuilder<T & Record<K, InputDefinition<S>>, R> {
        return Object.assign(this, {
            inputDefinitions: {
                ...this.inputDefinitions,
                [name]: { name, schema },
            },
        });
    }

    setRun<NewR>(fn: (inputs: StepInputs<T>, ctx: HatchetContext) => Promise<NewR>): StepBuilder<T, NewR> {
        return Object.assign(new StepBuilder<T, NewR>(this.name), this, { runFunction: fn });
    }

    build() {
        return {
            name: this.name,
            inputDefinitions: this.inputDefinitions,
            run: this.runFunction,
        };
    }
}