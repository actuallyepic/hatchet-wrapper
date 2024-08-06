import z from "zod";
import { StepBuilder } from "../step";
import { Context } from "@hatchet-dev/typescript-sdk";

export type Primitive = string | number | boolean | null | undefined;

export type DeepKeyOf<T> = T extends Primitive
    ? never
    : T extends any[]
    ? never
    : T extends object
    ? { [K in keyof T]: K extends string | number ? K | `${K}.${DeepKeyOf<T[K]>}` : never }[keyof T]
    : never;

export type InputSource<PreviousSteps extends { [key: string]: any }, WorkflowInputSchema extends z.ZodTypeAny> =
    | { type: 'workflowInput', path: DeepKeyOf<z.infer<WorkflowInputSchema>> }
    | { [K in keyof PreviousSteps]: { type: 'stepOutput', stepName: K, path: DeepKeyOf<PreviousSteps[K]> } }[keyof PreviousSteps];

export type InputDefinition<T extends z.ZodTypeAny> = {
    name: string;
    schema: T;
};

export type StepInputs<T extends Record<string, InputDefinition<any>>> = {
    [K in keyof T]: z.infer<T[K]['schema']>
};

export type StepDefinition<T extends Record<string, InputDefinition<any>>, R> = ReturnType<StepBuilder<T, R>['build']>;

export type HatchetContext = Context<any, any>;
