import z from 'zod';
import { Context } from '@hatchet-dev/typescript-sdk';

declare class StepBuilder<T extends Record<string, InputDefinition<any>>, R> {
    name: string;
    private inputDefinitions;
    private runFunction;
    constructor(name: string);
    addInput<K extends string, S extends z.ZodTypeAny>(name: K, schema: S): StepBuilder<T & Record<K, InputDefinition<S>>, R>;
    setRun<NewR>(fn: (inputs: StepInputs<T>, ctx: HatchetContext) => Promise<NewR>): StepBuilder<T, NewR>;
    build(): {
        name: string;
        inputDefinitions: T;
        run: (inputs: StepInputs<T>, ctx: HatchetContext) => Promise<R>;
    };
}

type Primitive = string | number | boolean | null | undefined;
type DeepKeyOf<T> = T extends Primitive ? never : T extends any[] ? never : T extends object ? {
    [K in keyof T]: K extends string | number ? K | `${K}.${DeepKeyOf<T[K]>}` : never;
}[keyof T] : never;
type InputSource<PreviousSteps extends {
    [key: string]: any;
}, WorkflowInputSchema extends z.ZodTypeAny> = {
    type: 'workflowInput';
    path: DeepKeyOf<z.infer<WorkflowInputSchema>>;
} | {
    [K in keyof PreviousSteps]: {
        type: 'stepOutput';
        stepName: K;
        path: DeepKeyOf<PreviousSteps[K]>;
    };
}[keyof PreviousSteps];
type InputDefinition<T extends z.ZodTypeAny> = {
    name: string;
    schema: T;
};
type StepInputs<T extends Record<string, InputDefinition<any>>> = {
    [K in keyof T]: z.infer<T[K]['schema']>;
};
type StepDefinition<T extends Record<string, InputDefinition<any>>, R> = ReturnType<StepBuilder<T, R>['build']>;
type HatchetContext = Context<any, any>;

export { type DeepKeyOf as D, type HatchetContext as H, type InputDefinition as I, type Primitive as P, StepBuilder as S, type InputSource as a, type StepDefinition as b, type StepInputs as c };
