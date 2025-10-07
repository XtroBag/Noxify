"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    data;
    execute;
    enabled;
    developerOnly;
    constructor(data, options = {}, execute) {
        this.data = data;
        this.execute = execute;
        this.enabled = options.enabled ?? true;
        this.developerOnly = options.developerOnly ?? false;
    }
}
exports.default = Command;
