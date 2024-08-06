# `@switchboard/workflow`

### Sample Usage

#### Set up steps 
```
const getBoardStep = new StepBuilder('get-board')
    //Specify inputs each step requires 
    .addInput('organizationId', z.string())
    .setRun(async (inputs, ctx) => {
        console.log("Getting board for organization", inputs.organizationId);
        return { data: { board: { id: "board-123" } } };
    })

const processBoard = new StepBuilder('process-board')
    .addInput('organizationId', z.string())
    .addInput('board', z.object({ id: z.string() }))
    .setRun(async (inputs, ctx) => {
        console.log("Processing board", inputs);
        return { result: true };
    })

const runAi = new StepBuilder('run-ai')
    .addInput('prompt', z.string())
    .addInput('success', z.boolean())
    .setRun(async (inputs, ctx) => {
        console.log("Running AI", inputs);
        return { result: "success!" };
    })

```

#### Create workflow schema, mapping required inputs from each steps to fit workflow inputs / previous step outputs 
```
const workflowInputSchema = z.object({
    organization: z.object({
        id: z.string(),
        name: z.string(),
    }),
    prompt: z.string(),
});

const workflow = new WorkflowBuilder({ id: 'example-workflow', description: 'This is an example workflow', workflowInputSchema })
    .addStep('get-board', getBoardStep, {
        organizationId: { type: 'workflowInput', path: 'organization.id' }
    })
    .addStep('process-board', processBoard, {
        organizationId: { type: 'workflowInput', path: 'organization.id' },
        board: { type: 'stepOutput', stepName: 'get-board', path: 'data.board' }
    })
    .addStep('run-ai', runAi, {
        prompt: { type: 'workflowInput', path: 'prompt' },
        success: { type: 'stepOutput', stepName: "process-board", path: "result" }
    })
```

#### Build and start workflow 
```
(async () => {
    new WorkerBuilder({
        hatchetInstance: new Hatchet(),
        workerId: "get-full-board"
    })
        .addWorkflow(workflow)
        .start()
})();
```
