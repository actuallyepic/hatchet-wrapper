// src/step/index.ts
var StepBuilder = class _StepBuilder {
  name;
  inputDefinitions;
  runFunction;
  constructor(name) {
    this.name = name;
    this.inputDefinitions = {};
    this.runFunction = async () => {
      throw new Error("Run function not set");
    };
  }
  addInput(name, schema) {
    return Object.assign(this, {
      inputDefinitions: {
        ...this.inputDefinitions,
        [name]: { name, schema }
      }
    });
  }
  setRun(fn) {
    return Object.assign(new _StepBuilder(this.name), this, { runFunction: fn });
  }
  build() {
    return {
      name: this.name,
      inputDefinitions: this.inputDefinitions,
      run: this.runFunction
    };
  }
};
export {
  StepBuilder
};
//# sourceMappingURL=index.mjs.map