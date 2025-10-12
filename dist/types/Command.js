"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    data;
    options;
    execute;
    autocomplete;
    constructor(definition) {
        this.data = definition.data;
        this.options = definition.options;
        this.execute = definition.execute;
        this.autocomplete = definition.autocomplete;
    }
}
exports.default = Command;
