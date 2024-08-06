// src/workflow/index.ts
import z from "zod";
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
            if (error instanceof z.ZodError) {
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
export {
  WorkflowBuilder
};
//# sourceMappingURL=index.mjs.map