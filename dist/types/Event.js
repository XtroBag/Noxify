"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    name;
    once;
    enabled;
    execute;
    constructor(name, options = {}, execute) {
        this.name = name;
        this.once = options.once ?? false;
        this.enabled = options.enabled ?? true;
        this.execute = execute;
    }
}
exports.default = Event;
